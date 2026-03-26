

## Plan: Premium Knowledge-World Portfolio Rebuild

This is a phased rebuild that preserves the existing Hero (section 1) and About/Beliefs (section 2) with refinements, then builds 6 new section components with distinct spatial metaphors.

### Phase 0 — Fix Build Error + Foundation

**Fix**: `MarqueeText` returns `void` (bare `return;`). It's typed as `ComponentType` in `sectionMap` but returns nothing. Fix by making it return `null` or removing it from the section map entirely (it will be replaced).

**Typography**: Add `Playfair Display` serif font import in `index.css` and register in `tailwind.config.ts` as `font-serif-display`. This gives editorial section titles their premium feel alongside existing Caveat handwritten font.

**CSS**: Add section-specific texture utility classes (`.shelf-bg`, `.whiteboard-bg`, `.toolbox-bg`, `.editorial-bg`) and a subtle gold accent CSS variable.

### Phase 1 — Navigation Expansion (`Navigation.tsx`)

Expand from 4 to 8 nav items: Home, About, Projects, Thinking, Skills, Journey, Writing, Contact. Add scroll-triggered glass-blur compact mode. Keep existing progress bar.

### Phase 2 — Hero Refinements (`HeroSection.tsx`)

Minor additions to existing hero:
- Add 2 CTAs ("View Work" filled, "Resume" outlined) styled as embossed label buttons
- Add subtle journal annotations: "Field Notes" label, date stamp, margin line decorations
- Keep existing typewriter rotating words, portrait, and layout

### Phase 3 — About Section (`AboutSection.tsx`, replaces `BeliefsSection.tsx`)

Two-page journal spread layout:
- **Left page**: "Notes on How I Work" narrative paragraph, personal positioning
- **Right page**: 3 strengths (systems thinking, fast learning, structured problem solving), 3 focus areas (product thinking, AI workflows, business+UX), philosophy quote
- Styled with dot-grid texture, taped mini-notes, stamped labels ("Focus", "Traits")
- Hover reveals short explanation on strengths

### Phase 4 — Projects as Library Shelf (`ProjectsShelf.tsx`, replaces `WorkSection.tsx`)

3D bookshelf UI:
- Dark matte shelf background with CSS perspective
- 4 book spines (Homeofarm, Drishti, Classy, Vaidya) + "Archive" slot
- Each spine: vertical title, category label, unique muted color tone
- Hover: `translateX` slide-out + `rotateY` tilt + shadow shift (Framer Motion)
- Click: opens a Dialog styled as open book spread with project details (problem, role, contribution, stack, impact)
- Mobile: horizontal scrollable book stack

### Phase 5 — Product Thinking / Strategy Wall (`ThinkingWall.tsx`, new)

Whiteboard/glass-board background:
- Curated grid of pinned cards in 3 styles: sticky notes (insights), framework sheets (structured), diagram cards (flows)
- Content: Product Teardowns, Comparative Analysis, User Journey Breakdowns, UX Critiques, Strategy Notes, Case Studies
- SVG connector lines between related cards
- Push-pin / tape decorative motifs
- Hover: card lifts with shadow, reveals summary tooltip
- Click: card expands into richer panel
- Mobile: swipeable stacked cards

### Phase 6 — Skills Toolbox (`SkillsToolbox.tsx`, new)

Modular compartment grid:
- 3 compartment cards: Product, Technical, Business
- Each contains skill chips with hover tooltip (project context, one-line description)
- Cleaner, slightly more modern-industrial feel than journal sections
- Compartments elevate on hover
- Mobile: stacked accordion trays

### Phase 7 — Journey Timeline with Globe (`JourneyTimeline.tsx`, replaces `StorySection.tsx`)

Metro-map vertical timeline:
- Curved vertical line with station-dot nodes
- 5 milestones: Schooling → IIT Gandhinagar → Accenture Internship → IIM Indore → Current ("Now Building")
- Cards branch left/right alternating with title, period, subtitle, takeaway
- **Globe component** integrated as a background element near the timeline, positioned behind the path with low opacity — representing global perspective
- "Currently Exploring" glowing marker at latest node
- Node hover animates connection line segment
- Mobile: clean vertical path with expandable cards, globe hidden

### Phase 8 — Writing / Editorial Desk (`WritingDesk.tsx`, replaces `BlogSection.tsx`)

Magazine-style layout:
- 1 large featured article card (hero treatment, big typography)
- Grid of 3 smaller article cards below
- Each card: title, summary, category tag, reading time, date
- Categories: Product Thinking, UX Notes, Strategy, Experiments
- Hover: card lifts, title underline animates
- Links to existing `/blog/:slug` routes
- Mobile: single-column stacked cards

### Phase 9 — Contact / Closing Page (`ContactClosing.tsx`, replaces `ConnectSection.tsx`)

Journal closing page:
- "End Notes" stamped label
- Warm closing line + invitation paragraph
- Clean link rows (Email, LinkedIn, Resume) with refined hover
- SVG signature-like decorative element
- Subtle ink-fade closing animation
- Minimal footer integrated

### Phase 10 — Index Wiring (`Index.tsx`)

Update `sectionMap` and `sectionAnchors`:
- Remove `marquee` entry
- Replace `beliefs` → `about`, `work` → `projects`, `story` → `journey`, `blog` → `writing`, `connect` → `contact`
- Add new entries: `thinking`, `skills`
- Update section groups to match 8-section flow
- Remove `MarqueeText` import

### Files Summary

| File | Action |
|---|---|
| `src/index.css` | Add serif font, texture classes, gold accent variable |
| `tailwind.config.ts` | Add `font-serif-display` family |
| `src/components/Navigation.tsx` | Expand to 8 items, add glass-blur scroll |
| `src/components/HeroSection.tsx` | Add CTAs, journal annotations |
| `src/components/AboutSection.tsx` | **Create** — journal spread |
| `src/components/ProjectsShelf.tsx` | **Create** — library bookshelf |
| `src/components/ThinkingWall.tsx` | **Create** — strategy wall |
| `src/components/SkillsToolbox.tsx` | **Create** — modular toolbox |
| `src/components/JourneyTimeline.tsx` | **Create** — metro timeline + Globe |
| `src/components/WritingDesk.tsx` | **Create** — editorial desk |
| `src/components/ContactClosing.tsx` | **Create** — closing page |
| `src/pages/Index.tsx` | Rewire section map, remove marquee |
| `src/components/MarqueeText.tsx` | Delete or fix (no longer used) |

