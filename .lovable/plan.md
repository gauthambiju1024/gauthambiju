

## Plan: Production-Grade Animations, Unified Notebook Page, and Scrollytelling

### Problem Analysis

From the screenshot and code:
1. **Animations** — Current framer-motion animations use basic `initial/animate` with hardcoded delays. Word rotation uses `mode="wait"` causing jarring swaps. No GPU-optimized properties (`will-change`), no staggered orchestration.
2. **Page structure** — Currently 3 separate `notebook-page` divs (about, work, connect) each with their own border/spine/holes. The screenshot shows a single continuous notebook page where all sections scroll within one page with a persistent top border.
3. **No scrollytelling** — Sections just fade in with `useInView`. Need scroll-progress-driven animations (parallax, reveal, progress indicators).

### Changes

#### 1. Unified Notebook Page (`Index.tsx`)

Replace the multi-`NotebookPage` structure with a **single** notebook container. All sections render inside one notebook with continuous spine, margin, holes, and a single outer border. Remove `NotebookPage` component entirely.

```text
Before:                          After:
┌─── about page ───┐            ┌─── single notebook ───┐
│ hero / marquee   │            │ hero                   │
│ beliefs          │            │ marquee                │
└──────────────────┘            │ beliefs                │
┌─── work page ────┐            │ ── divider ──          │
│ work / story     │            │ work                   │
└──────────────────┘            │ story                  │
┌─── connect page ─┐            │ ── divider ──          │
│ connect / footer │            │ connect                │
└──────────────────┘            │ footer                 │
                                └────────────────────────┘
```

- Single `.notebook` wrapper with spine, margin, holes, page-fold
- Section `id` attributes placed on individual section wrappers for scroll targeting
- Bookmark ribbons positioned at fixed offsets within the single page

#### 2. Production-Grade Animations

**Hero section**:
- Use `useScroll` + `useTransform` for parallax on the portrait image (moves slower than scroll)
- Smoother word rotation: use `spring` transitions with `clipPath` reveal instead of y-translate
- Add `will-change: transform` to animated elements
- Stagger children using `staggerChildren` variant orchestration instead of manual delays

**All scroll-triggered sections** (Beliefs, Work, Story, Connect):
- Replace `useInView` boolean with `useScroll({ target, offset })` + `useTransform` for progressive reveal
- Elements animate proportionally to scroll position, not just on/off
- Use `motion.div` with `style={{ opacity, y, scale }}` bound to scroll progress transforms

**Marquee**: Add `will-change: transform` for GPU compositing, use `translateZ(0)` hack.

**Navigation**: Add scroll-spy using `IntersectionObserver` to update `activeSection` based on which section is in viewport.

#### 3. Scrollytelling Implementation

Using framer-motion's `useScroll` and `useTransform` (already installed):

- **Global scroll progress bar** — thin line at top of viewport showing page scroll progress
- **Section reveal animations** — each section fades/slides in based on its scroll position within the viewport, not just "is in view"
- **Parallax layers** — hero portrait parallaxes, globe in connect section parallaxes
- **Sticky text reveals** — In StorySection, heading stays sticky while body text scrolls up to reveal stats
- **Progress-driven number counters** — Stats in StorySection count up as user scrolls through

**New hook**: `useScrollReveal(ref)` — returns `{ scrollYProgress, opacity, y }` transforms for consistent scroll-driven animation pattern across sections.

### Files to Modify

| File | Changes |
|---|---|
| `src/pages/Index.tsx` | Single notebook container, remove NotebookPage, add scroll progress bar |
| `src/components/HeroSection.tsx` | Parallax portrait, staggered variants, smoother word rotation |
| `src/components/BeliefsSection.tsx` | Scroll-driven progressive reveal per belief |
| `src/components/WorkSection.tsx` | Scroll-driven stagger, parallax hover |
| `src/components/StorySection.tsx` | Sticky heading scrollytelling, animated counters |
| `src/components/ConnectSection.tsx` | Globe parallax, scroll-driven link reveals |
| `src/components/Navigation.tsx` | Scroll-spy for active section, backdrop blur |
| `src/components/MarqueeText.tsx` | GPU-optimized animation |
| `src/hooks/useScrollReveal.ts` | New shared hook for scroll-driven transforms |
| `src/index.css` | Update notebook styles for single-page layout, add scroll progress bar styles |

