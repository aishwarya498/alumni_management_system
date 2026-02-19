import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Table } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';
import { storyService } from '../services/storyService';

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ title: '', author_name: '', content: '' });

  useEffect(() => { fetchStories(); }, []);

  const fetchStories = async () => {
    try { setLoading(true); setError(''); const res = await storyService.getAll(); if (res.data.success) setStories(res.data.data); }
    catch (err) { setError('Error fetching stories'); console.error(err); } finally { setLoading(false); }
  };

  const openModal = (st = null) => {
    setCurrent(st);
    setFormData(st ? { title: st.title || '', author_name: st.author_name || '', content: st.content || '' } : { title: '', author_name: '', content: '' });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setCurrent(null); };

  const handleSave = async () => {
    try {
      if (current) await storyService.update(current.id, formData);
      else await storyService.create(formData);
      fetchStories(); closeModal();
    } catch (err) { setError('Error saving story'); console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete story?')) return;
    try { await storyService.delete(id); setStories(stories.filter(s => s.id !== id)); }
    catch (err) { setError('Error deleting story'); console.error(err); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="pt-4">
          <Row className="mb-3">
            <Col md={6}><h1>Success Stories</h1><p>Share and browse achievements of alumni.</p></Col>
            <Col md={3} className="text-end"><Button variant="primary" onClick={() => openModal()}>+ New Story</Button></Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Search stories..."
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
              <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Actions</th></tr></thead>
              <tbody>{stories
                .filter(s =>
                  s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.author_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((s, i) => (
                <tr key={s.id}><td>{i+1}</td><td>{s.title}</td><td>{s.author_name}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(s)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                  </td>
                </tr>
              ))}</tbody>
            </Table>
          )}
        </Container>
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton><Modal.Title>{current ? 'Edit Story' : 'New Story'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="storyTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="storyAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" value={formData.author_name} onChange={e => setFormData({ ...formData, author_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="storyContent">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button variant="primary" onClick={handleSave}>Save</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuccessStories;
