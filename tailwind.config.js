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
}
