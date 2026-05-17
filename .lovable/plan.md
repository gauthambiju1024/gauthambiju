Fix `HeroIdBadge.tsx` so the animation has two strict, visible phases:

1. Fold phase: solid cream only
- The back/About card content fades out before folding starts.
- Replace the sliced About-card surfaces inside the folding packet with plain cream panels.
- Keep the 25/50/25 geometry, but make the folded result visually one solid cream packet.
- Correct the inward hinge directions: left flap rotates inward from its right edge, right flap rotates inward from its left edge.
- Avoid showing any green spine, About content fragments, or backside seams during this fold.

2. Flip phase: one packet, then full green spine
- After the flaps finish folding, rotate the whole folded packet container as one unit.
- Do not rely on the shelf handoff to reveal the spine.
- Put the `ProjectSpine` on the packet’s back face and make it visible during the packet flip once the turn passes 90°.
- Ensure the spine face is the same visible packet footprint before shrink/fly, so the user sees a full green ABOUT ME spine during the flip, not only after placement on the shelf.

Technical adjustments
- Add explicit z-index/translateZ layering so cream flaps draw over the center while folding.
- Add a spine face ref and drive its opacity from the turn phase: hidden until the packet passes 90°, visible immediately after.
- Keep current bridge timing, shrink-to-spine size, fly-to-shelf path, lanyard fade, globe fade, and shelf handoff unchanged.
- Only edit `src/components/HeroIdBadge.tsx`.