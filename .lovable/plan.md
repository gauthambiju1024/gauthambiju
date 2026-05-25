## Goal

From the moment the large green spine is fully visible (current end state in screenshot), animate ONLY that spine with a simple, elegant natural fall to its shelf slot while shrinking from its current "book" size down to the regular project-spine size. Nothing else changes.

## Scope (strict)

- No changes to Home, About, card flip, book-close, lanyard, globe, or anything before the spine becomes visible.
- No changes to the shelf, About slot position, ledges, project spines, toolbox, or AboutToProjectsBridge.
- Only the flying-spine segment inside `HeroIdBadge.tsx` is touched.

## What changes in `src/components/HeroIdBadge.tsx`

Inside the `flyT` block where the flying spine moves to the slot:

1. Replace the current linear `lerp(start → target)` + constant size with a natural-fall motion:
   - X: ease-out horizontal drift from start X to slot X (gentle, no overshoot).
   - Y: gravity-style fall — `y = start + (target - start) * t^2` (quadratic accel), so it falls slowly, then settles.
   - End exactly at the existing slot center (`fileTargetRef.targetCx/Cy`) so the invisible handoff to the shelf's About spine still lines up frame-perfectly.

2. Shrink the spine from current visible size to project-spine size during the fall:
   - Start width = current visible spine width (the "book spine" size shown in the screenshot).
   - End width = `ABOUT_SPINE_W` (28) — same as the shelf About slot, so the handoff has zero pop.
   - Apply via CSS `transform: translate3d(x,y,0) scale(s)` with `transform-origin: top center` so the shrink reads as the spine settling into the slot, not jumping.
   - Height scales with the same factor; the shelf About spine already matches `SPINE_HEIGHT`, so final scale = `ABOUT_SPINE_W / startWidth` (and same for height ratio if they differ — use a single uniform scale based on width to keep proportions clean).

3. Keep the existing fade-in at handoff start and fade-out at `flyT` end (0.92→1.0) so the shelf About spine takes over invisibly. No other opacity changes.

4. Remove only the white-line artifact source: ensure the flying spine wrapper has no border / box-shadow / outline and no residual lanyard clip is rendered during the fall (the lanyard layer is already faded by `bridge > 0`; just confirm no stray 1px element on the flying spine itself). No deletion of lanyard markup — just guarantee zero visible chrome on the falling spine.

## Technical notes

- File: `src/components/HeroIdBadge.tsx` only.
- Easing: `xT = 1 - (1 - flyT)^2` (easeOutQuad) for X; `yT = flyT^2` (easeInQuad / gravity) for Y.
- Compute `startWidth` once at handoff (when `fileTargetRef.current` is first set) by reading the rendered flying-spine box, then drive scale per frame.
- No new refs, no new DOM, no changes to `ProjectSpine`, `AboutToProjectsBridge`, or any CSS file.

## Out of scope

- Bounce, rotation, tilt, squash-and-stretch, particles, sound, or any secondary motion.
- Any timing-window changes to `bridge`, `closeT`, or `flyT` boundaries.
