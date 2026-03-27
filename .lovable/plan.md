

## Plan: Redesign ProjectsShelf — Compact, Premium, Consistent

### What's wrong now
- Missing the consistent section header (`page 03 ─── Projects`) that every other section uses
- Books are too narrow (65px) with tiny unreadable text
- Too much vertical padding and empty space
- Shelf area feels sparse and disconnected from the reference aesthetic
- Detail card is functional but plain

### Design direction (inspired by reference image, adapted to site)
The reference shows **wider, taller books** with readable vertical titles, a subtitle/description area at the bottom of each spine, and a warm wooden shelf with depth. We adapt this to the site's dark desk + editorial aesthetic:

- **Wider spines** (80-90px) with clear vertical title text and a subtle description line at the bottom
- **Linen/cloth texture effect** via CSS gradients on spines (no images needed)
- **Deeper shelf ledge** with proper 3D wood-grain shadow
- **Tighter vertical rhythm** — reduce py from 16/24 to 12/16, reduce gaps
- **Consistent header** — add `page 03 ─── Projects` label matching ThinkingWall/SkillsToolbox pattern
- **Section title**: "Project Library" with subtitle "Case Studies · Products · Builds"

### File changes

**`src/components/ProjectsShelf.tsx`** — Rewrite

1. **Add consistent section header**: `page 03` + divider + `Projects` label (same pattern as lines 68-71 of ThinkingWall, lines 59-63 of SkillsToolbox)

2. **Section title block**: "Project Library" heading + "Case Studies · Products · Builds" subtitle

3. **Book spines redesigned**:
   - Width: 80px (up from 65px), height: 260px
   - CSS linen texture: layered `background-image` with noise-like gradients over the base color
   - Vertical title: larger (13px), `font-serif-display`, letter-spacing 0.2em
   - Bottom area: small horizontal subtitle text (project.subtitle truncated) + an icon-like decorative element using a simple CSS shape
   - Left edge: 4px highlight gradient for 3D spine edge feel
   - Right edge: subtle dark gradient for depth

4. **Shelf improvements**:
   - Thicker ledge (6px height) with layered box-shadow for realistic wood depth
   - Top inner shadow on the shelf container for recessed feel
   - Reduce overall padding: `p-4 md:p-6` (down from `p-6 md:p-10`)

5. **Compact spacing**:
   - Section padding: `py-12 md:py-16` (down from `py-16 md:py-24`)
   - Gap between books: `gap-3 md:gap-4` (down from `gap-5 md:gap-6`)
   - Min-height reduced to 280px

6. **Hover/select polish**:
   - Hover: lift `-8px`, rotate `Y: -3deg`, shadow intensifies
   - Selected: lift `-14px`, subtle warm glow matching spine color at 10% opacity
   - Transition: snappier spring (stiffness 350, damping 28)

7. **Detail card refinement**:
   - Slightly tighter padding (`p-5 md:p-6`)
   - Keep existing content structure (problem, role/stack grid, impact, tags, links)

8. **Category row footer**: After the last shelf row, add a small centered text: `CURATED WORK · {earliest year} – {latest year}` in font-mono, matching reference

**`src/pages/Index.tsx`** — No changes needed (section already wrapped in panel)

### No database changes needed — all columns already exist.

### Summary
- 1 file modified: `ProjectsShelf.tsx`
- Adds consistent section header matching all other sections
- Wider, more readable book spines with textile texture
- More compact vertical spacing throughout
- Premium shelf depth and interaction polish

