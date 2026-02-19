import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user, hasRole } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();

  const isActive = (path) => location.pathname === path;

  // simplified, role-agnostic menu items for the alumni platform
  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/networking', icon: 'fas fa-network-wired', label: 'Networking Hub' },
    { path: '/jobs', icon: 'fas fa-briefcase', label: 'Job Portal' },
    { path: '/donations', icon: 'fas fa-donate', label: 'Donations' },
    { path: '/events', icon: 'fas fa-calendar-alt', label: 'Events & Reunions' },
    { path: '/stories', icon: 'fas fa-star', label: 'Success Stories' },
    { path: '/feedback', icon: 'fas fa-comment-dots', label: 'Feedback' },
  ];

  return (
    <div className={`sidebar-modern ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-info">
            <h4>{user?.username || 'User'}</h4>
            <span className="user-role">{user?.roles?.[0]?.name || 'User'}</span>
          </div>
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-section">
          <h5 className="menu-title">
            {hasRole('admin') ? 'Administrator' : hasRole('manager') ? 'Manager' : 'Alumni'}
          </h5>
          {menuItems.map((item, index) => (
            <Link
              key={index}
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
          <h5 className="menu-title">Personal Settings</h5>
          <Link
            to="/profile"
            className={`sidebar-item ${isActive('/profile') ? 'active' : ''}`}
          >
            <i className="fas fa-cog"></i>
            <span>Account Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
