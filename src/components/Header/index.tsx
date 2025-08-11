import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from '../ThemeToggle';
import { AnimatedLogo } from '../AnimatedLogo';
import { TextLogo } from '../TextLogo';

export const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Text Logo */}
          <div className="flex items-center space-x-2">
            <TextLogo />
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