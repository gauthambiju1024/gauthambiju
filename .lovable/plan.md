

## Plan: Oryzo-Inspired "Builder's Desk" Theme

Adapt the Oryzo.ai physical craft desk aesthetic to the portfolio — wood desk outer surface, cutting mat grid for content areas, ruler/measurement decorations, and warm tactile accents. Keep existing content, data, routing, and color palette foundation intact.

---

### Key Design Elements (from Oryzo)

```text
┌─────────────────────────────────────────────┐
│  WOOD DESK SURFACE (outer background)       │
│  ┌───────────────────────────────────────┐   │
│  │  CUTTING MAT (content surface)       │   │
│  │  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐  ruler     │   │
│  │  │ │ │ │ │ │ │ │ │ │ │  marks     │   │
│  │  ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤            │   │
│  │  │     CONTENT AREA     │            │   │
│  │  └─────────────────────┘             │   │
│  └───────────────────────────────────────┘   │
│              scattered desk objects          │
└─────────────────────────────────────────────┘
```

---

### Design System Changes (`src/index.css`)

**New CSS variables and utilities:**
- `--desk-wood`: warm dark brown `25 18% 14%` for the outer desk surface
- `--cutting-mat`: deep green `160 20% 16%` for content surfaces
- `--mat-grid`: subtle grid lines in `hsl(160 15% 22%)` at 20px intervals
- `--ruler-accent`: warm orange `25 80% 55%` for ruler ticks and measurement marks
- `.desk-surface`: CSS wood grain texture using layered gradients (no images)
- `.cutting-mat`: green surface with fine grid lines and ruler markings on edges
- `.ruler-edge`: top/left ruler decoration with tick marks every 20px
- `.desk-object`: decorative pseudo-element styles for scattered objects
- Update `.dimension-label` to use ruler-accent color for the bracket decorations
- Keep all existing classes for backward compatibility

**Updated `:root` variables:**
- `--background`: shift to warm wood tone `25 18% 14%`
- `--gold` used for ruler/accent marks

---

### Section Changes

**1. Global Layout (`Index.tsx`)**
- Outer `div` gets `.desk-surface` class — warm wood grain CSS background
- The `workspace-surface` (Hero+About wrapper) styled as a cutting mat with green tint, grid lines, and ruler markings along top/left edges
- Section panels also get cutting mat treatment but with slightly varied tones per section
- Add subtle CSS "desk objects" — a pencil line (rotated gradient div), ruler edge, maybe a paper clip shape via CSS

**2. Navigation**
- Add a warm wood/leather accent — thin warm-toned bottom border
- Keep existing behavior, just adjust colors for warmer palette harmony

**3. Hero — Technical Drawing on Cutting Mat**
- Blueprint grid becomes cutting mat grid (green-tinted, finer lines)
- Add ruler markings along the top edge of the section (CSS pseudo-element with tick marks)
- Orange/gold dimension markers between content blocks
- CTA buttons: outlined with ruler-accent color on hover
- Portrait image stays, with cutting mat backdrop feel

**4. About — Notes Pinned to Mat**
- Content cards get a slight "paper pinned to mat" feel — white/cream card on green surface
- Keep annotation markers but style them with ruler-accent color `[01]`
- Philosophy quote styled as a torn paper note

**5. Projects — Specimens on Desk**
- Book spines keep their current look but sit on a mat surface
- Shelf ledge styled as a ruler/straight-edge (with tick marks and numbers)
- Detail card appears as a paper document pulled from the shelf

**6. Thinking Wall — Pinboard on Mat**
- Cards styled as paper notes/cards laid on the cutting mat
- Subtle shadow to suggest physical layering
- Grid lines visible through card gaps

**7. Skills — Tool Compartments**
- Compartment containers get a toolbox drawer feel — darker inset with orange/gold accent borders
- Keep existing structure, add ruler-style dividers between compartments

**8. Journey — Path Drawn on Mat**
- Timeline line becomes a drawn/sketched line on the cutting mat
- Nodes styled as pushpins or measurement points (orange dots)
- Cards as paper notes alongside the path

**9. Writing — Documents on Desk**
- Articles styled as paper documents laid on the desk surface
- Featured article as a larger document with a slight angle
- Clean paper-on-wood aesthetic

**10. Contact — Closing the Workshop**
- Minimal, as-is, but with warm desk surface visible
- Links styled with ruler-accent underlines

---

### What Stays the Same
- All content, data fetching, routing, hooks, Supabase integration
- All Framer Motion animations (just adjusted styling)
- Responsive breakpoints and mobile layout
- Typography families (add warmth through color adjustments)
- All 8 section components remain separate files

### Files Modified (11)
1. `src/index.css` — New desk/mat utility classes, color adjustments
2. `src/pages/Index.tsx` — Desk surface background, mat wrappers
3. `src/components/Navigation.tsx` — Warm accent border
4. `src/components/HeroSection.tsx` — Cutting mat grid, ruler marks
5. `src/components/AboutSection.tsx` — Paper-on-mat card styling
6. `src/components/ProjectsShelf.tsx` — Ruler shelf ledge
7. `src/components/ThinkingWall.tsx` — Paper cards on mat
8. `src/components/SkillsToolbox.tsx` — Toolbox drawer accents
9. `src/components/JourneyTimeline.tsx` — Drawn path, pushpin nodes
10. `src/components/WritingDesk.tsx` — Paper documents on desk
11. `src/components/ContactClosing.tsx` — Warm accent styling

