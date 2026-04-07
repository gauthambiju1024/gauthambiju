

## Plan: Scale Doodles to Fill Full Viewport Height

### Problem
The `layoutDoodles` function only scales doodles **down** when they exceed viewport height, but never scales **up** when they're shorter. This leaves a large empty gap at the bottom.

### Change

**`src/components/MarginDoodles.tsx`** (line 71)
- Remove the conditional `totalNatural > availableHeight` check — always apply the scale factor so doodles stretch to fill the full viewport height
- Change: `const scaleFactor = totalNatural > availableHeight ? availableHeight / totalNatural : 1;`
- To: `const scaleFactor = availableHeight / totalNatural;`
- Also always apply the transform (remove the `if (scaleFactor < 1)` guard on lines 86-89)

### Result
Doodles will always scale to exactly fill the viewport height, whether they need to grow or shrink.

### Files: 1

