## Goal
Two tweaks to the existing flying-spine handoff in `src/components/HeroIdBadge.tsx`. Nothing else changes.

## 1. Width stays constant during the fly
- The spine renders at the final shelf width from the very first handoff frame and never scales in X.
- Only height shrinks toward the shelf project-spine height.
- The visible width on screen at handoff start matches the destination slot width, so there is no width pop and no width animation.

## 2. Bezier arc + impact settle + flight lean
Replace the current straight ease-in-out translate with a low, committed arc and a small landing recoil:

- Cubic bezier path from the measured start point to the slot target, with two control points biased to a low tight arc (gentle lift early, hover-decelerate late).
- Single damped-spring settle in the last ~12% of the motion: brief vertical sink and slight vertical compression that decays sharply.
- Subtle forward lean during flight that peaks mid-arc and returns to 0 at landing (small rotation on the flying spine wrapper).

All easing uses cubic ease-in-out matching the snippet the user provided. The damped settle uses the same exponential decay + single sine wave formula.

## Out of scope
- No changes to Home, About, card flip, book-close, lanyard, shelf, project spines, or any timing windows.
- No new DOM, no new refs, no CSS file changes.
- No change to where the spine starts or where it lands — only how it travels and that the width holds steady.

## File
- `src/components/HeroIdBadge.tsx` only.