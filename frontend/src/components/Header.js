import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setExpanded(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setExpanded(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" sticky="top" className="navbar-custom" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-title" onClick={() => setExpanded(false)}>
          <span className="brand-icon">🎓</span> Alumni Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-custom" onClick={() => setExpanded(false)}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/alumni" className="nav-link-custom" onClick={() => setExpanded(false)}>
                  All Alumni
                </Nav.Link>
                {hasRole(['admin', 'manager', 'alumni']) && (
                  <Nav.Link as={Link} to="/add-alumni" className="nav-link-custom" onClick={() => setExpanded(false)}>
                    Add Alumni
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/search" className="nav-link-custom" onClick={() => setExpanded(false)}>
                  Search
                </Nav.Link>

                <Dropdown className="nav-dropdown" align="end">
                  <Dropdown.Toggle as="a" className="nav-user-dropdown" id="user-dropdown">
                    <i className="fas fa-user-circle"></i> {user?.username}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleProfileClick}>
                      <i className="fas fa-user me-2"></i> My Profile
                    </Dropdown.Item>
                    {hasRole(['admin', 'manager']) && (
                      <>
                        <Dropdown.Divider />
                        {hasRole('admin') && (
                          <>
                            <Dropdown.Item onClick={handleAdminClick}>
                              <i className="fas fa-tachometer-alt me-2"></i> Admin Dashboard
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/roles" onClick={() => setExpanded(false)}>
                              <i className="fas fa-lock me-2"></i> Manage Roles
                            </Dropdown.Item>
                          </>
                        )}
                        {hasRole('manager') && (
                          <Dropdown.Item as={Link} to="/alumni" onClick={() => setExpanded(false)}>
                            <i className="fas fa-tasks me-2"></i> Manager Tools
                          </Dropdown.Item>
                        )}
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="logout-btn">
                      <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom" onClick={() => setExpanded(false)}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom nav-register-btn" onClick={() => setExpanded(false)}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
