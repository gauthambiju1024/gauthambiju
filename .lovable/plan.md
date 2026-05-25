Final plan:

1. **Use one continuous About spine element for the whole handoff**
   - Keep the existing `ProjectSpine` visual, but make the hero “flying spine” become the only visible About spine during the card-to-shelf transition.
   - The shelf About spine will stay hidden during arrival, so there is no crossfade, double image, or width pop.

2. **Preserve the new perfect motion**
   - Keep the compressed flip, thicken, unveil, bezier filing arc, and crisp settle timing already added.
   - Only adjust identity/visibility at the landing stage, not the motion choreography.

3. **No spin or geometry changes once the spine is fully visible/landed**
   - At the end of the file motion, lock the spine to the shelf slot with fixed translate, fixed width/height, fixed scale, and `rotate(0deg)`.
   - Remove any fade-out/shrink/scale interpolation after landing.

4. **No crossfade**
   - The hero flying spine will remain visible after it lands and become the clickable “MORE ABOUT ME” shelf spine.
   - The shelf’s duplicate About spine renderer will be hidden/non-interactive to avoid crossfade and duplication.

5. **Make the landed spine usable**
   - After the bridge settles, enable pointer events on the same landed spine and open the existing About popup when clicked.
   - This keeps behavior unchanged for users, but visually it is one spine from card to shelf.

Files to change:
- `src/components/HeroIdBadge.tsx`: keep the flying spine alive, freeze it after landing, and make it clickable after settle.
- `src/components/AboutToProjectsBridge.tsx`: keep the invisible slot target, but hide the duplicate About spine permanently so it never crossfades in.