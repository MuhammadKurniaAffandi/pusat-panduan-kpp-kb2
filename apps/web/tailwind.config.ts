import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class", "dark"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx, scss}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx, scss}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (DJP Navy)
        primary: {
          DEFAULT: "#003366",
          light: "#0052A3",
          dark: "#00264D",
          50: "#E6EBF0",
          100: "#B3C2D1",
          200: "#809AB3",
          300: "#4D7194",
          400: "#264D7A",
          500: "#003366",
          600: "#002D5C",
          700: "#002652",
          800: "#001F47",
          900: "#00132E",
          foreground: "#FFFFFF",
        },
        // Secondary Colors (Kemenkeu Gold)
        secondary: {
          DEFAULT: "#D4AF37",
          light: "#E5C158",
          dark: "#B8952D",
          foreground: "#1F2937",
        },
        // Background
        background: {
          DEFAULT: "#FFFFFF",
          alt: "#F5F7FA",
        },
        // Extend shadcn colors
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#003366",
        foreground: "#1F2937",
        muted: {
          DEFAULT: "#F5F7FA",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F5F7FA",
          foreground: "#003366",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [
    tailwindcssAnimate, // gunakan import, bukan require
    typography,
  ],
};

export default config;
