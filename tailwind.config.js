/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#002FA7',
        mediumBlue: '#4571e1',
        white: '#FFFFFF',
        black: '#1A1A1A',
        gray: '#666666',
        lightGrey: '#E0E0E0',
        error: '#B00020',
        primary: '#1A1A1A',
        secondary: '#666666',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};