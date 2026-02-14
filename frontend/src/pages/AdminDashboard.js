import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'roles') {
      fetchRoles();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`, { headers });
      setUsers(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/roles`, { headers });
      setRoles(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`, { headers });
        setSuccess('User deleted successfully');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, oldRole, newRole) => {
    try {
      // Remove old role
      await axios.post(`${API_URL}/users/${userId}/remove-role`, 
        { role: oldRole }, 
        { headers }
      );
      // Add new role
      await axios.post(`${API_URL}/users/${userId}/assign-role`, 
        { role: newRole }, 
        { headers }
      );
      setSuccess('Role changed successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change role');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p className="text-muted">Manage users and roles for the Alumni Management System</p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i> Manage Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <i className="fas fa-lock"></i> Manage Roles
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'users' && (
          <div className="users-section">
            <h3>Users Management</h3>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Roles</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <strong>{user.username}</strong>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.first_name} {user.last_name}</td>
                          <td>
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.map(role => (
                                <span key={role} className="badge bg-primary me-1">
                                  {role}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">No roles</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => setSelectedUser(user)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.username === 'admin'}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {selectedUser && (
              <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <h4>Edit User Roles</h4>
                  <p><strong>{selectedUser.username}</strong></p>
                  
                  <div className="roles-selector">
                    <label>Current Role:</label>
                    {selectedUser.roles && selectedUser.roles.map(role => (
                      <div key={role} className="role-item">
                        <span className="role-badge">{role}</span>
                        {role !== 'admin' && (
                          <select 
                            className="role-select"
                            onChange={(e) => handleRoleChange(selectedUser.id, role, e.target.value)}
                            defaultValue={role}
                          >
                            <option value="">Change to...</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="alumni">Alumni</option>
                            <option value="guest">Guest</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn btn-secondary mt-3"
                    onClick={() => setSelectedUser(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="roles-section">
            <h3>Roles Management</h3>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="roles-grid">
                {roles.length > 0 ? (
                  roles.map(role => (
                    <div key={role.id} className="role-card">
                      <h5>{role.name}</h5>
                      {role.description && <p>{role.description}</p>}
                      <div className="permissions-list">
                        <strong>Permissions:</strong>
                        <ul>
                          {role.permissions && role.permissions.map((perm, idx) => (
                            <li key={idx}>{perm}</li>
                          ))}
                        </ul>
                      </div>
                      {!['admin', 'manager', 'alumni', 'guest'].includes(role.name) && (
                        <button className="btn btn-sm btn-danger mt-3">
                          Delete Role
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center">No roles found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
