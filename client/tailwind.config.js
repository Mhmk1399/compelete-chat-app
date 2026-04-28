/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
        body:    ['"Space Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
        fa:      ['"Vazirmatn"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 60px -30px rgba(0, 218, 253, 0.8)',
      },
      colors: {
        // 60% — dominant dark base (#010413)
        slate: {
          50:  '#f2f4fb',
          100: '#e4e8f6',
          200: '#c8d0ec',
          300: '#a0abdb',
          400: '#6b7bc4',
          500: '#3a4a8a',
          600: '#1e2b5e',
          700: '#162047',
          800: '#0d1535',
          900: '#060b1d',
          950: '#010413',
        },
        // 30% — secondary cyan (#00dafd) — mapped to emerald so all emerald-* classes render cyan
        emerald: {
          50:  '#f0fffe',
          100: '#ccfbff',
          200: '#99f5fe',
          300: '#3deafc',
          400: '#00dafd',
          500: '#00b8d4',
          600: '#0090a8',
          700: '#00707f',
          800: '#005560',
          900: '#003040',
          950: '#001520',
        },
        // 10% — accent (#b70ff0 purple)
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f2c6fd',
          300: '#e58cfb',
          400: '#d44df5',
          500: '#b70ff0',
          600: '#9a0cc9',
          700: '#7a09a0',
          800: '#5e0779',
          900: '#420554',
          950: '#250230',
        },
      },
    },
  },
  plugins: [],
}
