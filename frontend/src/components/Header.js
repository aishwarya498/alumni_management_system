import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const { toggleSidebar } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar 
      expand="lg" 
      sticky="top" 
      className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`} 
      expanded={expanded} 
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? '/dashboard' : '/'} className="brand-title" onClick={() => setExpanded(false)}>
          <div className="brand-container">
            <span className="brand-icon">🎓</span>
            <div className="brand-text">
              <span className="brand-main">Alumni Portal</span>
              <span className="brand-sub">Connect • Network • Grow</span>
            </div>
          </div>
        </Navbar.Brand>

        {/* sidebar toggle for mobile */}
        <button type="button" className="sidebar-toggle d-lg-none btn btn-link" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className={`nav-link-custom ${isActiveLink('/dashboard') ? 'active' : ''}`} 
                  onClick={() => setExpanded(false)}
                >
                  <i className="fas fa-tachometer-alt me-1"></i> Dashboard
                </Nav.Link>

                <Dropdown className="nav-dropdown" align="end">
                  <Dropdown.Toggle as="a" className="nav-user-dropdown" id="user-dropdown">
                    <div className="user-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user?.username}</span>
                      <span className="user-role">{user?.roles?.[0]?.name || 'User'}</span>
                    </div>
                    <i className="fas fa-chevron-down dropdown-arrow"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown-menu">
                    <div className="dropdown-header">
                      <div className="user-avatar-large">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div>
                        <div className="dropdown-user-name">{user?.username}</div>
                        <div className="dropdown-user-email">{user?.email}</div>
                      </div>
                    </div>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleProfileClick} className="dropdown-item-custom">
                      <i className="fas fa-user me-2"></i> My Profile
                    </Dropdown.Item>
                    {hasRole(['admin', 'manager']) && (
                      <>
                        <Dropdown.Divider />
                        {hasRole('admin') && (
                          <>
                            <Dropdown.Item onClick={handleAdminClick} className="dropdown-item-custom">
                              <i className="fas fa-tachometer-alt me-2"></i> Admin Dashboard
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/roles" onClick={() => setExpanded(false)} className="dropdown-item-custom">
                              <i className="fas fa-lock me-2"></i> Manage Roles
                            </Dropdown.Item>
                          </>
                        )}
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="logout-btn dropdown-item-custom">
                      <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom" onClick={() => setExpanded(false)}>
                  <i className="fas fa-sign-in-alt me-1"></i> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom nav-register-btn" onClick={() => setExpanded(false)}>
                  <i className="fas fa-user-plus me-1"></i> Register
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
