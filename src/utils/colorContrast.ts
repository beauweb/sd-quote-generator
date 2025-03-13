/**
 * Utility functions for checking color contrast for accessibility
 * 
 * Based on WCAG 2.0 guidelines:
 * - AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text
 * - AAA requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text
 * 
 * Large text is defined as 14 point (typically 18.66px) and bold or larger, 
 * or 18 point (typically 24px) or larger.
 */

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex value
  let r, g, b;
  if (hex.length === 3) {
    // Short notation like #FFF
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    // Full notation like #FFFFFF
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  return { r, g, b };
}

// Calculate relative luminance for RGB values (sRGB color space)
export function getLuminance(r: number, g: number, b: number): number {
  // Convert RGB values to the range [0, 1]
  const rsrgb = r / 255;
  const gsrgb = g / 255;
  const bsrgb = b / 255;

  // Calculate the linearized RGB values
  const rLinear = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const gLinear = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const bLinear = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  // Calculate the relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// Calculate the contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const luminance1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const luminance2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  // Ensure we're calculating ratio with the lighter color first
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check if a color combination passes WCAG AA contrast requirements
export function passesWCAGAA(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// Check if a color combination passes WCAG AAA contrast requirements
export function passesWCAGAAA(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

// Get the accessibility level that the contrast passes (none, AA, AAA)
export function getAccessibilityLevel(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): 'AAA' | 'AA' | 'fail' {
  const ratio = getContrastRatio(foreground, background);
  
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'fail';
  } else {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'fail';
  }
}

// Get suggested accessible colors based on a given foreground and background
export function getSuggestedAccessibleColors(
  foreground: string, 
  background: string
): {
  suggestedForeground: string;
  suggestedBackground: string;
} {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  // Calculate luminance
  const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  // Determine which color to adjust (typically adjust the foreground)
  let suggestedForeground = foreground;
  let suggestedBackground = background;
  
  // If contrast is not sufficient, adjust the foreground to either black or white
  // based on the background luminance
  if (getContrastRatio(foreground, background) < 4.5) {
    suggestedForeground = bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
  }
  
  return { suggestedForeground, suggestedBackground };
}