import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { alumniService } from '../services/alumniService';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await alumniService.getStatistics();
      if (response.data.success) {
        setStats(response.data.data);
        const total = response.data.data.reduce((sum, item) => sum + item.totalAlumni, 0);
        setTotalAlumni(total);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={8} className="text-center">
              <h1 className="hero-title">Welcome to Alumni Portal</h1>
              <p className="hero-subtitle">
                Connect with your alumni network, share experiences, and build lasting professional relationships.
              </p>
              <div className="hero-buttons">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="btn-custom me-3"
                  onClick={() => navigate('/alumni')}
                >
                  View All Alumni
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="btn-custom-outline"
                  onClick={() => navigate('/add-alumni')}
                >
                  Add Your Profile
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="stats-section py-5">
        <Container>
          <h2 className="section-title text-center mb-4">Alumni Statistics</h2>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row>
              <Col lg={4} md={6} className="mb-3">
                <Card className="stat-card">
                  <Card.Body className="text-center">
                    <h3 className="stat-number">{totalAlumni}</h3>
                    <p className="stat-label">Total Alumni</p>
                  </Card.Body>
                </Card>
              </Col>
              {stats.map((stat) => (
                <Col lg={4} md={6} className="mb-3" key={stat.year}>
                  <Card className="stat-card">
                    <Card.Body className="text-center">
                      <h3 className="stat-number">{stat.totalAlumni}</h3>
                      <p className="stat-label">Class of {stat.year}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      <section className="features-section py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-4">Features</h2>
          <Row>
            <Col lg={4} md={6} className="mb-3">
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h4 className="feature-title">View Alumni</h4>
                <p className="feature-text">
                  Browse and discover profiles of alumni from your network.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-3">
              <div className="feature-card">
                <div className="feature-icon">➕</div>
                <h4 className="feature-title">Add Profile</h4>
                <p className="feature-text">
                  Create and manage your alumni profile with all your details.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-3">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h4 className="feature-title">Search Alumni</h4>
                <p className="feature-text">
                  Easily search and find alumni by name, company, or other details.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
