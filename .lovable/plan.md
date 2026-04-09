

## Plan: Fix Assembly Header to Top

Change the header from `sticky` to `fixed` positioning so it stays locked at the top while content scrolls beneath it. Add top padding to the content so it's not hidden behind the header.

### Changes

#### 1. `src/components/AssemblyHeader.tsx` (line 531)
- Change `sticky top-0` to `fixed top-0 left-0 right-0`
- Keep `z-50` and transparent background
- Add margin-content-wrapper padding so it aligns with the panels (matching `padding-left` and `padding-right` from the `.margin-content-wrapper` CSS)

```tsx
// Before
<div className="sticky top-0 z-50" style={{ background: 'transparent' }}>

// After
<div className="fixed top-0 left-0 right-0 z-50 margin-content-wrapper" style={{ background: 'transparent' }}>
```

Note: Reusing the `margin-content-wrapper` class on the fixed header ensures its left/right padding matches the page content gutters (after the margin doodles).

#### 2. `src/pages/Index.tsx`
- Add top padding to the content below the header so it doesn't get hidden behind the fixed element (~180px scaled to viewport, roughly `pt-[13vw]` or a fixed pixel value)

### Files: 2
1. `src/components/AssemblyHeader.tsx` — fixed positioning with margin alignment
2. `src/pages/Index.tsx` — add top spacing for content below header

