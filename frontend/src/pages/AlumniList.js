import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { alumniService } from '../services/alumniService';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import '../styles/AlumniList.css';

const AlumniList = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await alumniService.getAllAlumni();
      if (response.data.success) {
        setAlumni(response.data.data);
      }
    } catch (error) {
      setError('Error fetching alumni data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-alumni/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await alumniService.deleteAlumni(deleteId);
      if (response.data.success) {
        setAlumni(alumni.filter(a => a.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
        // Reset to first page if current page becomes empty
        const filteredAlumni = alumni.filter(a => a.id !== deleteId);
        const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      }
    } catch (error) {
      setError('Error deleting alumni profile');
      console.error('Error:', error);
    }
  };

  // Filter alumni based on search term
  const filteredAlumni = alumni.filter(person => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const fullName = `${person.first_name} ${person.last_name}`.toLowerCase();
    return (
      fullName.includes(term) ||
      person.email.toLowerCase().includes(term) ||
      person.degree?.toLowerCase().includes(term) ||
      person.field_of_study?.toLowerCase().includes(term) ||
      person.current_company?.toLowerCase().includes(term) ||
      person.current_position?.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlumni = filteredAlumni.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="alumni-list-container py-4">
      <Row className="mb-4">
        <Col md={6}>
          <h2 className="page-title">Alumni Directory</h2>
          <p className="page-subtitle">Browse all registered alumni profiles</p>
        </Col>
        <Col md={3} className="text-end">
          <Button 
            variant="primary" 
            className="btn-add-alumni"
            onClick={() => navigate('/add-alumni')}
          >
            + Add Alumni
          </Button>
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search alumni..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredAlumni.length === 0 ? (
        <Alert variant="info" className="text-center">
          {searchTerm ? `No alumni found matching "${searchTerm}".` : 'No alumni records found.'} <a href="/add-alumni">Add the first one now!</a>
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="alumni-table">
            <thead className="table-header">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Degree</th>
                <th>Field of Study</th>
                <th>Company</th>
                <th>Position</th>
                <th>Graduation Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlumni.map((person, index) => (
                <tr key={person.id} className="table-row">
                  <td>{startIndex + index + 1}</td>
                  <td className="name-cell">
                    {person.first_name} {person.last_name}
                  </td>
                  <td>{person.email}</td>
                  <td>{person.degree}</td>
                  <td>{person.field_of_study}</td>
                  <td>{person.current_company || 'N/A'}</td>
                  <td>{person.current_position || 'N/A'}</td>
                  <td>{person.graduation_year}</td>
                  <td className="action-cell">
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => navigate(`/alumni/${person.id}`)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEdit(person.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(person.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {filteredAlumni.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this alumni profile? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
    </div>
  );
};

export default AlumniList;
