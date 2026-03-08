

## Plan: Separate Pages with Clear Visual Breaks (Matching Reference)

Looking at the reference site carefully, the key difference from your current layout is:

1. **Navigation lives OUTSIDE the notebook** — floating on the dark desk background
2. **Each section is a visually distinct "page"** within the notebook spine — with rounded corners, slight gaps/folds between pages, creating a stacked-pages-in-a-binder effect
3. **Ribbon bookmarks** poke out from the right edge
4. **The entire thing still scrolls smoothly** as one continuous page

### Changes

**1. `src/pages/Index.tsx`** — Restructure into stacked pages
- Move `<Navigation />` **outside** the notebook container, into the dark desk area above
- Split content into 3 distinct "page" divs inside the notebook, each with:
  - Its own `notebook-grid` background, rounded corners (top/bottom)
  - A small vertical gap between pages (4-8px) showing the dark desk color through
  - Subtle shadow on each page edge for depth
- Page 1: HeroSection + MarqueeText + BeliefsSection
- Page 2: WorkSection + StorySection  
- Page 3: ConnectSection + Footer
- Add ribbon bookmark elements on the right side of the notebook

**2. `src/components/Navigation.tsx`** — Style for floating on dark background
- Change text colors to light (cream/paper color) since it's now on the dark desk
- Keep smooth scroll behavior
- Position sticky at top so it stays visible while scrolling

**3. `src/index.css`** — Add new styles
- `.notebook-page` class: individual page styling with rounded corners, paper background, grid, own shadow
- `.notebook-page + .notebook-page`: gap between stacked pages via margin-top
- `.page-crease`: decorative fold line at the bottom of each page before the gap
- Ribbon bookmark styling

**4. No changes to section components** — HeroSection, WorkSection, etc. stay as-is since they're content inside pages

### Visual Result
```text
┌─────────────────────────────┐
│    about   Work   Connect   │  ← nav on dark bg (sticky)
│                             │
│  ╭─────────────────────╮    │
│  │ ░░ Hero + Beliefs ░░│──  │  ← page 1 (rounded, grid bg)
│  ╰─────────────────────╯    │
│     ~~~ gap (desk shows) ~~~│
│  ╭─────────────────────╮    │
│  │ ░░ Work + Story  ░░░│──  │  ← page 2
│  ╰─────────────────────╯    │
│     ~~~ gap ~~~             │
│  ╭─────────────────────╮    │
│  │ ░░ Connect + Footer░│──  │  ← page 3
│  ╰─────────────────────╯    │
└─────────────────────────────┘
```

Each page has the notebook paper texture, red border, spine, holes on the left, and ribbon bookmarks on the right — but they're visually separated as distinct pages within one scrollable view.

