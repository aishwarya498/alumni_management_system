import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchRoles(); // always load roles so IDs are available for role changes
    if (activeTab === 'users') fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'roles') fetchRoles();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users`, { headers });
      setUsers(res.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/roles`, { headers });
      setRoles(res.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/users/${userId}`, { headers });
      setSuccess('User deleted successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, oldRoleName, newRoleName) => {
    if (!newRoleName) return;
    try {
      // Look up numeric role IDs from the roles list
      const oldRole = roles.find(r => r.name === oldRoleName);
      const newRole = roles.find(r => r.name === newRoleName);

      if (!oldRole || !newRole) {
        setError('Role not found — please reload the page and try again.');
        return;
      }

      await axios.post(
        `${API_URL}/users/${userId}/remove-role`,
        { userId, roleId: oldRole.id },
        { headers }
      );
      await axios.post(
        `${API_URL}/users/${userId}/assign-role`,
        { userId, roleId: newRole.id },
        { headers }
      );
      setSuccess('Role changed successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change role');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        {/* Top bar */}
        <div className="admin-topbar">
          <div>
            <h2 className="admin-topbar-title">Admin Dashboard</h2>
            <p className="admin-topbar-sub">Manage users and roles</p>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-topbar-user">
              <i className="fas fa-user-circle me-2"></i>
              {user?.username}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users me-2"></i>Manage Users
          </button>
          <button
            className={`admin-tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <i className="fas fa-lock me-2"></i>Manage Roles
          </button>
        </div>

        {/* Content */}
        <div className="admin-panel">
          {/* ── Users Tab ── */}
          {activeTab === 'users' && (
            <>
              <h4 className="panel-title">Users Management</h4>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? users.map(u => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td><strong>{u.username}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.first_name} {u.last_name}</td>
                          <td>
                            {u.roles?.length > 0
                              ? u.roles.map(r => (
                                  <span key={r} className="badge bg-primary me-1">{r}</span>
                                ))
                              : <span className="text-muted">No roles</span>}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => setSelectedUser(u)}
                              title="Edit roles"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.username === 'admin'}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-4">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── Roles Tab ── */}
          {activeTab === 'roles' && (
            <>
              <h4 className="panel-title">Roles Management</h4>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : (
                <div className="roles-grid-modern">
                  {roles.length > 0 ? roles.map(role => (
                    <div key={role.id} className="role-card-modern">
                      <div className="role-card-header">
                        <i className="fas fa-shield-alt"></i>
                        <h5>{role.name}</h5>
                      </div>
                      {role.description && <p>{role.description}</p>}
                      {role.permissions?.length > 0 && (
                        <ul className="role-perms">
                          {role.permissions.map((p, i) => (
                            <li key={i}><i className="fas fa-check me-1"></i>{p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )) : (
                    <p className="text-muted">No roles found</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit roles modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Edit Roles — <strong>{selectedUser.username}</strong></h4>
            <div className="roles-selector mt-3">
              {selectedUser.roles?.map(role => (
                <div key={role} className="role-item">
                  <span className="role-badge">{role}</span>
                  {role !== 'admin' && (
                    <select
                      className="role-select"
                      defaultValue={role}
                      onChange={e => handleRoleChange(selectedUser.id, role, e.target.value)}
                    >
                      <option value="">Change to…</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="alumni">Alumni</option>
                      <option value="guest">Guest</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-secondary mt-4" onClick={() => setSelectedUser(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
