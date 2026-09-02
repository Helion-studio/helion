import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is CSS-first (see src/app/globals.css).
 * This legacy config is loaded via `@config` purely as a COMPATIBILITY BRIDGE:
 * most 21st.dev / Aceternity / MagicUI snippets are written for v3 and expect
 * their keyframes to live here. Paste a component, drop its `theme.extend`
 * block in below, and it just works — no rewriting to v4 syntax.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        helion: {
          ice: "#dce6ef",
          mist: "#b4c8d8",
          steel: "#8ba2b8",
          slate: "#5b7085",
          deep: "#3c4854",
          ink: "#232c38",
          void: "#12161d",
        },
      },
      fontFamily: {
        // Spec §8 — Nevera/Varino are commercial faces and are NOT bundled.
        // Drop the files in public/fonts/ (see public/fonts/README.md) and they
        // activate automatically; until then this falls back to Geist.
        // `font-geist` is used by several 21st.dev components
        geist: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        // required by 21st.dev hero-1 (elements start at opacity-0)
        "fade-in": "fade-in 1000ms var(--animation-delay, 0ms) ease forwards",
        "fade-up": "fade-up 1000ms var(--animation-delay, 0ms) ease forwards",
        marquee: "marquee var(--duration, 40s) linear infinite",
        "marquee-vertical":
          "marquee-vertical var(--duration, 40s) linear infinite",
        shimmer: "shimmer 8s infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        meteor: "meteor 5s linear infinite",
        orbit: "orbit calc(var(--duration, 20) * 1s) linear infinite",
        "background-position-spin":
          "background-position-spin 3000ms infinite alternate",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "none" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap, 1rem)))" },
        },
        shimmer: {
          "0%, 90%, 100%": { backgroundPosition: "calc(-100% - var(--shimmer-width)) 0" },
          "30%, 60%": { backgroundPosition: "calc(100% + var(--shimmer-width)) 0" },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))",
          },
          "100%": {
            transform:
              "rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))",
          },
        },
        "background-position-spin": {
          "0%": { backgroundPosition: "top center" },
          "100%": { backgroundPosition: "bottom center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
