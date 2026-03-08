import { QuoteSettings } from '../types';

export interface GlassTemplate {
  id: string;
  name: string;
  preview: {
    bg: string;          // CSS background for the preview card
    textColor: string;
    accentColor: string;
    mode: 'dark' | 'light';
  };
  settings: Partial<QuoteSettings>;
}

export const GLASS_TEMPLATES: GlassTemplate[] = [
  // ── Dark Templates ──
  {
    id: 'midnight-aurora',
    name: 'Midnight Aurora',
    preview: { bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', textColor: '#ffffff', accentColor: '#a78bfa', mode: 'dark' },
    settings: {
      backgroundColor: '#0f0c29',
      backgroundGradient: { type: 'linear', colors: ['#0f0c29', '#302b63'], angle: 135 },
      textColor: '#ffffff',
      fontFamily: 'Playfair Display',
      signatureColor: '#a78bfa',
    },
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    preview: { bg: 'linear-gradient(135deg, #0a192f, #112240)', textColor: '#ccd6f6', accentColor: '#64ffda', mode: 'dark' },
    settings: {
      backgroundColor: '#0a192f',
      backgroundGradient: { type: 'linear', colors: ['#0a192f', '#112240'], angle: 135 },
      textColor: '#ccd6f6',
      fontFamily: 'Inter',
      signatureColor: '#64ffda',
    },
  },
  {
    id: 'neon-night',
    name: 'Neon Night',
    preview: { bg: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', textColor: '#e94560', accentColor: '#e94560', mode: 'dark' },
    settings: {
      backgroundColor: '#1a1a2e',
      backgroundGradient: { type: 'linear', colors: ['#1a1a2e', '#0f3460'], angle: 135 },
      textColor: '#e94560',
      fontFamily: 'Bebas Neue',
      signatureColor: '#ffffff',
    },
  },
  {
    id: 'dark-rose',
    name: 'Dark Rosé',
    preview: { bg: 'linear-gradient(135deg, #2d1b2e, #4a1942)', textColor: '#f8b4c8', accentColor: '#ff6b9d', mode: 'dark' },
    settings: {
      backgroundColor: '#2d1b2e',
      backgroundGradient: { type: 'linear', colors: ['#2d1b2e', '#4a1942'], angle: 135 },
      textColor: '#f8b4c8',
      fontFamily: 'Dancing Script',
      signatureColor: '#ff6b9d',
    },
  },
  {
    id: 'charcoal-gold',
    name: 'Charcoal Gold',
    preview: { bg: 'linear-gradient(135deg, #1c1c1c, #2d2d2d)', textColor: '#ffd700', accentColor: '#ffd700', mode: 'dark' },
    settings: {
      backgroundColor: '#1c1c1c',
      backgroundGradient: { type: 'linear', colors: ['#1c1c1c', '#2d2d2d'], angle: 135 },
      textColor: '#ffd700',
      fontFamily: 'Cinzel',
      signatureColor: '#b8860b',
    },
  },
  {
    id: 'forest-night',
    name: 'Forest Night',
    preview: { bg: 'linear-gradient(135deg, #0b3d0b, #1a472a)', textColor: '#a8e6cf', accentColor: '#55efc4', mode: 'dark' },
    settings: {
      backgroundColor: '#0b3d0b',
      backgroundGradient: { type: 'linear', colors: ['#0b3d0b', '#1a472a'], angle: 135 },
      textColor: '#a8e6cf',
      fontFamily: 'Lora',
      signatureColor: '#55efc4',
    },
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    preview: { bg: 'linear-gradient(135deg, #1f0533, #3c1361, #52307c)', textColor: '#e0aaff', accentColor: '#c77dff', mode: 'dark' },
    settings: {
      backgroundColor: '#1f0533',
      backgroundGradient: { type: 'linear', colors: ['#1f0533', '#52307c'], angle: 135 },
      textColor: '#e0aaff',
      fontFamily: 'Raleway',
      signatureColor: '#c77dff',
    },
  },
  {
    id: 'dark-teal',
    name: 'Dark Teal',
    preview: { bg: 'linear-gradient(135deg, #0d2137, #134e5e)', textColor: '#81ecec', accentColor: '#00cec9', mode: 'dark' },
    settings: {
      backgroundColor: '#0d2137',
      backgroundGradient: { type: 'linear', colors: ['#0d2137', '#134e5e'], angle: 135 },
      textColor: '#81ecec',
      fontFamily: 'Quicksand',
      signatureColor: '#00cec9',
    },
  },

  // ── Light Templates ──
  {
    id: 'morning-mist',
    name: 'Morning Mist',
    preview: { bg: 'linear-gradient(135deg, #fdfcfb, #e2d1c3)', textColor: '#2d3436', accentColor: '#e17055', mode: 'light' },
    settings: {
      backgroundColor: '#fdfcfb',
      backgroundGradient: { type: 'linear', colors: ['#fdfcfb', '#e2d1c3'], angle: 135 },
      textColor: '#2d3436',
      fontFamily: 'Merriweather',
      signatureColor: '#e17055',
    },
  },
  {
    id: 'soft-peach',
    name: 'Soft Peach',
    preview: { bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', textColor: '#6c3428', accentColor: '#e55039', mode: 'light' },
    settings: {
      backgroundColor: '#ffecd2',
      backgroundGradient: { type: 'linear', colors: ['#ffecd2', '#fcb69f'], angle: 135 },
      textColor: '#6c3428',
      fontFamily: 'Caveat',
      signatureColor: '#e55039',
    },
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    preview: { bg: 'linear-gradient(135deg, #e8daef, #d2b4de)', textColor: '#4a235a', accentColor: '#8e44ad', mode: 'light' },
    settings: {
      backgroundColor: '#e8daef',
      backgroundGradient: { type: 'linear', colors: ['#e8daef', '#d2b4de'], angle: 135 },
      textColor: '#4a235a',
      fontFamily: 'Great Vibes',
      signatureColor: '#8e44ad',
    },
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    preview: { bg: 'linear-gradient(135deg, #d4efdf, #a9dfbf)', textColor: '#1e5631', accentColor: '#27ae60', mode: 'light' },
    settings: {
      backgroundColor: '#d4efdf',
      backgroundGradient: { type: 'linear', colors: ['#d4efdf', '#a9dfbf'], angle: 135 },
      textColor: '#1e5631',
      fontFamily: 'Nunito',
      signatureColor: '#27ae60',
    },
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    preview: { bg: 'linear-gradient(135deg, #dfe9f3, #a4c4e0)', textColor: '#1b4f72', accentColor: '#2980b9', mode: 'light' },
    settings: {
      backgroundColor: '#dfe9f3',
      backgroundGradient: { type: 'linear', colors: ['#dfe9f3', '#a4c4e0'], angle: 135 },
      textColor: '#1b4f72',
      fontFamily: 'Josefin Sans',
      signatureColor: '#2980b9',
    },
  },
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    preview: { bg: 'linear-gradient(135deg, #f5f0e1, #e8d5b7)', textColor: '#4a3728', accentColor: '#c0792a', mode: 'light' },
    settings: {
      backgroundColor: '#f5f0e1',
      backgroundGradient: { type: 'linear', colors: ['#f5f0e1', '#e8d5b7'], angle: 135 },
      textColor: '#4a3728',
      fontFamily: 'Cormorant Garamond',
      signatureColor: '#c0792a',
    },
  },
  {
    id: 'blush-pink',
    name: 'Blush Pink',
    preview: { bg: 'linear-gradient(135deg, #fce4ec, #f8bbd0)', textColor: '#880e4f', accentColor: '#e91e63', mode: 'light' },
    settings: {
      backgroundColor: '#fce4ec',
      backgroundGradient: { type: 'linear', colors: ['#fce4ec', '#f8bbd0'], angle: 135 },
      textColor: '#880e4f',
      fontFamily: 'Satisfy',
      signatureColor: '#e91e63',
    },
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    preview: { bg: 'linear-gradient(135deg, #ffffff, #f0f0f0)', textColor: '#1a1a1a', accentColor: '#9333ea', mode: 'light' },
    settings: {
      backgroundColor: '#ffffff',
      backgroundGradient: { type: 'linear', colors: ['#ffffff', '#f0f0f0'], angle: 135 },
      textColor: '#1a1a1a',
      fontFamily: 'Poppins',
      signatureColor: '#9333ea',
    },
  },
];
