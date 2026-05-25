## Root cause
The flying spine's text is rendered vertically (`writing-mode: vertical-lr`). Because the spine's `scaleY` is animated from ~1.9 down to 1.0 during flight, the letters get squished horizontally as they move. The landing settle also multiplies `scaleY` by a brief oscillation (`1 - settle * 0.02`), which makes the font visibly reduce then increase right at landing.

## Fix (HeroIdBadge.tsx only)
- Remove the `scaleY` lerp; keep scaleY = 1 throughout the flight.
- Remove the `scaleY *= 1 - settle * 0.02` line from the landing settle (keep the small vertical `cy` sink so the impact still reads).
- scaleX stays at 1.
- Bezier arc, forward lean, and fade-in/out unchanged.

Result: the spine renders at the exact shelf size and font from the first handoff frame to landing — no width/font drift.

## Out of scope
Shelf, About slot, ProjectSpine, timing windows.