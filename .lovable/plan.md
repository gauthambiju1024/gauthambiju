

## Plan: Centre-Aligned Doodles, Animated Border Lines, Inner Padding

### Changes

**1. `src/index.css`**
- **Centre-align doodles**: Add `display: flex; flex-direction: column; align-items: center;` to `.margin-doodles` so SVGs sit in the horizontal centre of each margin column
- **Doodle inner padding**: Change `.doodle` from `left: 0; right: 0` to `width: 80%` (or similar) so doodles don't touch the margin edges — combined with `align-items: center` this gives equal padding on both sides
- **Remove corner bracket styles**: Delete all `.margin-corner` rules (`.margin-corner--tl/tr/bl/br`) since they're being replaced by animated SVG lines

**2. `src/components/MarginDoodles.tsx`**
- **Replace bracket `<span>` elements with animated SVG border lines**: Inside each `margin-bg` div, replace the 4 `<span className="margin-corner ...">` with a single full-size SVG containing 4 straight lines (top, bottom, left, right edges) using the `.draw` class so they animate on scroll just like the doodles
  - Lines will be inset ~4px from edges, drawn as simple straight paths with `stroke: hsl(0 0% 100% / 0.3)` and `strokeWidth: 1`
  - These border SVGs get their own scroll-driven draw animation — they'll be the first thing drawn (mapped to scroll progress 0-0.05)
- **Layout adjustment**: In `layoutDoodles`, update positioning to use `style.margin = '0 auto'` or remove `left/right: 0` and let flexbox handle centring. Add `style.width = '80%'` to each doodle so they don't touch the margin borders

### Files: 2
1. `src/index.css` — Centre-align doodles, add inner padding, remove bracket corner styles
2. `src/components/MarginDoodles.tsx` — Replace bracket spans with animated SVG border lines, adjust doodle width for inner padding

