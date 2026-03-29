

## Fix: Hero Portrait Blending Edges

### Problem
The mask gradients are fading the wrong edges. The portrait sits at top-right, so:
- **Horizontal**: should fade out on the **left** side (transparent left → opaque right) — current gradient does this correctly
- **Vertical**: should fade out at the **bottom** (opaque top → transparent bottom) — current gradient fades the **top** instead (`to top, transparent 0%` means bottom is opaque and top fades out, which is backwards)

The right edge also has a hard cutoff that could use softening.

### Changes

**`src/components/HeroSection.tsx`** — Fix the mask gradients:

```css
maskImage:
  linear-gradient(to right, transparent 0%, black 25%, black 100%),
  linear-gradient(to bottom, black 60%, transparent 100%)
```

- **Horizontal**: fade from transparent on left to solid by 25%, staying solid to the right edge
- **Vertical**: solid from top through 60%, then fading to transparent at the bottom
- These two masks intersect so both edges blend smoothly

No other file changes needed.

