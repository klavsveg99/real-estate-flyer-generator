/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './app/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { purple: { 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' } },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
