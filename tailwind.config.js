/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'color-paragraph': {
          DEFAULT: '#d6d6d6'
        },
        'primary-blue': {
          DEFAULT: '#3a7ff5'
        }, 
        'primary-white': {
          DEFAULT: '#f3f3f3'
        },
        'primary-black': {
          DEFAULT: '#181818'
        }
      },
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Add this line to your plugins array:
    // require('@fortawesome/fontawesome-free'),
  ],
}