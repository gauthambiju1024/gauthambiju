

## Plan: Add Page-Flip Animation Between Sections

### Concept
Replace the current vertical scroll layout with a page-flip book interface. Each section group becomes a "page" in a notebook that you flip through with a realistic 3D page-turn animation. The notebook frame (spine, holes, page-fold) stays fixed while pages flip inside it.

### Approach
Use the `react-pageflip` library — a mature React wrapper around StPageFlip that provides realistic CSS3D page-flip animations with touch/swipe support.

### Pages
Each section group becomes one page in the flip book:
1. **Page 1**: Hero + Marquee + Beliefs
2. **Page 2**: Work + Story
3. **Page 3**: Blog
4. **Page 4**: Connect + Footer

### Changes

**Install dependency**
- `react-pageflip` (npm package)

**`src/pages/Index.tsx`**
- Replace the scrollable `div` interior with an `HTMLFlipBook` component from `react-pageflip`
- Each section group becomes a `React.forwardRef` page component (required by the library)
- Configure flip book: single-page mode, paper size matching the notebook interior, page-flip animation on click/swipe, shadow enabled
- Remove scroll-based progress bar (no longer scrolling) — replace with a page indicator (e.g., "2 / 4")
- Add left/right arrow buttons or click zones to flip pages
- Wire navigation clicks (about, work, blog, connect) to flip to the corresponding page via the `pageFlip().flip(n)` API

**`src/components/Navigation.tsx`**
- Instead of `scrollIntoView`, call a callback that flips to the correct page number
- Pass the flip-book API ref down or use a shared context/callback

**`src/components/FlipPage.tsx`** (new)
- A `forwardRef` wrapper that gives each page the notebook paper styling, correct dimensions, and overflow-y scroll for content taller than one page

**`src/index.css`**
- Add styles for the flip book container to fit inside the notebook frame
- Style page shadows and flip animation to match the notebook aesthetic
- Each page gets the paper background and notebook grid styling

### Navigation integration
- Nav items map to page indices: about → 0, work → 1, blog → 2, connect → 3
- Clicking a nav item calls `flipBook.current.pageFlip().flip(pageIndex)`
- Active section updates based on current page number via the `onFlip` callback

### Mobile / touch
- `react-pageflip` supports swipe gestures out of the box
- On small screens, pages display in single-page mode (already the plan)

### Files

| File | Change |
|---|---|
| `package.json` | Add `react-pageflip` |
| `src/components/FlipPage.tsx` | New forwardRef page wrapper |
| `src/pages/Index.tsx` | Replace scroll layout with HTMLFlipBook, add page controls |
| `src/components/Navigation.tsx` | Change scroll-to-section to flip-to-page |
| `src/index.css` | Add flip book container styles |

