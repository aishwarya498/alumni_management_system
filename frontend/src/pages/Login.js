import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(formData.username, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ submit: result.message });
    }
  };

  const fillDemoAdmin = () => {
    setFormData({ username: 'admin_user', password: 'Demo@123' });
    setErrors({});
  };

  const fillDemoManager = () => {
    setFormData({ username: 'manager_user', password: 'Demo@123' });
    setErrors({});
  };

  const fillDemoAlumni = () => {
    setFormData({ username: 'alumni_user', password: 'Demo@123' });
    setErrors({});
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Alumni Management System</h1>
          <h2>Login</h2>
        </div>

        {errors.submit && (
          <div className="alert alert-danger" role="alert">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'is-invalid' : ''}
              placeholder="Enter your username"
              autoComplete="username"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'is-invalid' : ''}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>

        <div className="demo-section">
          <p className="demo-title">Demo Credentials</p>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="btn-demo btn-demo-info"
              onClick={fillDemoAdmin}
            >
              Admin Demo
            </button>
            <button 
              type="button" 
              className="btn-demo btn-demo-success"
              onClick={fillDemoManager}
            >
              Manager Demo
            </button>
            <button 
              type="button" 
              className="btn-demo btn-demo-warning"
              onClick={fillDemoAlumni}
            >
              Alumni Demo
            </button>
          </div>
          <small>
            Click a demo button to auto-fill credentials (Password: Demo@123)
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
