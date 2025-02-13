/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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
        }
      }
    },
  },
  plugins: [],
}