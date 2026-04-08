

## Plan: Replace BuildGap with Dimension Annotations, Fix Margin Doodles & Progress Bar

### Issues to Fix

1. **Remove BuildGap conveyor belt animations** between panels — replace with static architect-style dimension annotations (draw-on-scroll)
2. **Margin doodles not drawing from scroll start** — the `paddingTop: 72` offset shifts content down but the scroll progress calculation doesn't account for it, so early scroll produces 0 progress
3. **Progress bar product looks fully built** — all parts start with `opacity: 0` but `Math.floor(progress * 8)` at even tiny scroll values shows parts; the real issue is the product base shape (rect + internal line) looks "complete" from the start, and parts appear too early

---

### 1. Replace BuildGap with DimensionAnnotation

**Delete animation from:** `src/components/build-story/BuildGap.tsx`

**New file:** `src/components/build-story/DimensionAnnotation.tsx`

A purely static SVG that draws itself on scroll via IntersectionObserver + scroll progress:

- **Dimension lines** with arrow-tipped extensions extending from top panel and bottom panel, meeting in the middle
- **Tick counter** marks along the dimension line
- **Leader line** with a bubble callout containing the `refCode` (e.g., "A.01 → B.02")
- **Revision stamp** box (e.g., "REV 03")
- **North arrow** icon (small compass arrow)
- All lines use `strokeDashoffset` driven by scroll progress — they draw themselves as the gap scrolls into view
- Muted `hsl(220 ...)` palette, 0.5–0.8px strokes, mono labels
- Much shorter height than BuildGap (~60–80px vs ~120px)

**Modify:** `src/pages/Index.tsx`
- Replace `BuildGap` imports/usage with `DimensionAnnotation`
- Keep the same `gapData` array for `refCode` and `label` props

### 2. Fix Margin Doodles Scroll Start

**Modify:** `src/components/MarginDoodles.tsx`

The progress calculation on line 92 uses `window.scrollY / docH` which starts at 0. But the content has 72px top padding, so the first ~72px of scroll produces progress that's nearly 0 and no visible drawing happens.

Fix: Adjust the progress calculation to start drawing immediately. Either:
- Use a small negative offset so progress > 0 from the first scroll pixel
- Or scale progress so the first doodle starts drawing at `scrollY = 0`

Simplest fix: change progress formula to start slightly ahead, e.g. `Math.max(0, (scrollY + 72) / docH)` clamped to 1.

### 3. Fix Progress Bar Product Starting "Built"

**Modify:** `src/components/AssemblyLineProgress.tsx`

Two issues:
- The product's base shape (filled rect + internal detail line) is always visible, making it look complete from the start
- Parts appear too early because `Math.floor(progress * 8)` shows part 0 at any scroll > 0

Fixes:
- Start the product as a faint outline only (lower fill opacity, dashed stroke) and progressively solidify it as scroll increases
- Change parts threshold: use `Math.floor(progress * (SECTIONS.length + 1))` or require higher progress per part so part 0 only appears after passing the first section
- Add a "build progress" visual: the product rect fill opacity interpolates from ~0.05 to 0.25 based on scroll progress

---

### Files: 4
1. `src/components/build-story/DimensionAnnotation.tsx` — new architect-style dimension annotation with draw-on-scroll
2. `src/pages/Index.tsx` — swap BuildGap for DimensionAnnotation
3. `src/components/MarginDoodles.tsx` — fix progress offset so doodles draw from first scroll
4. `src/components/AssemblyLineProgress.tsx` — fix product appearing fully built at start

