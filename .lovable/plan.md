

## Reduce Max Chaos Intensity

### Problem
The chaos velocity multipliers are too high at scroll=0, making particles move too aggressively at the top of the page.

### Changes — `src/components/ui/entropy.tsx`

1. **Reduce random acceleration**: Lower `(Math.random() - 0.5) * 1.5` to `* 0.5` (line 55-56)
2. **Reduce chaos velocity multiplier**: Lower `this.velocity.x * 3` to `* 1` (lines 61-62)
3. **Add more damping**: Change velocity damping from `0.95` to `0.92` (lines 57-58) so particles slow down faster

These three changes together make the chaotic state at the top a gentle drift rather than aggressive movement, while still being visibly different from the ordered state at the bottom.

### Files: 1
- `src/components/ui/entropy.tsx` — reduce chaos force constants

