# Project Spine Landing — Polish Pass

Four targeted fixes in `src/components/AboutToProjectsBridge.tsx` (plus a small CSS tweak for shelf thickness). No business logic changes.

## 1. Remove About-spine flicker

**Root cause:** The archive (project-spine drop) window currently starts at `bridge = 0.965`, but the About spine only fades in at `bridge = 0.985`. During that 0.965 → 0.985 gap the flight spine (owned by the hero handoff) is finishing its travel while the shelf About slot is still invisible — and on every RAF frame we re-write `aboutSpineRef.style.opacity` from the same formula, so any 1-frame race with the flight spine's own opacity write produces a visible flicker. Project spines also begin dropping *before* About is locked in, which visually competes with the landing.

**Fix:**
- Hold the project-archive window until *after* About is fully landed: `archWinStart = 0.99` (was `0.965`), with About reveal moved slightly earlier to `0.975 → 0.99` so it is fully opaque before any sibling moves.
- Stop re-writing `aboutSpineRef.style.opacity` once it has reached 1. Track a `landed` flag in a ref; once `k >= 1` we set opacity to `1` one time and skip further writes (prevents fighting the flight-spine's final frames).
- Same one-shot guard for `slot.style.opacity` and `pointerEvents`.

## 2. Spines appear left → right after About lands

Current ordering uses `raw = r * 1.0 + c * 0.18` — every row starts at the same time as About lands, so the eye sees a near-simultaneous pop.

**Fix:** Order purely by global column index (left → right), with rows offset by a small constant so upper rows still lead slightly:
```
raw = c * 1.0 + r * 0.25   // left→right dominant, rows trail by 0.25 step
```
Stagger span (`archSpan`) shortened per-spine to ~0.35 of window so the wave is crisp, and total stagger spreads across the remaining 0.65.

## 3. Front-to-back 3D landing (replace top-down drop)

Match the About-spine handoff feel: spines arrive *from depth*, not from above.

**Fix (transform only — no DOM changes):**
- Add `perspective: 800px` on each row's spine container so child transforms get real depth.
- Per-spine initial state: `translateZ(-220px) scale(0.55) rotateY(-22deg)` with `opacity: 0`.
- Animate to `translateZ(0) scale(1) rotateY(0)` with `opacity: 1`, using a cubic-out ease on Z/scale and a tiny overshoot on `rotateY` (`-22 → +4 → 0`).
- Remove the `translateY(-160%)` drop and the `rotate(-6deg)` tilt entirely. Same treatment for the toolbox so it lands consistently.

Result: each spine "pushes forward" out of the shelf plane, mirroring the About-spine arrival vector.

## 4. Shelf thickness so spines/toolbox don't float

Current ledge is a 1px SVG stroke — spines visually sit on a line.

**Fix:** Wrap each ledge with a thin wooden-plank look:
- Increase ledge wrapper height from `14` → `18`.
- Behind the existing SVG rule, render a 6px-tall bar using the same ink color at low opacity, with:
  - top edge highlight: `inset 0 1px 0 rgba(255,255,255,0.06)`
  - drop shadow under the plank: `0 2px 4px rgba(0,0,0,0.45), 0 6px 10px -4px rgba(0,0,0,0.35)`
  - subtle vertical front-face gradient (`hsl(38 40% 18%) → hsl(38 35% 10%)`) to read as a board edge.
- The SVG rule keeps its draw-on animation as the *top edge* of the plank.
- Spines/toolbox `align-items: end` is unchanged, so they now visibly rest on the plank's top surface; the shadow grounds them.

## Technical notes

- All changes are visual/animation. No data, routing, or component-API changes.
- The "landed" guard uses a `useRef<{about:boolean; slot:boolean}>` initialized to `false`; reset on unmount via the existing cleanup.
- Perspective lives on the row's spine-row flex container (one per row) so toolbox shares it.
- Keep `willChange: "transform, opacity"` on each spine wrapper.
- Existing draw-in animation for the ledge path is untouched.