# Shelf Polish — Round 3

All edits in `src/components/AboutToProjectsBridge.tsx`.

## 1. About spine: snap-in after settle (no crossfade)

The duplicate you see is the **hero flight spine** mid-handoff (it fades from `bridge 0.985 → 1.0`) overlapping the shelf About spine (which I had also fading in over the same window). Crossfade made both visible at once — looks like two spines.

**Fix:** Stop crossfading. The shelf About stays at `opacity: 0` for the entire transition and **snaps to `opacity: 1` only when `bridge >= 1.0`** (the exact instant the flight spine reaches `opacity: 0`). One-shot guard `landedRef.about` stays so the snap happens exactly once and never re-paints — kills the original flicker without ever showing two spines.

```
opacity = bridge >= 1.0 ? 1 : 0   // single instantaneous flip at settle
```

## 2. Project spines emerge WHILE About is being shelved

Today the archive window is `0.995 → 1.0` so all spines pop in after About lands — abrupt.

**Fix:** Move the archive window to overlap the About handoff: `archWinStart = 0.92`, `archWinEnd = 1.0` (was 0.995→1.0). This means as About is still flying toward its slot, the first project spines are already emerging on the right — graceful, sequential, no pop.

- Per-spine `archSpan` shortened relative to total window so each spine still has a crisp arc (≈0.18 of the 0.08-wide window).
- Stagger still left→right dominant (`raw = c * 1.0 + r * 0.25`), so the wave reads naturally.
- Keep the "from-viewer" Z arrival (`translateZ 260 → 0`, `scale 1.35 → 1`, `rotateY 14 → 0`).

## 3. Bigger toolbox

Current: `96 × 76`. Bump to `**150 × 118**` (≈1.55× larger) — same SVG paths, just larger box.

- Wrapper `width: 150, height: 118`.
- SVG `width="150" height="118" viewBox="0 0 96 76"` — viewBox unchanged so the artwork scales uniformly with no redraw.
- Drop-shadow filter slightly stronger to match the larger footprint: `drop-shadow(0 5px 3px rgba(0,0,0,0.55)) drop-shadow(0 10px 14px rgba(0,0,0,0.35))`.

## Technical notes

- Only `src/components/AboutToProjectsBridge.tsx` changes; no other files touched.
- About-spine `pointerEvents` also flips on the same snap (`bridge >= 1.0`).
- No changes to the hero `HeroIdBadge.tsx` flight logic — its `0.985→1.0` fade now ends exactly when shelf About snaps on, so the handoff is seamless and never overlapping.