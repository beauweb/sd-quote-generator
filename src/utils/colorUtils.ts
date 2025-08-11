// Utility functions for color calculations and contrast

/**
 * Converts a hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Converts RGB values to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculates the relative luminance of a color
 * Based on WCAG 2.0 guidelines
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Automatically determines the best text color for a given background
 * Returns either black or white based on which provides better contrast
 */
export function getAutoTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';
  
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  
  // If background is light (high luminance), use dark text
  // If background is dark (low luminance), use light text
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Gets a contrasting color that's not pure black or white
 * Provides better visual appeal while maintaining readability
 */
export function getSmartContrastColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';
  
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  
  if (luminance > 0.6) {
    // Light background - use dark text with slight tint
    return '#1a1a1a';
  } else if (luminance < 0.4) {
    // Dark background - use light text with slight tint
    return '#f5f5f5';
  } else {
    // Medium background - use pure black or white based on contrast
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}

/**
 * Adjusts color brightness for better visibility
 */
export function adjustColorBrightness(color: string, factor: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const adjust = (value: number) => Math.max(0, Math.min(255, value * factor));
  
  return rgbToHex(
    adjust(rgb.r),
    adjust(rgb.g),
    adjust(rgb.b)
  );
}
