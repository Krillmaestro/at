/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        'bg-primary': '#0D0D0D',
        'bg-secondary': '#1A1A1A',
        'bg-tertiary': '#262626',
        'bg-elevated': '#333333',

        // Orange accent (Brand)
        'orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FF8533',
          500: '#FF6B00',
          600: '#E65C00',
          700: '#C2410C',
          800: '#9A3412',
          900: '#331500',
        },

        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#A3A3A3',
        'text-muted': '#666666',

        // Status colors
        'success': '#22C55E',
        'warning': '#EAB308',
        'error': '#EF4444',

        // Border
        'border-color': '#333333',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.4' }],
        'sm': ['12px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'lg': ['16px', { lineHeight: '1.5' }],
        'xl': ['18px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.2' }],
        '4xl': ['40px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 107, 0, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 107, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
