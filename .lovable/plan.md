

## Plan: Make Hero Section Full Viewport Height

### Changes

#### `src/pages/Index.tsx`
- Add `min-h-screen` to the hero wrapper div (line 27) so the blueprint surface fills the viewport
- Remove top padding (`pt-2 md:pt-4`) on the hero outer wrapper so it sits flush

#### `src/components/HeroSection.tsx`
- Add `min-h-screen` and `flex flex-col` to the `<section>` element
- Add `flex-1` to the main content area so it stretches to fill available space
- Keep the navigation bar pinned at the bottom via the flex layout

### Files: 2
1. `src/pages/Index.tsx` — add `min-h-screen` to hero container
2. `src/components/HeroSection.tsx` — flex layout to fill height

