import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          600: '#1A56DB',
          700: '#1E40AF',
        },
        purple: {
          50:  '#F5F3FF',
          600: '#7E3AF2',
          700: '#6D28D9',
        },
        success: {
          50:  '#ECFDF5',
          500: '#0E9F6E',
        },
        warning: {
          400: '#E3A008',
        },
        danger: {
          600: '#E02424',
        },
        gray: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          900: '#111928',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn:  '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
