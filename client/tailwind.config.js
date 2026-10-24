/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        coffee: {
          50: '#faf6f1',
          100: '#f1e6d8',
          200: '#e2ccaf',
          300: '#d0aa80',
          400: '#bf8a57',
          500: '#b0723d',
          600: '#935a31',
          700: '#764529',
          800: '#5f3925',
          900: '#4f3021',
        },
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'slide-up': 'slide-up 0.22s ease-out',
        'slide-left': 'slide-left 0.25s ease-out',
        fade: 'fade 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
