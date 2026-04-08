

## Plan: Make Ghost Grid More Visible with Always-Present Construction Marks

### Problems
1. **Grid barely visible** — base opacity is `0.025` (2.5%), too faint to notice
2. **Construction marks invisible** — SVG marks only show during the brief 400ms flash, and even then the SVG color (`hsl(var(--primary) / 0.5)`) is too subtle against the dark background. The `preserveAspectRatio="none"` also distorts the marks.

### Changes

#### 1. `src/index.css` — Increase visibility
- Raise ghost grid base opacity from `0.025` to `0.06` (6%)
- Raise flash opacity from `0.09` to `0.18`
- Make construction marks always visible at low opacity (`0.3`) instead of hidden (`0`)
- During flash, marks go to full opacity (`1`)
- Change marks color to use a brighter value (white-based instead of primary)

#### 2. `src/components/GhostGrid.tsx` — Fix SVG rendering
- Change `preserveAspectRatio` from `"none"` to `"xMidYMid meet"` so marks aren't distorted
- Use viewport-relative sizing instead of fixed 1920x1080 viewBox — switch to percentages or use `viewBox="0 0 100 100"` with proper coordinates
- Add more construction elements: additional crosshairs at corners, registration marks, grid coordinate labels
- Make stroke widths thicker so they're visible (current `0.4`–`0.8` get scaled down to near-invisible)
- Use explicit white/light colors instead of `currentColor` since the parent color may not contrast enough

### Files: 2
1. `src/index.css` — boost base opacity, make marks persistently visible at low opacity
2. `src/components/GhostGrid.tsx` — fix SVG scaling, thicker strokes, brighter colors, more construction elements

