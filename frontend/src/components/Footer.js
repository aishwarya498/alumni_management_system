import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom mt-5">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
        </svg>
      </div>
      
      <Container>
        <Row className="py-5">
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-icon">🎓</span>
                <div className="footer-brand-text">
                  <h4 className="footer-title">Alumni Portal</h4>
                  <p className="footer-tagline">Connect • Network • Grow</p>
                </div>
              </div>
              <p className="footer-description">
                Building bridges between past, present, and future. Connect with fellow alumni, 
                share experiences, and create lasting professional networks that span generations.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-section-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/alumni">All Alumni</Link></li>
              <li><Link to="/add-alumni">Add Alumni</Link></li>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-section-title">Resources</h5>
            <ul className="footer-links">
              <li><a href="#">Career Services</a></li>
              <li><a href="#">Alumni Events</a></li>
              <li><a href="#">Mentorship Program</a></li>
              <li><a href="#">Newsletter</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-section-title">Contact Info</h5>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <strong>Email</strong>
                  <p>alumni@university.edu</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <strong>Phone</strong>
                  <p>+91-XXXX-XXXX-XX</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>University Campus<br/>City, State 12345</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className="footer-bottom">
          <Col md={6} className="mb-3 mb-md-0">
            <p className="footer-copyright">
              &copy; {currentYear} Alumni Portal. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="#">Terms of Service</a>
              <span className="separator">•</span>
              <a href="#">Cookie Policy</a>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className="footer-glow"></div>
    </footer>
  );
};

export default Footer;
