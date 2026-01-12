# Design System: Structure & Tension

This document serves as a technical and aesthetic reference for the portfolio's Design Direction (DA). It ensures consistency across future redesigns and feature additions.

## 1. Core Philosophy
The design language is a hybrid of **High Brutalism** and **Swiss Style**. It balances raw, unpolished structural elements with the precision and grid-based discipline of the International Typographic Style.

- **Structure & Tension**: Layouts often use intentional overlaps, rotations, and "broken" grids to create visual interest.
- **Micro-Interactions**: Every action is reinforced with mechanical feedback (sound + movement), emphasizing the digital "machine" nature of the site.
- **Negative Space**: Extreme use of whitespace to focus attention on large-scale typography.

---

## 2. Color Palette
The palette is intentionally limited to primary-adjacent colors to maintain high contrast and a "raw" aesthetic.

| Variable | Hex Code | Usage |
| :--- | :--- | :--- |
| `--bg` | `#f9f9f9` | Primary background color (off-white). |
| `--ink` | `#000000` | Primary text and border color. |
| `--blue` | `#0000ff` | Action color, overlay backgrounds, and structural shadows. |
| `--yellow` | `#ffff00` | Text selection background only. |

### Usage Rules:
- **Contrast**: Use `--ink` on `--bg` for standard readability.
- **Inversion**: Use `--bg` (white-ish) text on `--blue` backgrounds for active states or overlays.
- **Shadows**: Structural shadows (hard offsets) always use `--blue` with 0 blur.

---

## 3. Typography
The system uses a strict dichotomy between a classical Serif and a functional Mono.

### Serif: Playfair Display
- **Role**: Primary headings, project titles, and decorative elements.
- **Styling**: 
  - Often **lowercase**.
  - Tight leading (`0.7` to `0.85`).
  - Negative tracking (`-0.05em`) for large display sizes.
  - Usage: `.font-serif`.

### Mono: Helvetica (Simulated) / Arial
- **Role**: Functional metadata, labels, descriptions, and structural numbering.
- **Styling**:
  - Often **UPPERCASE** and **EXTRABOLD** for descriptions.
  - Tracking: wide (`0.2em`) for small labels, tight (`-0.05em`) for large display numbers.
  - Usage: `.font-mono`.

### Impact (Display)
- **Role**: Backup for extreme display scenarios or specific brand elements.
- **Usage**: `.font-display`.

---

## 4. Layout & Grid
### Split Screen & Grid
- The layout often utilizes a 2-column grid (`grid-cols-[1.2fr_0.8fr]` or fixed sidebars) to separate navigational elements from content.
- Use `clamp()` for responsive spacing and font sizes to maintain the "structural" feel across viewports.

### Layering & Rotation
- **Panels**: Overlays (like `EllipsePanel`) are slightly rotated (`-3deg` to `-6deg`) to break the viewport's perfection.
- **Structural Shadows**: Large offset shadows (`shadow-[40px_40px_0px_var(--blue)]`) create a sense of physical layering without using depth/gradients.

### Scroll Snap
- The main experience is a **vertical scroll-snap** container.
- Each section (`snap-section`) occupies exactly `100vh`.

---

## 5. Animation & Interaction
### Easing Curves
- All transitions must use the custom **`ease-out-expo`** curve for a "snappy yet smooth" mechanical feel.
- **CSS**: `cubic-bezier(0.16, 1, 0.3, 1)`
- **Tailwind**: `ease-out-expo`

### Interaction Cues
- **Cursor**: The default cursor is a `crosshair`. Custom SVG cursors are used for 404 pages and active project states.
- **Sound Design**:
  - `playClick`: Standard interactive feedback.
  - `playMechanicalClack`: Triggered on major state changes (e.g., opening a project).
  - `playExit`: Feedback for closing overlays or navigating away.

---

## 6. Component Patterns
### Buttons & Triggers
- **Identity Circle**: A floating circular trigger with spinning text (`font-mono`) that indicates state (info vs exit).
- **Project Titles**: Large-scale serif text that serves as a primary navigation trigger.

### Overlays
- **Stack & Ellipse Panels**: High-z-index panels that use `AnimatePresence` for exit animations. They should always have a solid border and hard structural shadow.

### Text Styles
- **Text Stroke**: Used for background decorative text (`-webkit-text-stroke: 1px rgba(255, 255, 255, 0.3)`).
- **Background Numbers**: Large, low-opacity (`0.015`) mono numbers used as section identifiers.
