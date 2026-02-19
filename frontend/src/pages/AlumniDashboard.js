import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    connections: 45,
    events: 8,
    messages: 12,
    updates: 3
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <div className="welcome-banner-modern">
                <div className="banner-content">
                  <h2>Hello, {user?.username || 'Alumni'}!</h2>
                  <p>Welcome back to the Alumni Portal</p>
                </div>
                <div className="banner-illustration">
                  <i className="fas fa-user-graduate"></i>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h3 className="section-heading">Your Dashboard</h3>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-blue">
                <div className="stat-icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.connections}</h2>
                  <p>CONNECTIONS</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-orange">
                <div className="stat-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.events}</h2>
                  <p>EVENTS</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-pink">
                <div className="stat-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.messages}</h2>
                  <p>MESSAGES</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-green">
                <div className="stat-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.updates}</h2>
                  <p>UPDATES</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8} className="mb-4">
              <Card className="modern-card">
                <Card.Body>
                  <h4 className="section-title">Quick Links</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="primary" 
                        className="w-100 py-3"
                        onClick={() => navigate('/profile')}
                      >
                        <i className="fas fa-user me-2"></i>
                        My Profile
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="info" 
                        className="w-100 py-3"
                        onClick={() => navigate('/alumni')}
                      >
                        <i className="fas fa-users me-2"></i>
                        Alumni Directory
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="success" 
                        className="w-100 py-3"
                      >
                        <i className="fas fa-calendar me-2"></i>
                        Upcoming Events
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="warning" 
                        className="w-100 py-3"
                      >
                        <i className="fas fa-briefcase me-2"></i>
                        Job Board
                      </Button>
                    </Col>
                  </Row>

                  <h4 className="section-title mt-4">Recent Activity</h4>
                  <div className="announcement-card info">
                    <div className="announcement-header">
                      <h5>Welcome to Alumni Portal</h5>
                    </div>
                    <p className="announcement-content">
                      Stay connected with your fellow alumni, discover networking opportunities, 
                      and keep up with university news and events.
                    </p>
                    <p className="announcement-meta">System • Today</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} className="mb-4">
              <Card className="modern-card mb-3">
                <Card.Body>
                  <div className="time-widget">
                    <h3 className="time-display">
                      {currentTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </h3>
                    <p className="date-display">
                      {currentTime.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="day-display">
                      {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              <Card className="modern-card">
                <Card.Body>
                  <div className="greeting-card">
                    <h4>Welcome back, {user?.username || 'Alumni'}!</h4>
                    <p className="text-muted">Stay connected with your alma mater</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AlumniDashboard;
