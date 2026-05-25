## Make the book → spine shrink genuinely slow & elegant

The current `closeT = seg(0.50, 0.80, bridge)` is only 0.30 wide — still feels abrupt. The shrink also runs back-to-back with the flying-spine handoff, which compresses the perceived duration further.

### Changes in `src/components/HeroIdBadge.tsx`

1. **Widen `closeT`** (line 212) from `seg(0.50, 0.80, bridge)` to `seg(0.30, 0.90, bridge)`.
   - 2× the scroll distance of the current value, 3.75× the original. The cover-close and shrink read as a deliberate, slow gesture rather than a snap.

2. **Push the flying-spine handoff later** (line 284) from `handoffStart = 0.55` to `handoffStart = 0.70`.
   - With the wider `closeT`, the handoff at 0.55 would fire too early (around bridge 0.63) and the static visible spine would linger before `flyT` begins at bridge 0.70. Moving handoff to 0.70 lines up the cross-fade with the start of `flyT` (bridge ≈ 0.72), so the shrink finishes, then the flying spine immediately takes over — no dead frames, no double motion.

### Preserved

- `flyT = seg(0.70, 1.0, bridge)` unchanged — flight pacing stays the same.
- `eInOutCubic` easing on `closeT` unchanged — already smooth, just gets more room to breathe.
- Bezier path, lean, settle, fades, scaleX/scaleY unchanged.
- Shelf, ProjectSpine, About card flip, p1/p2 beats untouched.

### Result

The book-close + shrink-to-spine beat occupies the majority of the bridge window and reads as a slow, professional fold rather than a quick collapse. The handoff to the flying spine is timed so the two motions feel like one continuous gesture.