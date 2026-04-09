

## Fix: Header Visibility, Margin Doodle Masking & Soft Edges

### Problems
1. **Header not visible** — The header SVG uses very dim/subtle colors on a transparent background, making it invisible against the dark page background. The fixed mask at `z-[49]` with the same background color as the page also sits directly behind it, but the header SVG ink colors are too faint.
2. **Mask covers margin doodles** — The fixed mask div spans `left-0 right-0`, covering the full viewport width including the margin doodle columns on the sides.
3. **Hard edges** — The mask has a sharp bottom edge at `h-[160px]`, creating an abrupt cutoff.

### Solution

#### `src/pages/Index.tsx` (line 27)
- Narrow the mask to only cover the content area (respect margin padding) by using the same `margin-content-wrapper` padding values
- Add a gradient fade at the bottom edge instead of a hard cutoff using `mask-image: linear-gradient(to bottom, black 60%, transparent 100%)`
- This leaves the side margin doodle columns uncovered

#### `src/components/AssemblyHeader.tsx` (line 531)
- Give the header a very subtle semi-transparent background so the SVG elements are readable: `background: 'hsla(220, 15%, 12%, 0.85)'` with `backdropFilter: 'blur(8px)'`
- This provides enough contrast for the header SVG to be visible while still feeling transparent/glassy

### Changes

**`src/pages/Index.tsx`** — Change the fixed mask div:
- Add CSS class to respect margin column widths (use same padding as `margin-content-wrapper`)
- Replace hard bottom edge with gradient mask: `maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'`
- Apply margin-aware left/right padding so doodles show through

**`src/components/AssemblyHeader.tsx`** — Update header container:
- Add semi-transparent background + backdrop blur for readability
- `background: 'hsla(220, 15%, 12%, 0.8)'`, `backdropFilter: 'blur(12px)'`, `borderBottom: '1px solid hsla(220, 15%, 20%, 0.3)'`

### Files: 2
- `src/pages/Index.tsx`
- `src/components/AssemblyHeader.tsx`

