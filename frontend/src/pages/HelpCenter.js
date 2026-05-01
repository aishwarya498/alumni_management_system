import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';

const HelpCenter = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container className="py-5">
          <h1>Help Center</h1>
          <p>Need assistance? This page will contain FAQs, contact options, and other support resources.</p>
        </Container>
      </div>
    </div>
  );
};

export default HelpCenter;
