

## Remove Translucent Margins + Restore Frosted Header Background

### Changes

#### 1. `src/components/MarginDoodles.tsx` — Remove translucent margin backgrounds
Delete the two `margin-bg` divs (lines 173-175). The margins go back to being transparent.

#### 2. `src/index.css` — Revert `.margin-bg` background
Set `.margin-bg` background back to transparent (or leave it — won't matter once the divs are removed, but clean is better).

#### 3. `src/components/AssemblyHeader.tsx` — Add frosted-glass background
Wrap the SVG in (or apply to the existing outer/inner div) a frosted-glass container styled for the 90px height:

```tsx
<div className="pointer-events-none fixed top-0 z-50 left-0 right-0 
  min-[800px]:left-[calc(var(--margin-col-width,60px)+6px)] 
  min-[800px]:right-[calc(var(--margin-col-width,60px)+6px)]">
  <div className="relative" style={{
    background: 'hsla(220, 15%, 12%, 0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    maskImage: 'linear-gradient(to bottom, black calc(100% - 4px), transparent 100%), linear-gradient(to right, transparent 0px, black 3px, black calc(100% - 3px), transparent 100%)',
    WebkitMaskImage: '...',
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
  }}>
    <svg ...>
```

This restores the soft-edged frosted glass look from the previous header, now fitting the compact 90px height.

### Files: 3
- `src/components/MarginDoodles.tsx` — remove margin-bg divs
- `src/index.css` — clean up margin-bg style
- `src/components/AssemblyHeader.tsx` — add frosted background to header container

