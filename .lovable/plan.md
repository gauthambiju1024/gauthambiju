

## Soften Header Edges (Subtle 2-4px Smoothness)

### Problem
The header has sharp rectangular edges — a hard border-bottom line and crisp left/right boundaries.

### Solution
Apply a very subtle softening — just 2-4px of feathering — around the bottom, left, and right edges using a CSS mask gradient. Keep the top edge fully solid (it's flush with the viewport top). Remove the hard `borderBottom`.

### Changes

#### `src/components/AssemblyHeader.tsx` (line 531)
Update the sticky header's inline style:
- Remove `borderBottom: '1px solid hsla(220, 15%, 20%, 0.3)'`
- Add mask gradients that create a ~3px soft fade on the bottom, left, and right edges:
  ```
  maskImage: 'linear-gradient(to bottom, black calc(100% - 4px), transparent 100%), linear-gradient(to right, transparent 0px, black 3px, black calc(100% - 3px), transparent 100%)'
  maskComposite: 'intersect'
  WebkitMaskComposite: 'source-in'
  ```

This keeps the effect minimal — just enough to remove the pixel-sharp boundary without making the header feel blurry or faded.

### Files: 1
- `src/components/AssemblyHeader.tsx`

