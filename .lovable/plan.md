

## Translucent Margin Background + Header Inset After Margins

### Problem
1. The margin columns (left/right doodle areas) have a transparent background — they should have a translucent background to subtly separate them from the main content area.
2. The header currently spans `inset-x-0` (full viewport width), overlapping the margin doodles. It should start *after* the margin columns, sitting only over the central content area.

### Changes

#### 1. `src/index.css` — Translucent margin background
Update `.margin-bg` from `background: transparent` to a semi-transparent dark background:
```css
background: hsla(220, 15%, 10%, 0.4);
```
This gives the margin columns a subtle translucent tint that differentiates them from the main content while keeping the doodles visible.

#### 2. `src/components/AssemblyHeader.tsx` — Constrain header within margins
Change the outer container from `fixed inset-x-0` to respect the margin column widths. Replace:
```tsx
<div className="pointer-events-none fixed inset-x-0 top-0 z-50">
```
With:
```tsx
<div className="pointer-events-none fixed top-0 z-50"
     style={{
       left: 'calc(var(--margin-col-width, 60px) + 6px)',
       right: 'calc(var(--margin-col-width, 60px) + 6px)',
     }}>
```
This positions the header to start after the left margin and end before the right margin, only on screens ≥800px. On smaller screens (where margins are hidden), it falls back to full width via a media query or by keeping `inset-x-0` below 800px.

We'll need to handle the responsive case: below 800px the margins are hidden, so the header should be full-width. This can be done by wrapping the style in a check or using CSS classes with responsive breakpoints.

#### 3. `src/components/MarginDoodles.tsx` — Ensure margin-bg divs are rendered
Check if `margin-bg` divs exist in the render. If not, add them so the translucent background is visible.

### Files: 3
- `src/index.css` — translucent margin background
- `src/components/AssemblyHeader.tsx` — inset header after margins
- `src/components/MarginDoodles.tsx` — ensure margin-bg divs rendered

