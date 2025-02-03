/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scans all files in the src folder
    "./public/index.html"          // (Optional) Scans your HTML file
  ],
  theme: {
    extend: {
      fontFamily: {
        anton: ["Anton", "sans-serif"], // This will use Anton font
      },
    },
  },
  plugins: [],
}
