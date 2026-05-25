I found two likely causes:

1. The visible spine is still inheriting the old card wrapper rotation/3D flip while the handoff begins, so it keeps tilting even after it should read as a straight book spine.
2. The “white line” is the old lanyard/metal clip layer and/or the 3px page-block edge still being visible during the spine handoff, leaving a stray vertical strip as the card disappears.

Plan:

1. Freeze tilt before the spine becomes visible
   - Stop adding the card’s 2D tilt once the book-close phase starts.
   - Keep the flying spine upright from its first visible frame through shelf landing.
   - Remove `rotateY` influence from anything visible after the handoff so the spine does not continue twisting.

2. Remove the white trailing line
   - Fade the entire lanyard/clip layer earlier and force it hidden once the bridge/file sequence starts.
   - Hide the book page-block edge during the close-to-spine handoff so no thin cream/white strip remains beside the spine.

3. Make the handoff visually consistent
   - Begin the flying spine only after the card wrapper has faded enough to avoid double exposure.
   - Use a fixed 28px spine width and 200px shelf height for the flying object, matching the destination slot.
   - Keep the shelf About spine fade synchronized with the flying spine’s final fade-out.

Files to change:
- `src/components/HeroIdBadge.tsx`
- Only touch `src/components/AboutToProjectsBridge.tsx` if the final fade timing needs a tiny alignment adjustment.