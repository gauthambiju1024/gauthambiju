

## Plan: Prevent Panels from Scrolling Behind Header

The header is `sticky top-0` with a transparent background, so content scrolls visibly behind it. The fix: use `clip-path` or `overflow: clip` on the header wrapper won't work with transparent bg. Instead, the content below needs to be clipped so it doesn't render in the header's space.

### Approach

Use CSS `clip-path` on the scrollable content area to clip anything that enters the header zone. Alternatively, simpler: wrap the content below the header in a container that establishes its own stacking context and clips at the top.

The cleanest solution: add `clip-path: inset(0 0 0 0)` on the sticky header div. This creates a clipping boundary — content scrolling behind the transparent header will be hidden because the header's clip-path prevents anything underneath from showing through its bounding box... but that clips the header itself, not content behind it.

**Correct approach**: The content sections need to be clipped so they don't visually overlap the header. Apply `clip-path: inset(0)` on the **content container** below the header, which will clip content at its own edges. But since sticky takes space in flow, content doesn't actually overlap unless we use negative margins.

**Simplest fix**: Since the header is transparent and sticky, content naturally scrolls behind it. To prevent this, change the header from `sticky` to `relative` (non-sticky) so it just sits at the top and scrolls away. But the user likely wants it to stay visible.

**Best fix**: Keep sticky, but clip content that passes behind it. Add a pseudo-element or a clip wrapper. The most reliable method: on the content wrapper div (the sibling content after the header), set `clip-path: inset(0 -100% -100% -100%)` — this clips only the top edge, preventing content from rendering above its container's top boundary. But since the content div starts right after the header in flow, it won't overlap unless scrolled.

Actually the real issue is simple: with `sticky top-0`, the header occupies space in the document flow AND sticks. Content below it in the DOM scrolls up and **behind** it because `z-50` puts the header on top. Content is visible through the transparent background.

**Solution**: Give the header an opaque mask that hides content behind it, but the user wants transparency. The alternative: use `backdrop-filter` with a clip, or simply set `overflow: clip` combined with containing the scroll.

**Practical solution**: Wrap the content sections in a div with `clip-path: inset(0 0 0 0)`. This creates a clipping context — as the content scrolls up, anything that goes above the container's visual boundary (i.e., behind the header) gets clipped.

### Changes

#### `src/pages/Index.tsx`
- Wrap all content after `<AssemblyHeader>` in a `<div style={{ clipPath: 'inset(0 0 0 0)' }}>` — this clips content at the div's boundary, so as sections scroll behind the sticky header, they disappear instead of showing through the transparent header.

### Files: 1
- `src/pages/Index.tsx`

