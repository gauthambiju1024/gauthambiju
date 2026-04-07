

## Plan: Center-Align Doodles Between Viewport Edge and Panels

### Problem
The doodle columns sit flush against the viewport edge (`left: 0` / `right: 0`), while panels start at `margin-col-width + 4px` inward. This means there's no gap between doodles and the viewport edge, but a 4px gap between doodles and the panels — the doodles are not centered in the gutter.

### Changes

**`src/index.css`**

1. Offset `.margin-doodles--left` and `.margin-doodles--right` inward by `2px` so the doodle column sits centered in the gutter zone:
   - `.margin-doodles--left { left: 2px; }`
   - `.margin-doodles--right { right: 2px; }`

2. Similarly offset `.margin-bg--left` and `.margin-bg--right` by `2px` to keep the background grid aligned with the doodles.

This splits the 4px total gap evenly: 2px between viewport edge and doodles, 2px between doodles and panels.

### Files: 1

