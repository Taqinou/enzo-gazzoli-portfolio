# Agent Guidelines: New Portfolio

This project is a high-performance, animated portfolio built with Next.js (App Router), TypeScript, and Framer Motion. It emphasizes smooth transitions, custom easing, and a clean, modular architecture.

## 🧭 Site Architecture: two wings (studio + archive)

The site is split into two coexisting "wings" that share the same design tokens but serve different audiences:

- **Studio wing** (`/`, `/work/[slug]`, `/services`, `/cv`, `/pricing`) — the business-facing front door. Positions Enzo as an independent studio (offer, method, case studies, contact). Normal scroll, single theme.
- **Archive wing** (`/archive`) — the original artistic SPA (intro `portfolio.`, scroll-snap, project overlays, `MIN./ART.` theme toggle). Moved here verbatim; **do not restyle it**. It's the "folio/lab". The `minimal` theme is scoped to `/archive` only (see `ThemeContext.tsx` + the inline anti-FOUC script in `layout.tsx`).

Cross-navigation: studio → archive via `StudioNav`/`StudioFooter`; archive → studio via the `studio.` link in `HeroSection.tsx` and the `navLinks.studio` entry in `NAV_LINKS`.

Work is on branch **`feat/studio-home`** (not yet merged to `main`).

### Studio design direction (NON-NEGOTIABLE)

The studio wing must keep Enzo's **existing design system** (Playfair Display lowercase, Helvetica-bold uppercase mono labels, `blue #0000ff`, `bg #f9f9f9`, hard shadows, crosshair, sound design) while raising execution to **"premium AI craft"** level — the references are cursor.com, devin.ai, sinewdesign.com, the-square.io (cinematic motion, atmospheric photographic backgrounds, depth, refined micro-interactions).

- **Rejected directions** (do not reintroduce): plain reproduction of the DA (too flat), and generic modern-SaaS restyling (bento grids / pills / Inter-only → "on se croirait en 2022"). Every studio iteration must pass both tests: (1) is it in his tokens? (2) is it at Cursor/Devin staging level?
- The home hero (`StudioHero.tsx`) is an **atmospheric hero**: full-bleed photographic sky (`public/images/studio/sky.jpg`, swappable — `sky-alt1/2.jpg` are alternates) with a slow drift, centered element, word-by-word blur reveal on the thesis. Iterate hero details section by section, proposing ideas before coding.

### ⚠️ CRITICAL: framer-motion is broken in this env

Framer-motion `initial`/`animate` and `whileInView` animations **stay frozen at their initial state** (content invisible) on fresh load — reproduced on `main`, in dev AND production build, with framer-motion 12.25.0 and 12.42.2 (React 19 + Next 16 + the `LanguageProvider` returning `null` before hydration).

- The live site only works because it was deployed before the January 2026 lockfile bump. **Any redeploy (even of `main`) risks rendering `/services` and `/archive` blank.** Verify with `npm run build && npm run start` and confirm content appears before deploying.
- **On the studio wing, NEVER use framer-motion for reveals.** Use the CSS-only primitives instead (below).

### Studio-only utility components (`src/components/studio/`)

- `Reveal.tsx` — CSS reveal (IntersectionObserver + `.studio-reveal`/`.studio-mask` keyframes in `globals.css`). `variant="fade" | "mask"`. Replaces `BlurFade` here.
- `BlurWords.tsx` — word-by-word blur-in wave (`.studio-blurwords`/`.studio-word`); used for the hero thesis.
- `Scramble.tsx` — terminal-style text-scramble for mono micro-labels.
- `SmoothScroll.tsx` — Lenis smooth-scroll wrapper, scoped to studio pages (respects `prefers-reduced-motion`; do NOT wrap `/archive`, it has its own scroll-snap container).
- All respect `prefers-reduced-motion` and require `"use client"`.

## 🛠 Commands

### Development & Build
- **Start Dev Server:** `npm run dev`
- **Build Project:** `npm run build`
- **Production Start:** `npm run start`
- **Linting:** ⚠️ `npm run lint` (`next lint`) is **broken** on Next 16 (errors `no such directory: .../lint`). Rely on `npm run build` (runs TypeScript type-checking) for validation instead.

### Testing
- **Run Tests:** *No testing framework currently configured.*
- **Single Test:** N/A
- *Note: If adding tests, prefer Vitest or Jest with React Testing Library.*

## 🎨 Code Style & Conventions

