## Problem
The wings fold a few degrees and then vanish. Cause: their backface was set to `background: transparent` with `backface-visibility: hidden` on the front. Past ~90°, the front face stops rendering and there's nothing on the back to show, so the panel disappears mid-fold.

Real paper physics: as a wing rotates behind the center, the viewer should see the **back of the paper** (still a cream surface), then it tucks flush behind the center strip at 180°.

## Fix (HeroIdBadge.tsx)

1. **Restore a paper backface on each wing** instead of transparent. Use the same `CARD_BG` cream with a very subtle inner shadow so it reads as the underside of the same sheet:
   ```
   background: CARD_BG,
   boxShadow: "inset 0 0 0 1px hsl(160 30% 4% / 0.08), inset 0 0 24px hsl(160 30% 4% / 0.06)"
   ```
   Apply to both left wing (line 563) and right wing (line 606) backface divs.

2. **Add a small `translateZ(-0.5px)` on the wings' backface** to avoid z-fighting with the center strip at the final flush position.

3. **Cap `flapAngle` at 178°** (not 180°) so the wings stop just before perfect flush; this prevents a 1-frame flicker where the backface and center strip occupy the same plane.

4. **Make the center strip sit slightly forward** with `transform: translateZ(1px) rotateY(...)` so wings cleanly fold behind it.

5. Keep the front faces unchanged (they still carry the clipped About surface so the unfolded card looks intact at fold start).

## Expected after fix

- 0–90°: wing front (About surface slice) visible, rotating away.
- 90–178°: wing **back** (cream paper) visible, continuing to rotate behind.
- 178°: wing is flush behind center strip, hidden by it.
- No vanishing mid-rotation.

## Files touched
- `src/components/HeroIdBadge.tsx` — wing backface paint + tiny z offsets + flapAngle cap.
