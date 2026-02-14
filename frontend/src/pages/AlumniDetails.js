import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { alumniService } from '../services/alumniService';

const AlumniDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlumnusDetails();
  }, [id]);

  const fetchAlumnusDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await alumniService.getAlumniById(id);
      if (response.data.success) {
        setAlumnus(response.data.data);
      }
    } catch (error) {
      setError('Error fetching alumni details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !alumnus) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || 'Alumni not found'}</Alert>
        <Button onClick={() => navigate('/alumni')}>Back to Alumni List</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="secondary" 
        className="mb-3"
        onClick={() => navigate('/alumni')}
      >
        ← Back to Alumni List
      </Button>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <h3 className="mb-0">
                {alumnus.first_name} {alumnus.last_name}
              </h3>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted">Email</h6>
                  <p>{alumnus.email}</p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted">Phone</h6>
                  <p>{alumnus.phone || 'N/A'}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted">Graduation Year</h6>
                  <p>{alumnus.graduation_year}</p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted">Degree</h6>
                  <p>{alumnus.degree}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted">Field of Study</h6>
                  <p>{alumnus.field_of_study}</p>
                </Col>
              </Row>

              <hr />

              <h5> Professional Information</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted">Current Company</h6>
                  <p>{alumnus.current_company || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted">Position</h6>
                  <p>{alumnus.current_position || 'N/A'}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted">City</h6>
                  <p>{alumnus.city || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted">Country</h6>
                  <p>{alumnus.country || 'N/A'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="mt-3">
            <Button 
              variant="warning" 
              className="me-2"
              onClick={() => navigate(`/edit-alumni/${alumnus.id}`)}
            >
              Edit Profile
            </Button>
            <Button 
              variant="danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this profile?')) {
                  alumniService.deleteAlumni(alumnus.id).then(() => {
                    navigate('/alumni');
                  });
                }
              }}
            >
              Delete Profile
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="shadow">
            <Card.Body>
              <h6 className="text-muted">Profile Information</h6>
              <p className="text-muted small">
                Created: {new Date(alumnus.created_at).toLocaleDateString()} <br/>
                Last Updated: {new Date(alumnus.updated_at).toLocaleDateString()}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AlumniDetails;
