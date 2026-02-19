import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';
import { eventService } from '../services/eventService';

const EventsReunions = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', event_date: '', description: '' });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try { setLoading(true); setError(''); const res = await eventService.getAll(); if (res.data.success) setEvents(res.data.data); }
    catch (err) { setError('Error fetching events'); console.error(err); } finally { setLoading(false); }
  };

  const openModal = (evt = null) => {
    setCurrent(evt);
    setFormData(evt ? {
      name: evt.name || '',
      location: evt.location || '',
      event_date: evt.event_date ? evt.event_date.split('T')[0] : '',
      description: evt.description || ''
    } : { name: '', location: '', event_date: '', description: '' });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setCurrent(null); };

  const handleSave = async () => {
    try {
      if (current) await eventService.update(current.id, formData);
      else await eventService.create(formData);
      fetchEvents(); closeModal();
    } catch (err) { setError('Error saving event'); console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try { await eventService.delete(id); setEvents(events.filter(e => e.id !== id)); }
    catch (err) { setError('Error deleting event'); console.error(err); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="pt-4">
          <Row className="mb-3">
            <Col md={6}><h1>Events & Reunions</h1><p>Create and manage events, register attendees.</p></Col>
            <Col md={3} className="text-end"><Button variant="success" onClick={() => openModal()}>+ New Event</Button></Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Search events..."
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
              <thead><tr><th>#</th><th>Event</th><th>Date</th><th>Location</th><th>Actions</th></tr></thead>
              <tbody>{events
                .filter(e =>
                  e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.location.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((e, i) => (
                <tr key={e.id}><td>{i+1}</td><td>{e.name}</td><td>{e.event_date?.split('T')[0]}</td><td>{e.location}</td>
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
        <Modal.Header closeButton><Modal.Title>{current ? 'Edit Event' : 'New Event'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="eventName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button variant="primary" onClick={handleSave}>Save</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventsReunions;
