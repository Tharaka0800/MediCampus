/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal:       { DEFAULT: '#0d9488', light: '#14b8a6', dark: '#0f766e', bg: '#f0fdfa' },
        cream:      '#fdf8f3',
        mc: {
          text:     '#1c3238',
          muted:    '#6b8c90',
          border:   '#e2eaeb',
          error:    '#e53e3e',
          red:      '#dc2626',
          'red-bg': '#fef2f2',
          warn:     '#d97706',
          'warn-bg':'#fffbeb',
          green:    '#16a34a',
          'green-bg':'#f0fdf4',
          blue:     '#2563eb',
          'blue-bg':'#eff6ff',
        }
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 8s ease-in-out infinite',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'bounce-in':  'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%':      { transform: 'translateY(-20px) scale(1.04)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        bounceIn: {
          from: { opacity: 0, transform: 'scale(0.8) translateY(20px)' },
          to:   { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
