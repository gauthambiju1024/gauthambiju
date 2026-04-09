

## Plan: Make Assembly Header Transparent

### Change

#### `src/components/AssemblyHeader.tsx` (line 531)
- Remove the opaque `background: 'hsl(160 20% 14%)'` inline style
- Add a transparent/translucent background instead, e.g. `background: 'transparent'` or a subtle `backdrop-filter: blur()` for readability

```tsx
// Before
<div className="sticky top-0 z-50" style={{ background: 'hsl(160 20% 14%)' }}>

// After
<div className="sticky top-0 z-50" style={{ background: 'transparent' }}>
```

### Files: 1
- `src/components/AssemblyHeader.tsx` — set background to transparent

