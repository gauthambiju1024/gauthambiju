## Problem

The book spine currently looks 2D throughout the entire bridge because `spineSkinRef` (the perpendicular `rotateY(-90deg)` panel attached to the rotating `#book` wrapper — the only thing that gives the spine real 3D thickness as the cover swings) is hidden as soon as `bridge > 0`. From that moment, the only visible spine is `flyingSpineRef`, a flat element with no perspective rotation, so the whole closing animation reads as flat.

The fly-to-shelf transition is correct and must not change.

## Fix

Split ownership cleanly by phase:

- **Reveal + close phase** (`bridge` 0 → ~0.75, i.e. `flyT === 0`): the 3D `spineSkinRef` inside the rotating book stays visible. This restores the perpendicular spine look from before.
- **Flight phase** (`flyT > 0`): hand off to `flyingSpineRef` for the trip to the shelf slot, exactly as it works now. Hide `spineSkinRef` at that moment.

### Edit in `src/components/HeroIdBadge.tsx` (inside `applyTransform`)

1. Change the `spineSkinRef` visibility rule so it stays visible while the book is rotating/closing, and only hides once flight begins:
   - Show when `bridge === 0` OR `flyT === 0` (i.e. before the spine launches).
   - Hide once `flyT > 0`.

2. Change the `flyingSpineRef` visibility rule so it only appears at the start of flight, not from `bridge > 0`:
   - `visible = flyT > 0.001` (instead of `bridge > 0.001`).
   - This element is already a flat rendering — fine for the airborne trip, where perspective isn't readable anyway.

3. Keep all positioning math, easings, shelf-spine fade-in timing in `AboutToProjectsBridge.tsx`, and `closeT`/`flyT` windows unchanged. No other file changes.

### Why this works

The "2D" look is entirely caused by killing the perpendicular 3D panel too early. By letting it live through the rotation, the user sees the true hinged spine emerge in 3D exactly as before. The handoff to the flat flying element happens only when the cover has already finished closing and the spine is about to launch — at that point the eye is tracking motion, not perspective, so the switch is invisible.

No risk to the transition: the flying spine's start position (`startP`) is already computed to sit exactly where the in-book spine ends up after close, so the visual handover frame stays aligned.
