/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bela: {
          navy: '#082B59',
          navyDark: '#051C3B',
          cream: '#FFF0D9',
          creamLight: '#FFF8ED',
          gold: '#D8B46A',
          goldDark: '#BC964B',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(8, 43, 89, 0.08)',
        cardHover: '0 20px 40px -12px rgba(8, 43, 89, 0.16)',
      },
    },
  },
  plugins: [],
};
