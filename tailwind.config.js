/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffe5d9',
          200: '#ffcbb3',
          300: '#ffa680',
          400: '#ff8a5c',
          500: '#ff6b35',
          600: '#e65a2a',
          700: '#cc4e24',
          800: '#a33f1d',
          900: '#7a2f16',
        },
      },
    },
  },
  plugins: [],
}
