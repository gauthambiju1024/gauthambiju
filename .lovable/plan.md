

## Plan: Scroll-Animated Building Clipart on Left & Right Margins

Add fixed-position decorative SVG illustrations related to building/construction on both sides of the viewport that animate (translate upward) as the user scrolls, creating a parallax diorama effect.

---

### New Component: `src/components/ScrollDoodles.tsx`

A component rendered once in `Index.tsx` that places two fixed columns of SVG building-related doodles (crane, hammer, gears, ruler, pencil, bricks, blueprint roll, protractor, wrench, lightbulb) on the left and right edges of the screen.

- **Position**: `fixed`, `left-0` and `right-0`, full viewport height, `pointer-events-none`, `z-10`
- **Scroll binding**: Use `useScroll` + `useTransform` from Framer Motion to translate each column's `y` position based on scroll progress — left column moves up slowly, right column moves up at a different speed (parallax offset)
- **SVGs**: Simple line-art/outline style doodles in `hsl(var(--primary)/0.12)` — very subtle, not distracting. ~8-10 icons per side, spaced vertically, each ~32-40px
- **Responsive**: Hidden on mobile (`hidden lg:flex`) since the margins are too narrow on small screens
- **Variety**: Left side gets architectural tools (ruler, protractor, pencil, T-square, compass). Right side gets construction items (crane, hammer, gears, bricks, wrench, lightbulb)

### Technical approach
- Each side is a `motion.div` with `style={{ y }}` driven by scroll progress
- Left column: `useTransform(scrollYProgress, [0, 1], [0, -600])`
- Right column: `useTransform(scrollYProgress, [0, 1], [100, -500])` (offset start for variety)
- SVGs are inline React components for easy color theming via `currentColor`
- Opacity is very low (~0.10-0.15) so they act as ambient decoration

### Modified: `src/pages/Index.tsx`
- Import and render `<ScrollDoodles />` inside the root div, passing `scrollYProgress` from the existing `useScroll` hook

### Files
1. `src/components/ScrollDoodles.tsx` — New component with SVG doodles and scroll animation
2. `src/pages/Index.tsx` — Add `<ScrollDoodles />` render

