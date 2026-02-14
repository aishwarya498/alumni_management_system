import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/RoleManagement.css';

const RoleManagement = () => {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const headers = { Authorization: `Bearer ${token}` };

  const availablePermissions = [
    'manage_users',
    'manage_roles',
    'manage_alumni',
    'view_reports',
    'view_alumni',
    'update_profile',
    'view_directory',
    'export_data'
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/roles`, { headers });
      setRoles(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    if (formData.permissions.length === 0) {
      setError('Please select at least one permission');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/roles`,
        formData,
        { headers }
      );

      if (response.data.success) {
        setSuccess('Role created successfully');
        setFormData({ name: '', description: '', permissions: [] });
        setShowForm(false);
        fetchRoles();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/roles/${editingRole.id}`,
        formData,
        { headers }
      );

      if (response.data.success) {
        setSuccess('Role updated successfully');
        setFormData({ name: '', description: '', permissions: [] });
        setEditingRole(null);
        setShowForm(false);
        fetchRoles();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || []
    });
    setShowForm(true);
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (['admin', 'manager', 'alumni', 'guest'].includes(roleName)) {
      setError('System roles cannot be deleted');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      try {
        setLoading(true);
        const response = await axios.delete(
          `${API_URL}/roles/${roleId}`,
          { headers }
        );

        if (response.data.success) {
          setSuccess('Role deleted successfully');
          fetchRoles();
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete role');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
    setError('');
  };

  return (
    <div className="role-management-container">
      <div className="role-management-header">
        <h2>Role Management</h2>
        <p>Create, update, and manage system roles and permissions</p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="role-management-controls">
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus"></i> Create New Role
          </button>
        )}
      </div>

      {showForm && (
        <div className="role-form-container">
          <div className="role-form">
            <h3>{editingRole ? 'Edit Role' : 'Create New Role'}</h3>
            <form onSubmit={editingRole ? handleUpdateRole : handleCreateRole}>
              <div className="form-group">
                <label htmlFor="name">Role Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Supervisor, Guest, etc."
                  disabled={editingRole && ['admin', 'manager', 'alumni', 'guest'].includes(editingRole.name)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Describe the purpose of this role"
                />
              </div>

              <div className="form-group">
                <label>Permissions *</label>
                <div className="permissions-grid">
                  {availablePermissions.map(permission => (
                    <div key={permission} className="permission-item">
                      <input
                        type="checkbox"
                        id={`perm_${permission}`}
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                      />
                      <label htmlFor={`perm_${permission}`}>
                        {permission.replace(/_/g, ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="roles-grid">
        {loading && !showForm ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : roles.length > 0 ? (
          roles.map(role => (
            <div key={role.id} className="role-card">
              <div className="role-card-header">
                <h4>{role.name}</h4>
                {!['admin', 'manager', 'alumni', 'guest'].includes(role.name) && (
                  <div className="role-card-actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditRole(role)}
                      title="Edit role"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteRole(role.id, role.name)}
                      title="Delete role"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
                {['admin', 'manager', 'alumni', 'guest'].includes(role.name) && (
                  <span className="badge bg-info">System Role</span>
                )}
              </div>

              {role.description && (
                <p className="role-description">{role.description}</p>
              )}

              <div className="role-permissions">
                <strong>Permissions:</strong>
                <ul>
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.map((perm, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check-circle"></i>
                        {perm.replace(/_/g, ' ')}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted">No permissions</li>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="no-roles">No roles found</div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
