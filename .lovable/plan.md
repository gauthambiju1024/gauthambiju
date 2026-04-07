

## Plan: Tighter Doodle Spacing + Subtle Blueprint Background

### Problem
1. The layout currently fits all 22 doodles per side into one viewport height. With narrow columns (110px), the SVGs are tiny and spaced unpredictably — many may not be visible.
2. The blueprint background was fully removed (`display: none` on `::before`/`::after`), losing the subtle engineering aesthetic.

### Changes

**1. `src/components/MarginDoodles.tsx` — Allow doodles to extend beyond viewport**

The `layoutDoodles` function currently constrains all doodles to `window.innerHeight`. Instead:
- Remove the viewport-height constraint; let doodles stack naturally with a small fixed gap (e.g., 4px)
- The fixed container should use `overflow: visible` so doodles below the fold are still rendered
- The scroll-progress mapping (`updateDoodles`) already maps doodle index to global scroll progress, so doodles beyond the viewport will still draw correctly as the user scrolls

Key change in `layoutDoodles`:
```
gap = 4px (fixed, tight)
y starts at 10px (reduced top padding)
```

**2. `src/index.css` — Reintroduce subtle blueprint grid**

Re-enable `.margin-bg::before` with a very faint grid:
- Thin grid lines at `rgba(255,255,255, 0.03)` for small grid, `rgba(255,255,255, 0.05)` for large grid
- Use a soft radial mask (`mask-image: radial-gradient(...)`) to fade edges so there are no hard borders
- Remove `border-right`/`border-left` if any remain
- Keep the background itself transparent — the grid floats over the dark desk background

### Files: 2
1. `src/components/MarginDoodles.tsx` — Update `layoutDoodles` to use tight fixed gap instead of viewport-constrained spacing
2. `src/index.css` — Re-enable `.margin-bg::before` with subtle grid + radial fade mask

