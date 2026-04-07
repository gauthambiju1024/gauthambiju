

## Plan: Fix Margin Doodles Overlap & Subtle Background

### Problem Analysis

1. **Overlap issue**: The margins are `position: fixed` with width `var(--margin-col-width)`, but the main content uses `max-w-7xl` (1280px) with no awareness of the margins. At viewports below ~1680px (1280 + 220*2), the fixed margins sit on top of the content panels.

2. **Separate background**: The `.margin-bg` uses a bright blue radial gradient (`hsl(220 55% 24%)`) that looks disconnected from the site's dark desk background (`hsl(220 15% 12%)`).

### Fixes

**1. Prevent content overlap — add margin-aware padding to Index.tsx**

The main content wrapper needs left/right padding equal to the margin column width so sections never sit behind the doodles. Apply this only at `min-width: 800px` (when margins are visible).

In `Index.tsx`, add a wrapper div around all content with responsive padding:
- `pl-[var(--margin-col-width)] pr-[var(--margin-col-width)]` at `min-[800px]`
- No padding below 800px (margins hidden)

This will be done via a style prop: `paddingLeft/Right: var(--margin-col-width)` inside a media query, or a simple CSS class.

**2. Make blueprint background subtle and blend with existing background**

Replace the bright blue gradient with a near-transparent version that blends into the existing dark background:
- Change `.margin-bg` background from `radial-gradient(ellipse at center, hsl(220 55% 24%), hsl(220 60% 16%))` to `transparent`
- Reduce grid line opacity from `0.08`/`0.18` to `0.03`/`0.06` (subtle grid only)
- Remove the visible border between margins and content (the `border-right`/`border-left` on `.margin-bg--left`/`--right`)
- Remove corner marks — they reinforce the "separate panel" look

**3. Reduce doodle z-index**

Set `.margin-doodles` z-index to `1` (below the main content's section panels which have shadows) so doodles never visually compete with sections.

### Files Modified (2)

1. **`src/index.css`** — Update `.margin-bg` background to transparent, reduce grid opacity, remove borders and corner marks styling
2. **`src/pages/Index.tsx`** — Add a CSS class or inline style that pads the content inward by `var(--margin-col-width)` on screens >= 800px