### Core Technologies
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode preferred)
- **Styling:** Tailwind CSS with CSS Variables (`--bg`, `--ink`, `--blue`)
- **Animations:** Framer Motion (`AnimatePresence`, `motion`)
- **React Version:** 19 (React 19 features like improved hooks and hydration are expected)

### File Structure
- `src/app`: Routes, global layouts, and `globals.css`.
- `src/components`:
  - `core/`: Fundamental wrappers (e.g., `Providers.tsx`).
  - `layout/`: Shared layout elements like ribbons or navigation.
  - `overlays/`: Modals, full-screen panels, and transition overlays.
  - `sections/`: Major page sections (e.g., `HeroSection.tsx`).
  - `ui/`: Smaller, reusable interactive elements.
- `src/contexts`: React Contexts for global state management.
- `src/hooks`: Custom hooks for logic extraction.
- `src/data`: Static configuration, project details, and i18n JSON files.

### Component Guidelines
- **Client Directive:** Always include `"use client";` at the very top of files using hooks, state, or browser APIs.
- **Naming:** Use **PascalCase** for component files and function names.
- **Functional Components:** Prefer function declarations over arrow functions for top-level components.
- **Optimization:** Use `memo` and `forwardRef` for components that are part of the main scrollable list to prevent unnecessary re-renders.
- **Ref Handling:** When using `forwardRef`, always set `ComponentName.displayName` at the bottom of the file.

### State & Logic
- **Custom Hooks:** Extract complex component logic into dedicated hooks (e.g., `useHomeState.ts`). This facilitates testing and keeps UI components declarative.
- **Context Usage:** Use `useContext` via a custom wrapper hook (e.g., `useLanguage`) that checks for the existence of the Provider.

### Naming Conventions
- **Components:** `PascalCase` (e.g., `ProjectSection`)
- **Variables/Functions:** `camelCase` (e.g., `toggleProject`)
- **Constants:** `UPPER_SNAKE_CASE`
- **Hooks:** `usePrefix` (e.g., `useTranslation`)
- **Types/Interfaces:** `PascalCase` (e.g., `ProjectSectionProps`)

### Formatting & Syntax
- **Indentation:** 2 spaces.
- **Quotes:** Double quotes for strings and JSX attributes.
- **Semicolons:** Always required.
- **Trailing Commas:** Required in multi-line arrays and objects.
- **Imports:**
  - Use the `@/` alias for all internal paths.
  - **Standard Order:**
    1. React and Next.js built-ins (`useState`, `Link`, etc.)
    2. Third-party libraries (`framer-motion`, `lucide-react`)
    3. Internal components (`@/components/...`)
    4. Logic/State (`@/hooks/...`, `@/contexts/...`, `@/lib/...`)
    5. Data (`@/data/...`)
    6. Assets/Styles (`.css`, `.svg`)

