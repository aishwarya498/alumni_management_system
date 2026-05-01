import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';

const ManagerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAlumni: 150,
    activeAlumni: 120,
    recentlyAdded: 15,
    pendingApprovals: 5
  });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await axios.get(`${API_URL}/users`, { headers });
      setUsers(response.data.data || []);
      setUserError('');
    } catch (error) {
      setUserError('Unable to load users.');
      console.error('Manager user fetch failed:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userRoles) => {
    if (userRoles?.includes('admin')) {
      setUserError('Managers cannot delete admin users.');
      return;
    }

    if (!window.confirm('Delete this user?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/users/${userId}`, { headers });
      setSuccess('User deleted successfully.');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setUserError(error.response?.data?.message || 'Failed to delete user.');
      console.error('Manager delete failed:', error);
    }
  };

  const toggleActiveStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`${API_URL}/users/${userId}`, { is_active: !currentStatus }, { headers });
      setSuccess(`User ${currentStatus ? 'deactivated' : 'activated'} successfully.`);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setUserError(error.response?.data?.message || 'Failed to update user status.');
      console.error('Manager update failed:', error);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <div className="welcome-banner-modern">
                <div className="banner-content">
                  <h2>Hello, {user?.username || 'Manager'}!</h2>
                  <p>Welcome! You are logged in as an Alumni Manager</p>
                </div>
                <div className="banner-illustration">
                  <i className="fas fa-user-tie"></i>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h3 className="section-heading">Alumni Overview</h3>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-blue">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.totalAlumni}</h2>
                  <p>TOTAL ALUMNI</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-green">
                <div className="stat-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.activeAlumni}</h2>
                  <p>ACTIVE</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-orange">
                <div className="stat-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.recentlyAdded}</h2>
                  <p>RECENTLY ADDED</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="stat-card-modern stat-card-pink">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-details">
                  <h2>{stats.pendingApprovals}</h2>
                  <p>PENDING</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8} className="mb-4">
              <Card className="modern-card">
                <Card.Body>
                  <h4 className="section-title">Quick Actions</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="primary" 
                        className="w-100 py-3"
                        onClick={() => navigate('/add-alumni')}
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        Add New Alumni
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="info" 
                        className="w-100 py-3"
                        onClick={() => navigate('/alumni')}
                      >
                        <i className="fas fa-list me-2"></i>
                        View All Alumni
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="success" 
                        className="w-100 py-3"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-search me-2"></i>
                        Search Alumni
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="warning" 
                        className="w-100 py-3"
                      >
                        <i className="fas fa-file-export me-2"></i>
                        Export Data
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="modern-card mt-4">
                <Card.Body>
                  <h4 className="section-title">Users Management</h4>

                  {success && (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  )}
                  {userError && (
                    <div className="alert alert-danger" role="alert">
                      {userError}
                    </div>
                  )}

                  {usersLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0 ? (
                            users.map((userItem) => (
                              <tr key={userItem.id}>
                                <td>{userItem.id}</td>
                                <td>{userItem.username}</td>
                                <td>{userItem.email}</td>
                                <td>{userItem.first_name} {userItem.last_name}</td>
                                <td>{userItem.is_active ? 'Active' : 'Inactive'}</td>
                                <td>
                                  <Button
                                    variant={userItem.is_active ? 'outline-secondary' : 'outline-success'}
                                    size="sm"
                                    className="me-2"
                                    onClick={() => toggleActiveStatus(userItem.id, userItem.is_active)}
                                  >
                                    {userItem.is_active ? 'Deactivate' : 'Activate'}
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    disabled={userItem.roles?.includes('admin')}
                                    onClick={() => handleDeleteUser(userItem.id, userItem.roles)}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">No users found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
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
                    <h4>Good day, {user?.username || 'Manager'}!</h4>
                    <p className="text-muted">Keep up the great work managing our alumni network</p>
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

export default ManagerDashboard;
