import React from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => (
  <>
    {/* Backdrop */}
    {open && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
    )}
    
    {/* Sidebar */}
    <div
      className={`
        fixed top-0 left-0 h-full w-64 bg-surface border-r border-border
        transform transition-transform duration-300 ease-in-out z-50
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        {/* Add menu items here */}
      </div>
    </div>
  </>
); 