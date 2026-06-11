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
        bg: "var(--bg)",
        ink: "var(--ink)",
        blue: "var(--blue)",
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
