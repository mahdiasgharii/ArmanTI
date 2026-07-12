/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx,jsx,js}',
  ],
  // Disable preflight to avoid conflicts with MUI's CSS reset
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // Ravin Style design tokens
        canvas: '#0A0A0A',
        surface: '#141414',
        elevated: '#1A1A1A',
        'surface-2': '#262626',
        border: {
          DEFAULT: '#262626',
          strong: '#404040',
        },
        primary: {
          DEFAULT: '#019BE5',
          light: '#66C4F5',
          dark: '#0073A8',
        },
        signal: {
          DEFAULT: '#F20F0F',
          light: '#FF6B6B',
          dark: '#881106',
        },
        violet: {
          DEFAULT: '#860EFE',
          light: '#B88DFF',
          dark: '#4A08A0',
        },
        success: {
          DEFAULT: '#17AB1F',
          dark: '#094E0B',
        },
        warning: {
          DEFAULT: '#E6700F',
        },
      },
      fontFamily: {
        display: ['"Geologica"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['Consolas', 'monaco', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      fontSize: {
        'metric': ['32px', { lineHeight: '1', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
