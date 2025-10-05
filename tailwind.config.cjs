/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cockpit Dark Theme
        background: {
          primary: '#1A1A1A',
          secondary: '#252525',
          tertiary: '#2F2F2F',
        },
        accent: {
          primary: '#0066FF', // Bleu cobalt électrique
          secondary: '#FF6B35', // Orange brûlé
          hover: '#0052CC',
        },
        status: {
          success: '#10B981', // Vert pour PR et confirmations
          danger: '#EF4444', // Rouge pour alertes
          warning: '#F59E0B', // Orange pour avertissements
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A0A0A0',
          muted: '#707070',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
    },
  },
  plugins: [],
}
