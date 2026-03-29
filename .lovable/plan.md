

## Fix: Soften Bottom Edge of Hero Portrait

### Problem
The bottom gradient transition is too abrupt — the image cuts off visibly at the bottom of the container.

### Change
**`src/components/HeroSection.tsx`** (line 100) — Adjust the bottom gradient to start fading earlier and more gradually:

Current: `transparent 55%, hsl(var(--card)) 100%`
New: `transparent 40%, hsl(var(--card)) 85%`

This makes the bottom fade begin at 40% height instead of 55%, and reach full coverage by 85% instead of 100% — eliminating the hard cutoff.

### Files modified
- `src/components/HeroSection.tsx` — one line change to gradient stops

