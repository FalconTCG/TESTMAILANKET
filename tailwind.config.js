/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-primary',
    'text-primary',
    'border-primary',
    'bg-secondary',
    'text-secondary',
    'border-secondary',
    'bg-white',
    'text-white',
    'bg-background',
    'text-text-primary',
    'text-text-secondary',
    'text-text-light',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#A5D8FF',
          green: '#B3E5D1',
          yellow: '#FFF2CC',
          pink: '#FFD6E0',
          purple: '#D9C5DF',
          orange: '#FFD4B8',
          teal: '#B4E4E0',
        },
        primary: {
          DEFAULT: '#6A98FF',
          dark: '#5379D2',
          light: '#A5D8FF',
        },
        secondary: {
          DEFAULT: '#B3E5D1',
          dark: '#80C4A6',
          light: '#DAFAEE',
        },
        background: {
          light: '#F8FAFC',
          DEFAULT: '#F1F5F9',
          dark: '#E2E8F0',
        },
        text: {
          primary: '#334155',
          secondary: '#64748B',
          light: '#94A3B8',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 