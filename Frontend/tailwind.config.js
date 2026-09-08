/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: {
          DEFAULT: "#111827",
          hover: "#172033",
          active: "#1e293b",
        },
        border: {
          DEFAULT: "#1f293d",
          light: "#2d3a54",
        },
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          light: "rgba(59, 130, 246, 0.12)",
        },
        accent: {
          DEFAULT: "#06b6d4",
          hover: "#0891b2",
          light: "rgba(6, 182, 212, 0.12)",
        },
        danger: {
          DEFAULT: "#ef4444",
          hover: "#dc2626",
          light: "rgba(239, 68, 68, 0.12)",
        },
        success: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "rgba(16, 185, 129, 0.12)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          hover: "#d97706",
          light: "rgba(245, 158, 11, 0.12)",
        },
        muted: "#94a3b8",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "scale-in": "scaleIn 0.2s ease-out forwards",
        "slide-down": "slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
