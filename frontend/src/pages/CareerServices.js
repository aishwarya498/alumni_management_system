import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';

const CareerServices = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container className="py-5">
          <h1>Career Services</h1>
          <p>This section will eventually provide information and links to career-related resources for alumni.</p>
        </Container>
      </div>
    </div>
  );
};

export default CareerServices;
