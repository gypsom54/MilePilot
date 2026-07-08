import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--vector-color-brand-50)',
          100: 'var(--vector-color-brand-100)',
          200: 'var(--vector-color-brand-200)',
          300: 'var(--vector-color-brand-300)',
          400: 'var(--vector-color-brand-400)',
          500: 'var(--vector-color-brand-500)',
          600: 'var(--vector-color-brand-600)',
          700: 'var(--vector-color-brand-700)',
          800: 'var(--vector-color-brand-800)',
          900: 'var(--vector-color-brand-900)',
          950: 'var(--vector-color-brand-950)',
        },
        neutral: {
          0: 'var(--vector-color-neutral-0)',
          50: 'var(--vector-color-neutral-50)',
          100: 'var(--vector-color-neutral-100)',
          200: 'var(--vector-color-neutral-200)',
          300: 'var(--vector-color-neutral-300)',
          400: 'var(--vector-color-neutral-400)',
          500: 'var(--vector-color-neutral-500)',
          600: 'var(--vector-color-neutral-600)',
          700: 'var(--vector-color-neutral-700)',
          800: 'var(--vector-color-neutral-800)',
          900: 'var(--vector-color-neutral-900)',
          950: 'var(--vector-color-neutral-950)',
        },
      },
      fontFamily: {
        sans: ['var(--vector-font-sans)'],
        mono: ['var(--vector-font-mono)'],
      },
      spacing: {
        1: 'var(--vector-space-1)',
        2: 'var(--vector-space-2)',
        3: 'var(--vector-space-3)',
        4: 'var(--vector-space-4)',
        5: 'var(--vector-space-5)',
        6: 'var(--vector-space-6)',
        8: 'var(--vector-space-8)',
        10: 'var(--vector-space-10)',
        12: 'var(--vector-space-12)',
        16: 'var(--vector-space-16)',
      },
      borderRadius: {
        sm: 'var(--vector-radius-sm)',
        md: 'var(--vector-radius-md)',
        lg: 'var(--vector-radius-lg)',
        xl: 'var(--vector-radius-xl)',
        full: 'var(--vector-radius-full)',
      },
      boxShadow: {
        sm: 'var(--vector-shadow-sm)',
        md: 'var(--vector-shadow-md)',
        lg: 'var(--vector-shadow-lg)',
        focus: 'var(--vector-shadow-focus)',
      },
      transitionDuration: {
        fast: 'var(--vector-duration-fast)',
        normal: 'var(--vector-duration-normal)',
        slow: 'var(--vector-duration-slow)',
      },
      transitionTimingFunction: {
        default: 'var(--vector-easing-default)',
      },
    },
  },
  plugins: [],
};

export default config;
