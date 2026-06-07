import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'eyebrow': ['11px', { lineHeight: '1.6', fontWeight: '500', letterSpacing: '0.12em' }],
        'mono-sm': ['13px', { lineHeight: '1.6' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'small': ['13px', { lineHeight: '1.6' }],
        'h3': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h1': ['30px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.02em' }],
      },
      colors: {
        // Preserve shadcn/Radix compatibility via CSS vars
        border: 'var(--c-border)',
        input: 'var(--c-border-strong)',
        ring: 'var(--c-accent-600)',
        background: 'var(--c-canvas)',
        foreground: 'var(--c-text-1)',
        primary: {
          DEFAULT: 'var(--c-accent-600)',
          foreground: 'var(--c-white)',
        },
        secondary: {
          DEFAULT: 'var(--c-sunken)',
          foreground: 'var(--c-text-1)',
        },
        destructive: {
          DEFAULT: 'var(--c-bad-600)',
          foreground: 'var(--c-white)',
        },
        muted: {
          DEFAULT: 'var(--c-sunken)',
          foreground: 'var(--c-text-2)',
        },
        accent: {
          DEFAULT: 'var(--c-accent-50)',
          foreground: 'var(--c-accent-800)',
        },
        popover: {
          DEFAULT: 'var(--c-white)',
          foreground: 'var(--c-text-1)',
        },
        card: {
          DEFAULT: 'var(--c-white)',
          foreground: 'var(--c-text-1)',
        },
        // Design system palette — direct tokens
        canvas: 'var(--c-canvas)',
        sunken: 'var(--c-sunken)',
        'border-strong': 'var(--c-border-strong)',
        'text-1': 'var(--c-text-1)',
        'text-2': 'var(--c-text-2)',
        'text-3': 'var(--c-text-3)',
        ds: {
          accent: {
            50: 'var(--c-accent-50)',
            100: 'var(--c-accent-100)',
            600: 'var(--c-accent-600)',
            700: 'var(--c-accent-700)',
            800: 'var(--c-accent-800)',
          },
          ok: {
            50: 'var(--c-ok-50)',
            600: 'var(--c-ok-600)',
            800: 'var(--c-ok-800)',
          },
          warn: {
            50: 'var(--c-warn-50)',
            600: 'var(--c-warn-600)',
            800: 'var(--c-warn-800)',
          },
          bad: {
            50: 'var(--c-bad-50)',
            600: 'var(--c-bad-600)',
            800: 'var(--c-bad-800)',
          },
        },
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
        // Keep Radix compat
        DEFAULT: 'var(--r-md)',
      },
      boxShadow: {
        sm: 'var(--sh-sm)',
        md: 'var(--sh-md)',
        lg: 'var(--sh-lg)',
        // Keep default Tailwind shadows accessible for existing code
        DEFAULT: 'var(--sh-sm)',
      },
      spacing: {
        's-1': 'var(--s-1)',
        's-2': 'var(--s-2)',
        's-3': 'var(--s-3)',
        's-4': 'var(--s-4)',
        's-6': 'var(--s-6)',
        's-8': 'var(--s-8)',
        's-12': 'var(--s-12)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
};

export default config;
