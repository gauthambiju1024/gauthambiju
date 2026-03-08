

## Plan: Book with Separate Pages

Transform the single-scroll notebook into a multi-page book with three navigation modes: page-flip animations, side bookmark tabs, and scroll-within-page with visual page breaks.

### Page Structure

Split content into 3 book pages:
- **Page 1 "About"**: Navigation + HeroSection + MarqueeText + BeliefsSection
- **Page 2 "Work"**: WorkSection + StorySection
- **Page 3 "Connect"**: ConnectSection (with Globe) + Footer

### New Components

**1. `src/components/Book.tsx`** — Main book controller
- State: `currentPage` (0-2), `direction` (1 or -1 for flip direction)
- Uses `framer-motion` `AnimatePresence` with custom page-flip variants (rotate on Y-axis with perspective, or slide with opacity)
- Renders one page at a time inside the notebook shell
- Left/right arrow buttons on the sides for flipping
- Keyboard arrow key support
- Each page scrolls independently (overflow-y-auto within the notebook)

**2. `src/components/BookPage.tsx`** — Wrapper for each page
- Accepts `pageNumber` and `label` (e.g. "page 01")
- Renders the tape-strip page label, notebook decorations (spine, margin, holes, page fold)
- Content area with scroll

### Updated Components

**3. `src/components/NotebookLayout.tsx`** — Simplify
- Remove content wrapper, just render the outer desk-pattern background
- The Book component handles the notebook container itself

**4. `src/pages/Index.tsx`** — Use Book
- Replace the flat layout with `<Book>` containing 3 pages
- Remove section-dividers (pages are naturally separated)

**5. `src/components/Navigation.tsx`** — Bookmark tabs
- Convert nav items into side bookmark tabs (positioned on the right edge of the book)
- Clicking a tab jumps to that page with flip animation
- Active tab is visually distinct (extended further out, highlighted with primary color)
- Tabs visible on all pages

### Animation Details

- Page flip: `framer-motion` variants with `rotateY` and perspective for a 3D book-flip feel, or a simpler crossfade + slide if performance is a concern
- Direction-aware: flipping forward slides/rotates right-to-left, backward left-to-right
- Swipe support via `drag="x"` on the page container with `onDragEnd` threshold detection

### Visual Details

- Dark desk background stays exactly the same (`hsl(20 15% 8%)`)
- Each page keeps the notebook paper texture, grid lines, spine, holes
- Bookmark tabs stick out from the right edge like real divider tabs
- Page numbers on tape strips update per page
- Arrow buttons styled subtly on the desk area (outside the notebook)

