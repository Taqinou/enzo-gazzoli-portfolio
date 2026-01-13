# Agent Guidelines: New Portfolio

This project is a high-performance, animated portfolio built with Next.js (App Router), TypeScript, and Framer Motion. It emphasizes smooth transitions, custom easing, and a clean, modular architecture.

## 🛠 Commands

### Development & Build
- **Start Dev Server:** `npm run dev`
- **Build Project:** `npm run build`
- **Production Start:** `npm run start`
- **Linting:** `npm run lint`

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
