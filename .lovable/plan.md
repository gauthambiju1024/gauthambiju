

## Plan: Polish ProjectsShelf — Fix Visibility, Add Spine Descriptions, Better Colors, Better Headings, Admin Color Picker

### Issues to fix

1. **"Project Library" title not visible** — likely clipped by `section-panel overflow: hidden` or rendered outside visible area. The title sits at `px-6 md:px-16` but the shelf container inside has its own `mx-4 md:mx-12` padding creating nesting issues.

2. **Spine needs horizontal 4-5 word description** — like the reference image, each spine should show a short horizontal subtitle text (from `project.subtitle`) near the bottom of the spine, rotated back to horizontal.

3. **Background too dark** — current `shelf-bg` uses `--shelf-wood: 24 18% 18%` which is very dark brown. Need a warmer, lighter tone that still feels premium.

4. **Section headings inconsistent** — the `page 03 ─── Projects` pattern with small mono text is too subtle. Need to match other sections better while elevating the design.

5. **Admin color picker** — replace the raw text input for spine color with a visual preset picker.

### File changes

**`src/components/ProjectsShelf.tsx`** — Major polish

1. **Fix title visibility**: Move "Project Library" heading and subtitle above the shelf container, ensure proper padding alignment. Remove conflicting nested padding.

2. **Spine horizontal description**: Add a horizontal text block at the bottom of each spine (inside a rotated container) showing `project.subtitle` truncated to ~5 words. White text at 40% opacity, 9px font-body, positioned absolutely at the bottom with proper padding.

3. **Refined section header**: Match ThinkingWall/SkillsToolbox pattern exactly — `page 03` left, divider, `Projects` right — but ensure it renders within the visible overflow area.

4. **Better shelf background**: Change the inner shelf container from `shelf-bg` to a custom warm dark tone — `hsl(25 12% 14%)` with a subtle wood grain gradient. Update the outer section to not double-apply shelf-bg.

5. **Polish details**:
   - Spine width increased slightly to 85px for the horizontal subtitle to breathe
   - Better spine colors default palette — richer jewel tones
   - Smoother hover shadow transitions
   - Detail card: add a subtle top border matching the selected book's color

**`src/index.css`** — Update shelf-wood CSS variable

- Change `--shelf-wood` from `24 18% 18%` to `25 15% 16%` — slightly warmer, still dark but with more character
- Add a new warm gradient to `.shelf-bg` for depth

**`src/pages/admin/AdminProjects.tsx`** — Visual color picker

Replace the plain text input for "Spine Color" with a grid of preset color swatches (the 8-10 curated jewel tones) that the admin can click. Include a "Custom" option that reveals the text input for any HSL value. Each swatch shows a small circle with the color and a checkmark when selected.

### Preset spine colors for admin picker

```text
Teal:     hsl(170 25% 28%)
Burgundy: hsl(350 28% 30%)
Navy:     hsl(215 28% 28%)
Olive:    hsl(85 18% 28%)
Rust:     hsl(15 30% 30%)
Plum:     hsl(280 18% 30%)
Slate:    hsl(200 12% 32%)
Amber:    hsl(35 25% 30%)
Forest:   hsl(140 20% 25%)
Charcoal: hsl(220 8% 22%)
```

### Summary
- 3 files modified: `ProjectsShelf.tsx`, `index.css`, `AdminProjects.tsx`
- No database changes
- Fixes title visibility, adds horizontal spine descriptions, warmer background, and admin color picker

