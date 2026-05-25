Corrected final plan:

1. **Remove the fake replacement spine behavior**
   - Stop showing a separate “flying spine” after the side spine disappears.
   - The card-side About spine must not appear, vanish, then be replaced.

2. **Use one continuous visible spine from the card side onward**
   - Create one overlay About spine that is visible as the actual side spine while the book/card closes.
   - It starts exactly where the side spine is: same position, same size, same artwork.
   - When filing begins, that same visible spine continues moving into the shelf.

3. **Hide the old internal side-spine renderers**
   - `spineSkinRef` / `closedSpineRef` should no longer visibly render as independent spines.
   - They can remain only as geometry/reference if needed, but not as visible elements.
   - This removes the “appears then disappears” phase.

4. **Keep the same size throughout**
   - The continuous About spine stays `28px × 200px` from the moment it becomes visible through final landing.
   - No width reduction, no scale pop, no sudden new size.

5. **Keep the filing motion, but start it from the real side-spine location**
   - At the filing start, capture the current screen position of the visible side spine.
   - Use that as the bezier start point.
   - Continue the existing smooth filing arc to the shelf slot.

6. **No crossfade, no second About spine**
   - The shelf duplicate About spine stays hidden.
   - The continuous spine remains visible and clickable after landing.

Files to update:
- `src/components/HeroIdBadge.tsx`
- `src/components/AboutToProjectsBridge.tsx`