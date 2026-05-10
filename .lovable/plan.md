## Anchor lanyard to mat edge; lift card into the upper-right viewport

Two adjustments to the hero ID badge in `src/components/HeroSection.tsx`. No other files.

### 1. Strands originate at the top edge of the cutmat (full hero width)

Right now the lanyard SVG lives inside the right column and the strands start at `x = 55%`/`75%` of that narrow column. The reference shows the strands entering from the **top edge of the dark green mat** itself, far apart, sweeping diagonally down to the clip in the upper right.

Fix:
- Move the lanyard SVG + clip out of the right column and **mount them on the hero `<section>`** as an absolutely positioned overlay (`inset-0`, `pointer-events: none`, behind the headline text via `z-index` tuned so text stays readable but card is above mat).
- The `stageRef` becomes the hero section itself (or a dedicated full-bleed wrapper inside it).
- Strand start anchors recompute against the **section width**, not the column. New start points (matching the reference image): `startLeft = { x: width * 0.62, y: -8 }`, `startRight = { x: width * 0.86, y: -8 }`. Slightly negative `y` so the rope tucks under the top mat edge (bleeds off-canvas).
- Bézier control points scale with `targetY` as before — formulas unchanged, only the start anchors move.
- The right column itself shrinks back to a non-interactive spacer so the headline keeps its current width.

### 2. Card sits in the upper-right, above the headline baseline

The card currently centers vertically in the right column (`top: 55%`), so it floats around mid-hero. The reference puts it **near the top-right of the viewport**, partly bleeding past the section's right padding.

Fix:
- Position the card absolutely against the new full-bleed stage: `top: 110px`, `right: clamp(24px, 4vw, 64px)` (no `left/translate` centering — anchor from the right edge so it hugs the corner like the reference).
- Drag offsets stay relative to this rest position. Spring-back returns to the same anchor.
- Card rest rotation unchanged (`rotate(8deg)`).
- Mat shadow re-anchors under the new rest position (`top: ~310px`, `right: ~40px`, sized to ~260×40).
- `z-index` order: mat shadow (1) < strands (5) < clip (8) < card (10); all above the hero background but card stays below the fixed Assembly Header.

### Behavior preserved

- Drag, spring-back, clip rotation, woven-pattern strands, ribbon `<textPath>`, admin-editable badge fields — all unchanged.
- Strands now visibly continue past the top edge of the mat (the SVG's `overflow: visible` already allows this), giving the "ribbon hangs from off-canvas" feel.
- On mobile (`< md`) the whole stage stays hidden as before.

### Files

- `src/components/HeroSection.tsx` — restructure: hoist the lanyard SVG, clip, mat shadow, and card out of the right-column `motion.div` into a sibling absolute overlay anchored to the section. Update `updateLanyard()` start-X coefficients and the card's rest-position styles. ~40 lines moved + ~10 lines tweaked.
