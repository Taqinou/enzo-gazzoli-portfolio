# Language Toggle Redesign

## Objective
Replace the static text-based FR/EN toggle in `TopRibbon.tsx` with an interactive, motion-based "Sliding Pill" design to improve readability and match the project's Design Direction.

## Proposed Changes

### `src/components/TopRibbon.tsx`
- Remove the current text buttons ("FR / EN").
- Implement a mapped list `['fr', 'en']` inside a container.
- **Container Styling**:
  - `bg-white/10` (translucent)
  - `backdrop-blur-sm`
  - `rounded-full`
  - `border border-white/20`
- **Item Styling**:
  - Relative positioning.
  - Dynamic text color: `text-blue` (active) vs `text-white` (inactive).
- **Animation**:
  - Add a `motion.div` with `layoutId="active-lang-pill"` behind the active item.
  - Use `type: "spring", stiffness: 400, damping: 30` for snappy feel.

## Verification
- Visual check: Ensure white pill slides correctly.
- Functional check: Clicking toggles the language context.
- Responsive check: Ensure it fits in the mobile ribbon.
