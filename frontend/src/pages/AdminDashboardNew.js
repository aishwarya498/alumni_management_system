import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';

const AdminDashboardNew = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 7,
    teachers: 2,
    faculty: 1,
    total: 10
  });
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Meeting',
      content: 'We will be having an emergency meeting today at 3:00 PM.',
      author: 'Mark Calendario',
      date: 'April 05, 2023 at 02:23 PM',
      type: 'urgent'
    }
  ]);
  const [activity, setActivity] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePostAnnouncement = () => {
    if (announcement.trim()) {
      const newAnnouncement = {
        id: announcements.length + 1,
        title: 'Announcement',
        content: announcement,
        author: user?.username || 'Admin',
        date: new Date().toLocaleString(),
        type: 'info'
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncement('');
    }
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handleAddActivity = () => {
    if (activity.trim()) {
      console.log('Activity added:', activity);
      setActivity('');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid>
          {/* Welcome Banner */}
          <Row className="mb-4">
            <Col>
              <div className="welcome-banner-modern">
                <div className="banner-content">
                  <h2>Hello, {user?.username || 'Admin'}!</h2>
                  <p>Welcome! You are logged in as a Faculty Administrator</p>
                </div>
                <div className="banner-illustration">
                  <i className="fas fa-user-tie"></i>
                </div>
              </div>
            </Col>
          </Row>

          {/* Analytics Overview */}
          <Row className="mb-4">
            <Col>
              <h3 className="section-heading">Analytics Overview</h3>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-blue">
                <div className="stat-icon">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.students}</h2>
                  <p>STUDENTS</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-orange">
                <div className="stat-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.teachers}</h2>
                  <p>TEACHERS</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-pink">
                <div className="stat-icon">
                  <i className="fas fa-crown"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.faculty}</h2>
                  <p>FACULTY</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-green">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.total}</h2>
                  <p>TOTAL</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Announcements Section */}
            <Col lg={7} className="mb-4">
              <Card className="modern-card">
                <Card.Body>
                  <div className="post-announcement-section">
                    <Button variant="light" className="post-btn">
                      <i className="fas fa-plus-circle me-2"></i>
                      Post new announcement
                    </Button>
                  </div>

                  <h4 className="section-title mt-4">Announcements</h4>
                  
                  {announcements.map((item) => (
                    <div key={item.id} className={`announcement-card ${item.type}`}>
                      <div className="announcement-header">
                        <h5>{item.title}</h5>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAnnouncement(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                      <p className="announcement-content">{item.content}</p>
                      <p className="announcement-meta">
                        {item.author} on {item.date}
                      </p>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Right Sidebar */}
            <Col lg={5} className="mb-4">
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
                    <h4>Good afternoon, {user?.username || 'Admin'}!</h4>
                    <p className="text-muted">Failures are the best teacher</p>
                  </div>

                  <h5 className="mt-4 mb-3">Your activities</h5>
                  <Form.Group className="activity-input">
                    <div className="input-group">
                      <Form.Control
                        type="text"
                        placeholder="Task content"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                      />
                      <Button variant="primary" onClick={handleAddActivity}>
                        <i className="fas fa-plus"></i>
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="mt-4">
                    <p className="text-muted">Create meeting announcement.</p>
                    <div className="action-buttons">
                      <Button variant="success" size="sm">
                        <i className="fas fa-check me-1"></i>
                      </Button>
                      <Button variant="danger" size="sm">
                        <i className="fas fa-trash me-1"></i>
                      </Button>
                    </div>
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

export default AdminDashboardNew;
