
## Fix CSS Build Error

The preview is broken because `src/index.css` has a Google Fonts `@import` *after* the `@tailwind` directives. Per CSS spec, `@import` must come before all other statements — Vite is rejecting the file, which kills the whole stylesheet (and the page).

### Change

In `src/index.css`, move the `@import url('https://fonts.googleapis.com/...')` line so it sits **above** the three `@tailwind base/components/utilities` directives.

Before:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/...');
```

After:
```css
@import url('https://fonts.googleapis.com/...');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

That's the only edit. The 3D desk, scroll behavior, and all other recent changes stay exactly as they are.

### Files Changed
- `src/index.css` — reorder lines 1–5 only.

### Out of Scope
- Everything else.
