import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { alumniService } from '../services/alumniService';
import '../styles/AlumniForm.css';

const AlumniForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    graduation_year: '',
    degree: '',
    field_of_study: '',
    current_company: '',
    current_position: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchAlumnusData();
    }
  }, [isEdit, id]);

  const fetchAlumnusData = async () => {
    try {
      setLoading(true);
      const response = await alumniService.getAlumniById(id);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      setError('Error loading alumni data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (formData.phone && !/^\d{10,}$/.test(formData.phone)) errors.phone = 'Phone must be at least 10 digits';
    if (!formData.graduation_year) errors.graduation_year = 'Graduation year is required';
    if (!formData.degree.trim()) errors.degree = 'Degree is required';
    if (!formData.field_of_study.trim()) errors.field_of_study = 'Field of study is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      let response;
      if (isEdit) {
        response = await alumniService.updateAlumni(id, formData);
      } else {
        response = await alumniService.createAlumni(formData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => {
          navigate('/alumni');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving alumni profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="alumni-form-container py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="form-card">
            <h2 className="form-title">
              {isEdit ? 'Edit Alumni Profile' : 'Add New Alumni Profile'}
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      isInvalid={!!validationErrors.first_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      isInvalid={!!validationErrors.last_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      isInvalid={!!validationErrors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Graduation Year *</Form.Label>
                    <Form.Control
                      type="number"
                      name="graduation_year"
                      value={formData.graduation_year}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      isInvalid={!!validationErrors.graduation_year}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.graduation_year}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Degree *</Form.Label>
                    <Form.Control
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      isInvalid={!!validationErrors.degree}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.degree}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Field of Study *</Form.Label>
                    <Form.Control
                      type="text"
                      name="field_of_study"
                      value={formData.field_of_study}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      isInvalid={!!validationErrors.field_of_study}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.field_of_study}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Current Company</Form.Label>
                    <Form.Control
                      type="text"
                      name="current_company"
                      value={formData.current_company}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Current Position</Form.Label>
                    <Form.Control
                      type="text"
                      name="current_position"
                      value={formData.current_position}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label">Country</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="form-actions">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    isEdit ? 'Update Profile' : 'Create Profile'
                  )}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/alumni')}
                  className="btn-cancel"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AlumniForm;
