import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  label = 'Loading...' 
}) => {
  const sizeMap = {
    small: '16px',
    medium: '32px',
    large: '48px',
  };

  return (
    <div className="loading-spinner-container" role="status" aria-label={label}>
      <div 
        className="loading-spinner"
        style={{ 
          width: sizeMap[size], 
          height: sizeMap[size] 
        }}
      />
      <span className="loading-label">{label}</span>
    </div>
  );
};
