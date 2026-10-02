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
        background: "#f1f2f4",
        surface: "#ffffff",
        flipkart: {
          blue: "#2874f0",
          darkBlue: "#1a5bc7",
          yellow: "#ffe11b",
          starYellow: "#ffbb00",
          orange: "#fb641b",
          darkOrange: "#e25412",
          cartYellow: "#ff9f00",
          green: "#388e3c",
          lightGreen: "#e8f5e9",
          grayText: "#878787",
          darkText: "#212121",
          border: "#e0e0e0",
          badgeBg: "#f0f5ff",
        },
      },
      boxShadow: {
        flipkart: "0 1px 2px 0 rgba(0,0,0,.2)",
        "flipkart-card": "0 2px 4px 0 rgba(0,0,0,.08)",
        "flipkart-hover": "0 4px 12px 0 rgba(0,0,0,.12)",
      },
    },
  },
  plugins: [],
};

export default config;
