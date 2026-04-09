

## Change Entropy to Top/Bottom Split with Gradient Ordering

### What changes
Switch from left/right order-chaos split to **top/bottom**: chaos at the top, gradually becoming more ordered as you scroll down. Make everything more subtle.

### Changes — `src/components/ui/entropy.tsx`

#### 1. Top-down gradient split
- Instead of `order = x < w/2`, use `order = y > h/2` — top half is chaos, bottom half is order
- Rather than a hard binary split, use a **gradient**: each particle's "order strength" is based on its vertical position (`y / h`). Particles near the top (y ≈ 0) are fully chaotic; particles near the bottom (y ≈ h) are fully ordered. Mid-screen particles blend both behaviors.

#### 2. Subtler visuals
- Reduce particle size from `2` to `1.5`
- Lower particle alpha: ordered ~0.3, chaos ~0.35
- Lower connection line alpha from `0.18` to `0.10`, reduce connection distance from `50` to `40`
- Remove the dashed divider line entirely (no hard boundary — it's a gradient)

#### 3. Chaos boundary clamping
- Chaos particles constrained to top half (`y < h/2`) instead of right half
- Boundary checks updated: `if (this.y > h/2) this.velocity.y *= -1` for chaos particles, and x spans full width

#### 4. Gradient blending logic
- Each particle stores an `orderStrength` value (0 = full chaos, 1 = full order) based on `1 - (originalY / h)` inverted so bottom = ordered
- In `update()`: blend between grid-return force and random velocity using `orderStrength`
- This creates a smooth visual transition rather than a hard line

### Files: 1
- `src/components/ui/entropy.tsx`

