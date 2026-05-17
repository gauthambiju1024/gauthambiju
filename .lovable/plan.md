
# About → Projects: Dossier-fold transition

Adopt the uploaded prototype's 5-phase choreography for the About ID card filing itself onto the Projects shelf, but rebuilt with the site's existing components, tokens, and assets — no extra chrome (constellation, dock, "filing this away" captions). The current bridge already owns scroll, slot publishing, and the live ProjectSpine row; this plan refactors the fold + landing math and adds the globe-collapse and archive-rise beats.

## Choreography (local bridge progress `b`, mapped from `progressMV` 0.55–1.0)

```
P1  TRIFOLD   0.00 – 0.32   wings rotateY ±178° behind center panel
P2  TURN      0.20 – 0.50   whole packet rotateY -180°, revealing spine
P3  COLLAPSE  0.30 – 0.60   AboutGlobe flattens + streaks onto shelf line
P4  DRAW      0.46 – 0.74   shelf line strokes L→R (already exists, retimed)
P5  FILE      0.58 – 0.86   spine arcs into the About slot, scales to slot
P6  ARCHIVE   0.74 – 1.00   adjacent ProjectSpines rise from below (eBack)
```

Easings: `eInOut` for fold/turn/collapse, `eOut` for seed streak, `eBack` for spine rise.

## Files & responsibilities

**`src/components/HeroIdBadge.tsx`** — refactor existing fold logic to true 3-panel trifold + packet turn.
- Replace the current single-`cardWrap` scaleX/scaleY shrink with three real panels (`pL`, `pC`, `pR`), each 1/3 of card width, `transform-style: preserve-3d`, hinge origins `right center` / `left center`. Each panel's `.front` clones the existing About card content offset by `-panelIndex * panelWidth` so it reads as one continuous face pre-fold.
- Add a `vol` wrapper around the 3 panels. Apply `rotateY(-180 * tTurn)` to `vol` for P2.
- Center panel's back face = spine skin: walnut/teal gradient using site tokens (`hsl(170 25% 28%)` body, gold cap `hsl(38 60% 52%)`), vertical `Playfair Display` "ABOUT" label, mono "2026" / "PORTFOLIO", thin tick — matches `ProjectSpine` visual language so the landed spine reads identical to its shelf neighbors.
- FILE arc: compute current card center → `__bridgeSlotRect` center, lerp with `eInOut(tFile)` plus `sin(tFile*π)*-60px` arc lift; scale to `SPINE_WIDTH/cardW`, `SPINE_HEIGHT/cardH` over the same window. Remove the current `tFold` scaleX/scaleY (now handled by real geometry + final FILE scale).
- Drop the now-redundant `foldSeamsRef` color crease shadow code; trifold geometry replaces it.
- Lanyard fades out by end of P1 (already does, retime to `1 - tFold`). AboutCardBack content fade-out retimed to P1 (0.00–0.18).
- Globe layer hand-off: at P3 start, hide `globeLayerRef` and unmount-style fade — the bridge owns the collapse visual (see next file).

**`src/components/AboutToProjectsBridge.tsx`** — own COLLAPSE + ARCHIVE beats, keep the minimal shelf line.
- Add an internal `collapseGlobeRef` overlay that mirrors the AboutGlobe's screen rect at P3 start (read once from `globeLayerRef` bbox via a shared `window.__aboutGlobeRect`), then transforms: `translate(gx, gy) scale(lerp(1,1.9,c), lerp(1,0.014,c))` toward the shelf line midpoint, fading at `c > 0.82`. Use a simple radial-gradient div in site tokens (`hsl(40 25% 92%)` core, walnut rim) — no DOM globe duplication.
- Add `seedsRef`: 24 `<i>` particles seeded at globe rim, animated outward in arc (`-sin(t*π)*bow`) to scattered points across the shelf-line strip, fade `0.9 → 0.32`. Stage-level, `pointer-events:none`.
- Retime the existing `tLedge` (shelf line draw) to `ease(0.46, 0.74, b)` to match P4.
- ARCHIVE: each `ProjectSpine` in the spines row already has the rise-in `translateY((1-k)*8px)`. Replace with `eBack` curve over `0.74 → 1.00`, staggered by `col*0.04`, rising from `135%` like the prototype (still inside the row's `overflow:visible` container — clip with a row-level `overflow:hidden` wrapper bottom-anchored, so spines emerge from beneath the line).
- Publish `window.__aboutGlobeRect` from `HeroIdBadge` each frame (cheap getBoundingClientRect on `globeLayerRef`).
- Keep `aboutSlotRef` placeholder reveal at `b ≥ 0.998` (real card lands first).

**`src/components/HeroAboutFlip.tsx`** — no structural change. Confirm `progressMV` passes through and bridge stage height (340vh) accommodates the new sub-beats; if motion feels rushed at 1001×769, bump to 360vh.

## Site-consistency rules (non-negotiable)

- All new colors from existing tokens (`--paper`, `--ink`, `--shelf-wood-*`, walnut/teal HSLs already in use). No new HSL literals outside the spine/globe gradients already established.
- Typography on spine label: `font-serif-display` (Playfair) for "ABOUT", `font-mono` (JetBrains) for year/sub — matches `ProjectSpine`.
- No captions, dock, slider, hint text, or constellation background — those belong to the standalone demo.
- All animation via direct DOM mutation in the existing `requestAnimationFrame` loop. Zero new React state, zero re-renders.
- `prefers-reduced-motion`: skip P1–P3 entirely, snap to landed state (spine in slot, shelf line drawn, neighbors visible).

## Technical details

- Panel geometry: `cardW = card.offsetWidth` (260), `panelW = cardW/3 ≈ 86.67px`. Hinges: `pL` origin `100% 50%`, `pR` origin `0% 50%`. Wing rotation max 178° (not 180°) to preserve subtle z-stacking and avoid backface flicker.
- `vol` flip uses `backface-visibility: hidden` on `.pf.front` so the spine back is the only thing visible after turn.
- FILE target: read `__bridgeSlotRect.cx/cy` (already published every frame). Scale targets: `KX_END = SPINE_WIDTH / cardW`, `KY_END = SPINE_HEIGHT / cardH`. Compose with existing `dxToCenter/dyToCenter` so the FILE motion picks up from wherever P2 left the card.
- Globe collapse div: 420×420 absolute, `border-radius: 50%`, `transform-origin: 50% 50%`. Uses `__aboutGlobeRect` for initial position so it matches the real globe pixel-for-pixel at hand-off.
- Seeds: created once on mount, transforms updated per frame; targets are random points along `y = shelfLineY, x ∈ [bandLeft, bandRight]`.
- ProjectSpine rise clip: wrap spines row in a `div` with `overflow: hidden; height: SPINE_HEIGHT + 12px`. Bottom-anchored so `translateY(135%)` hides them below the line.

## Verification (1001×769)

Capture 6 frames at `b = 0.10, 0.28, 0.45, 0.62, 0.80, 0.99`:
1. Wings folding behind, center face still cream
2. Packet rotating, spine edge emerging
3. Spine front, globe flattening into a streak
4. Shelf line drawn, spine mid-arc with lift
5. Spine landing in slot, neighbors starting to rise
6. Full shelf populated, spine seated, identical to neighbors

Confirm no layout shift on the rest of `Index.tsx`, no console errors, and that the About nav link still lands on the flipped state.
