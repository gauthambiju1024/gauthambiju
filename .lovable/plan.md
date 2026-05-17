## Problem

During the bridge from About → Projects, the cream packet appears to abruptly shrink to half width instead of visibly folding. Root cause is in `HeroIdBadge.tsx`:

1. **Easing is front-loaded.** `flapAngle = eOut(tFold) * 178` uses `1 − (1−t)⁵`, so at tFold = 0.2 the wings are already at ~120° and at tFold = 0.4 they are essentially closed. The eye registers this as a sudden size change, not a fold.
2. **Window is too short.** `tFold = smoothstep(0.00, 0.40, bridge)` inside a bridge of `smoothstep(0.72, 1.0, p)` gives only ~11% of total scroll for the entire fold motion.
3. **No "settle" gap before the flip.** `tTurn` starts at bridge 0.42, immediately after the fold finishes, so the eye never sees the folded packet sit still as cream.

## Fix (HeroIdBadge.tsx only — no structural changes)

1. **Re-ease the fold** — replace `eOut` with an ease-in-out (`t<0.5 ? 2t² : 1 − (−2t+2)²/2`) so the wings move with a slow start, full middle, slow end. The viewer reads it as rotating panels, not a width collapse.
2. **Widen and re-phase the bridge windows:**
   ```
   tFold   = seg(0.00, 0.55, bridge)   // was 0.00–0.40
   tTurn   = seg(0.62, 0.82, bridge)   // was 0.42–0.70 — adds a brief "cream packet rests" beat
   tShrink = seg(0.82, 0.92, bridge)   // was 0.70–0.85
   tFile   = seg(0.92, 1.00, bridge)   // was 0.85–1.00
   ```
3. **Cap the closed angle at 176°** instead of 178° so the wing's lit front face stays visible right up to the moment it lands — prevents the last frame from looking like a snap.
4. **Tiny depth bump per wing** during the fold so the inward-traveling face catches a shadow edge: keep `translateZ(0.8px)` but add `boxShadow` opacity ramp tied to `tFold` (existing inset shadow values, just unchanged — already present, no new shadows).
5. **No changes** to: Layer B (final folded strip), spine rotation, shrink target, fly-to-shelf, lanyard/globe fades, opacity handoff at `settled`.

## Verification

- Scroll slowly through the About → Projects bridge: wings should be clearly visible rotating inward across roughly half the bridge length.
- The folded cream packet should briefly sit still before the green ABOUT ME spine flips into view.
- Final shrink + fly-to-shelf timing unchanged.

No other files touched.
