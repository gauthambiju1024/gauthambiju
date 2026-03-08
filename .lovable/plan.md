

## Plan: Revert to Scrollable Notebook (Matching Reference)

The reference site (jackiezhang.co.za) uses a **single continuous scrollable notebook** — not paginated pages with flip animations. Content flows vertically inside one notebook container, and the top navigation scrolls to sections. This means reverting the book/page-flip approach.

### Changes

**1. `src/pages/Index.tsx`** — Replace `<Book>` with a single scrollable notebook layout
- Render all sections (Hero, Marquee, Beliefs, Work, Story, Connect, Footer) in one continuous flow inside a notebook container
- Add `id` attributes to each section for scroll-to navigation
- Keep the dark desk background with the notebook centered

**2. `src/components/Navigation.tsx`** — Restore scroll-to navigation
- Keep nav items at top (about, Work, Connect)
- `scrollToSection` smoothly scrolls within the notebook container (not the page)
- Style to match reference: centered nav with handwritten font

**3. Remove `src/components/Book.tsx`** — No longer needed (page-flip logic removed)

**4. `src/components/BookPage.tsx`** — Repurpose as the outer notebook shell
- Single wrapper with notebook border, grid background, spine, holes, margin
- Content scrolls inside via `overflow-y: auto` or natural page scroll
- Keep rounded corners, red border matching reference

**5. CSS/Layout adjustments**
- Notebook container gets `max-width` constraint and vertical padding on the desk
- Smooth scroll behavior (`scroll-behavior: smooth`) on the notebook container
- Section dividers between content blocks restored
- `whileInView` framer-motion animations on each section as they scroll into view (fade-in, slide-up) — this is the animation style from the reference

### Animation Style (from reference)
- Sections animate in with `whileInView` fade + translateY as user scrolls
- Staggered children animations within sections
- No page-flip or rotateY — purely scroll-triggered entrance animations

