import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Scans all subdirectories
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens en canaux RGB (--x-rgb) + placeholder <alpha-value> : permet
        // l'alpha Tailwind (text-ink/40, border-ink/[0.12], bg-blue/10…). Les
        // hex --bg/--ink/--blue restent définis pour les usages var() bruts
        // (hard shadows, gradients, curseurs SVG). Voir globals.css.
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        blue: "rgb(var(--blue-rgb) / <alpha-value>)",
        // Aile studio (dark-first) : fond quasi-noir, surface, filets et
        // déclinaison lisible du bleu signature pour le texte sur dark.
        "st-bg": "#050507",
        "st-surface": "#0c0c11",
        "st-accent": "#5c5cff",
        "mn-background": "hsl(var(--mn-background))",
        "mn-foreground": "hsl(var(--mn-foreground))",
        "mn-muted": "hsl(var(--mn-muted))",
        "mn-muted-foreground": "hsl(var(--mn-muted-foreground))",
        "mn-border": "hsl(var(--mn-border))",
        "mn-primary": "hsl(var(--mn-primary))",
        "mn-primary-foreground": "hsl(var(--mn-primary-foreground))",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "Helvetica", "Arial", "sans-serif"],
        display: ["Impact", "Arial Black", "sans-serif"],
        // Clé dédiée au thème minimal : ne PAS redéfinir `sans`, sinon le
        // preflight Tailwind (html/body) et la classe `font-sans` du thème
        // par défaut (ex. /pricing) basculeraient de system-ui vers Inter.
        "mn-sans": ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        // Clé dédiée à l'aile studio (langage tech moderne), même contrainte.
        studio: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        spin: "spin 12s linear infinite",
        "spin-fast": "spin 3s linear infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
