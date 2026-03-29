

## Fix: More Natural Hero Portrait Blending

### Problem
The current mask gradients create a somewhat harsh fade. The reference screenshot shows a softer, more diffused blend — the portrait dissolves gradually from all edges, especially the left and bottom, with a watercolor-like softness.

### Changes

**`src/components/HeroSection.tsx`** — Adjust the mask gradients for a wider, softer fade:

- **Left fade**: Start transparent further in (~30%) for a gentler dissolve
- **Bottom fade**: Start fading earlier (~50%) for a longer tail
- **Top fade**: Add slight top fade so the portrait doesn't have a hard edge at the top-right corner
- Reduce opacity from 0.80 to 0.70 for a more ethereal feel

```css
maskImage:
  linear-gradient(to right, transparent 0%, black 30%, black 100%),
  linear-gradient(to bottom, black 0%, black 50%, transparent 100%)
```

### Files modified
- `src/components/HeroSection.tsx` — softer gradient mask + reduced opacity

