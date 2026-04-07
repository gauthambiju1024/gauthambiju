

## Plan: Remove All Margin Doodle Animations

Delete the `ScrollDoodles` component and its usage from the homepage.

### Changes

**1. Delete `src/components/ScrollDoodles.tsx`**

**2. Edit `src/pages/Index.tsx`**
- Remove the `ScrollDoodles` import (line 11)
- Remove `<ScrollDoodles scrollYProgress={scrollYProgress} />` (line 28)
- The `scrollYProgress` and `useScroll` can stay since they're used by the progress bar

**3. Optionally clean `src/index.css`**
- Remove the `.doodle-column` CSS class (no longer needed)

### Files: 3
1. `src/components/ScrollDoodles.tsx` — Delete
2. `src/pages/Index.tsx` — Remove import and usage
3. `src/index.css` — Remove `.doodle-column` class

