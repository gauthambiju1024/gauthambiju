## Goal

Replace the current jittery ID-card fold with the **exact choreography from the bookmarked preview** (commit `34092b17`'s `AboutToProjectsBridge`) — but applied to the **ID card itself**, not the blueprint slab. Keep everything in the same pinned `HeroAboutFlip` viewport.

## Reference choreography (verbatim from bookmark)

```
A 0.00–0.15  Settle    object visible, "Filing this away." caption fades in
B 0.15–0.45  Tri-fold  left/right flaps rotateY ±88°, scaleX 1 → 0.12
                       center crease shadow darkens 0.15 → 0.40
C 0.45–0.70  Rotate    rotateY 0 → 90°, color lerps from source → spine tone,
                       vertical spine label fades in
D 0.70–1.00  Land      translateY → 18vh (smoothstepped), drawn ledge sweeps
                       L→R via strokeDashoffset, tick marks + dim brackets +
                       "SPINE_01 · W:78mm" / "REV: A · 2025" fade in,
                       bottom caption "Selected work — pull a spine." fades up
```

Easing helpers:
```
clamp01(x) = min(1, max(0, x))
ease(a,b,t) = clamp01((t-a)/(b-a))
smooth(t) = t*t*(3-2*t)
```

These phase numbers (`0.00–0.15 / 0.15–0.45 / 0.45–0.70 / 0.70–1.00`) are applied to the **fold-stage local progress**, which is itself `ease(0.55, 1.0, parentProgress)` of the `HeroAboutFlip` pin (Hero settle owns 0.00–0.55).

## What changes

### 1. `src/components/HeroIdBadge.tsx` — replace fold/drop section

Strip the current trifold/shrink/drop math (`tFold`, `tShrink`, `tDrop` blocks, `foldLeftRef/foldCenterRef/foldRightRef`, `spineSkinRef`, scaling-to-spine logic). Replace with three rigid panels and a single transformed wrapper that follows the bookmarked math, scoped to the **ID card's own dimensions** (≈ `260 × 380`):

- Wrap the full card in `cardSlabRef` with `transformStyle: preserve-3d`, `perspective: 2200px` on its parent.
- Render three `FlapPanel`s (left / center / right, each `33.33%` wide) that **carry the existing ID-card front-face content** (portrait, name, role, ribbon, paper grain). The front face is split into thirds via `clip-path: inset(0 66.66% 0 0)` / `inset(0 33.33% 0 33.33%)` / `inset(0 0 0 66.66%)` so the same artwork stays continuous across the seams.
- Flap transforms: left `rotateY(+flapAngle)` origin `right center`; right `rotateY(-flapAngle)` origin `left center`; center stays flat. `flapAngle = tFold * 88`.
- Center crease shadows: `inset 8px 0 14px -8px rgba(0,0,0,${0.15+tFold*0.25}), inset -8px 0 14px -8px rgba(0,0,0,${0.15+tFold*0.25})`.
- Slab transform: `translateY(${tDrop*18}vh) scaleX(${1 - tFold*0.88}) rotateY(${tRot*90}deg)`.
- Color lerp: backFace background lerps from the ID-card cream/paper to spine tone (`hsl(170 25% 28%)` = SPINE_COLORS[0]) using `smooth(tRot)`.
- Vertical spine label (`writing-mode: vertical-rl`, `Projects · 2022—Now` or the card's name) fades in over `ease(0.55, 0.8, t)`.
- Keep the lanyard string above untouched until tFold > 0, then fade it out over `ease(0.10, 0.30, t)` so it doesn't fight the fold.

### 2. `src/components/AboutToProjectsBridge.tsx` — adopt bookmarked captions + ledge

Around the existing shelf, layer the bookmarked decoration so the card lands into the same visual frame as the reference:

- Top caption `Filing this away.` (font-handwritten, fades 1 → 0 over `ease(0.0, 0.25, t)`).
- Mono sub-label `FOLD · ROTATE · SHELVE` under it.
- Drawn ledge SVG with `strokeDashoffset` draw-in over `ease(0.74, 1.0, t)`, tick marks group fading with the same range.
- Dimension marks layer: top-left + top-right brackets, `SPINE_01 · W:78mm`, `REV: A · 2025`, center datum `⌖`, fading in over `ease(0.82, 1.0, t)`.
- Bottom caption `Selected work — pull a spine.` fades up over `ease(0.86, 1.0, t)`.
- The live `ProjectSpine` shelf row keeps rendering, but its `aboutSlotRef` placeholder reveals only at `ease(0.998, 1.0, t)` so the moving card's landed spine reads as the About slot — no swap.

All driven from the existing `progressMV` (no separate scroll listener), refs only, no React re-renders.

### 3. `src/components/HeroAboutFlip.tsx`

No structural change. Confirm `scrollYProgress` is passed to both `HeroIdBadge` and `AboutToProjectsBridge` and that the pin height stays `340vh`.

### 4. `.lovable/plan.md`

Replace with a short note: canonical fold = bookmarked choreography applied to the ID card; phases A/B/C/D are owned by `HeroIdBadge`, captions + ledge + dim marks by `AboutToProjectsBridge`.

## Verification at 1001×769

Scroll through the pin and confirm four frames match the bookmarked reference:
1. ID card resting, `Filing this away.` + `FOLD · ROTATE · SHELVE` visible above it.
2. Mid tri-fold — ID card visibly creased into three panels with edge shadow, no premature fade.
3. Rotated spine — card is a thin vertical spine, color shifted to walnut/teal, vertical label visible.
4. Landed on drawn ledge — dim brackets, `SPINE_01 · W:78mm`, `REV: A · 2025`, bottom caption present; live shelf spines flank it.

## Files touched

- **edit** `src/components/HeroIdBadge.tsx` — swap fold/drop logic for the bookmarked slab math, scoped to card dimensions.
- **edit** `src/components/AboutToProjectsBridge.tsx` — add top/bottom captions, drawn ledge, dim marks; gate shelf-slot reveal to the very end.
- **edit** `.lovable/plan.md`.
