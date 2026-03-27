

## Plan: Sticky Notebook Effect

The notebook (Hero + About) will pin itself to the viewport while its content scrolls internally. Once the user finishes reading the About section, the notebook unpins and the floating panels below scroll into view naturally.

### How It Works

```text
Phase 1: User scrolls → notebook sticks to viewport (position: sticky)
Phase 2: Hero + About content scrolls INSIDE the notebook (internal overflow)
Phase 3: Internal scroll completes → notebook unsticks → floating panels appear
```

This is achieved with **CSS `position: sticky`** and a tall wrapper div that provides the "scroll runway" for the sticky element.

### Implementation

**1. `src/pages/Index.tsx`**
- Wrap the notebook in a "runway" div with a calculated height (e.g. `h-[200vh]`) — this gives the sticky element room to stay pinned
- Set the notebook div to `sticky top-[60px]` (below nav) with `h-[calc(100vh-80px)]`
- Add `overflow-y-auto` to the notebook's inner content area so Hero + About scroll inside the pinned frame
- The floating panels below remain unchanged — they naturally appear after the runway div ends

**2. `src/index.css`**
- Add a `.notebook-sticky` utility: `max-height: calc(100vh - 80px); overflow-y: auto;` for the inner content
- Keep existing `overflow: clip` on `.notebook` but scope it to block-axis only so vertical scroll works inside

**3. `src/components/Navigation.tsx`**
- Minor: ensure nav `z-index` stays above the sticky notebook (already z-50, notebook will be z-40)

### Key Details
- The runway height controls how long the notebook stays pinned — `200vh` means roughly one extra viewport of scrolling before it releases
- Mobile: reduce runway or disable sticky behavior below `md` breakpoint to avoid awkward small-screen pinning
- The notebook hole-punches, spine, and page-fold stay fixed in place while content scrolls past them — enhancing the journal metaphor

### Files Changed
| File | Change |
|---|---|
| `src/pages/Index.tsx` | Add runway wrapper + sticky positioning + internal scroll |
| `src/index.css` | Add `.notebook-sticky` scroll styles |

