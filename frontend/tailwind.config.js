/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef0ff',
          100: '#e0e4ff',
          200: '#c7ccff',
          300: '#a5aafc',
          400: '#827ef9',
          500: '#6457f5',
          600: '#5540e8',
          700: '#4832cd',
          800: '#3b2aa6',
          900: '#332883',
          950: '#1f184f',
        },
        violet: {
          950: '#1a0e4f',
        },
        slate: {
          825: '#18213a',
          850: '#101827',
          925: '#070c18',
          950: '#040810',
        },
        surface: {
          DEFAULT: '#ffffff',
          50: '#f8f9fc',
          100: '#f1f4f9',
          200: '#e8ecf4',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        card:   '0 4px 12px -2px rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.04)',
        hover:  '0 12px 28px -6px rgba(0,0,0,0.10), 0 4px 8px -4px rgba(0,0,0,0.06)',
        brand:  '0 8px 24px -4px rgba(100,87,245,0.35)',
        glow:   '0 0 32px rgba(100,87,245,0.25)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.12)',
        glass:  '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out both',
        'slide-up':      'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 1.6s linear infinite',
        'glow-pulse':    'glowPulse 2s ease-in-out infinite',
        'counter':       'counter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in':      'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(100,87,245,0.2)' },
          '50%':      { boxShadow: '0 0 28px rgba(100,87,245,0.5)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
}
