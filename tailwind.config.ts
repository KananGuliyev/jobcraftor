import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        panel: "#0f1b30",
        mist: "#dce6f2",
        sunrise: "#f6a54f",
        sky: "#8cd4ff",
        sand: "#f4ede3",
        ember: "#ff835f",
        mint: "#8dd8b1",
      },
      fontFamily: {
        display: ["var(--font-sans)", "Segoe UI", "sans-serif"],
        body: ["var(--font-sans)", "Segoe UI", "sans-serif"],
        accent: ["Iowan Old Style", "Palatino Linotype", "serif"],
      },
      boxShadow: {
        soft: "0 22px 60px rgba(0, 0, 0, 0.24)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(246,165,79,0.08), transparent 24%), radial-gradient(circle at 82% 10%, rgba(140,212,255,0.08), transparent 22%), linear-gradient(180deg, #08111d 0%, #0c1625 42%, #111d2f 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
