

## Plan: Fix Margin-Panel Overlap Across Viewports

### Problem
The `margin-content-wrapper` padding is `calc(var(--margin-col-width) - 30px)`, which at smaller viewports (where `--margin-col-width` is 28px) produces **negative padding (-2px)**, causing panels to overlap the doodles. At larger viewports, the gap is inconsistent.

### Changes

**`src/index.css`**
1. Change the `margin-content-wrapper` padding formula to use the full margin width with only a tiny inset, ensuring panels always sit just inside the doodle columns:
   - `padding-left/right: calc(var(--margin-col-width, 60px) + 4px)` — panels start 4px inside the margin edge, never overlapping
2. Add responsive overrides so the padding tracks `--margin-col-width` at every breakpoint consistently

### Result
- Small viewports: panels clear the 28px doodle column with a 4px gap
- Large viewports: panels clear the 60px doodle column with a 4px gap
- Consistent tight spacing matching the second reference image at all sizes

### Files: 1
1. `src/index.css` — Fix margin-content-wrapper padding formula

