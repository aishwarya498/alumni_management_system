import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css'; // reuse layout styles

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="pt-4">
          <Row>
            <Col>
              <h1>Dashboard</h1>
              <p>Overview of statistics and quick links will go here.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
