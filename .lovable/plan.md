## Goal
Make the visible green spine transition feel continuous and calm: no abrupt jump in position, no abrupt resize, and no white line moving left. Only the spine handoff is adjusted.

## What I will change
1. Lock the flying spine to the exact on-screen position of the visible spine at the handoff frame.
   - Capture the real rendered rectangle of the visible spine at the moment the handoff begins.
   - Use that exact center/size as the flying spine start state so there is zero pop in step 2 or 3.

2. Replace the current independent X/Y timing with one continuous, softer settle.
   - Keep the same overall handoff window.
   - Use a gentler path so the spine moves as one continuous drop toward the shelf instead of appearing to “teleport then fall”.
   - Preserve the existing end target so it still lands in the same shelf slot.

3. Make the shrink start from the actual visible spine size, not an inferred scale.
   - Read the real rendered start width/height from the handoff frame.
   - Interpolate from that exact size down to the shelf spine size to remove the abrupt size snap.

4. Remove the white-line artifact at its source.
   - Suppress any lingering lanyard/clip/page-edge visual during the bridge window.
   - Ensure the flying spine wrapper itself contributes no border/outline/shadow artifact.

## Files
- `src/components/HeroIdBadge.tsx` only

## Out of scope
- No changes to Home or About layouts
- No changes to the earlier card flip/book close behavior beyond preventing the artifact during handoff
- No changes to the shelf, project spines, or section timing structure

## Technical details
- Use the actual rendered handoff geometry instead of `targetCenterX/targetCenterY` plus derived start scales.
- Base the start measurement on the visible spine/card transform already on screen.
- Keep the same destination slot coordinates currently used for the shelf handoff.
- Remove the stray line by fully hiding the artifact source during the handoff frame range, not by changing the page design.