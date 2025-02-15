import React from 'react';

interface FABProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export const FAB: React.FC<FABProps> = ({ onClick, className = '', children }) => (
  <button
    onClick={onClick}
    className={`
      p-4 rounded-full bg-primary text-white shadow-lg
      hover:bg-opacity-90 active:bg-opacity-80
      transition-all duration-200
      ${className}
    `}
  >
    {children}
  </button>
); 