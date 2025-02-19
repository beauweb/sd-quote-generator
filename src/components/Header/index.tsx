import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from '../ThemeToggle';

export const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SD
            </div>
            <span className="hidden sm:inline-block text-text-secondary">
              Quotes Creator
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-lg transition-colors"
              onClick={() => {
                // TODO: Implement Google login
                console.log('Login clicked');
              }}
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};