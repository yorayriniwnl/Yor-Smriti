import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm dark palette
        void: {
          DEFAULT: '#0d0c0a',
          50: '#1a1814',
          100: '#141210',
          200: '#0d0c0a',
          300: '#080706',
        },
        // Off-white warm text
        parchment: {
          DEFAULT: '#e2d9c8',
          50: '#f5f0e8',
          100: '#ece5d5',
          200: '#e2d9c8',
          300: '#d4c9b4',
          400: '#c0ad96',
          500: '#a8937a',
          600: '#8c7860',
        },
        // Amber accent
        amber: {
          soft: '#c9a96e',
          dim: '#a8884a',
          glow: 'rgba(201, 169, 110, 0.15)',
          faint: 'rgba(201, 169, 110, 0.06)',
        },
        // Muted tones
        dusk: {
          DEFAULT: '#4a4236',
          light: '#6b5e50',
          dark: '#2e2820',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-crimson)', 'Georgia', 'serif'],
        mono: ['var(--font-dm-mono)', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
        'body-lg': ['clamp(1.1rem, 1.5vw, 1.3rem)', { lineHeight: '1.8' }],
        'body-md': ['clamp(1rem, 1.2vw, 1.15rem)', { lineHeight: '1.75' }],
        'label': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.12em' }],
      },
      spacing: {
        'stage': 'clamp(2rem, 8vw, 6rem)',
        'breath': 'clamp(1.5rem, 4vw, 3rem)',
      },
      animation: {
        'grain': 'grain 8s steps(10) infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'fade-in': 'fade-in 1.5s ease-out forwards',
        'text-reveal': 'text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'cursor-blink': 'cursor-blink 1.2s ease-in-out infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 1%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -2%)' },
          '50%': { transform: 'translate(-3%, 2%)' },
          '60%': { transform: 'translate(1%, -4%)' },
          '70%': { transform: 'translate(-4%, 1%)' },
          '80%': { transform: 'translate(2%, 3%)' },
          '90%': { transform: 'translate(-1%, -1%)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg)' },
          '25%': { transform: 'translate(2%, -1%) rotate(1deg)' },
          '50%': { transform: 'translate(-1%, 2%) rotate(-0.5deg)' },
          '75%': { transform: 'translate(1%, 1%) rotate(0.8deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'text-reveal': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'drift': 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [],
};

export default config;
