# Agent Guidelines: New Portfolio

This project is a high-performance, animated portfolio built with Next.js (App Router), TypeScript, and Framer Motion. It emphasizes smooth transitions, custom easing, and a clean, modular architecture.

## 🧭 Site Architecture: two wings (studio + archive)

The site is split into two coexisting "wings" that share the same design tokens but serve different audiences:

- **Studio wing** (`/`, `/work/[slug]`, `/services`, `/cv`, `/pricing`) — the business-facing front door. Positions Enzo as an independent studio (offer, method, case studies, contact). Normal scroll, single theme.
- **Archive wing** (`/archive`) — the original artistic SPA (intro `portfolio.`, scroll-snap, project overlays, `MIN./ART.` theme toggle). Moved here verbatim; **do not restyle it**. It's the "folio/lab". The `minimal` theme is scoped to `/archive` only (see `ThemeContext.tsx` + the inline anti-FOUC script in `layout.tsx`).

Cross-navigation: studio → archive via `StudioNav`/`StudioFooter`; archive → studio via the `studio.` link in `HeroSection.tsx` and the `navLinks.studio` entry in `NAV_LINKS`.

Work is on branch **`feat/studio-home`** (not yet merged to `main`).

### Studio design direction (NON-NEGOTIABLE)

The studio wing must keep Enzo's **existing design system** (Playfair Display lowercase, Helvetica-bold uppercase mono labels, `blue #0000ff`, `bg #f7f6f5`, hard shadows, crosshair, sound design) while raising execution to **"premium AI craft"** level — the references are cursor.com, devin.ai, sinewdesign.com, the-square.io (cinematic motion, atmospheric photographic backgrounds, depth, refined micro-interactions).

