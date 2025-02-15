const { theme } = require('./src/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: theme.colors.background,
        surface: theme.colors.surface,
        primary: theme.colors.primary,
        accent: theme.colors.accent,
        border: theme.colors.border,
        hover: theme.colors.hover,
        active: theme.colors.active,
        text: theme.colors.text,
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e6',
          200: '#c2c5cb',
          300: '#9ca1ab',
          400: '#767d8a',
          500: '#5c6370',
          600: '#484d59',
          700: '#1e1e1e',
          800: '#151515',
          900: '#0c0c0c',
          950: '#000000',
        },
        'surface-light': '#3a3a3a',
      },
    },
  },
  plugins: [],
}