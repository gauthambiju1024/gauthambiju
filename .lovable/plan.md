## Vector zoom + AI-edited shelf with live project spines

### 1. Replace raster zoom tiers with blueprint-line SVGs

Drop `zoom-india.jpg`, `zoom-pune.jpg`, `zoom-rooftops.jpg`. Build four React SVG components in a single shared file `src/components/desk-hub/ZoomTiers.tsx` — all using the same blueprint vocabulary so the zoom feels continuous:

- **Stroke**: `hsl(40 30% 92%)` at 1.2px, plus a faint `hsl(40 60% 55%)` accent stroke at 0.6px for the focus marker (crosshair / circle).
- **Background**: transparent — the section's dark backdrop shows through, so each tier composites cleanly.
- **Subtle blueprint grid**: thin `0.5px` lines at 5% opacity behind every tier, scale-matched per tier so zooming feels like flying down through the same drawing.

Tiers:

1. **`<GlobeWireSVG />`** — sphere with longitude/latitude lines, India landmass outlined heavier, marker dot pulsing on Pune. (Replaces the cobe canvas during the zoom — cobe stays only as a still first frame, then the SVG overlays.)
2. **`<IndiaSVG />`** — accurate India border path, state lines as faint dotted strokes, crosshair on Pune coordinates, "PUNE · 18.52°N 73.86°E" mono label.
3. **`<PuneSVG />`** — abstracted city street grid (radial + grid streets), district blocks as outlined polygons, single marked block.
4. **`<RoofSVG />`** — top-down floorplan of a small house with a desk inside; the desk rectangle is the morph target into tier 5.

All four share viewBox `0 0 1000 1000`, are absolutely positioned `inset: 0`, scale via the existing `useTransform` pipeline. No new asset files — pure inline SVG.

**Continuity**: the focus crosshair sits at the same screen position across all 4 tiers, so the user feels they're falling toward one fixed point. Slight stroke-dash animation on the crosshair while it's the foreground tier ("settling in").

### 2. Replace the bookshelf in the desk image with a real interactive project shelf

**Step A — bake out the shelf**: use `imagegen--edit_image` on `src/assets/builders-desk.png` with a prompt like *"Remove the entire wooden bookshelf and all books at the top center. Replace that area with the same dark wall and ambient lighting, keeping shadows and lamp glow consistent. Do not alter anything else."* → save as `src/assets/builders-desk-noshelf.png`. Swap the desk hub to use this version.

**Step B — render the shelf in SVG over the empty wall**: new component `src/components/desk-hub/ProjectShelfOverlay.tsx`, absolutely positioned at the same `{left: 21, top: 7, width: 38, height: 24}` rectangle the original shelf occupied. Contains:

- A wooden plank (filled rect with subtle wood-grain noise via `<filter>`), warm amber underglow LED at top mimicking the original strip light.
- N book spines side-by-side, each an SVG `<g>` — varying widths, heights, dark muted spine colors derived from `project.color`, vertical text label using `Playfair Display` for the project title and a small mono year tag at the spine foot.
- A small potted plant SVG at the right end matches the original.

**Data**: fetch from the existing `projects` table via the same query `ProjectsShelf` already uses. New hook `useProjects()` extracted from `ProjectsShelf.tsx` (or just inline `useEffect` + `supabase.from('projects').select(...)` ordered by `sort_order`, limited to 8 spines max so the shelf doesn't crowd).

**Interaction**: each spine is a `<a href={`/projects/${slug}`}>` (or button calling the existing project navigation), with hover lift (translateY -3px, brightness up) and a tooltip plate above showing full title. Removes the need for the generic "shelf hotspot → #projects" — clicking a spine deep-links to the case study page.

### Files

**New**
- `src/components/desk-hub/ZoomTiers.tsx` — `GlobeWireSVG`, `IndiaSVG`, `PuneSVG`, `RoofSVG`
- `src/components/desk-hub/ProjectShelfOverlay.tsx`
- `src/assets/builders-desk-noshelf.png` — generated via `imagegen--edit_image`

**Edited**
- `src/components/desk-hub/DeskHubScene.tsx` — swap raster `<motion.img>` layers for the SVG components; swap desk image import to no-shelf version; mount `<ProjectShelfOverlay />` inside the desk stage; remove the `shelf` entry from the hotspot overlay (it's replaced by interactive spines)
- `src/components/desk-hub/hotspots.ts` — drop the `shelf` hotspot

**Deleted**
- `src/assets/zoom-india.jpg`
- `src/assets/zoom-pune.jpg`
- `src/assets/zoom-rooftops.jpg`

### Out of scope
Other hotspots (corkboard, notepad, toolbox, badge, contact tray) and their image positions are unchanged. Globe rotation, ID-card flip, Assembly Header, mobile fallback all untouched. No DB schema changes.