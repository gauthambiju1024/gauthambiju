

## Plan: Fix Margin Issues & Expand Panels

### Issues Identified

1. **Empty space on left margin**: Doodles have `left: 2px` offset leaving visible gap
2. **Corner brackets missing**: The blueprint-style square brackets (from image-21) should frame the margin backgrounds at top-left, top-right, bottom-left, bottom-right corners
3. **Colored dots visible at initial state**: The "impact/effort" doodle (right side, ~line 553-556) has small filled circles (`fill="hsl(...)"`) on `.draw` paths. Even though stroke is hidden via dashoffset, the `fill` renders immediately as colored dots
4. **Too much space between margin and panels**: The `margin-content-wrapper` pads by `var(--margin-col-width)` on each side, plus panels have `px-2 md:px-4 lg:px-8` — combined creates excessive gap

### Changes

**1. `src/index.css`**
- Re-enable `.margin-corner` styles (currently `display: none`) as subtle bracket marks at all 4 corners of each margin background — thin 1px lines, low opacity white, ~16px size
- Reduce `margin-content-wrapper` padding to use a smaller value than `--margin-col-width` (e.g., `calc(var(--margin-col-width) - 10px)`) so panels sit closer to margins
- Tighten `.doodle` left/right to `0px` to eliminate empty space in margin column

**2. `src/components/MarginDoodles.tsx`**
- On the "impact/effort" doodle (~line 553-556): remove the `fill` attribute from the 4 small dot paths (keep stroke only), so they only appear when drawn. Alternatively, add `fillOpacity="0"` initially and use the `.fade` class approach
- Adjust doodle `left`/`right` in `layoutDoodles` to `0px`

**3. `src/pages/Index.tsx`**
- Reduce horizontal padding on panel wrappers: change `px-2 md:px-4 lg:px-8` to `px-1 md:px-2 lg:px-4` so panels expand closer to the margins

### Files: 3
1. `src/index.css` — Enable corner brackets, reduce content wrapper padding, tighten doodle positioning
2. `src/components/MarginDoodles.tsx` — Fix colored dot fills, adjust doodle left/right to 0
3. `src/pages/Index.tsx` — Reduce panel horizontal padding

