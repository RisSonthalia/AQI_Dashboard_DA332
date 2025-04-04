// tailwind.config.js
module.exports = {
    darkMode: 'class', // Enables dark mode via a .dark class on a parent element (e.g. <html>)
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3498db',
          secondary: '#2980b9',
          accent: '#2ecc71',
          darkbg: '#1e293b',
          darktext: '#e2e8f0',
        },
        keyframes: {
          spinner: {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        },
        animation: {
          spinner: 'spinner 1s linear infinite',
          fadeIn: 'fadeIn 0.5s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          }
        }
      },
    },
    plugins: [],
  };
  