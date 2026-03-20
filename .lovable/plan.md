

## Plan: Fixed Header, Smoother Word Animation, Functional Bookmarks

### 1. Move Navigation Outside Scroll Area

Currently `Navigation` is inside the scrollable `notebook-scroll-area` div (sticky). Move it **above** the scroll container but still inside the notebook frame, so it never scrolls.

**`src/pages/Index.tsx`**:
- Move `<Navigation scrollContainer={scrollRef} />` out of the scroll div, place it between the decorations and the scroll area
- Give the scroll area `h-[calc(100%-nav_height)]` to account for the fixed nav above it

### 2. Smoother Word Rotation

The current `clipPath` reveal is functional but abrupt. Make it more elegant:

**`src/components/HeroSection.tsx`**:
- Increase duration from `0.55s` to `0.7s`
- Use a softer easing curve `[0.16, 1, 0.3, 1]` (decelerate-heavy)
- Add a subtle `opacity` cross-fade (initial: 0, animate: 1, exit: 0) layered with the clipPath for a gentler feel
- Increase interval from `3500ms` to `4000ms` to give more reading time

### 3. Functional Bookmark Ribbons

Make the two ribbon bookmarks clickable — they scroll to specific sections within the notebook.

**`src/pages/Index.tsx`**:
- Replace the static `<div className="ribbon-bookmark">` elements with `<button>` elements
- First ribbon scrolls to `#work`, second to `#blog`
- Add `pointer-events: auto`, `cursor: pointer`, remove `pointer-events: none` from CSS
- Add hover effect (slight translateX or scale)
- Add a tooltip on hover showing the target section name

**`src/index.css`**:
- Add `.ribbon-bookmark-interactive` variant with hover states and `cursor: pointer`
- Keep `pointer-events: none` only on the non-interactive variant

### Files to Modify

| File | Change |
|---|---|
| `src/pages/Index.tsx` | Move nav outside scroll area, make ribbons functional buttons |
| `src/components/HeroSection.tsx` | Softer word animation timing |
| `src/index.css` | Interactive ribbon styles |

