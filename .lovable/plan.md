

## Plan: Builder's Workspace UI Redesign

Restyle every section with a distinct but cohesive "builder's workspace" metaphor, keeping all existing content, data fetching, routing, and functionality intact. The current dark background and muted color palette stay — changes are purely visual/structural.

---

### Design System Foundation

**`src/index.css`** — New utility classes and updated base styles:

- **Blueprint grid** (`.blueprint-grid`): Subtle CSS grid overlay using thin `hsl(var(--primary)/0.06)` lines at 40px intervals on the existing dark background — used for Hero section
- **Measurement markers**: Small tick-mark decorations via pseudo-elements for blueprint feel
- **Notes texture** (`.notes-surface`): Very subtle lined-paper effect for About section using faint horizontal ruling
- **Cork/pin surface**: Remove current whiteboard radial gradients from `.whiteboard-bg`, replace with a warm neutral muted tone and faint dot grid
- **Compartment styling**: Update `.toolbox-bg` to use clean bordered compartments instead of diagonal hatching
- **Remove** notebook-specific classes no longer needed (hole punches, spine, page-fold) from components but keep CSS definitions for backward compatibility
- **Add** `.dimension-label` class: tiny mono text with bracket decorations for annotation-style labels

---

### Section-by-Section Changes

**1. Hero (`HeroSection.tsx`) — Blueprint UI**
- Add a subtle blueprint grid overlay behind the content (CSS background on the section)
- Replace "Field Notes" badge with a technical annotation style: dashed border, measurement-style brackets
- Add thin dashed guide lines (horizontal) between content blocks using `border-dashed` dividers
- CTA buttons: outlined/technical style — thin borders, squared corners, mono text
- Keep portrait image, morphing text, and all data fetching unchanged

**2. About (`AboutSection.tsx`) — Design Notes UI**
- Add faint horizontal ruled lines behind text (background-image on the section)
- "Traits" / "Focus" / "Quick Facts" labels: style as annotation stamps — small boxed labels with a left accent line
- Philosophy quote: change from border-left to a highlighted/underlined snippet style
- Add small annotation markers (numbered references like `[01]`) next to key points
- Layout stays 2-column grid, all content unchanged

**3. Projects (`ProjectsShelf.tsx`) — Library UI (Minimal)**
- Keep the book-spine metaphor but flatten it: remove linen texture, use solid muted colors with very subtle shadow
- Reduce spine height slightly, increase spacing consistency
- Hover: cleaner lift with slightly increased shadow only (no rotateY)
- Detail card: keep structure, soften shadows, add thin top accent line
- Remove warm shelf glow gradients, use clean dark background

**4. Thinking Wall (`ThinkingWall.tsx`) — Strategy Wall UI**
- Remove card rotations (set all to 0) for cleaner alignment
- Remove pin/tape decorations from cards
- Cards become clean bordered panels with consistent sizing
- Add subtle category grouping via section borders or spacing
- Hover: elevate with shadow increase, no rotation reset needed
- Keep ScrollArea, grid layout, and linking

**5. Skills (`SkillsToolbox.tsx`) — Toolbox UI**
- Keep 3-column grid of compartment cards
- Add stronger container borders with slight inset feel (inset shadow)
- Skill chips: more uniform, consistent shape, slight contrast on hover
- Compartment headers: add a thin bottom divider with icon (already exists, refine styling)
- Tooltip stays, just ensure consistent positioning

**6. Journey (`JourneyTimeline.tsx`) — Timeline UI**
- Keep vertical line and node structure
- Clean up node styling: simpler circles, thinner connecting line
- Remove Globe background entirely for cleaner focus
- Cards: consistent border radius, cleaner spacing
- Current node: keep primary color pulse but reduce glow intensity

**7. Writing (`WritingDesk.tsx`) — Editorial UI**
- Keep featured card + 3-column grid structure
- Remove editorial-cream background, use transparent/section-panel default
- Add subtle horizontal dividers between featured and grid sections
- Typography-first: increase heading size slightly, ensure strong whitespace
- Hover: subtle underline animation on title instead of background change

**8. Contact (`ContactClosing.tsx`) — Minimal Terminal UI**
- Center layout (already centered)
- Simplify link rows: remove rounded-lg border cards, use minimal text rows with subtle hover underline
- Add a thin baseline divider above the links
- Signature: keep as-is, it's already minimal
- Footer: keep, simplify further

---

### Index Page (`src/pages/Index.tsx`)

- Remove notebook decorative elements: spine, margin line, hole punches, page-fold from the Hero+About wrapper
- Keep the notebook container class for its background/border/shadow but strip interior decorations
- Section panels: keep `.section-panel` wrapper, ensure consistent spacing (`my-6 md:my-8` already set)

### Navigation (`Navigation.tsx`)

- Refine active indicator: use a thin solid line instead of spring-animated bar
- Add subtle backdrop blur on scroll (already partially exists, ensure consistency)
- Keep all nav items and scroll behavior unchanged

---

### What stays the same
- All content, data, routing, hooks, and Supabase integration
- Color palette (CSS variables) — no changes to `:root` values
- Typography families
- Framer Motion scroll-in animations (just parameters adjusted where noted)
- Responsive breakpoints and mobile layout
- All 8 section components remain separate files

### Files modified (10)
1. `src/index.css` — Add utility classes, adjust existing ones
2. `src/pages/Index.tsx` — Remove notebook decorations
3. `src/components/Navigation.tsx` — Refine indicator style
4. `src/components/HeroSection.tsx` — Blueprint grid + annotation style
5. `src/components/AboutSection.tsx` — Notes/annotation styling
6. `src/components/ProjectsShelf.tsx` — Flatten and clean shelf
7. `src/components/ThinkingWall.tsx` — Remove rotations/pins, clean cards
8. `src/components/SkillsToolbox.tsx` — Refine compartment styling
9. `src/components/JourneyTimeline.tsx` — Clean timeline, remove Globe
10. `src/components/WritingDesk.tsx` — Editorial typography focus
11. `src/components/ContactClosing.tsx` — Minimal terminal style

