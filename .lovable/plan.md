

## Plan: Fix Scroll Doodles — Overlap, Density, Responsiveness & Initial Grid

Address overlapping doodles, uneven density, screen-size adaptation, and show the grid immediately on load.

---

### Issues & Fixes

**1. Doodle overlap** — Currently `genDoodles` places doodles randomly with no collision avoidance. Fix: add minimum vertical spacing check (skip doodle if too close to previously placed one), and reduce doodle sizes relative to canvas width.

**2. Density too low at top** — Currently `yPct = i / count` distributes linearly, but the draw-reveal uses staggered scroll ranges so top doodles barely show. Fix: distribute doodles more evenly across the full height and start the first doodle reveal window earlier (from scroll 0% instead of waiting).

**3. More doodles** — Add ~6 new types: `wrench`, `ruler`, `compass`, `terminal`, `pieChart2` (donut), `circuitBoard`. Increase total count from ~28-40 to ~40-55 per side.

**4. Screen-size responsive border width** — Currently hardcoded at `110px`. Fix: compute border width dynamically based on viewport: `80px` for `lg` (1024-1279), `100px` for `xl` (1280-1535), `120px` for `2xl` (1536+). Also scale doodle sizes proportionally to canvas width so they don't overflow into content on narrower screens. The `max-w-7xl` content area is 1280px — the doodles must stay within the gap between content edge and viewport edge.

**5. Grid visible before first scroll** — Currently `drawGrid` has `if (p < 0.03) return`. Fix: always draw the grid at a base opacity (e.g., 0.03-0.04) even when scroll is 0, then intensify as user scrolls. This gives the blueprint feel from the start.

---

### Changes to `src/components/ScrollDoodles.tsx`

**genDoodles function** — Add collision avoidance:
- Track placed Y positions, skip if within 30px of any existing doodle
- Distribute yPct uniformly from 0.05 to 0.95
- Increase count range to 40-55

**drawGrid function** — Remove the `if (p < 0.03) return` gate. Draw grid at base alpha `0.03` always, scaling up with scroll.

**New doodle types** — Add `wrench`, `ruler`, `compass`, `terminal`, `circuitTrace`, `donut` draw functions and add them to the types array + dispatcher.

**Responsive canvas width** — In the component JSX and resize handler:
- Calculate `borderW` from `window.innerWidth`: `< 1280 ? 80 : < 1536 ? 100 : 120`
- Store in a ref, apply as inline style width on canvases and fade overlays
- On resize, recalculate and re-init data

**Doodle size scaling** — In `genDoodles`, scale the `size` field relative to canvas width: `size = (14 + r() * 18) * (canvasWidth / 110)` so doodles shrink on narrower borders.

**Fade overlays** — Update overlay widths to use the same dynamic `borderW` value.

### Files modified (1)
1. `src/components/ScrollDoodles.tsx` — All fixes above

