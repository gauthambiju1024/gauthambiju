

## Plan: Tighten Margin-Panel Gap, Bolder Brackets, Contained Doodles

### Changes

**1. `src/index.css`**

- **Reduce margin-to-panel spacing**: Change `margin-content-wrapper` padding from `calc(var(--margin-col-width) - 10px)` to `calc(var(--margin-col-width) - 18px)` — panels expand ~8px closer to margins on each side
- **Bolder corner brackets**: Increase `.margin-corner` opacity from `0.15` to `0.35` and border width from `1px` to `1.5px`
- **Remove doodle rotations**: The `nth-child` rotate/translate transforms on `.doodle` cause overlap in tight columns — remove all four rotation rules so doodles stack cleanly without overlapping
- **Remove doodle padding**: Set `.doodle` padding to `0` to eliminate any vertical overflow

**2. `src/components/MarginDoodles.tsx`**

- **Constrain doodles within brackets**: Adjust `layoutDoodles` to respect bracket insets — use `topPad = 28` (below top brackets) and cap total height to `viewportHeight - 56` (above bottom brackets)
- **Scale gap dynamically**: After measuring all doodle heights, if total exceeds available space, reduce gap to 0 and scale SVGs down via a `transform: scale()` factor so everything fits without overlap
- Logic: `availableHeight = window.innerHeight - 56; totalNatural = sum(heights); if totalNatural > availableHeight: scaleFactor = availableHeight / totalNatural` then apply to container

### Files: 2
1. `src/index.css` — Tighter padding, bolder brackets, remove rotation transforms
2. `src/components/MarginDoodles.tsx` — Constrain doodle stack within bracket bounds, scale to fit

