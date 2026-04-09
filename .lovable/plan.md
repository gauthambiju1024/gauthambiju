

## Full-Viewport Panels with Internal Scrolling & Margins

### What You'll Get
Each section panel fills exactly one screen height, with breathing room above (below the header) and below (above the viewport bottom). Only one panel is visible at a time. Content taller than the panel scrolls internally.

### Layout Math
- Header height: ~160px (CSS variable `--header-height`)
- Top gap (header → panel): 16px
- Bottom gap (panel → viewport edge): 16px
- Panel height: `calc(100vh - var(--header-height, 160px) - 32px)`

### Changes

#### `src/index.css`
Add new utility class and CSS variable:
```css
:root {
  --header-height: 160px;
}

.viewport-panel {
  height: calc(100vh - var(--header-height, 160px) - 32px);
  overflow-y: auto;
  margin-top: 16px;
  /* Reuse existing notebook scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--notebook-border) / 0.3) transparent;
}
```

#### `src/pages/Index.tsx`
- Remove vertical margins (`my-6 md:my-8`) and top padding from section wrappers
- Add `viewport-panel` class to each section's outer wrapper (home, about, and all panelSections)
- Move the `id` attribute to the outer wrapper so scroll-snap targets the full panel
- The inner panel/notebook/blueprint div gets `h-full overflow-y: auto` to enable internal scrolling while keeping its visual styling

### Files: 2
- `src/index.css`
- `src/pages/Index.tsx`

