What is happening:

The spine is still being driven by the old 3D book-close math for too long.

In `HeroIdBadge.tsx`, the current handoff waits for:

```ts
const closeT = seg(0.25, 0.75, bridge);
const flatSpineActive = bridge > 0 && closeT >= 0.72;
```

But `closeT >= 0.72` is not an early visual handoff. Because the actual book rotation is eased again here:

```ts
const bookRotate = 90 * reveal + 90 * eInOutCubic(closeT);
```

At the handoff threshold, the book is already around 170+ degrees rotated. That means the 3D spine has become almost edge-on in perspective, so the browser compresses it into a thin vertical strip. That is exactly what your screenshots show: the spine starts acceptable, then keeps closing, then collapses into a skinny line.

The dark ghost/blank-looking slab is caused by the same issue: the original 3D book/back-face is still present while the spine is being perspective-compressed. The detached flight spine is only created after that bad state, so it captures the wrong skinny/warped rectangle and continues from there.

The fix should not be another tiny threshold tweak. The transition needs to stop using the 3D closing animation at the stage shown in your first screenshot.

Implementation plan:

1. Freeze the book at the first clean spine frame
   - End the 3D book-close much earlier, around the visual state shown in screenshot 1.
   - Do not let `bookRotate` continue toward 170–180 degrees.

2. Hand off immediately at that visual state
   - Capture the rendered spine rect while it is still wide and readable.
   - Hide the 3D book/back-face immediately after the detached spine is placed.

3. Replace the rest of the close with a flat spine flight
   - From that point onward, only one element should be visible: `flyingSpineRef`.
   - It should keep the same width/height as the clean captured spine until the travel begins.
   - Then it should interpolate to the shelf slot.

4. Remove the perspective-collapse path
   - Stop using late `closeT` values to drive the visible spine.
   - Do not capture `getBoundingClientRect()` after the spine has become edge-on.

5. Keep shelf reveal only at the final landing
   - The shelf About spine should stay hidden until the flying spine lands.
   - This avoids double-spine ghosting.

Expected result:

The transition will hand off at the first screenshot stage, not after further closing. The spine will not shrink into a line, the dark ghost slab will disappear, and the flight to the shelf will start from the readable full spine.