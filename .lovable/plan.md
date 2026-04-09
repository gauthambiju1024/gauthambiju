

## Plan: Match Page Background to Header

### Current State
- Header: `hsla(220, 15%, 12%, 0.92)` with `backdrop-filter: blur(20px)` — frosted glass
- Page background (`--background`): `220 15% 12%` — same base color but fully opaque

These are already the same base color. The visual inconsistency comes from the header being 92% opaque with blur, which can make it appear slightly lighter/different depending on what's behind it.

### Solution
Update the page `--background` CSS variable to exactly match the header's visual tone. Since the header at 0.92 opacity over dark content effectively renders close to `hsl(220, 15%, 12%)`, the real fix is ensuring both use the identical solid value. If there's a perceived mismatch, we can nudge the page background to be slightly warmer/cooler to match the blurred header appearance.

### Changes

#### `src/index.css`
- Adjust `--background` value to visually match the header's frosted-glass appearance (e.g., tweak lightness from 12% to ~11% or adjust saturation slightly so the solid background blends seamlessly with the semi-transparent header)

### Files: 1
- `src/index.css`

