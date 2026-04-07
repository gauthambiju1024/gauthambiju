

## Plan: Shrink Margins & Doodles to Fit All 22 Per Side

### Analysis

Each side has 22 SVGs with viewBox width 200 and combined viewBox heights ~2330. At the current 110px column width (102px effective after padding), rendered total height ≈ 1190px + gaps = ~1280px — far exceeds the 769px viewport.

To fit all 22 in one viewport height without panning, the column width must shrink so the proportionally-scaled SVG heights sum to less than ~750px.

At **60px** column width (52px effective): total rendered height ≈ 606px + 84px gaps = ~690px. This fits.

### Changes

**`src/index.css`** — Reduce margin widths:
- Default: `--margin-col-width: 60px` (was 110px)
- `≤1280px`: `50px` (was 85px)  
- `≤1100px`: `28px` (was 40px)
- Adjust `.doodle` padding to `1px 2px` for tighter fit
- Keep the subtle blueprint grid as-is (already merged with background)

**`src/components/MarginDoodles.tsx`** — Update layout to fit viewport:
- In `layoutDoodles`, use `gap = 2` (was 4) and `topPad = 6` (was 10) for tighter stacking
- Use `left: 2px; right: 2px` instead of `4px` to maximize SVG width within the narrower column

### Files: 2
1. `src/index.css` — Halve margin column widths again
2. `src/components/MarginDoodles.tsx` — Tighten gap and padding in layout function

