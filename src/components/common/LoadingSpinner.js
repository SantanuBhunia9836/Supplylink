// src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 6, color = 'white' }) => {
  const spinnerStyle = {
    width: `${size * 4}px`,
    height: `${size * 4}px`,
    border: `${size / 2}px solid rgba(255, 255, 255, 0.3)`,
    borderTopColor: color,
    borderRadius: '50%',
  };

  return (
    <div className="flex justify-center items-center">
      <div style={spinnerStyle} className="animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
 