import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedLogo } from './AnimatedLogo';
import { TextLogo } from './TextLogo';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
      {/* Left side - Text Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center space-x-2"
      >
        <TextLogo />
      </motion.div>

      {/* Right side - Description */}
      <p className="text-sm text-gray-400 italic hidden sm:block">
        Design and share stunning multilingual quote images effortlessly!
      </p>
    </header>
  );
}; 