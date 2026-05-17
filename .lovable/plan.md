## Plan

Fix the trifold animation so both 25% side wings physically fold inward onto the 50% center strip, preserving the existing 25/50/25 layout and everything else.

### What will change

1. **Correct the wing rotation directions**
   - Left wing keeps folding inward from its right hinge.
   - Right wing will be corrected to fold inward from its left hinge.
   - The result should be a symmetrical fold toward the center, not one side folding outward or exposing the cream face incorrectly.

```text
Before fold:   [ left 25 ][ center 50 ][ right 25 ]
During fold:        -> [ center 50 ] <-
After fold:          [ green spine packet ]
```

2. **Preserve the current proportions**
   - Keep the current 25% / 50% / 25% split exactly as requested.
   - Do not change card size, spine size, bridge timing, shelf placement, or the project shelf animation.

3. **Keep the faces fully visible and opaque**
   - Front faces remain cream About-card slices during the fold.
   - Back faces remain green so the final folded packet reads as one solid spine.
   - No transparent half-card, no semi-visible starfield showing through the folded packet.

4. **Keep the final result professional and concrete**
   - The mid-fold should show both wings moving inward toward the center.
   - The end state should show only the green spine surface, with no cream strip.
   - Existing shelf drawing and animation timing fixes remain included and untouched.

### Technical details

- Update only `src/components/HeroIdBadge.tsx`.
- Adjust the per-frame transform assignment for `foldRightRef` so its `rotateY(...)` direction matches a true inward fold relative to its left-side hinge.
- Keep the current trifold DOM structure, `transformOrigin` values, 25/50/25 widths, backface visibility, and green back-face styling.
- If needed, add a small `translateZ`/z-order adjustment only to prevent z-fighting while folded, without changing the visible layout or timing.

### Validation

- Check the current preview stage shown in your screenshot: mid-fold should show left and right wings folding toward the center.
- Confirm final folded state is a single green spine packet, with all project spine visuals intended for the shelf still visible after handoff.