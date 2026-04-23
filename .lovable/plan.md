

## Replace Frame Designs with Original Panel Skins + Larger Panels + No Inner Scroll

Two changes in one pass:

### 1. Use the original panel designs (from Remix #65)

The current Frame components (`BlueprintFrame`, `CorkboardFrame`, `BookshelfFrame`, etc.) use `.frame-*` skins. The reference project uses richer, already-defined skins in `src/index.css`:

| Section  | New skin (replacing `frame-*`) |
|----------|--------------------------------|
| Home     | `.blueprint-surface` (dark green + blueprint grid) |
| About    | `.notebook` + `.notebook-grid` + spine + red margin + 4 hole punches + page-fold |
| Projects | `.shelf-bg` (dark walnut, wood grain) |
| Thinking | `.whiteboard-bg` |
| Skills   | `.toolbox-bg` (brushed metal) |
| Journey  | `.section-panel` (clean floating panel, primary border) |
| Writing  | `.editorial-bg` (cream editorial paper) |
| Contact  | `.section-panel` (transparent border) |

Each frame becomes a thin wrapper (`relative w-full h-full overflow-hidden`) applying the corresponding class set. The About frame gets the full notebook chrome (spine, margin line, 4 hole punches, page-fold) exactly like the reference. Slide-L/R transition behavior in `DeskStage` stays unchanged.

### 2. Larger panel + no inner scroll

In `src/components/DeskStage.tsx`:
- **Panel height**: 82vh → **88vh**.
- **Desk strip**: 18vh → **12vh** (compensate so total = 100vh).
- **Padding**: reduce `pt-[96px] pb-2` → `pt-[88px] pb-1` and `px-4 md:px-8` → `px-3 md:px-6` to give content more room.
- **Seam gradient**: reposition to `bottom: 12vh`.

In `src/index.css`:
- Update `.stage-scroll` to **`overflow: hidden`** (was scrollable). Remove the inner scrollbar entirely.
- `.stage-fit` keeps `width:100%; height:100%`.

### 3. Resize section content to fit the larger, non-scrolling panel

Each section component's outer wrapper currently assumes a scrollable container. With no scroll, content must fit ~88vh. Apply uniform compaction:

- Reduce vertical padding: `py-12/py-16` → `py-6/py-8`; `pt-6 pb-0` (Hero) stays.
- Reduce internal `mb-10`/`mb-12` rhythm by ~30% (`mb-6`/`mb-8`).
- Use `clamp()` font sizes already present — no font-size changes needed for Hero.
- For dense sections (`ProjectsShelf`, `ThinkingWall`, `WritingDesk`, `JourneyTimeline`): wrap their inner lists/grids in `max-h-full` containers, switch inner `overflow-y-auto` lists to **horizontal carousels or condensed grids** so nothing overflows vertically. Specifically:
  - `ProjectsShelf` → 3-up horizontal book row (no vertical scroll).
  - `ThinkingWall` → 3-column compact note grid (top N notes only).
  - `WritingDesk` → 2-column post grid, latest 4 posts only.
  - `JourneyTimeline` → horizontal timeline rail instead of vertical list.
  - `SkillsToolbox` → compact 4-column tray.
  - `ContactClosing` → centered, already fits.
  - `AboutSection` → reduce paragraph max-height; use 2-column bio + beliefs row.
- Hero: portrait scales `w-[180px] lg:w-[220px]` → `w-[160px] lg:w-[200px]`; gaps reduced.

### Files to modify

- `src/components/desk/frames/BlueprintFrame.tsx`
- `src/components/desk/frames/BusinessCardFrame.tsx` → rename concept to NotebookFrame? No — keep filename, just swap to notebook skin since About now uses notebook in the reference.
- `src/components/desk/frames/BookshelfFrame.tsx`
- `src/components/desk/frames/CorkboardFrame.tsx`
- `src/components/desk/frames/NotebookFrame.tsx` (Writing → editorial-bg)
- `src/components/desk/frames/ToolboxFrame.tsx`
- `src/components/desk/frames/ScrollFrame.tsx` (Journey → section-panel)
- `src/components/desk/frames/LetterFrame.tsx` (Contact → section-panel)
- `src/components/DeskStage.tsx` — 88/12 split + padding
- `src/index.css` — `.stage-scroll { overflow: hidden }`; ensure `.notebook`, `.shelf-bg`, `.whiteboard-bg`, `.toolbox-bg`, `.editorial-bg`, `.section-panel`, `.blueprint-surface` are present (they already are)
- `src/components/HeroSection.tsx` — minor portrait + spacing compaction
- `src/components/AboutSection.tsx` — 2-col compact layout
- `src/components/ProjectsShelf.tsx` — horizontal 3-up
- `src/components/ThinkingWall.tsx` — 3-col compact grid, cap items
- `src/components/SkillsToolbox.tsx` — 4-col compact tray
- `src/components/JourneyTimeline.tsx` — horizontal timeline rail
- `src/components/WritingDesk.tsx` — 2x2 grid, cap 4 posts
- `src/components/ContactClosing.tsx` — vertical centering tweak

### Out of Scope

- 3D desk strip props/lighting/decor — untouched (only height changes from 18vh→12vh).
- Routing, header, doodles, entropy, backend, Supabase — untouched.
- Slide L/R transition logic in `DeskStage` — untouched.
- No new dependencies or assets.

