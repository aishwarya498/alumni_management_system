import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom mt-5">
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-3">
            <h5 className="footer-title">Alumni Portal</h5>
            <p className="footer-text">
              Connect with fellow alumni and build lasting professional networks.
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/alumni">All Alumni</a></li>
              <li><a href="/add-alumni">Add Alumni</a></li>
              <li><a href="/search">Search</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className="footer-title">Contact Us</h5>
            <p className="footer-text">
              Email: alumni@university.edu<br/>
              Phone: +91-XXXX-XXXX-XX
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3 border-top">
            <p className="footer-copyright">
              &copy; {currentYear} Alumni Portal. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
