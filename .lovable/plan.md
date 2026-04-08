

## Plan: Fix Construction Marks Visibility

### Root Cause

The `.ghost-grid` container has `opacity: 0.06`, which applies to **all children** including the SVG marks. So the marks' effective opacity is `0.06 × 0.3 = 1.8%` — virtually invisible. Even during flash it's only `0.18 × 1 = 18%` for elements drawn with `rgba(255,255,255,0.4)`, making them ~7% effective.

### Solution

Separate the grid background and construction marks into **two sibling elements** so the marks aren't affected by the grid's low opacity. The grid background keeps its low opacity via its own element, while the marks SVG sits alongside it with independent opacity control.

### Changes

#### 1. `src/components/GhostGrid.tsx`
- Wrap everything in a plain container div (`position: fixed, inset: 0, z-index: 0, pointer-events: none`)
- Render the grid background as one child div (`.ghost-grid-bg`) with the low opacity
- Render the SVG marks as a sibling div (`.ghost-grid__marks`) with its own independent opacity
- Both get the flash class toggled

#### 2. `src/index.css`
- Split `.ghost-grid` into a wrapper (no opacity) and `.ghost-grid-bg` (carries the background + low opacity)
- `.ghost-grid__marks` becomes a direct child of the wrapper, not affected by background opacity
- Base marks opacity: `0.15` (subtle but visible), flash: `0.5`

### Files: 2
1. `src/components/GhostGrid.tsx` — restructure to sibling elements
2. `src/index.css` — split styles for independent opacity control

