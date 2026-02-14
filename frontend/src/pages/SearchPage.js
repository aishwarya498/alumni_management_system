import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { alumniService } from '../services/alumniService';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await alumniService.searchAlumni(searchTerm);
      
      if (response.data.success) {
        setResults(response.data.data);
        setSearched(true);
      }
    } catch (error) {
      setError('Error searching alumni');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSearched(false);
    setError('');
  };

  return (
    <Container fluid className="search-page-container py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Search Alumni</h2>
          <p className="page-subtitle">Find alumni by name, email, company, or any other details</p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col lg={8}>
          <div className="search-card">
            <Form onSubmit={handleSearch}>
              <Form.Group className="mb-3">
                <Form.Label className="search-label">Search Term</Form.Label>
                <div className="search-input-group">
                  <Form.Control
                    type="text"
                    placeholder="Enter name, email, company, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="search-button"
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : '🔍 Search'}
                  </Button>
                </div>
              </Form.Group>
            </Form>

            {searched && (
              <div className="mt-2 text-center">
                <Button 
                  variant="link" 
                  onClick={handleClearSearch}
                  className="clear-button"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {searched && (
        <Row className="justify-content-center">
          <Col lg={10}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : results.length === 0 ? (
              <Alert variant="info" className="text-center">
                No alumni found matching "{searchTerm}". Try searching with different keywords.
              </Alert>
            ) : (
              <div className="results-card">
                <h4 className="results-title">Search Results ({results.length})</h4>
                <div className="table-responsive">
                  <Table striped bordered hover className="results-table">
                    <thead className="table-header">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Degree</th>
                        <th>Company</th>
                        <th>City</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((person) => (
                        <tr key={person.id} className="result-row">
                          <td className="name-cell">
                            {person.first_name} {person.last_name}
                          </td>
                          <td>{person.email}</td>
                          <td>{person.degree}</td>
                          <td>{person.current_company || 'N/A'}</td>
                          <td>{person.city || 'N/A'}</td>
                          <td>
                            <Button 
                              variant="info" 
                              size="sm"
                              onClick={() => navigate(`/alumni/${person.id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SearchPage;
