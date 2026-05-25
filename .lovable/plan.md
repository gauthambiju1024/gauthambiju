Goal: Replace the current hero→shelf handoff with the denser, more elegant book-file motion from the choreography preview, and ensure the spine never spins or shrinks once it is fully visible.

Scope: `src/components/HeroIdBadge.tsx` only. Home, About card, lanyard, globe, flip, shelf, and Projects shelf timings stay unchanged.

1. New choreography beats (compressed, overlapping)
   - flip: 0.44 → 0.60
   - thicken (book rotates 0→90°, closes): 0.62 → 0.76
   - unveil (spine reveal at hinge): 0.72 → 0.84
   - file (fly to shelf About slot): 0.82 → 0.96
   - settle (impact): 0.94 → 0.96
   - Bridge progress is the existing `smoothstep(0.72, 1.0, p)`; the above are remapped onto it.

2. Density layer during flip/thicken
   - Horizontal flip-swing: −3px sway peaking at the 90° edge-on moment.
   - Flip pulse: 3% `scaleY` compression at the same instant.
   - Rotate wobble: 1° tilt oscillation `sin(3πr)·sin(πr)` during book rotation, fading to 0 at both ends.

3. Book rotation easing
   - Swap `easeInOutCubic` → `easeInOutQuart` for the 0→90° close. Slower entry, committed middle, gentler landing.

4. Filing motion (drop-in math)
   - Scale eases from `baseScale` to final spine scale via `easeInOutCubic(fileT)` — the book "is carried" early, shrinks through the middle, eases into place.
   - Trajectory is a cubic bezier with a low, tight arc:
     - `c1 = start + 0.15·Δ, y = start.y − 40` (anticipation lift)
     - `c2 = start + 0.65·Δ, y = min(start.y, end.y) − 70` (decelerating hover)
   - Target uses the published shelf slot rect, adjusted so the spine's center lands on the slot center (account for spine sitting left of the cover after rotation).
   - Forward-lean during flight: `tilt += 3·sin(π·fileT)`.

5. Crisp settle
   - On impact (`fileT > 0.88`): damped spring, decay rate 5, one quick oscillation.
   - `ty += settle · 1.2`, `scaleY ·= 1 − settle·0.020`.

6. No spin / no shrink after spine is fully visible (hard rule)
   - Once `fileT ≥ 1` (or shelf handoff `k ≥ 1` at bridge ≥ 0.96): freeze the flying spine — clear all transforms except final translate, lock `scaleX = scaleY = fileTargetScale`, zero tilt/wobble/lean.
   - Stop the per-frame book rotation, flip pulse, wobble, and any scale interpolation. The shelf's static About spine fades in over the last 0.04 of bridge exactly as today; the flying spine fades out simultaneously with no further geometry changes.
   - Lanyard layer stays `display:none` for the whole bridge (already in place) so no white line returns.

7. Helpers
   - Add `bezierCubic(p0,p1,p2,p3,t)` inline in the per-frame loop (no new files).
   - Reuse existing `clamp`, `smoothstep`, `easeInOutCubic`; add a local `easeInOutQuart`.

Out of scope: no changes to data, routes, Projects shelf layout, About content, drag behavior, or any other component.