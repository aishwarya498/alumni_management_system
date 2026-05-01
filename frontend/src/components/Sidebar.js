import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasRole, logout } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();

  const isActive = (path) => location.pathname === path;

  // Logo click → role home page
  const homeRoute = hasRole('admin')
    ? '/admin'
    : hasRole('manager')
    ? '/manager'
    : '/alumni-dashboard';

  const roleLabel = hasRole('admin')
    ? 'Administrator'
    : hasRole('manager')
    ? 'Manager'
    : 'Alumni';

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeSidebar();
  };

  const adminMenu = [
    { path: '/admin',      icon: 'fas fa-home',               label: 'Dashboard' },
    { path: '/roles',      icon: 'fas fa-lock',               label: 'Manage Roles' },
    { path: '/alumni',     icon: 'fas fa-users',              label: 'Alumni Directory' },
    { path: '/add-alumni', icon: 'fas fa-user-plus',          label: 'Add Alumni' },
    { path: '/search',     icon: 'fas fa-search',             label: 'Search Alumni' },
    { path: '/events',     icon: 'fas fa-calendar-alt',       label: 'Events & Reunions' },
    { path: '/jobs',       icon: 'fas fa-briefcase',          label: 'Job Portal' },
    { path: '/donations',  icon: 'fas fa-hand-holding-heart', label: 'Donations' },
    { path: '/stories',    icon: 'fas fa-star',               label: 'Success Stories' },
    { path: '/feedback',   icon: 'fas fa-comment-dots',       label: 'Feedback' },
    { path: '/networking', icon: 'fas fa-network-wired',      label: 'Networking Hub' },
    { path: '/help',       icon: 'fas fa-question-circle',    label: 'Help Center' },
  ];

  const managerMenu = [
    { path: '/manager',    icon: 'fas fa-home',               label: 'Dashboard' },
    { path: '/alumni',     icon: 'fas fa-users',              label: 'Alumni Directory' },
    { path: '/add-alumni', icon: 'fas fa-user-plus',          label: 'Add Alumni' },
    { path: '/events',     icon: 'fas fa-calendar-alt',       label: 'Events & Reunions' },
    { path: '/jobs',       icon: 'fas fa-briefcase',          label: 'Job Portal' },
    { path: '/donations',  icon: 'fas fa-hand-holding-heart', label: 'Donations' },
    { path: '/stories',    icon: 'fas fa-star',               label: 'Success Stories' },
    { path: '/feedback',   icon: 'fas fa-comment-dots',       label: 'Feedback' },
    { path: '/networking', icon: 'fas fa-network-wired',      label: 'Networking Hub' },
    { path: '/help',       icon: 'fas fa-question-circle',    label: 'Help Center' },
  ];

  const alumniMenu = [
    { path: '/alumni-dashboard', icon: 'fas fa-home',               label: 'Dashboard' },
    { path: '/networking',       icon: 'fas fa-network-wired',      label: 'Networking Hub' },
    { path: '/jobs',             icon: 'fas fa-briefcase',          label: 'Job Portal' },
    { path: '/events',           icon: 'fas fa-calendar-alt',       label: 'Events & Reunions' },
    { path: '/donations',        icon: 'fas fa-hand-holding-heart', label: 'Donations' },
    { path: '/stories',          icon: 'fas fa-star',               label: 'Success Stories' },
    { path: '/feedback',         icon: 'fas fa-comment-dots',       label: 'Feedback' },
    { path: '/help',             icon: 'fas fa-question-circle',    label: 'Help Center' },
  ];

  const menuItems = hasRole('admin')
    ? adminMenu
    : hasRole('manager')
    ? managerMenu
    : alumniMenu;

  return (
    <div className={`sidebar-modern ${sidebarOpen ? 'open' : ''}`}>

      {/* Brand / Logo */}
      <Link to={homeRoute} className="sidebar-brand" onClick={closeSidebar}>
        <span className="sidebar-brand-icon">🎓</span>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Alumni Portal</span>
          <span className="sidebar-brand-role">{roleLabel}</span>
        </div>
      </Link>

      {/* User profile */}
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-info">
            <h4>{user?.username || 'User'}</h4>
            <span className="user-role">{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-menu">
        <div className="menu-section">
          <h5 className="menu-title">Navigation</h5>
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="menu-section">
          <h5 className="menu-title">Account</h5>
          <Link
            to="/profile"
            className={`sidebar-item ${isActive('/profile') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <i className="fas fa-user-cog"></i>
            <span>Account Settings</span>
          </Link>
          <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
