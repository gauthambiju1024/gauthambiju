

## Fix: Prevent Panels from Scrolling Behind Transparent Header

### Problem
The current `clip-path: inset(0 -100% -100% -100%)` on the content wrapper doesn't work because `clip-path` clips relative to the element's own border box, which scrolls with the content. It doesn't create a viewport-relative clipping boundary.

### Solution
The `clip-path` approach needs to be on a container that **contains both** the sticky header and the content — i.e., the `margin-content-wrapper` div. When `clip-path: inset(0)` is applied to this outer wrapper, it creates a clipping context. The sticky header sticks within this context, and content that scrolls past the top of this container gets clipped. But the header itself also gets clipped at the same boundary, so it remains visible since it's sticky at `top: 0`.

However, the real fix is simpler: since the header is transparent and sticky, content naturally renders behind it because the header has no background to occlude it. The `clip-path` on the content container won't help because the content is still within its own bounds as it scrolls.

**Correct approach**: Change the header from `sticky` to using `position: sticky` with the content container having `overflow: clip` (not `hidden`, which breaks sticky). Actually, the cleanest fix:

Move the `clip-path` from the content div to the **outer wrapper** (`margin-content-wrapper`), using `clip-path: inset(0)`. This makes the wrapper a clip root — the sticky header stays visible at `top: 0` within it, and any content that scrolls above the wrapper's top edge gets clipped. Since the sticky header sits at the very top, content scrolling behind it will be clipped at the wrapper boundary before it reaches the header.

Wait — this still won't work because the wrapper itself scrolls with the page. The wrapper's top edge scrolls off screen too.

**Actually correct approach**: The issue is that `clip-path` on a scrolling element clips relative to that element's box, which moves. We need a **fixed-position masking layer** or to make the **body/viewport** the clip context.

**Simplest reliable fix**: Add a pseudo-element or real div that acts as a **mask** — a `position: fixed; top: 0; height: [header-height]; z-index: 49` div with the page background color, sitting just behind the header. This effectively "paints over" any content that scrolls behind the transparent header area, using the page background color to match.

### Changes

#### 1. `src/pages/Index.tsx`
- Remove the non-working `clip-path` from the content wrapper
- Add a fixed mask div before the `AssemblyHeader`: a `position: fixed; top: 0; left: 0; right: 0; height: ~160px; z-index: 49` div with `background: hsl(var(--background))` — this sits behind the header (z-49) but above content (z < 49), painting over any content that scrolls into the header zone
- The header at z-50 renders on top of this mask, keeping its transparent look while the mask hides content behind it

This approach is clean — the mask uses the same background color as the page, so it's invisible but blocks content from showing through the header.

### Files: 1
- `src/pages/Index.tsx`

