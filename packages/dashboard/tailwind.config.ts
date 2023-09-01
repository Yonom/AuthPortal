import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
