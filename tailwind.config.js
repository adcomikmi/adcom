/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neum-bg': '#F0F2F5',
        'accent-blue': '#4285F4',
        'accent-red': '#EA4335',
        'accent-yellow': '#FBBC05',
        'accent-green': '#34A853',
      },
      boxShadow: {
        'neum-out': '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
        'neum-in': 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff',
        'neum-out-hover': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        'neum-in-active': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
      },
      keyframes: {
        'gradient-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        'gradient-move': 'gradient-move 4s ease infinite',
      }
    },
  },
  plugins: [],
}