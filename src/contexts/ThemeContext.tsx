import React, { createContext, useContext } from 'react';
import { theme } from '../theme';

type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = ({ 
  theme, 
  children 
}) => (
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext); 