### Styling & Tailwind
- **Colors:** Use semantic names defined in `tailwind.config.ts`: `bg`, `ink`, `blue`.
- **Color tokens & alpha:** `bg`/`ink`/`blue` are `rgb(var(--x-rgb) / <alpha-value>)`, so opacity modifiers work (`text-ink/40`, `border-ink/[0.12]`, `bg-blue/10`). Keep the RGB-channel vars (`--bg-rgb`, `--ink-rgb`, `--blue-rgb` in `globals.css` `:root` **and** `.theme-minimal`) in sync with the hex `--bg`/`--ink`/`--blue`. The hex vars still exist for **raw** `var(--x)` uses (hard shadows, gradients, cursor SVGs) — don't feed `var(--x-rgb)` into those. ⚠️ Historic gotcha: before this, the tokens were `var(--x)` (hex) so all `*-ink/<alpha>` silently rendered at full opacity.
- **Typography:** Use `font-serif`, `font-mono`, or `font-display`.
- **Easing:** Use the custom `ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) for transitions.
- **Responsiveness:** Favor Tailwind's utility classes. Use the `useIsMobile` hook only for complex programmatic layout changes.

### Localization (i18n)
- **Implementation:** Custom hook `useTranslation` wrapping `LanguageContext`.
- **Text:** Never hardcode user-facing strings. Use `t("namespace.key")`.
- **Keys:** dot-notated strings corresponding to `src/data/translations/*.json`.
- **Hydration:** Handle hydration mismatches by ensuring client-specific state (like locale) is only accessed after the component has mounted (see `useEffect` in `LanguageProvider`).

### Data & Constants
- **Project Definitions:** Found in `src/data/projects.ts`. Each project has an `index`, `linkUrl`, and optional `githubUrl`.
- **Translations:** JSON files in `src/data/translations/` contain all UI text.

### Error Handling
- **Contexts:** Throw errors if hooks are used outside their respective Providers.
- **API/Utilities:** Use `try/catch` blocks for browser API interactions (e.g., `localStorage`, `navigator`).

## 🚀 Pro Tips for Agents
- **Framer Motion:** Use `AnimatePresence` for exit animations. Prefer `mode="wait"` for sequential transitions.
- **Tailwind:** Combine classes dynamically using template literals: `` `${isActive ? "text-white" : "text-ink"}` ``.
- **Accessibility:** Always include `aria-label` on interactive elements, especially if they only contain icons or use `motion.button`.
- **Hydration Safety:** When using browser APIs (like `window` or `localStorage`), check if `typeof window !== "undefined"` or use a `useEffect` mount check.
- **Images/Assets:** Place static assets in the `/public` directory and reference them with absolute paths (e.g., `/images/logo.png`).

## 📝 Example Component Structure

```tsx
"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

interface ExampleProps {
  title: string;
}

const ExampleComponent = memo(({ title }: ExampleProps) => {
  const [isActive, setIsActive] = useState(false);
  const { t } = useTranslation();

  return (
    <motion.div 
      className={`p-4 ${isActive ? "bg-blue" : "bg-bg"}`}
      onClick={() => setIsActive(!isActive)}
    >
      <h1>{title}</h1>
      <p>{t("common.click_me")}</p>
    </motion.div>
  );
});

ExampleComponent.displayName = "ExampleComponent";

export default ExampleComponent;
```

## 💶 Offre & grille tarifaire (`/services`, `src/data/pricing.ts`)

Refonte du 2026-08-26 (PR #1), après une étude de marché et de concurrence. Quatre offres, **planchers seuls, aucune fourchette haute** :

| # | Offre | Plancher |
|---|---|---|
| 01 | Site vitrine et landing page | 1 200 € (Landing 1 200 · Vitrine 3 500) |
| 02 | Application métier | 6 000 € |
| 03 | Boutique en ligne | 7 000 € |
| 04 | IA sur votre application | 1 500 € |

**Retiré, et à ne pas réintroduire** : les intitulés `MVP` / `SaaS complet` / `Dashboard métier`, la formule « Portfolio créatif » (hors cible : entrepreneurs, artisans, PME), l'offre « Sur mesure », le système d'**options payantes unitaires** (auth 300 €, Stripe 250 €, SEO 150 €, Analytics 75 €… — il contredisait le forfait par valeur et invitait à négocier ligne par ligne), le bloc « Ce qui est inclus », les sous-titres sous les noms de formules, et les mentions « prix fixé avant le démarrage, hors taxes » et maintenance mensuelle.

### ✍️ Règle d'écriture des textes visiteur (NON-NÉGOCIABLE, tout le site)

Enzo rejette tout ce qui « sonne généré par IA ». Bannis : **le tiret cadratin**, « sur mesure », « MVP », « SaaS » comme intitulé commercial, « dashboard », « robuste », « ultra-rapide », « architecture solide », « performant », « moderne », « clé en main », « solutions », « qui vous ressemble », « pensé pour ». Interdits de forme : la construction « X, pas Y », la punchline courte en fin de paragraphe, la clause vide (« ça dépend du projet »), les emoji, les gloses entre parenthèses en rythme ternaire.

**Le principe** : nommer des choses réelles plutôt que promettre des bénéfices. « catalogue, panier, paiement » ne peut pas sonner généré, « être visible en ligne » si. Une promesse doit être **vérifiable** : « rapide au chargement » se mesure, « développé de zéro » se constate, « performant » ne s'oppose à rien. Vaut pour le FR **et** l'EN.

### État du simulateur de devis

`useQuoteSimulator.ts` a été fortement réduit (les options ont disparu). `ProjectTypeCard.tsx` et `QuoteSummary.tsx` sont **morts mais compilent**, laissés en place. `OptionCategory.tsx` supprimé. `src/app/_pricing/page.tsx` (non routée, préfixe underscore) a été adaptée mécaniquement pour ne pas casser le typecheck — sa numérotation garde un « 01. » sans « 02. ».
