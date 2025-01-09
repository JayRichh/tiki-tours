import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          secondary: "hsl(var(--border-secondary))",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          secondary: "hsl(var(--foreground-secondary))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        "gradient-fast": "gradient 4s linear infinite",
        "gradient-slow": "gradient 12s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh":
          "repeating-linear-gradient(45deg, var(--tw-gradient-stops) 0px, var(--tw-gradient-stops) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, var(--tw-gradient-stops) 0px, var(--tw-gradient-stops) 1px, transparent 1px, transparent 10px)",
      },
    },
  },
  plugins: [
    {
      handler: ({ addComponents, addUtilities }: PluginAPI) => {
        addComponents({
          ".container": {
            maxWidth: "100%",
            "@screen sm": { maxWidth: "640px" },
            "@screen md": { maxWidth: "768px" },
            "@screen lg": { maxWidth: "1024px" },
            "@screen xl": { maxWidth: "1280px" },
            "@screen 2xl": { maxWidth: "1536px" },
          },
        });
        addUtilities({
          ".bg-gradient-primary": {
            background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))",
          },
          ".bg-gradient-secondary": {
            background: "linear-gradient(to right, hsl(var(--accent)), hsl(var(--secondary)))",
          },
          ".bg-gradient-mesh": {
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 10px)",
          },
        });
      },
    },
  ],
  darkMode: "class",
};

export default config;
