## About section rework — plan

### 1. Card portrait — taller, ID-shaped
`HeroIdBadge.tsx` (front face): change the photo block from `height: 150` to a true 3:4 portrait window (≈ `width: 100%; aspect-ratio: 3/4`, ~170×226). Reduce slot/header margins so the card stays 260×380. `backgroundPosition: "center top"` so the face isn't cropped.

### 2. Bigger globe, balanced columns
`HeroIdBadge.tsx` globe layer: grow from `left:4% width:42% height:80%` → `left:3% width:48% height:92% top:4%`, and lift `top` so its vertical centre aligns with the card. In `AboutGlobe.tsx` the canvas already auto-resizes via the `ResizeObserver`, so it will fill the new box. Card column gets `targetCenterX = stageRect.width * 0.72` (was 0.68) so the two columns sit symmetrically.

### 3. About goes under the Assembly Header (acts like a normal panel)
Today the back-of-card + globe live in a `position:fixed` portal at `z-3`, but the hero pin keeps it visually "floating". Restructure so the post-flip state is a real in-flow panel:

- Shorten the pin in `HeroAboutFlip.tsx` to `110vh` and end the flip at `p2 = 1` before pin release.
- Replace `<div id="about">` placeholder with a real, in-flow `<section id="about">` rendered **after** the pin, wrapped in the same `.margin-content-wrapper` / panel frame used by the other stations (use `BlueprintFrame` or a new `IdCardFrame` for visual continuity). It contains: globe (left col) + back-of-card content (right col) — same `AboutCardBack` + `AboutGlobe` components, just laid out in normal flow.
- The portal stage stays only for the flip animation: once `p2 ≥ 0.98`, fade the portal stage to `opacity: 0` and `pointer-events: none`, and fade in the in-flow About panel. Both share identical layout so the handoff is seamless.
- Result: scrolling past About slides it under the fixed `z-50` header like every other station.

### 4. Full admin control over About
Extend `AdminContent.tsx`'s "About / Journey" tab from a raw JSON textarea into a structured form (still saved to `site_content` row `about/journey`). Sections:

- **Overview**: blurb, traits[], focus[], quickFacts[{label,value}], footer.
- **Markers** (globe pins): id, label, [lat, lng].
- **Education** & **Experience**: ordered list. Each entry: id, title, org, period, location, summary, details, link, `markerId` (dropdown of markers), `logoUrl` (new, see #7), `groupHeading` (new, see #7).
- "Add / remove / reorder" controls per list. JSON view kept as a fallback "Advanced" toggle.

### 5. Remove "Path" from menu
- `AssemblyHeader.tsx` line 149: drop `{ key: "path", label: "Path" }` from `NAV` (and the same entry in `AssemblyHeaderMobile.tsx` if present). Recompute belt spacing — NAV now has 7 items; the existing layout maths uses `NAV.length`, so it auto-rebalances.
- DB: delete the `homepage_sections` row where `section_key = 'path'` (data-only, via the insert/delete tool).

### 6. "Experience" instead of "Work"
- `AboutCardBack.tsx` line 145: tab label `WORK` → `EXPERIENCE`.
- Admin labels in #4 use "Experience" too. Underlying data key stays `experience` (already is).
- AssemblyHeader's separate `work` nav key (which maps to the Projects shelf) is unrelated and stays.

### 7. Logos + section headings in Experience / Education
- `JourneyEntry` type gains `logoUrl?: string` and `groupHeading?: string`.
- `AboutCardBack.tsx` `EntryRow`: when `logoUrl` is set, render a 16×16 monochrome logo to the left of the title (mix-blend or grayscale to fit the cream card aesthetic). When `groupHeading` is set on the first entry of a run, render a small mono divider row above it (e.g. `· INTERNSHIPS`, `· FULL-TIME`).
- Admin form (#4) exposes a logo URL field per entry (uploads via existing `uploads` storage bucket — paste URL or file picker) and a free-text "Group heading" field.
- Migration: none needed (JSONB).

### Technical notes / files touched

```
src/components/HeroIdBadge.tsx              # portrait box, globe box, handoff fade
src/components/HeroAboutFlip.tsx            # shorter pin, in-flow About panel
src/components/about/AboutCardBack.tsx      # EXPERIENCE label, logo + group heading
src/components/about/AboutGlobe.tsx         # (only if sizing tweaks needed)
src/components/AssemblyHeader.tsx           # remove path
src/components/AssemblyHeaderMobile.tsx     # remove path (if present)
src/pages/admin/AdminContent.tsx            # structured About editor
DB (data, not schema):
  delete from homepage_sections where section_key='path';
```

### Out of scope

Lanyard physics, hero blueprint, other stations, auth/RLS.
