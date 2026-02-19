import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';
import { jobService } from '../services/jobService';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', description: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await jobService.getAll();
      if (res.data.success) setJobs(res.data.data);
    } catch (err) {
      setError('Error fetching jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job = null) => {
    setCurrentJob(job);
    setFormData(job ? {
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      description: job.description || ''
    } : { title: '', company: '', location: '', description: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentJob(null);
  };

  const handleSave = async () => {
    try {
      if (currentJob) {
        await jobService.update(currentJob.id, formData);
      } else {
        await jobService.create(formData);
      }
      fetchJobs();
      closeModal();
    } catch (err) {
      setError('Error saving job');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await jobService.delete(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      setError('Error deleting job');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="pt-4">
          <Row className="mb-3">
            <Col md={6}>
              <h1>Job Portal</h1>
              <p>Create and browse job listings; employers can post jobs.</p>
            </Col>
            <Col md={3} className="text-end">
              <Button variant="primary" onClick={() => openModal()}>+ New Job</Button>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs
                  .filter(job =>
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((job, idx) => (
                  <tr key={job.id}>
                    <td>{idx + 1}</td>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(job)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(job.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentJob ? 'Edit Job' : 'New Job'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="jobTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="jobCompany">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="jobLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="jobDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobPortal;
