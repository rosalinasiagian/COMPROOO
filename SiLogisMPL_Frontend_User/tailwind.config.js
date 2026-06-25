/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary) / 0.9)",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      fontFamily: {
        primary: ['Manrope', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}