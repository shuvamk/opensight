import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0b132b",
          50: "#e8eaf2",
          100: "#b7c4ec",
          200: "#6f89da",
          300: "#3154bd",
          400: "#1e3475",
          500: "#0b132b",
          600: "#091024",
          700: "#070c1b",
          800: "#050812",
          900: "#020409",
          950: "#010204",
        },
        accent: {
          DEFAULT: "#3a506b",
          50: "#e8edf2",
          100: "#d2dbe7",
          200: "#a5b8ce",
          300: "#7894b6",
          400: "#517197",
          500: "#3a506b",
          600: "#2e3f55",
          700: "#222f40",
          800: "#17202a",
          900: "#0b1015",
        },
        indigo: {
          DEFAULT: "#1c2541",
          50: "#e6e9f0",
          100: "#c4cde6",
          200: "#8a9bcd",
          300: "#4f68b4",
          400: "#35467b",
          500: "#1c2541",
          600: "#161d33",
          700: "#111627",
          800: "#0b0f1a",
          900: "#06070d",
        },
        background: "#FFFFFF",
        surface: "#F5F6FA",
        text: {
          DEFAULT: "#0b132b",
          secondary: "#3a506b",
          tertiary: "#7894b6",
        },
        border: "#d2dbe7",
        error: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "soft": "0 1px 3px 0 rgb(11 19 43 / 0.04), 0 1px 2px -1px rgb(11 19 43 / 0.04)",
        "medium": "0 4px 6px -1px rgb(11 19 43 / 0.06), 0 2px 4px -2px rgb(11 19 43 / 0.04)",
        "large": "0 10px 15px -3px rgb(11 19 43 / 0.08), 0 4px 6px -4px rgb(11 19 43 / 0.04)",
        "glow": "0 0 20px rgb(58 80 107 / 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
