export const theme = {
  colors: {
    // Base colors
    background: '#000000',
    surface: 'rgba(42, 42, 42, 0.8)',  // Added transparency for frosted glass effect
    'surface-light': 'rgba(58, 58, 58, 0.9)',
    primary: '#8B5CF6',  // Updated to a more vibrant purple
    accent: '#F472B6',   // Added pink accent
    
    // Semantic colors
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.85)',  // Increased contrast
      disabled: 'rgba(255, 255, 255, 0.45)'
    },
    
    // UI elements
    border: 'rgba(255, 255, 255, 0.15)',  // Slightly more visible borders
    hover: 'rgba(255, 255, 255, 0.08)',
    active: 'rgba(255, 255, 255, 0.12)',
    backdrop: 'rgba(0, 0, 0, 0.8)',  // For modal backdrops
    
    // Status colors
    success: '#10B981',  // Updated green
    error: '#EF4444',    // Updated red
    warning: '#F59E0B'   // Updated amber
  },
  
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      display: 'Space Grotesk, Inter, system-ui, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
  },
  
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms'
  }
};