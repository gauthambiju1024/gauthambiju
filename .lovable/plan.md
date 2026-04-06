

## Plan: Upgrade Scroll Doodles to Draw-on-Scroll Engineering Borders

Replace the current simple parallax doodles with a richer, draw-on-scroll system inspired by the reference — SVG paths that progressively draw themselves (stroke-dashoffset animation driven by scroll), more icons across categories (engineering, business, code, design, ideas), and a soft fade gradient at the edges so the doodles blend into the background.

---

### Changes

**1. `src/components/ScrollDoodles.tsx` — Full rewrite**

- **Many more doodles** (~12-15 per side): Add business charts (bar chart, pie chart, growth arrow), code symbols (curly braces, terminal), design elements (grid/golden ratio, pen tool), idea icons (rocket, star, satellite), and keep existing engineering ones (crane, gear, wrench, lightbulb, bricks)
- **Draw-on-scroll effect**: Each SVG uses `strokeDasharray` + `strokeDashoffset` driven by `useTransform` mapped to scroll progress. As the user scrolls, paths progressively "draw" themselves in — earlier doodles draw first, later ones draw as you scroll further
- **Staggered reveal**: Each doodle maps to a different scroll range (e.g., doodle 1 draws at 0-15%, doodle 2 at 5-20%, etc.) so they cascade down as you scroll
- **Fade-in opacity**: Each doodle also fades from 0 to its target opacity (~0.15-0.20) as it draws, using the same scroll-mapped transform
- **Parallax movement**: Keep the existing vertical parallax translation but increase range for more travel
- **Edge fade gradients**: Add `::after` pseudo-elements or gradient overlays on the left/right columns so doodles fade softly into the dark background at top and bottom edges
- **Slight rotation variety**: Alternate between small rotations (-6deg to 6deg) for a hand-drawn notebook margin feel
- **Color variety**: Most doodles in `primary/0.15`, some accent doodles in `gold/0.12` for warmth
- **Responsive**: Still hidden below `lg` breakpoint

**2. `src/index.css` — Add border fade utility**

- Add `.doodle-column` class with a vertical gradient mask (`mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)`) so doodles fade at viewport top/bottom edges

### SVG Categories (per side)

**Left column** (~12 items): Ruler, Protractor, Pencil, T-Square, Compass, Bar Chart, Curly Braces, Grid, Coffee Cup, Lightbulb, Satellite, Paper Plane

**Right column** (~12 items): Crane, Hammer, Gear, Bricks, Wrench, Pie Chart, Terminal, Pen Tool, Rocket, Star, Antenna/WiFi, Blueprint Roll

### Technical approach

```tsx
// Each doodle gets a scroll range for its draw animation
const getDrawRange = (index: number, total: number) => {
  const start = (index / total) * 0.6;
  const end = start + 0.25;
  return [start, Math.min(end, 1)];
};

// Inside each doodle wrapper:
const [start, end] = getDrawRange(i, doodles.length);
const drawProgress = useTransform(scrollYProgress, [start, end], [1, 0]); // 1 = hidden, 0 = fully drawn
const opacity = useTransform(scrollYProgress, [start, end], [0, 0.18]);
```

Each SVG path gets `strokeDasharray={pathLength}` and `strokeDashoffset` bound to the motion value.

### Files modified (2)
1. `src/components/ScrollDoodles.tsx` — Full rewrite with draw-on-scroll animation and more icons
2. `src/index.css` — Add `.doodle-column` gradient mask utility

