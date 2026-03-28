/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0069ff",
        "primary-dark": "#003cc5",
        success: "#00a86b",
        danger: "#f04438",
        "text-primary": "#1a1a2e",
        "text-secondary": "#667085",
        border: "#e4e7ec",
        background: "#f9fafb",
        card: "#ffffff",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06)",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};


