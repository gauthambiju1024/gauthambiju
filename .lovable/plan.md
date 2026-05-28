# Shelf Polish — Round 2

All edits in `src/components/AboutToProjectsBridge.tsx`. No data/logic changes.

## 1. Kill the duplicate About spine

**Root cause:** the hero flight spine (`HeroIdBadge.tsx` line 327) fades out across `bridge 0.985 → 1.0`. My previous patch moved the shelf About reveal earlier to `0.975 → 0.99`, so for ~10% of the window both are fully opaque side-by-side. That's the second spine you see.

**Fix:** Re-align the shelf About reveal *exactly* to the flight handoff window — `0.985 → 1.0` — so the two crossfade rather than overlap. Keep the one-shot `landedRef.about` guard so we still avoid the original 1-frame flicker after settle. Move the project archive window after that: `0.995 → 1.0` (very crisp, since project spines kick in only once About is fully owned by the shelf).

## 2. Spines arrive FROM the viewer (not from depth)

Reverse the Z direction so spines fly *out of the screen toward the shelf*, settling into the plane.

- Initial: `translateZ(260px) scale(1.35) rotateY(14deg)` opacity `0`.
- End: `translateZ(0) scale(1) rotateY(0)` opacity `1`.
- Keep cubic-out easing on Z/scale and the small overshoot on rotateY (`14 → -3 → 0`).
- Keep `perspective: 800px` on the row container so the depth reads.

## 3. Toolbox actually rests on the plank

Two issues — its built-in SVG ground shadow sits *inside* the SVG viewbox above its feet, and there is no contact shadow on the plank surface.

- Drop the toolbox's internal `<ellipse>` shadow.
- Add a CSS contact shadow on the toolbox wrapper: `filter: drop-shadow(0 3px 2px rgba(0,0,0,0.55)) drop-shadow(0 6px 8px rgba(0,0,0,0.35))`.
- Shift the toolbox SVG down by 2px (`marginBottom: -2px`) so its feet visually press into the plank's top edge.
- Apply the same drop-shadow filter to each project spine wrapper for consistent grounding.

## 4. Shelf line + plank both animate left → right (in sync)

Today the SVG line draws from center outward and the plank just appears statically.

- Change the SVG path to a single left→right stroke (`M 0 1 L 1180 1`) drawn by dashoffset.
- Animate the plank's `width` from `0%` → `100%` (left origin) over the *same* per-row window using `transform: scaleX(...)` with `transform-origin: left center` — GPU-cheap, no layout thrash.
- A new `plankRefs` array tracks each plank `<div>`; inside the existing draw loop we set `el.style.transform = scaleX(e)` using the same eased value already computed for the line.

## 5. PROJECTS header becomes a top shelf

Replace the current centered "— PROJECTS —" rule with the same plank component used for category shelves (left→right draw, same thickness/shadow), labeled `PROJECTS`. Treat it as `rowIndex = -1` (or a separate `headerPlankRef`) so it draws first, slightly ahead of the category planks (`drawWinStart - 0.04`).

## Technical notes

- New refs: `plankRefs: useRef<HTMLDivElement[]>` (one per category row) and `headerPlankRef`.
- Draw loop already iterates `rulePathRefs`; extend each iteration to also write `plankRefs.current[i].style.transform = scaleX(e)`.
- Header plank uses its own `start/end` window (`0.70 → 0.78`) so the top shelf appears just before the category shelves cascade.
- Spine + toolbox initial inline styles updated to the new positive-Z transform; archive loop updated to lerp `Z: 260→0`, `scale: 1.35→1`, `rotateY: 14→-3→0`.
- No changes to `HeroIdBadge.tsx`, `ProjectSpine.tsx`, routing, or data hooks.