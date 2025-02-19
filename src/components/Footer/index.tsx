import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <footer className="mt-auto py-6 bg-surface/80 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-text-secondary text-sm">
            Developed by{' '}
            <a
              href="https://twitter.com/beaubhavik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              #beaubhavik
            </a>
          </p>
          <p className="text-text-disabled text-xs">
            Design and share stunning multilingual quote images effortlessly!
          </p>
        </div>
      </div>
    </footer>
  );
};