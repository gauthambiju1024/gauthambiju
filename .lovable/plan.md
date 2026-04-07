

## Plan: Halve Margin Width & Remove Blueprint Background

### Changes

**1. `src/index.css`** — Update margin widths and remove blueprint

Halve all margin column widths:
- `--margin-col-width: 110px` (was 220px)
- `@media (max-width: 1280px)`: `85px` (was 170px)
- `@media (max-width: 1100px)`: `40px` (was 80px)

Remove the blueprint grid and noise texture from `.margin-bg`:
- Remove the `::before` pseudo-element content (grid lines)
- Remove the `::after` pseudo-element content (noise texture)
- Keep `.margin-bg` as a transparent fixed container (needed for structure)

Adjust doodle padding for narrower columns:
- `.doodle { left: 4px; right: 4px; padding: 2px 3px; }`

**2. No changes needed to `Index.tsx`** — the content wrapper already reads `var(--margin-col-width)` dynamically, so it will automatically expand panels to fill the freed space.

### Files: 1
- `src/index.css`

