

## Plan: Page Flip Transitions, Diary Polish, Section Reorder, Production UI

### 1. Page Flip Transitions (`App.tsx`, new `PageTransition.tsx`)

Create a `PageTransition` wrapper component using Framer Motion's `AnimatePresence` with a 3D page-flip effect:

- Wrap `<Routes>` with `AnimatePresence` and use `useLocation()` as key
- Each page gets a `PageTransition` wrapper with:
  - **Enter**: `rotateY(-90deg) → 0` with `perspective(1200px)`, opacity 0→1, ~0.5s ease
  - **Exit**: `rotateY(0) → 90deg`, opacity 1→0
  - `transformOrigin: 'left center'` to simulate a page turning from the spine
- Apply to Index, BlogPage, BlogPostPage

### 2. Fix Diary Elements (Ribbons, Spine)

From the screenshot, the ribbon bookmarks overlap content/images incorrectly. Fix:

- **Ribbons**: Move them inside the notebook container but ensure `pointer-events: none`, proper `z-index` (above paper, below interactive content), and clip to the right edge naturally
- **Reduce ribbon height** and add a tapered bottom (CSS `clip-path` for a "V" notch at the bottom like a real bookmark ribbon)
- **Add subtle paper texture**: Use a CSS noise filter or subtle gradient overlay on `.notebook` for authentic paper feel
- **Page fold**: Make it more subtle and realistic with a curved shadow

### 3. Blog Above Connect (Section Order)

Update the default fallback group order in `Index.tsx`:
- Change from: `[['hero', 'marquee', 'beliefs'], ['work', 'story'], ['connect', 'footer']]`
- Change to: `[['hero', 'marquee', 'beliefs'], ['work', 'story'], ['blog'], ['connect', 'footer']]`

Add `blog` section between story and connect groups. The database `homepage_sections` already has the blog entry — this just fixes the fallback/default ordering.

### 4. Production-Grade UI Polish

- **Hero word rotation**: Switch to `clipPath` based reveal — words slide up with `clipPath: inset(0 0 100% 0)` → `inset(0)` for a smooth mask reveal instead of y-translate + opacity (eliminates layout shift entirely)
- **Smoother section transitions**: Add subtle `scale` transform (0.98→1) alongside opacity/y for depth
- **Navigation**: Add `border-bottom` separator when scrolled, smooth `backgroundColor` transition
- **Marquee**: Pause on hover for interactivity
- **Footer**: Polish with proper spacing and subtle entrance

### Files to Modify

| File | Change |
|---|---|
| `src/components/PageTransition.tsx` | **New** — 3D page flip wrapper |
| `src/App.tsx` | Add AnimatePresence + PageTransition around routes |
| `src/pages/Index.tsx` | Fix fallback section order (blog before connect) |
| `src/components/HeroSection.tsx` | clipPath word reveal for smoother animation |
| `src/components/Navigation.tsx` | Scroll-aware border, polish |
| `src/components/MarqueeText.tsx` | Pause on hover |
| `src/index.css` | Ribbon V-notch, paper texture, refined page-fold, polish |
| `src/pages/BlogPage.tsx` | Wrap in PageTransition |
| `src/pages/BlogPostPage.tsx` | Wrap in PageTransition |

