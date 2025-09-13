/** @type {import('tailwindcss').Config} */
module.exports = {
  // This tells Tailwind to scan all your JS and JSX files in the src folder
  // for class names. This is crucial for tree-shaking (removing unused styles).
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      // Add these keyframes and animation properties
      keyframes: {
        slideInFromLeft: {
          '0%': {
            transform: 'translateX(-50%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
        },
      },
      animation: {
        slideIn: 'slideInFromLeft 0.7s ease-out forwards',
      },
    },
  },

}
