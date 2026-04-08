

## Plan: Assembly Line Progress Bar, Floating Nav & Blueprint Background

Keeps MarginDoodles untouched. Implements items 1, 2, and 4 from the previous plan.

---

### 1. Assembly Line Scroll Progress Bar
**New file: `src/components/AssemblyLineProgress.tsx`**

Fixed bar at the very top of the viewport (~28px tall, z-50). Contains a miniature conveyor belt SVG that mirrors the BuildGap aesthetic (same muted `hsl(220 ...)` palette, thin strokes, mono labels).

- A schematic "product" rectangle travels left-to-right based on `scrollY / maxScroll`
- 8 tick marks along the belt for each section (Home, About, Projects, etc.) with tiny 5px mono labels
- Product accumulates small detail marks as each section tick is passed
- Faint roller marks animate via rAF, gated by `document.visibilityState`
- Direct DOM mutation — no React re-renders during scroll
- `backdrop-blur-sm bg-background/80` background

### 2. Floating Navigation
**Modify: `src/components/Navigation.tsx`**

Convert the non-embedded nav to a fixed, always-visible header:
- `fixed top-[28px]` (sits below the progress bar), full width, z-40
- Always has `backdrop-blur-md bg-background/80` — remove the scroll-dependent compact toggle
- Keep intersection observer for active section highlighting and spring indicator

**Modify: `src/components/HeroSection.tsx`**
- Remove the `<Navigation embedded />` block at the bottom of the hero section
- The nav is now global, no longer needed inside hero

**Modify: `src/pages/Index.tsx`**
- Import and render `<AssemblyLineProgress />` and `<Navigation />` as fixed elements outside the scrolling content
- Add top padding (~80px) to the content wrapper to offset the fixed header stack
- Keep `<MarginDoodles />` exactly as-is

### 3. Blueprint Background with Construction Flash
**New file: `src/components/BlueprintBackground.tsx`**

Fixed full-screen background layer (z-0, pointer-events-none):

**Persistent faint grid:**
- CSS background-image grid lines in faint cyan (`hsl(200 60% 50% / 0.03)`) — barely visible

**Construction flash on panel boundaries:**
- IntersectionObserver watches each section panel
- When a panel boundary crosses the viewport center, a brief (~400ms) flash fires:
  - Grid opacity pulses from 3% to ~15%
  - Dimension arrows draw from corners via `strokeDashoffset` animation
  - Centerline crosshair appears and fades
  - Coordinate readouts tick in corners (mono text showing scrollY-derived values)
  - Tolerance ring (thin circle) expands and fades from center
  - Origin marks (small + signs) flash at nearby grid intersections
  - Rotating radial sweep line (thin cyan, one rotation over 400ms)
- All elements in faint cyan (`hsl(200 60% 50% / 0.08–0.15)`)
- Direct DOM mutation, CSS transitions, no React re-renders
- Coexists with MarginDoodles (lower z-index)

**Modify: `src/pages/Index.tsx`**
- Import and render `<BlueprintBackground />` as a fixed background layer (before MarginDoodles in DOM, z-[0])

---

### Files: 5
1. `src/components/AssemblyLineProgress.tsx` — new scroll-driven conveyor progress bar
2. `src/components/BlueprintBackground.tsx` — new fixed blueprint grid + construction flash
3. `src/components/Navigation.tsx` — convert to fixed floating nav below progress bar
4. `src/components/HeroSection.tsx` — remove embedded nav
5. `src/pages/Index.tsx` — wire up new components, add top padding, keep MarginDoodles

