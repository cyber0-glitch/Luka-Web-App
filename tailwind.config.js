/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        'bg-primary-light': '#FFFFFF',
        'bg-secondary-light': '#F5F5F7',
        'bg-tertiary-light': '#E5E5EA',
        'text-primary-light': '#1D1D1F',
        'text-secondary-light': '#86868B',
        'text-tertiary-light': '#AEAEB2',

        // Dark mode (System Gray)
        'bg-primary-dark': '#1C1C1E',
        'bg-secondary-dark': '#2C2C2E',
        'bg-tertiary-dark': '#3A3A3C',
        'text-primary-dark': '#FFFFFF',
        'text-secondary-dark': '#8E8E93',
        'text-tertiary-dark': '#636366',

        // Dark mode (True Black)
        'bg-primary-black': '#000000',
        'bg-secondary-black': '#1C1C1E',
        'bg-tertiary-black': '#2C2C2E',

        // Accent colors
        'accent': '#007AFF',
        'success': '#34C759',
        'warning': '#FF9500',
        'error': '#FF3B30',
        'streak-flame': '#FF9500',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '22px',
        '2xl': '28px',
        '3xl': '34px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
    },
  },
  plugins: [],
}
