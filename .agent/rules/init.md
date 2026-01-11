---
trigger: always_on
---

# AGENTS.md

This file provides guidance to agentic coding agents working in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Testing**: This project does not have a test suite. Focus on manual testing and lint validation.

## Architecture Overview

This is a creative portfolio site for Enzo Gazzoli built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, and Framer Motion.

### Core Structure

- **Single-page app** with scroll-snap sections: one hero + multiple project sections
- **Main orchestrator**: `src/app/page.tsx` manages all state (intro animation, overlays, scroll tracking, active sections)
- **No routing**: Everything happens on the home page with overlay panels and scroll navigation

### Key Patterns

**State Flow**: The main page component holds all app state and passes handlers down to components:
- `introComplete` - Controls when main content becomes visible
- `ellipsePanelOpen` / `linksOverlayOpen` - Modal-like panels
- `isProjectActive` - When a project is expanded (locks scroll)
- `activeSections` - Tracked via IntersectionObserver for animations

**Animation System**: Uses Framer Motion throughout:
- `AnimatePresence` for enter/exit animations
- Motion variants with custom easing (`ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)`)
- Scroll velocity tracking affects UI elements

**Sound System**: `src/hooks/useSound.ts` provides Web Audio API-based procedural sounds:
- `playClick()` - White noise burst for section changes
- `playIntroTick()` - Oscillator ticks for intro sequence
- `playMechanicalClack()` - Noise for project open/close

## Code Style Guidelines

### Imports and Formatting

- Use 2-space indentation (configured in `.editorconfig`)
- Import order: React hooks → external libraries → local components → data/types
- Use absolute imports with `@/` prefix for all local imports
- Example:
  ```tsx
  import { useState, useRef, useCallback } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import BackgroundName from "@/components/BackgroundName";
  import { projects } from "@/data/projects";
  ```

### TypeScript and Types

- Strict TypeScript enabled (see `tsconfig.json`)
- Use interfaces for data shapes (`Project` interface in `src/data/projects.ts`)
- Prefer explicit typing for props and state
- Use generic types where appropriate (`Set<number>`, `HTMLElement | null`)

### Component Patterns

- Use `"use client";` directive for all components with interactivity
- Forward refs for components that need scroll targeting (`ProjectSection`)
- Use `Suspense` boundaries for components using `useSearchParams()`
- Component naming: PascalCase, descriptive (e.g., `EllipsePanel`, `LinksOverlay`)

### State Management

- All state lives in the main page component (`src/app/page.tsx`)
- Pass state setters as props to child components
- Use `useState` for simple state, `useRef` for DOM references and non-reactive values
- Implement proper cleanup in `useEffect` hooks

### Styling Conventions

- CSS variables for colors: `--bg`, `--ink`, `--blue`
- Font variables: `--font-serif` (Playfair Display), `--font-mono` (Helvetica)
- Custom utilities in `globals.css`: `.snap-section`, `.leading-085`, `.text-stroke-white`
- Global crosshair cursor with custom SVG cursor when project active
- Use Tailwind classes for styling, avoid inline styles

### Naming Conventions

- Components: PascalCase (`HeroSection`, `IdentityCircle`)
- Functions/variables: camelCase (`introComplete`, `setEllipsePanelOpen`)
- Constants: UPPER_SNAKE_CASE for CSS variables (`--bg`, `--ink`)
- Files: PascalCase for components, kebab-case for utilities

### Error Handling

- Use try-catch blocks for Web Audio API operations
- Graceful fallbacks for unsupported features
- Check for `typeof window === "undefined"` for SSR compatibility
- Proper cleanup in useEffect to prevent memory leaks

### Performance Considerations

- Use `useCallback` for event handlers passed to child components
- Implement scroll throttling to prevent excessive re-renders
- Shared AudioContext instance for sound system
- Lazy loading with `Suspense` for search params

### Data Management

- Projects defined in `src/data/projects.ts` with `Project` interface
- Adding/editing projects only requires modifying this file
- Use array methods for project data manipulation
- Maintain consistent data structure across all projects

## Development Workflow

1. Always run `npm run lint` before committing changes
2. Test scroll behavior and animations in development server
3. Verify sound functionality works across different browsers
4. Check responsive behavior at different viewport sizes
5. Ensure all overlays and panels open/close correctly

## File Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── data/            # Data definitions and mock data
└── hooks/           # Custom React hooks
```

## Key Dependencies

- `framer-motion` - Animations and gestures
- `next` - React framework
- `react` - UI library
- `tailwindcss` - Utility-first CSS
- `typescript` - Type safety

## Browser Compatibility

- Modern browsers only (ES2017+ target)
- Web Audio API support required for sound features
- CSS custom properties support required
- IntersectionObserver support required for scroll tracking
