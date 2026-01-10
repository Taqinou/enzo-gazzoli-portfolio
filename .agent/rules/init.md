---
trigger: always_on
---



## Build and Development Commands

```bash
npm run dev      # Start development server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

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

### Component Responsibilities

| Component | Purpose |
|-----------|---------|
| `IntroOverlay` | Animated word sequence on page load |
| `HeroSection` | Main landing with archive list |
| `ProjectSection` | Expandable project cards (forwardRef for scroll targeting) |
| `EllipsePanel` | Bio/about slide-in panel |
| `LinksOverlay` | Contact/links fullscreen overlay |
| `IdentityCircle` | Floating interactive element |
| `TopRibbon` | Current section indicator |
| `ScrollProgress` | Visual scroll position indicator |

### Styling Conventions

- CSS variables for colors: `--bg`, `--ink`, `--blue`
- Font variables: `--font-serif` (Playfair Display), `--font-mono` (Helvetica)
- Custom utilities in `globals.css`: `.snap-section`, `.leading-085`, `.text-stroke-white`
- Global crosshair cursor with custom SVG cursor when project active

### Data

Projects defined in `src/data/projects.ts` with `Project` interface. Adding/editing projects only requires modifying this file.
