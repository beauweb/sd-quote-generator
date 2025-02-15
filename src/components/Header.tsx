import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center space-x-2"
      >
        <div className="relative group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white"
          >
            SD
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Quotes Creator
          </h1>
        </div>
      </motion.div>

      <p className="text-sm text-gray-400 italic hidden sm:block">
        Design and share stunning multilingual quote images effortlessly!
      </p>
    </header>
  );
}; 