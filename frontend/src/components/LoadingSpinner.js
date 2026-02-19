import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <div className="spinner-glow"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;