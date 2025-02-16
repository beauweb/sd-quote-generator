import { useState, useEffect } from 'react';

type ColorMode = 'light' | 'dark';

export function useColorMode(initialMode: ColorMode = 'dark') {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    // Check for saved preference in localStorage
    const savedMode = localStorage.getItem('colorMode');
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return initialMode;
  });

  useEffect(() => {
    // Update localStorage when mode changes
    localStorage.setItem('colorMode', colorMode);
    
    // Update document class
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(colorMode);
  }, [colorMode]);

  return [colorMode, setColorMode] as const;
}