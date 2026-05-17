# Real-card fold → drawn shelf with project spines

## Goal

1. The **actual** flipped About card (the one the user just read on the back) folds in place — not a clone. As scroll continues past the flip, the same DOM card tri-folds, rotates to a spine, drops, and parks on a shelf.
2. The shelf is a **single drawn warm-wood line** (no thick plank, no construction marks) that draws itself in left→right with scroll.
3. The folded About spine lands on the shelf next to **project spines** that fade/draw in as the shelf line completes, previewing the Projects section that follows directly below.

## What changes

### 1. `HeroIdBadge.tsx` — make the real card foldable

- Wrap the existing back-of-card content (`AboutCardBack`) in an inner `<div ref={cardInnerRef}>` so it can be hidden once folding begins.
- Add three sibling **flap overlay** divs absolutely positioned over the card (left 0–33.3%, center 33.3–66.6%, right 66.6–100%), each with the cream paper background + faint grid that already exists on the back. Refs: `flapLeftRef`, `flapCenterRef`, `flapRightRef`. `transform-origin: right center / center / left center`. Initially `opacity: 0`, `pointerEvents: none`.
- Bridge progress drives them directly (same window flag pattern already in place):
  - `tFold = ease(0.10, 0.40, bridge)` — flap overlays fade in across the first ~5% of bridge, then `flapLeft.rotateY(+tFold·88°)`, `flapRight.rotateY(-tFold·88°)`. `cardInnerRef.opacity = 1 - smoothstep(0, 0.10, bridge)` so the back content hides cleanly before any rotation is visible.
  - `tRot = ease(0.40, 0.66, bridge)` — apply `scaleX(1 - tFold·0.88) rotateY(tRot·90deg)` to the whole `cardWrap`, and lerp its background from cream `hsl(40 25% 92%)` → walnut `hsl(28 32% 24%)`. (This happens *in addition to* the existing flip `rotateY(180)`, so it composes naturally.)
  - `tDrop = smoothstep · ease(0.66, 1.0, bridge)` — translateY the cardWrap downward to land on the shelf line (target Y computed from the shelf's `getBoundingClientRect` so it always meets the line precisely).
- All other existing behavior (drag, lanyard fade, globe fade, stage pinning via `__bridgeActive`) is unchanged.

### 2. `AboutToProjectsBridge.tsx` — drop the clone, build the shelf

- Remove the entire folding-clone subtree (`cloneRef`, `slabRef`, `FlapPanel`, `lerpHsl`, `cardViewportRect`). The bridge no longer renders any "card" — only the shelf.
- Keep publishing `window.__bridgeActive` and `window.__bridgeProgress` exactly as today; `HeroIdBadge` reads them.
- Render a **minimalist drawn shelf**: one `<svg>` with a single warm-wood `<path>` (1.5px stroke, `hsl(28 35% 28%)`, rounded caps) spanning `min(78vw, 1040px)` centered, positioned ~22% from bottom. Animate `stroke-dashoffset` from full length → 0 across `ease(0.55, 0.92, t)`.
- **Project spines**: render 6–7 thin vertical rectangles sitting on the shelf line (positioned absolutely on top of the SVG, baseline aligned to the shelf), in muted spine colors reused from `ProjectsShelf.SPINE_COLORS` (walnut, sage, oxblood, navy, olive, terracotta, plum). Each spine is ~10–16px wide, 70–100px tall, with subtle linen texture and `box-shadow: 0 -2px 4px rgba(0,0,0,0.25)`. They fade + slide in one-by-one as the shelf line draws past them — each spine has its own `appearAt = 0.60 + i·0.05`, opacity = `ease(appearAt, appearAt+0.06, t)`, with a small `translateY(6px → 0)`.
- Leave a deliberate **empty slot** at the right end of the lineup (slightly taller, ~120px) — this is where the folded About card lands. The card's drop target Y in `HeroIdBadge` is computed from this slot's rect.
- No plank, no construction marks, no captions. Just the line + spines + the incoming About spine.

### 3. Files untouched

`HeroAboutFlip.tsx`, `HeroSection.tsx`, `AboutSection.tsx`, `AboutCardBack.tsx`, `ProjectsShelf.tsx`, `AssemblyHeader.tsx`, `Index.tsx`, ID-card front, hero portrait, all desk frames.

## Timeline (bridge progress `t`)

```text
0.00 ─ 0.10  globe + lanyard already faded; back-content of card fades out;
             flap overlays fade in over the card face
0.10 ─ 0.40  tri-fold: left/right flaps rotateY ±88°
0.40 ─ 0.66  cardWrap scaleX→0.12 + rotateY 0→90°; bg cream → walnut
0.55 ─ 0.92  shelf line draws L→R
0.60 ─ 0.95  project spines fade/rise in, staggered along the drawn line
0.66 ─ 1.00  folded card drops onto its slot at the right end of the shelf
```

## Performance

Single window scroll listener + rAF in the bridge (already in place). Spine appearance and shelf draw read the same `t` already computed — zero React re-renders, all direct ref mutation. `HeroIdBadge`'s existing per-frame loop branches on `__bridgeActive` (already added) and now also reads `__bridgeProgress` to drive flap rotateY / scaleX / cardWrap drop.
