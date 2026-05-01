import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';

const Mentorship = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container className="py-5">
          <h1>Mentorship Program</h1>
          <p>Information about the mentorship program will be available here.</p>
        </Container>
      </div>
    </div>
  );
};

export default Mentorship;
