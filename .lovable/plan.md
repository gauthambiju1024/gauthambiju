

## Fix: Assembly Header Background & Sticky Positioning

### Problem

1. **Transparent background**: The inline style `background: 'hsl(var(--blueprint-bg, 160 20% 14%))'` doesn't work because `--blueprint-bg` CSS variable is never defined, and the `var()` fallback syntax with raw HSL values inside `hsl()` is invalid in most browsers. Result: no background renders.

2. **Appears fixed instead of sticky**: The class says `sticky top-0` which is correct, but without a visible background the header is transparent — content scrolls behind it making it *look* fixed/floating rather than properly sticky with an opaque surface.

### Changes

#### 1. `src/components/AssemblyHeader.tsx` (line 531)

Replace the broken CSS variable background with a direct HSL value matching the blueprint surface color used elsewhere in the site:

```tsx
// Before
<div className="sticky top-0 z-50" style={{ background: 'hsl(var(--blueprint-bg, 160 20% 14%))' }}>

// After  
<div className="sticky top-0 z-50" style={{ background: 'hsl(160 20% 14%)' }}>
```

This gives the header an opaque dark green background matching the blueprint aesthetic, so content scrolls cleanly behind it.

### Files: 1
- `src/components/AssemblyHeader.tsx` — fix background color value

