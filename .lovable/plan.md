I’ll replace the current transition instead of patching it.

## Plan

1. **Delete the current flight choreography in `HeroIdBadge.tsx`**
   - Remove the mixed `cardWrap` flight / hidden `flyingSpineRef` / persistent 3D spine logic.
   - Stop moving the whole ID card/book wrapper toward the shelf, because that carries hidden 3D faces and causes the blank/ghost frames.

2. **Use a clean, explicit 3-phase transition**
   ```text
   Phase A: ID card flips to About book
   Phase B: About book closes into one visible spine
   Phase C: one spine element flies to the shelf slot
   ```
   Each phase will own exactly one visible element, with no competing transforms.

3. **Create one dedicated flight spine, but only after the book is fully closed**
   - At the end of close, measure the visible closed spine’s real screen rect.
   - Position the flight spine from that exact rect.
   - Make it immediately opaque.
   - Hide the book/card only after the flight spine is placed.
   - This avoids the current issue where the 3D spine is still inside a rotating/perspective context while also being used as the flying object.

4. **Make the flight math rect-based, not card-size-based**
   - Start rect = measured closed spine rect.
   - End rect = shelf About slot rect from `AboutToProjectsBridge`.
   - Interpolate `left/top/width/height` plus a small arc offset.
   - No inherited `rotateY`, no parent scale guessing, no transform-origin mismatch.

5. **Simplify the shelf handoff**
   - Keep the real shelf About spine hidden until the flight spine is nearly landed.
   - Cross only at the final settled position with identical size and full opacity.
   - Then disable the flight spine.

6. **Keep scope tight**
   - Primary change: `src/components/HeroIdBadge.tsx`.
   - Only adjust `AboutToProjectsBridge.tsx` if the shelf slot timing needs to expose a more stable rect/opacity signal.

## Technical details

- Replace the current `flyT` block with a small state machine driven by scroll progress.
- Use `getBoundingClientRect()` for the closed spine and shelf slot so the handoff is based on actual rendered pixels.
- Keep the 3D book only for the flip/close portion; the flight becomes a flat, deterministic spine animation.
- Remove unused/dead transition branches so there is one obvious source of truth for visibility.