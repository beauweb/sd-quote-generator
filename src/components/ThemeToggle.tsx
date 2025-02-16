import React from 'react';
import { SunIcon, MoonIcon } from '../icons';
import { useColorMode } from '../hooks/useColorMode';

export const ThemeToggle: React.FC = () => {
  const [colorMode, setColorMode] = useColorMode();

  const toggleColorMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleColorMode}
      className="p-2 rounded-lg bg-surface hover:bg-surface-light transition-colors"
      title={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {colorMode === 'dark' ? (
        <SunIcon className="w-5 h-5 text-amber-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-indigo-400" />
      )}
    </button>
  );
};