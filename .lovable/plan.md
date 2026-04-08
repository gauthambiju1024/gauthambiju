

## Plan: Fix Invisible BuildGap Animation

### Root Cause
The animated elements are positioned outside the visible SVG area. The viewBox is `0 0 900 120`, but `BELT_Y` is set to `149` — 29px below the bottom edge. Rollers, conveyor parts, and sparks all render at y=149, making them invisible. The static belt rectangle (y=48, height=38) is visible, but the animation plays beneath it off-screen.

### Fix

#### `src/components/build-story/BuildGap.tsx`
- Change `BELT_Y` from `149` to `67` (vertically centered within the belt rectangle at y=48, height=38)
- This single constant change repositions all animated elements (rollers, parts, sparks) into the visible belt area
- No other changes needed — every animated element references `BELT_Y`

### Files: 1
1. `src/components/build-story/BuildGap.tsx` — change `BELT_Y` from 149 to 67

