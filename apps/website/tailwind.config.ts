import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {},
  plugins: [require("@tailwindcss/typography")],
};

export default config;
