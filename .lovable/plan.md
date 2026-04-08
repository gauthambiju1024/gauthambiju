

## Plan: Ghost Grid Background with Panel-Boundary Flash

A fixed-position blueprint grid covers the entire page at ~2% opacity. When the user scrolls past a panel boundary, the grid briefly flashes to ~8-10% opacity and SVG "construction lines" (dimension arrows, center marks, tick counters) appear for ~400ms before fading back.

### How It Works

1. **Fixed ghost grid layer** — A `position: fixed` full-viewport div with CSS blueprint grid lines at very low opacity (2-3%), sitting behind all content at `z-index: 0`.

2. **Scroll boundary detection** — A React component uses `IntersectionObserver` on each panel wrapper. When a panel enters/exits the viewport threshold (~50%), it triggers a brief "flash" state.

3. **Flash effect** — On trigger, the grid opacity animates from 2% → 8% → 2% over ~600ms using CSS transition. Simultaneously, an SVG overlay with construction details (dimension arrows, center crosshairs, tick marks) fades in and out.

4. **Construction line SVGs** — Simple fixed-position SVG elements: horizontal/vertical dimension arrows with small arrowheads, a center crosshair mark, and faint numeric tick labels. These only render during the flash.

### Changes

#### 1. New file: `src/components/GhostGrid.tsx`
- Renders a `position: fixed; inset: 0` div with the blueprint grid pattern (reusing existing CSS grid pattern from `.blueprint-surface` but at 2% base opacity)
- Contains an SVG layer with construction marks (dimension arrows at edges, center crosshair, tick numbers)
- Uses `IntersectionObserver` watching all `.section-panel` and `.notebook` elements
- On boundary crossing: sets `flash` state → CSS class bumps grid opacity to 8% and fades in construction SVGs → 600ms timeout clears the class
- Construction SVG elements: two dimension arrows (top-center horizontal, left-center vertical), corner tick marks with small numbers, center "+" crosshair

#### 2. `src/pages/Index.tsx`
- Import and render `<GhostGrid />` alongside `<MarginDoodles />`

#### 3. `src/index.css`
- Add `.ghost-grid` base styles with the grid pattern at 2% opacity
- Add `.ghost-grid--flash` class that transitions opacity to 8% and shows construction marks
- Transition: `opacity 0.3s ease-in, 0.6s ease-out`

### Files: 3
1. `src/components/GhostGrid.tsx` — new component with grid + observer + construction SVGs
2. `src/pages/Index.tsx` — add `<GhostGrid />`
3. `src/index.css` — ghost grid CSS classes

