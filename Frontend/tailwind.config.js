/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0F172A",
        surface: "#1E293B",
        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        accent: "#06B6D4",
        success: "#22C55E",
        danger: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
        },
        border: "#334155",
        muted: "#94A3B8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1rem",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blobMove: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s ease-out both",
        blob: "blobMove 12s ease-in-out infinite",
        float: "floatY 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
