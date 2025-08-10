import React from 'react';
import { Mail, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <a
            href="https://twitter.com/beaubhavik"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
          >
            <Twitter size={16} />
            <span>Developed by #beaubhavik</span>
          </a>
        </div>
        
        <a
          href="mailto:code@spiderdunia.com"
          className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
        >
          <Mail size={16} />
          <span>code@bhavik.info</span>
        </a>
      </div>
    </footer>
  );
}; 