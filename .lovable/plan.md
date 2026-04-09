

## Add Entropy Particle Animation as Full-Page Background

### Overview
Create the `Entropy` component adapted as a fixed, full-viewport background canvas behind all page content. The animation shows order-vs-chaos particles with connecting lines — no text, no divider line, scaled to fill the entire window.

### Changes

#### 1. Create `src/components/ui/entropy.tsx`
- Copy the Entropy component, modified for full-viewport use:
  - Remove `size` prop; use `window.innerWidth` / `window.innerHeight` instead
  - Remove the divider line and text drawing from the `animate()` function
  - Add a `resize` event listener to re-initialize on window resize
  - Use `position: fixed; inset: 0; z-index: 0` so it sits behind everything
  - Remove `'use client'` directive (not needed in Vite/React)
  - Reduce particle opacity slightly so content remains readable (e.g. alpha 0.4–0.5 instead of 0.8)
  - Adjust `gridSize` based on viewport to keep particle density reasonable
  - Boundary checks use full width/height instead of `size`
  - Remove the left-half/right-half order split — use a center-based or random split so it looks natural across the full viewport

#### 2. Update `src/pages/Index.tsx`
- Import and render `<Entropy />` as the first child inside the outer `div`, before `<MarginDoodles />`
- It renders as a fixed background layer at `z-index: 0`
- Existing content already has `z-[2]` so it layers correctly

#### 3. No Tailwind or CSS changes needed
- The existing project already has all required Tailwind config and CSS
- The component uses inline canvas drawing, no extra styles required

### Files: 2
- `src/components/ui/entropy.tsx` — new component (full-viewport particle canvas)
- `src/pages/Index.tsx` — add `<Entropy />` as background layer

