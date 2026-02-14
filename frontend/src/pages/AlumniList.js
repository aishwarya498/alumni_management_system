import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { alumniService } from '../services/alumniService';
import '../styles/AlumniList.css';

const AlumniList = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      }
    } catch (error) {
      setError('Error deleting alumni profile');
      console.error('Error:', error);
    }
  };

  return (
    <Container fluid className="alumni-list-container py-4">
      <Row className="mb-4">
        <Col>
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
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : alumni.length === 0 ? (
        <Alert variant="info" className="text-center">
          No alumni records found. <a href="/add-alumni">Add the first one now!</a>
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
              {alumni.map((person, index) => (
                <tr key={person.id} className="table-row">
                  <td>{index + 1}</td>
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
  );
};

export default AlumniList;
