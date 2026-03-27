

## Plan: Strategy Wall — Vertical Scroll with Custom Scrollbar

### What changes

**`src/components/ThinkingWall.tsx`**
- Switch from horizontal `flex` row to a **vertical grid layout** (2 columns on desktop, 1 on mobile) with `max-height` and `overflow-y-auto`
- Remove all horizontal drag-to-scroll logic (`handleMouseDown`, `handleMouseMove`, etc.)
- Cards laid out in a masonry-like grid within the corkboard area, scrolling vertically
- Replace the native scrollbar with a **custom thin scrollbar** using a styled track — a semi-transparent pill indicator on the right edge of the corkboard, auto-hiding when not scrolling (CSS-only approach with `scrollbar-width: none` + a custom scroll indicator div, or use Radix `ScrollArea` already in the project)

### Layout

```text
┌─────────────────────────────────┐
│  The Strategy Wall              │
│  subtitle text                  │
│ ┌─────────────────────────┐ ┌─┐│
│ │ ┌──────┐  ┌──────┐      │ │▓││ ← custom scroll indicator
│ │ │sticky│  │frame │      │ │ ││
│ │ └──────┘  └──────┘      │ │ ││
│ │ ┌──────┐  ┌──────┐      │ │ ││
│ │ │diag  │  │sticky│      │ │ ││
│ │ └──────┘  └──────┘      │ └─┘│
│ └─────────────────────────┘    │
└─────────────────────────────────┘
```

### Implementation details

- Use **Radix ScrollArea** (already installed at `src/components/ui/scroll-area.tsx`) to wrap the cards grid — this gives a minimal, styled scrollbar that replaces the browser default
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`
- Container max-height: `max-h-[520px]` to constrain and enable vertical scroll
- Style the Radix `ScrollBar` thumb with a rounded, semi-transparent pill (matching the whiteboard aesthetic)
- Keep all card styling (rotations, pins, tape, hover effects) unchanged

### Files modified
- `src/components/ThinkingWall.tsx` — layout + ScrollArea integration

