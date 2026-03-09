

## Plan: Blog on Homepage, Remove Grid, Section Animations, Smooth Word Rotation

### 1. Add Blog Section to Homepage

**New component**: `src/components/BlogSection.tsx`
- Fetch latest 3 published blog posts using `useBlogPosts()`
- Display as a minimal list (title, date, excerpt) with scroll-driven reveal animations
- "View all →" link to `/blog`
- Style consistent with WorkSection (handwritten font, hover effects)

**Update `Index.tsx`**:
- Import `BlogSection` and add `blog: BlogSection` to `sectionMap`
- Add `blog: 'blog'` to `sectionAnchors`

**Update `Navigation.tsx`**:
- Change blog nav item from `isRoute: true` to a scroll target on homepage (remove `isRoute` flag)

**Database**: Add a `blog` row to `homepage_sections` table (migration) with `page_group: 'work'`, positioned after story.

### 2. Remove Grid Background

**Update `src/index.css`**:
- Remove the grid lines from `.notebook-grid` class — keep the class but remove the `background-image` with the grid pattern. The notebook paper stays plain/clean.

### 3. Animated Section Dividers

**Update `src/index.css`**:
- Enhance `.section-divider` with a subtle animated line-draw effect

**Update `Index.tsx`**:
- Wrap each section group divider in a `motion.div` with scroll-driven opacity/scaleX animation (line draws in as you scroll to it)
- Each section wrapper gets a `motion.div` with scroll-triggered fade-up entry

### 4. Smoother Word Rotation in Hero

**Update `HeroSection.tsx`**:
- Replace `AnimatePresence mode="popLayout"` with `mode="wait"` 
- Switch from spring physics to a smooth tween with custom cubic-bezier easing
- Remove `filter: blur()` animation (causes jank on some GPUs) — use only `opacity` + `y` transform
- Add `layout` prop to the static text to prevent layout shift during word swap
- Increase transition duration slightly for a more elegant feel

### Files to Modify
| File | Change |
|---|---|
| `src/components/BlogSection.tsx` | New — blog preview section |
| `src/pages/Index.tsx` | Add blog to sectionMap, animated dividers |
| `src/components/Navigation.tsx` | Blog becomes scroll target |
| `src/components/HeroSection.tsx` | Smoother word animation |
| `src/index.css` | Remove grid, enhance divider |
| Migration SQL | Insert blog row into homepage_sections |

