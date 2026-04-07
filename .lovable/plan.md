

## Plan: Reduce Gap Between Margins and Panels

### Problem
The `margin-content-wrapper` padding pushes panels too far inward, creating visible gaps between the doodle margins and the content panels. The second screenshot shows the desired tighter layout.

### Changes

**`src/index.css`**
- Reduce `margin-content-wrapper` padding from `calc(var(--margin-col-width) - 18px)` to `calc(var(--margin-col-width) - 30px)` so panels sit closer to the margin doodles
- Remove `max-w-7xl` constraint influence by also removing the per-panel horizontal padding (`px-1 md:px-2 lg:px-4`) in favour of minimal `px-0 md:px-1`

**`src/pages/Index.tsx`**
- Remove or reduce the `px-1 md:px-2 lg:px-4` padding on each panel wrapper div — change to `px-0 md:px-1` so panels stretch closer to the edges
- This applies to the hero wrapper (line 39), about wrapper (line 46), and the panelSections map (line 65)

### Result
Panels will sit tighter against the margin columns consistently across all viewport sizes, matching the second reference image.

### Files: 2
1. `src/index.css` — Tighter margin-content-wrapper padding
2. `src/pages/Index.tsx` — Reduce per-panel horizontal padding

