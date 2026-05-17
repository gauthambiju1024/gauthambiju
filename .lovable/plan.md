Fix only `src/components/HeroIdBadge.tsx` so the animation reads as a real folded packet:

1. Make the fold visually dimensional again
   - Keep the 25% / 50% / 25% tri-fold geometry.
   - Add real front/back faces to each flap instead of single flat panels.
   - During the fold, both flaps fold inward onto the front/center, with visible cream faces only.
   - Add subtle cream shading on fold edges so it looks folded, not like pieces disappearing or flattening.

2. Remove the broken opacity swap
   - Stop crossfading the whole cream packet to the spine, because that makes the fold look fake/flat.
   - Use proper 3D backface visibility: the cream folded packet is the front face; the green spine is the back face of the same rotating packet.

3. Make the full green spine appear during the flip, before shelf placement
   - Put the spine face directly behind the folded packet with `rotateY(180deg)` and full back-face visibility behavior.
   - Rotate the entire `volRef` packet as one unit.
   - Before 90°: user sees only the folded cream packet.
   - After 90°: user sees the full green ABOUT ME spine, not half spine and not only after landing on the shelf.

4. Preserve everything else
   - Keep the existing hero-to-about flip timing, lanyard/globe fade, shrink, fly-to-shelf path, and shelf handoff unchanged.