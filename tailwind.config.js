const { theme } = require('./src/theme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-900': '#0f1115',
        'dark-800': '#151822',
        'dark-700': '#1c202b',
        'dark-600': '#252a37',
        'dark-500': '#2e3342',
        'background': '#080808',
        'surface': '#0f1115',
        'surface-light': '#151822',
        'border': '#252a37',
        'primary': '#7e58ff',
        'secondary': '#ff58a6',
        'error': '#ff5858',
        'text-primary': '#ffffff',
        'text-secondary': '#9ca3af',
        'disabled': '#4b5563',
      },
      animation: {
        'spin': 'spin 4s linear infinite',
        'pulse-tile': 'pulseTile 8s infinite',
      },
      keyframes: {
        pulseTile: {
          '0%, 12.5%, 100%': { opacity: 1 },
          '25%, 82.5%': { opacity: 0 },
        }
      }
    },
  },
  plugins: [],
};