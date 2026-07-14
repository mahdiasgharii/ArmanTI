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
        // Ravin Style design tokens — using CSS variables for runtime theme switching
        canvas: 'var(--ravin-bg)',
        background: 'var(--ravin-bg)',
        surface: 'var(--ravin-surface)',
        elevated: 'var(--ravin-elevated)',
        'surface-2': 'var(--ravin-surface-2)',
        border: {
          DEFAULT: 'var(--ravin-border)',
          strong: 'var(--ravin-border-strong)',
        },
        primary: {
          DEFAULT: 'var(--ravin-primary)',
          light: 'var(--ravin-primary-light)',
          dark: 'var(--ravin-primary-dark)',
        },
        signal: {
          DEFAULT: 'var(--ravin-danger)',
          light: 'var(--ravin-danger-light)',
          dark: 'var(--ravin-danger-dark)',
        },
        danger: {
          DEFAULT: 'var(--ravin-danger)',
          light: 'var(--ravin-danger-light)',
          dark: 'var(--ravin-danger-dark)',
        },
        violet: {
          DEFAULT: 'var(--ravin-secondary)',
          light: 'var(--ravin-secondary-light)',
          dark: 'var(--ravin-secondary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--ravin-secondary)',
          light: 'var(--ravin-secondary-light)',
          dark: 'var(--ravin-secondary-dark)',
        },
        success: {
          DEFAULT: 'var(--ravin-success)',
          dark: 'var(--ravin-success-dark)',
        },
        warning: {
          DEFAULT: 'var(--ravin-warning)',
        },
        // Text colors
        'text-base': 'var(--ravin-text)',
        'text-muted': 'var(--ravin-text-muted)',
        'text-light': 'var(--ravin-text-light)',
        // Severity colors
        severity: {
          DEFAULT: 'var(--ravin-warning)',
          danger: 'var(--ravin-danger)',
          success: 'var(--ravin-success)',
          warning: 'var(--ravin-warning)',
          info: 'var(--ravin-primary)',
        },
      },
      fontFamily: {
        display: ['"Peyda"', 'sans-serif'],
        body: ['"Peyda"', 'sans-serif'],
        mono: ['Consolas', 'monaco', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
        container: '8px',
        xl: '12px',
      },
      spacing: {
        container: '8px',
      },
      fontSize: {
        'metric': ['28px', { lineHeight: '1', fontWeight: '600' }],
        'display': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
