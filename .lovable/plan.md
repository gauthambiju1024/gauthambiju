

## Plan: Dashed → Solid Construction Effect

A scroll-driven reveal where elements start as dashed outlines / ghost states and solidify as they enter the viewport — evoking "idea → execution."

### How It Works

A reusable CSS + Intersection Observer system. Elements get a `.construct` class. When off-screen, borders are dashed, text is outlined (transparent fill with stroke), and opacity is faint. As they scroll into view, a CSS transition solidifies everything.

### Implementation

#### 1. New hook: `src/hooks/useConstructReveal.ts` (~25 lines)
- Uses `IntersectionObserver` (threshold 0.15) on all `.construct` elements
- Adds class `.constructed` when element enters viewport
- `once: true` behavior — doesn't revert
- Respects `prefers-reduced-motion` (skips to solid immediately)

#### 2. CSS in `src/index.css` (~40 lines)
```css
/* Ghost / dashed state */
.construct {
  border-style: dashed;
  border-color: hsl(var(--border) / 0.3);
  opacity: 0.4;
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Solidified state */
.construct.constructed {
  border-style: solid;
  border-color: hsl(var(--border));
  opacity: 1;
}

/* Text variant — outlined → filled */
.construct-text {
  color: transparent;
  -webkit-text-stroke: 1px hsl(var(--ink) / 0.3);
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.constructed .construct-text,
.construct-text.constructed {
  color: hsl(var(--ink));
  -webkit-text-stroke: 0px transparent;
}
```

#### 3. Apply to `src/pages/Index.tsx`
- Add the hook call once at page level
- Add `.construct` class to:
  - The blueprint hero container border
  - The notebook (about) container border
  - Each `section-panel` wrapper
- Add `.construct-text` to section headings inside panels

#### 4. Apply to key section components
- **`HeroSection.tsx`**: Add `.construct-text` to the main headline
- **`AboutSection.tsx`**: Add `.construct-text` to "Notes on How I Work" heading; `.construct` to the corner-marks or divider lines
- **`ProjectsShelf.tsx`**: `.construct` on the shelf container border
- Other sections get it automatically via the panel wrapper in Index.tsx

### What the user sees
- Scrolling down: panels start with faint dashed borders, headings appear as thin outlined text
- As each element enters the viewport, borders solidify (dashed → solid), text fills in, opacity goes from 0.4 → 1
- Smooth 0.8s transition — feels like a blueprint being finalized into a real design
- One-time reveal per element (doesn't re-trigger)

### Files: 4
1. `src/hooks/useConstructReveal.ts` (new, ~25 lines)
2. `src/index.css` (add construct classes, ~40 lines)
3. `src/pages/Index.tsx` (add hook + classes to wrappers)
4. `src/components/HeroSection.tsx` (add construct-text to headline)

