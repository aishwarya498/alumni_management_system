import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Modal, Form, Table } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';
import { donationService } from '../services/donationService';

const Donations = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ campaign_name: '', goal_amount: '', start_date: '', end_date: '', description: '' });

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true); setError('');
      const res = await donationService.getAll();
      if (res.data.success) setCampaigns(res.data.data);
    } catch (err) { setError('Error fetching campaigns'); console.error(err);} finally { setLoading(false); }
  };

  const openModal = (camp = null) => {
    setCurrent(camp);
    setFormData(camp ? {
      campaign_name: camp.campaign_name || '',
      goal_amount: camp.goal_amount || '',
      start_date: camp.start_date ? camp.start_date.split('T')[0] : '',
      end_date: camp.end_date ? camp.end_date.split('T')[0] : '',
      description: camp.description || ''
    } : { campaign_name: '', goal_amount: '', start_date: '', end_date: '', description: '' });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setCurrent(null); };

  const handleSave = async () => {
    try {
      if (current) await donationService.update(current.id, formData);
      else await donationService.create(formData);
      fetchCampaigns(); closeModal();
    } catch (err) { setError('Error saving campaign'); console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete campaign?')) return;
    try { await donationService.delete(id); setCampaigns(campaigns.filter(c => c.id !== id)); }
    catch (err) { setError('Error deleting campaign'); console.error(err); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="pt-4">
          <Row className="mb-3">
            <Col md={6}><h1>Donations</h1><p>View campaigns, donate, and manage contributions.</p></Col>
            <Col md={3} className="text-end"><Button variant="primary" onClick={() => openModal()}>+ New Campaign</Button></Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Search campaigns..."
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
              <thead><tr><th>#</th><th>Campaign</th><th>Goal</th><th>Start</th><th>End</th><th>Actions</th></tr></thead>
              <tbody>{campaigns
                .filter(c =>
                  c.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((c, i) => (
                <tr key={c.id}><td>{i+1}</td><td>{c.campaign_name}</td><td>{c.goal_amount}</td><td>{c.start_date?.split('T')[0]}</td><td>{c.end_date?.split('T')[0]}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(c)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>Delete</Button>
                  </td>
                </tr>
              ))}</tbody>
            </Table>
          )}
        </Container>
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton><Modal.Title>{current ? 'Edit Campaign' : 'New Campaign'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="campaignName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={formData.campaign_name} onChange={e => setFormData({ ...formData, campaign_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="goalAmount">
              <Form.Label>Goal Amount</Form.Label>
              <Form.Control type="number" value={formData.goal_amount} onChange={e => setFormData({ ...formData, goal_amount: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
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

export default Donations;
