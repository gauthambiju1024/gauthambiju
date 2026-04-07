

## Plan: Port Fixed-Margin SVG Doodle System from HTML Reference

Port the exact SVG-based scroll-drawing margin animation from the uploaded HTML into the React site, adapting only colors and sizing to match the existing design system.

---

### Architecture

The reference uses a simple, elegant approach:
- **Fixed blueprint backgrounds** on left and right margins (never scroll)
- **Fixed doodle containers** with absolutely-positioned SVG doodles filling the viewport height
- **Scroll-progress mapping**: each doodle `i` of `n` draws between scroll `i/n` and `(i+1)/n`
- **SVG stroke-dashoffset** animation for the drawing effect
- **Fade class** toggled at 92% completion for text/label reveal

### Color Mapping (Reference → Site)

| Reference | Site equivalent |
|-----------|----------------|
| `--blueprint` (#18375F) | `hsl(var(--primary))` (220 60% 50%) |
| `--blueprint-deep` (#0E2747) | Darker primary variant |
| `--chalk` (#F4F1E8) | `hsl(var(--card))` or `hsl(0 0% 100% / 0.85)` |
| `--accent-warn` (#E8B26B) | `hsl(var(--gold))` |
| `--accent-red` (#E37B6C) | `hsl(var(--destructive))` |
| `--accent-cyan` (#7DBFCE) | Cyan accent (keep or map to lighter primary) |
| Grid lines | Use site's `--primary` at low opacity |

### Responsive Sizing

| Viewport | Margin width |
|----------|-------------|
| > 1280px | 220px (matches reference) |
| 1100-1280px | 170px |
| 800-1100px | 80px |
| < 800px | Hidden (no margins on mobile) |

---

### Files

**1. Create `src/components/MarginDoodles.tsx`** (new)

A React component that renders:
- Two fixed blueprint background divs (left/right) with grid pattern, noise texture, corner marks
- Two fixed doodle container divs (left/right) containing all 44 SVG doodles (22 per side) — copied exactly from the HTML reference
- Uses `useEffect` + scroll listener to:
  - Measure doodle heights and distribute them vertically with uniform gap
  - On scroll, compute global progress and animate `strokeDashoffset` per-path
  - Toggle `.complete` class for fade-in text elements
- Uses `useEffect` + resize listener for relayout
- Color values adapted: replace hardcoded hex fills/strokes with CSS variable-based colors
- Hidden on screens < 800px via Tailwind `hidden lg:block`

**2. Edit `src/pages/Index.tsx`**
- Import and render `<MarginDoodles />` as a sibling to the main content
- No layout changes needed — margins are fixed-position overlays

**3. Edit `src/index.css`**
- Add margin-specific styles: `.margin-bg`, `.doodles`, `.doodle`, `.doodle .draw`, `.doodle .fade`, `.doodle.complete .fade` — ported from the HTML reference
- Add responsive breakpoints for margin width

### Key Technical Details

- All 44 SVG doodles (22 left engineering, 22 right business) are inlined exactly as in the reference HTML
- The stroke-dashoffset animation is done via direct DOM manipulation in a `requestAnimationFrame`-throttled scroll handler (not Framer Motion) — matching the reference's approach for performance
- Doodle layout uses `position: absolute` within fixed containers, with heights measured via refs
- Colors in SVG fills/strokes will use the site's palette (e.g., `hsl(220, 60%, 50%)` for primary tones, gold for accents)

