import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Spinner, Alert, Modal } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';
import { feedbackService } from '../services/feedbackService';

const Feedback = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ message: '', response: '', status: 'new' });

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    try { setLoading(true); setError(''); const res = await feedbackService.getAll(); if (res.data.success) setEntries(res.data.data); }
    catch (err) { setError('Error fetching feedback'); console.error(err); } finally { setLoading(false); }
  };

  const openModal = (fb = null) => {
    setCurrent(fb);
    setFormData(fb ? { message: fb.message || '', response: fb.response || '', status: fb.status || 'new' } : { message: '', response: '', status: 'new' });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setCurrent(null); };

  const handleSave = async () => {
    try {
      if (current) await feedbackService.update(current.id, formData);
      else await feedbackService.create(formData);
      fetchEntries(); closeModal();
    } catch (err) { setError('Error saving feedback'); console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete feedback?')) return;
    try { await feedbackService.delete(id); setEntries(entries.filter(e => e.id !== id)); }
    catch (err) { setError('Error deleting feedback'); console.error(err); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="pt-4">
          <Row className="mb-3">
            <Col md={6}><h1>Feedback</h1><p>Let us know what you think or report issues.</p></Col>
            <Col md={3} className="text-end"><Button variant="primary" onClick={() => openModal()}>+ New Feedback</Button></Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive>
              <thead><tr><th>#</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{entries
                .filter(e =>
                  e.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.status.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((e, i) => (
                <tr key={e.id}><td>{i+1}</td><td>{e.message}</td><td>{e.status}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(e)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(e.id)}>Delete</Button>
                  </td>
                </tr>
              ))}</tbody>
            </Table>
          )}
        </Container>
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton><Modal.Title>{current ? 'Edit Feedback' : 'New Feedback'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="feedbackMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="feedbackResponse">
              <Form.Label>Response</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.response} onChange={e => setFormData({ ...formData, response: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="feedbackStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button variant="primary" onClick={handleSave}>Save</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Feedback;
