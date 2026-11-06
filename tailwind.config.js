/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        moked: {
          dark: '#09090B',
          surface: '#121215',
          card: '#18181B',
          crimson: '#922125',
          crimsonHover: '#7a1b1e',
          crimsonLight: '#d9383e',
          crimsonSoft: '#fef2f2',
          border: '#27272A',
          subtle: '#3F3F46',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
