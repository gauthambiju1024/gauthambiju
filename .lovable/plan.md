

## Make Order vs Chaos Clearly Visible

### Problem
Currently the order/chaos distinction is hard to see because:
1. The order region is defined by distance from center (`dist < min(w,h) * 0.35`) — a circular blob — rather than a clear left/right split
2. Particle opacity is very low (0.35–0.4) making everything look uniformly faint
3. Chaos particles roam the entire viewport instead of staying on one side
4. Connection line opacity is only 0.12, too subtle to see structure
5. No visual divider separates the two zones

### Changes — `src/components/ui/entropy.tsx`

1. **Restore left/right split**: Order = left half (`x < w/2`), chaos = right half. This is the original design's core visual metaphor — a clear vertical boundary between structured grid and chaotic movement.

2. **Add subtle vertical divider line**: Draw a thin dashed line at `x = w/2` each frame (like the original component) with low opacity (~0.15) so the boundary is visible but not harsh.

3. **Constrain chaos particles to right half**: Boundary checks clamp chaos particles to `[w/2, w]` instead of `[0, w]`, keeping chaos visually separated.

4. **Increase particle visibility**: Bump ordered particle alpha from 0.35 to ~0.5, chaos alpha from 0.4 to ~0.55. Increase particle size from 1.5 to 2. Still subtle enough as a background but now clearly visible.

5. **Increase connection line alpha**: From 0.12 to ~0.18, and connection distance from 40 to 50, so the grid structure on the left and the tangled web on the right are both apparent.

### Files: 1
- `src/components/ui/entropy.tsx`

