/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F2F0EF",
          dark: "#303B53"
        },
        text:{
          light: "#F2F0EF",
          dark: "#303B53"
        },
        primary: "#1A5B8A",
        accent: {
          light: "#A98376",
          dark: "#8249F0"
        },
      },
    },
  },
  plugins: [],
}