- **Rejected directions** (do not reintroduce): plain reproduction of the DA (too flat), and generic modern-SaaS restyling (bento grids / pills / Inter-only → "on se croirait en 2022"). Every studio iteration must pass both tests: (1) is it in his tokens? (2) is it at Cursor/Devin staging level?
- The home hero (`StudioHero.tsx` + `src/hooks/useHeroScene.ts`) is a **three-plane scene, "le titre dans le ciel"**: the sky (`public/images/studio/sky-painting.jpg`), since 2026-09-16 **a painting**: Pierre-Henri de Valenciennes, *Study of Clouds over the Roman Campagna* (c. 1782–85, National Gallery of Art, public domain / CC0), cropped to the sky (land removed) and resized to 3200 px wide; chosen by Enzo ("magnifique") among four public-domain cloud studies (three Constable) against the former photo. Swappable, `sky-alt1/2.jpg` are old photo alternates, the big Playfair title, and a foreground cloud veil (`sky-veil-painting.webp`) that passes in front of the letters. The veil is derived from the sky by `scripts/sky-veil.py` and the looping sky by `scripts/sky-loop.py` (both take `[source] [output]`): **regenerate both whenever the sky is swapped**, and report the new `sky-painting-loop.jpg` ratio in `.studio-sky-tile` (`aspect-ratio`). ⚠️ Give a swapped image a **new file name**: `next/image` and the browser cache it by URL, so overwriting `sky.jpg` in place kept showing the old photo (hence the `sky-painting*` names). 2026-09-16: a denser, taller veil plus a band of mist drifting across the title was tried and reverted ("ça empiète trop sur le texte"): keep the clouds off the letters. The clouds scroll left endlessly (asked by Enzo the same day): the sky through `.studio-sky-loop` (200 s, slowed down at Enzo's request, three tiles of `sky-painting-loop.jpg`, a horizontally seamless version of the sky made by `scripts/sky-loop.py`, **regenerate it too when the sky is swapped**), and the veil faster in front (`.studio-hero-veil-drift`, 130 s, tiles veil / mirror / veil). The veil alone moving was invisible (too soft). Enzo also found the white band at the bottom of the hero too big (it hid the sky): the bottom cream gradient now stops at 60 % instead of opaque (the whiteout covers the hero edge on exit), and the veil's uniform bottom mist was lowered (`mist` 0.55 → 0.3 in `sky-veil.py`), keeping the cloud shapes.
  - Opening = one short camera move in CSS (`.studio-hero-*` in `globals.css`: pull-back, focus, overexposure, ~1.9 s), held until the sky has loaded (`.is-ready` pauses every hero animation, since the page only mounts after hydration). Enzo found a ~2.8 s opening too long.
  - The scroll exit (camera rises into the clouds, title fades into the mist, whiteout) is driven by the native scroll event in `useHeroScene`, writing transforms on dedicated wrappers so they never fight the CSS animations. The hero is `192svh` with a sticky stage (mobile: `140svh` / `-38svh`, no animated title blur, small sky zoom, whiteout `span(p, 0.3, 1)`, because the long pin and filters stuttered on phones); the next section overlaps it by `-mb-[90svh]` (height − overlap ≈ 100svh: the offer starts just below the fold), has **no background** and a small top padding, so the offer heading rises *through* the dissolving sky during the whole pin. The whiteout (`span(p, 0.45, 1)`) only starts once the heading is well on screen and completes at the end of the pin, when the heading reaches the nav (Enzo, 2026-09-16: whiteout ending with the heading mid-screen (`150/-48`) then in the top third (`170/-68`) was still "pas ouf", he wants the sky to linger behind it). Title/CTA fades are expressed in absolute scroll (≈17svh / 7svh): rescale them if the pin length changes. ⚠️ The "empty white screen" Enzo kept seeing (2026-09-16, and before with `170/-16`, `150/-26`, `140`, `130/-24`) came from the whiteout finishing long before the heading was on screen, not from the hero height: never shorten the overlap or end the whiteout early again, keep `height − overlap ≈ 100svh` and the whiteout ending near the end of the pin. `OfferSection` is now **« le viseur »** (chosen 2026-09-15 among three full redesigns): four quadrants split by a crosshair whose lines (`--cx`/`--cy`, registered custom properties driving both grid tracks and lines) glide toward the hovered cell; the hovered title scales up by `transform` in a fixed-width box (never by font-size, it caused reflow jitter), the others blur (depth of field) and a blurred sky haze fades in behind the hovered title, contained inside the cell. Idle state = all four cells plain and sharp (Enzo refused a default focus and an idle "breathing" drift of the cross, and the blue reticle at the centre). Rejected earlier: a scroll-pinned rewrite, and (2026-09-16, "c'est nul") the blurred cream-washed sky filling the whole grid at rest with a sharp sky in the hovered cell. Enzo finds the idle grid not rich enough, but the sky is not the answer there. Also rejected the same day ("nul", all three): titles oversized and cropped by the cross, revealed in full on hover; the four offers stacked and blurred at the centre, pushed into their corners by the opening cross on scroll; giant pale numerals behind each title with scroll parallax. Moving or restyling the same four titles does not make the idle state richer. **What works (2026-09-16, "là on tient un vrai truc")**: one isometric line figure per offer (`offer/OfferFigure.tsx`, geometry generated, one blue detail, no words) that tells the offer on hover: the page's sections detach forward, the blue file moves to the next stage, the product drops into the bag, a scan line reads the document and two lines lift off in blue. Figures sit large and centred in their cell, **behind** the full-width title, as a watermark (opacity 50 % at rest and on focus: Enzo found 100 % then 70 % on focus too present), sized from `--fig-s` with an equal-area factor per figure. Placements tried and rejected the same day: small top-right under the price (corner icons), bottom-right beside a narrowed title (SaaS feature cards), small centred above the title, taller cells, smaller titles, oversized and cropped top-right; at rest the description takes no room (grid rows 0fr → 1fr on hover), so titles stay at the bottom of their cell. Disabled under `prefers-reduced-motion`.
  - **No mouse parallax**: Enzo tried it and rejected it ("quand on bouge le curseur tout bouge ça j'aime pas").
  - No visible layer edges: the veil has a baked top fade + a long CSS mask ramp and only ever scales from its bottom edge (never translates up), and the blurred focus copy overflows the frame (`-inset-[14%]`).
  - The hook toggles `html.studio-on-hero`: the nav (`--nav-rgb`, Tailwind color `nav`) is ink over the sky, because `mix-blend-difference` rendered it brown there.
  - **CTAs stay as they are**: the ink pill + the frosted-glass pill (Inter, `playClick`). Enzo validated them against the pills ban below; hard-shadow rectangle buttons were tried and rejected ("horriblissime"). They are now `HeroPill.tsx` (same look at rest) with a hover animation asked by Enzo on 2026-09-16: slight lift, colour spreading in a circle from the cursor's entry point (blue / white glass) and receding to its exit point, a progressive gaussian blur wave crossing the label then the arrow, letter by letter, without moving them; the fill takes 1.1 s. Rejected: the letters (and arrow) rolling up/out.
  - Iterate hero details section by section, proposing ideas before coding. Enzo wants product-design thinking (staging, depth, motion), not copy proposals.

  - **Work section (formerly `CaseStudiesSection`, rounded blue cards)**: 2026-09-16, two redesigns rejected ("aucun des deux ne me plaît"): A, a full-width index of big project names separated by the viewfinder hairlines, row focus on hover revealing the tagline and the matching offer figure as a watermark; B, a small project index on the left with a large hairline frame on the right showing the hovered project's offer figure and tagline. Both used a vertical hairline drawn from the offer grid down to the heading as the transition. Then, with real captures of the live sites (7eyes, lumière de soso, th14, off screen, this site): plates alternating left/right and a mosaic wall were "ok but banal" (also with scroll-driven depth of field and parallax: "l'organisation est vue et revue"), a looping horizontal reel was refused, and a 3D fly-through between floating captures, prints scattered on a tilting table and a free layered collage were all refused as off-brand ("ça ne rentre pas du tout dans la DA"). The raw captures bring foreign colours (purple gradients, black screens) that fight the cream / blue / Playfair palette. **Retained (same day)**: `work/WorkSection.tsx`, "le mur" (mosaic: one large capture + five smaller, 12-col grid, rows 21vw). Every capture is **printed in square blue #0000ff pixels on cream** (1-bit ordered Bayer dither, `public/images/work/<slug>-pixel.webp`, generated by `scripts/work-pixel.py` from the colour captures in `scripts/work-captures/`; served `unoptimized` and lossless, a lossy re-encode smears the pixels). Chosen over a smooth duotone, a dot halftone, ASCII and a line engraving. The image stays as is on hover (no colour reveal) and hovering one project must not affect the others. Hover treatments refused on 2026-09-16: tile lifting with a hard blue offset shadow, the year scrambling into "lire l'étude de cas →", blue corner brackets converging on the image. **Click = zoom into the image** (`src/lib/workZoom.ts`, replaces the old `morphOrigin` morph): an exact copy of the tile (same file, object-cover, `image-rendering: pixelated`) is laid over the page in a fixed layer and grows to the exact frame of the `/work` hero (full width × 82svh on desktop; on phones the hero is the image at its own ratio with the title below, so no portrait crop) while the image zooms to `HERO_ZOOM` (1.08) and the page fades under cream paper; only then the route changes. `/work/[slug]` shows the same pixel image, same frame, `scale-[1.08]`, then removes the copy once its image is painted and the zoom has ended, showing the veil and title almost instantly (measured: ≤ 1px difference). The route change starts at 40 % of the 700 ms zoom so the page is mounted underneath; Enzo asked several times for the text to come faster. Keep `HERO_HEIGHT_VH` / `HERO_ZOOM` in sync with `CaseStudyContent`. Captions show only the project name (year removed). The hover is: italic name crossed by the same letter-by-letter blur wave as the hero pills (`.work-title-char`), a blue hairline drawn under the caption, and the mechanical clack (a blue viewfinder cursor and an arrow after the name were removed at Enzo's request). Sneakerscope has no live site: a blue plate with its name in Playfair, dithered too.

  - **Method section (`MethodSection`, pinned split, liked by Enzo)**: 2026-09-16, the flat blue line glyphs were replaced by `MethodFigure.tsx`, isometric line figures in the same drawing as the offer figures telling one story (framing brackets settle on the workspace, layers stack into a page, blocks take volume, the finished page lifts off with a blue signal). Each figure builds with the in-step scroll progress: the rAF loop writes `--p` (0 → 1) on the figure wrapper, layers use `clamp()` sub-progressions (set per figure: past steps 1, next 0, so the fading figure never resets); without `--p` (mobile list, reduced motion) the figure is complete.

  - **Method → Confiance (2026-09-16)**: the method's step description words go from blur to sharp while reading (no more reduced opacity), the progress rail is gone, the left number/title swap is a soft blur crossfade (`.method-swap`). Once unpinned, the method stage dissolves into blur as it scrolls away, and `ProofSection` comes out of that blur: the label sharpens on entry, the quote is read word by word (blur → sharp) as it crosses the screen, then the blue line draws and the signature appears. The Sacha (the square) testimonial is real and validated by Enzo (id `sample` is historical).

  - **Final CTA (`StudioCTA`, 2026-09-16)**: the button is a `HeroPill` (glass, same hover as the hero). The bottom blend from the painted sky to the solid blue footer is no longer a gradient but `DitherWave.tsx`: a canvas of blue pixels in the same ordered Bayer dither as the work images, sparse at the top and solid at the bottom, whose boundary rolls slowly like lava (three crossed sine waves, 30 fps, paused off-screen, still under reduced motion). Kept subtle: a thin band (20 % of the section, 3 px pixels, small wave amplitude); a first 48 %/40 % version was "beaucoup trop fort", and a blur over the pixels was refused.

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
- **Background colour (2026-09-16)**: `#f7f6f5` everywhere (`--bg` / `--bg-rgb` in `:root` and `.theme-minimal`, `/cv`, `/services` no longer overrides it to white). Colours baked into assets follow it: hard-coded `rgba(247,246,245,…)` gradients (hero, CTA, case study veil), the cloud veil (`scripts/sky-veil.py`) and the pixel work images (`scripts/work-pixel.py`): regenerate them if the background changes again.
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
