/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#E8EDF5',
          100: '#C5D0E6',
          200: '#9BAFD4',
          300: '#708EC2',
          400: '#4F74B4',
          500: '#2E5AA6',
          600: '#1E4382',
          700: '#0F2B5B',
          800: '#0A1E40',
          900: '#061325',
        },
        saffron: {
          50:  '#FFF7E6',
          100: '#FEECC0',
          200: '#FDD889',
          300: '#F9C44F',
          400: '#F4A020',
          500: '#E8900A',
          600: '#C07306',
          700: '#995709',
          800: '#7C450F',
          900: '#683A13',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
