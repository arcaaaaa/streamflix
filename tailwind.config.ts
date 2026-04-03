import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#141414",
        card: "#1a1a1a",
        "card-hover": "#222222",
        accent: {
          DEFAULT: "#1DB954",
          hover: "#169c46",
          bright: "#1ed760",
        },
        text: {
          primary: "#ffffff",
          secondary: "#b3b3b3",
          muted: "#666666",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(to top, #0a0a0a 0%, transparent 50%), linear-gradient(to top, #0a0a0a 0%, transparent 30%)",
      },
    },
  },
  plugins: [],
};
export default config;
