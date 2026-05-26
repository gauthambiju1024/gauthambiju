## Why the spine teleports to the shelf right now

In `src/components/HeroIdBadge.tsx`:

- `closeT = seg(0.30, 0.90, bridge)` — book finishes closing at bridge **0.90**.
- `flyT  = seg(0.75, 1.00, bridge)` — flight begins at bridge **0.75**.
- Handoff fires only when `closeT >= 1` — i.e. bridge **0.90**.

So between bridge 0.75 and 0.90:
- In-book spine (`cardWrap`) is still visible (handoffT=0).
- Flying spine is hidden, but `flyT` is silently advancing — by bridge 0.90 it's already `eInOutCubic(0.60) ≈ 0.65` along the bezier arc.

At bridge 0.90 the swap fires and the flying spine appears **already two-thirds of the way to the shelf**. That's the teleport.

## The fix: lock close-end and fly-start to the SAME frame

Both timelines must meet exactly. Change in `src/components/HeroIdBadge.tsx`:

1. **Line 212** — `closeT = seg(0.25, 0.75, bridge)` (was `seg(0.30, 0.90, bridge)`).
   - Window stays 0.50 wide → shrink is still slow and elegant.
   - Ends at bridge **0.75**.

2. **Line 213** — `flyT = seg(0.75, 1.0, bridge)` (already set in last edit, keep as-is).
   - Starts at bridge **0.75**, exactly when `closeT` hits 1.

3. **Handoff block (lines 284–286)** — unchanged: `handoffT = closeT >= 1 ? 1 : 0` now fires at the exact frame `flyT` begins at 0. Same DOM rect, same `ProjectSpine` markup, flight starts from zero progress → no teleport, no ghost.

## Preserved

- Slow elegant shrink (0.50-wide window of bridge).
- Identical `<ProjectSpine data={ABOUT_SPINE_DATA} />` on both sides.
- Bezier path, lean, settle, landing — unchanged.

## Result

Book closes and shrinks slowly. At the exact frame the shrink completes, the visible spine begins its flight from that same position — one continuous spine, no disappear, no jump.
