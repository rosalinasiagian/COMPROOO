/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F5BC00",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        primary: ["Manrope", "sans-serif"],
        secondary: ["Inter", "sans-serif"],
      },
      borderColor: {
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [],
}