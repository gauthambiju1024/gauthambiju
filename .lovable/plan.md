

## Fix: Scrolling and Navigation Not Working

### Root Cause

The `.notebook` CSS class in `src/index.css` sets `overflow: hidden`. While the inner scroll area div has `overflow-y: auto`, the parent's `overflow: hidden` can prevent proper scroll propagation in certain browser/rendering contexts — especially when combined with `position: relative` and multiple absolute-positioned children.

Additionally, the `.notebook-spine` (48px wide, full height) and `.notebook-margin` decorative elements don't have `pointer-events: none`, meaning they could intercept pointer/touch events on the left side of the notebook.

### Fix (2 files)

**1. `src/index.css`** — Change `.notebook` from `overflow: hidden` to `overflow: clip`
- `overflow: clip` provides the same visual clipping (rounded corners, no visible overflow) but does NOT create a scroll context, so it won't interfere with child scroll areas
- Add `pointer-events: none` to `.notebook-spine` and `.notebook-margin`

**2. `src/pages/Index.tsx`** — Add `min-h-0` to the notebook div
- Ensures the flex column child (scroll area) can properly shrink and create its own scroll context
- This is a common flex layout fix: without `min-h-0`, a flex child defaults to `min-height: auto` which can prevent overflow scrolling

### Changes Summary

| File | Change |
|---|---|
| `src/index.css` | `.notebook`: change `overflow: hidden` → `overflow: clip`; add `pointer-events: none` to `.notebook-spine` and `.notebook-margin` |
| `src/pages/Index.tsx` | Add `min-h-0` class to the notebook div |

