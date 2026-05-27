I understand the issue now: the remaining “blank frame” is not just opacity timing — it is caused by switching between two different DOM/rendering systems: the real 3D book spine (`spineSkinRef`) and the separate fixed-position flying spine (`flyingSpineRef`). Even if opacity is full, they do not render as identical pixels because they have different dimensions, transform origins, 3D context, and scale math.

Plan:

1. Eliminate the risky visual handoff during the close/launch moment.
   - Keep the real 3D about-book spine as the single visible spine through the close and launch.
   - Stop showing `flyingSpineRef` at the start of the flight.

2. Move the actual book/card wrapper into the flight path instead of swapping to a separate flying spine.
   - Once the book is closed, animate `cardWrapRef` itself from the closed-spine position toward the shelf slot.
   - During this phase, hide the cover/pages so only the about spine remains visible.

3. Keep the spine visually 3D at the beginning.
   - The existing real book spine remains `rotateY(-90deg)` inside the 3D book, so it keeps the current 3D look at launch.
   - As it flies, reduce/remove excess depth only after the launch is past, so the first frame does not flatten abruptly.

4. Use `flyingSpineRef` only if needed at the very end near the shelf, not during launch.
   - If a final shelf-size alignment helper is still necessary, it will only appear after the real spine is already essentially landed.
   - No midair/launch overlap, no partial opacity, no blank gap.

5. Keep the scope limited to `src/components/HeroIdBadge.tsx`.
   - Do not touch shelf layout, scroll timing outside this component, `AboutToProjectsBridge.tsx`, or project shelf behavior.

Technical target:
- Replace the current `cardWrap` opacity hide + `flyingSpineRef` launch with a single-spine choreography.
- The spine owner remains the 3D book DOM during the problematic frame range, removing the source of mismatch entirely.