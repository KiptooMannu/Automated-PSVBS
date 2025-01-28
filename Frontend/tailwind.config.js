/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          600: '#800000', // You can adjust the color code to match the maroon you need
        },
      },
    },
  },
  plugins: [require('daisyui')],
};
