

## Plan: Push Fade Start Closer to Image Edges

Currently the left fade goes from `transparent 0%` to `black 28%` and the bottom fade from `black 62%` to `transparent 100%`. This means the fade occupies ~28% of the left and ~38% of the bottom.

### Change
Push the fade transitions closer to the margins so more of the image is fully visible:

- **Left fade**: `transparent 0%, black 15%` (was 28%) — fade occupies only ~15% of the left edge
- **Bottom fade**: `black 75%, transparent 100%` (was 62%) — fade starts later, occupying only ~25% of the bottom

```css
maskImage:
  linear-gradient(to right, transparent 0%, black 15%, black 100%),
  linear-gradient(to bottom, black 0%, black 75%, transparent 100%)
```

### File modified
- `src/components/HeroSection.tsx` — line 90 only

