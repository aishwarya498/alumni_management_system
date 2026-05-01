import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';

const Newsletter = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container className="py-5">
          <h1>Newsletter</h1>
          <p>Subscribe to or browse past editions of the alumni newsletter here.</p>
        </Container>
      </div>
    </div>
  );
};

export default Newsletter;
