

## Plan: Replace Border SVG with Simple Top/Bottom Line Doodles

### What Changes

**1. `src/components/MarginDoodles.tsx`**
- **Remove `BorderLineSvg` component** entirely (lines 3-10)
- **Remove the two `margin-bg` divs** that render `BorderLineSvg` (lines 191-196)
- **Remove border line animation logic** from the `useEffect` (lines 132-143 and 154-160) — no separate border animation needed
- **Add a simple hand-drawn horizontal line doodle as the first doodle** (index 0) in each margin column — a wavy/imperfect single stroke near the top, using a `<path className="draw">` just like all other doodles. viewBox ~`0 0 200 12`, positioned close to the top edge
- **Add a matching bottom line doodle as the last doodle** (index 23) in each column — same style, near the bottom edge
- These two line doodles are treated as regular doodles in the scroll animation (the top line draws first, bottom line draws last) — no special handling needed
- Total doodles per side becomes 24 (top line + 22 existing + bottom line)

**2. `src/index.css`**
- **Remove `.margin-border-svg`** styles (no longer needed)
- **Remove `.margin-bg::before` blueprint grid** background since the border SVG container is gone — or keep `.margin-bg` divs purely for the faint grid if desired. Since the border lines are gone, simplify by removing the `.margin-bg` divs entirely and their styles

### Result
- Each margin has a simple hand-drawn line at the very top and very bottom, animated on scroll like every other doodle
- No separate border/bracket system — just doodles
- Doodles remain centred at 80% width with padding from edges

### Files: 2
1. `src/components/MarginDoodles.tsx` — Remove BorderLineSvg, add top/bottom line doodles, remove border animation logic
2. `src/index.css` — Remove `.margin-border-svg` styles

