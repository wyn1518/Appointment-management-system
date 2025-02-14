/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {

  daisyui: {
    themes: ["light","dark"],
  },
  // darkMode:"selector",
  safelist: [
    'bg-blue-600',
    'bg-pink-600',
  ],
  content: ["./backend/views/**/*.{html,ejs}"],
  plugins: [
    require('@tailwindcss/typography'),
    // require('daisyui'),
  ],
  theme: {
   
    extend: {
     
      colors:{
        "muba":"#6d2829"
      }
    },
  },
}

