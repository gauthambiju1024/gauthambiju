## Slow down the book → spine shrink

The "About book closing into the narrow spine" beat currently runs in `closeT = seg(0.62, 0.78, bridge)` — a 0.16-wide window. That's why the shrink feels quick before the flying spine takes over.

### Change

In `src/components/HeroIdBadge.tsx` (line 212):

- Widen `closeT` from `seg(0.62, 0.78, bridge)` to `seg(0.50, 0.80, bridge)`.

This gives the cover-close / shrink-to-spine motion ~1.9× more scroll distance, making the transition from About spine to flying spine noticeably slower and smoother.

### Preserved

- `flyT` stays `seg(0.70, 1.0, bridge)` (already-tuned slower flight).
- Handoff threshold (`handoffStart = 0.55` of `closeT`) unchanged — still triggers the flying spine reveal near the end of the close, just over a longer scroll range.
- Bezier path, lean, settle, fades, scaleX/scaleY all unchanged.
- Shelf, ProjectSpine, card flip untouched.