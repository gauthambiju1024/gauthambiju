

## Plan: Fix Dynamic Background Color Sync

### Root Cause
When you set `style={{ background: 'hsla(220, 15%, 12%, 0.92)' }}` in React, the browser internally normalizes it. Reading back `element.style.background` returns something like `rgba(28, 31, 35, 0.92)` — **not** the original `hsla(...)` string. The `parseHSLA` regex never matches, so the effect silently bails out and the background never changes.

### Fix
Replace the fragile color-parsing approach with a simple, reliable solution. Since the header color is a known constant (`hsla(220, 15%, 12%, 0.92)`), we can:

1. **Store the raw color string as a `data-` attribute** on the header element (browsers don't normalize data attributes)
2. **Read the data attribute** in `Index.tsx` instead of trying to parse `element.style.background`

### Changes

#### `src/components/AssemblyHeader.tsx`
- Add `data-header-bg-value="hsla(220, 15%, 12%, 0.92)"` to the sticky div (the raw string, preserved exactly)

#### `src/pages/Index.tsx`
- Read `header.getAttribute('data-header-bg-value')` instead of `header.style.background`
- This gives us the exact `hsla(...)` string that the regex can parse correctly

### Files: 2
- `src/components/AssemblyHeader.tsx` — add data attribute with raw color value
- `src/pages/Index.tsx` — read from data attribute instead of style property

