

## Plan: Show Margin Doodles & Hide Container Styling

### Problems
1. **Margin doodles hidden**: The scroll container has `z-[2]`, `background: hsl(var(--background))`, and the `margin-content-wrapper` class (which sets `z-index: 2`). This opaque layer covers the fixed-position doodles at z-1.
2. **Container visually distinct**: The `rounded-t-2xl` corners and `border-t border-border/20` make the scroll container visible as a separate element.

### Solution

#### `src/pages/Index.tsx`
- Remove `rounded-t-2xl`, `border-t border-border/20` from the scroll container — no visible container edges
- Remove inline `background` style — let it be transparent so doodles show through
- Remove `relative z-[2]` — don't stack above the doodles
- Keep `margin-content-wrapper` for side padding alignment (but it won't block doodles since no background)
- Move the page background (`hsl(var(--background))`) to the outermost div only (already there)

```tsx
// Before
<div className="flex-1 overflow-y-auto rounded-t-2xl border-t border-border/20 margin-content-wrapper relative z-[2]"
  style={{ background: 'hsl(var(--background))' }}>

// After
<div className="flex-1 overflow-y-auto margin-content-wrapper">
```

### Files: 1
- `src/pages/Index.tsx` — remove container styling, let doodles show through

