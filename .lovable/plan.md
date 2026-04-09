

## Plan: Dynamically Sync Page Background to Header Color

### Problem
The page background (`hsl(220, 15%, 11%)`) doesn't exactly match the header's frosted-glass tone (`hsla(220, 15%, 12%, 0.92)`), creating a visible seam.

### Approach
On mount, read the header element's inline background style, alpha-composite it against black (since the page bg is what we're solving for, and the header sits at the top where only it is visible), and set the page wrapper's background to the resulting solid color. This only runs once.

Specifically:
1. Add a `ref` to the header div in `AssemblyHeader.tsx` and expose it (or just use a `data-` attribute to find it)
2. In `Index.tsx`, use a `useEffect` on mount to:
   - Query the header element
   - Parse its `hsla(220, 15%, 12%, 0.92)` background
   - Compute the fully opaque equivalent: blend `rgba` over a dark base → result is `hsl(220, 15%, ~12%)`
   - Apply that as the page wrapper's `backgroundColor`

### Simpler Alternative (recommended)
Since both colors are hardcoded and the compositing math is deterministic, we can skip runtime sampling entirely: just compute the blended result once and use it as both. The header over a dark background at 0.92 opacity effectively renders as `hsl(220, 15%, 12%)`. So:

1. **`src/index.css`** — Change `--background: 220 15% 11%` → `220 15% 12%` to exactly match the header's base HSL
2. **No JS needed** — they're now the same color, perfectly in sync

But if the user truly wants the dynamic JS approach:

### Dynamic JS Approach

#### `src/components/AssemblyHeader.tsx`
- Add `data-header-bg` attribute to the sticky div so it can be found easily

#### `src/pages/Index.tsx`
- Add a `useEffect` that runs once on mount:
  - Find element with `[data-header-bg]`
  - Read its `style.background` string
  - Parse the HSLA values, alpha-composite over black to get a solid color
  - Set the page wrapper ref's `style.background` to that solid result
- Add a `useRef` on the outer `div` to apply the computed background

### Files: 2
- `src/components/AssemblyHeader.tsx` — add data attribute
- `src/pages/Index.tsx` — add useEffect + useRef to sync background on mount

