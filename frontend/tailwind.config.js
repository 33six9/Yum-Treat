/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0a08",
          900: "#14120e",
          800: "#1e1b16",
          700: "#2a251d",
        },
        ember: {
          50: "#fff6ed",
          100: "#ffead4",
          200: "#ffd1a8",
          300: "#ffb070",
          400: "#ff8a3d",
          500: "#fb6a17",
          600: "#ec4f0d",
          700: "#c3390d",
          800: "#9b2d13",
          900: "#7d2712",
        },
        saffron: "#ffc93c",
        cream: "#fffaf2",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(251,106,23,0.15), 0 20px 50px -15px rgba(251,106,23,0.45)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
