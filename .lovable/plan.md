
## Goal

1. The About card already visible at the end of the flip is the same card that folds — no globe/about re-appearance, no position jump.
2. The folded card looks identical to a `ProjectsShelf` spine (78×200, linen texture, vertical title, year, color, edge highlights, bottom subtitle).
3. The bridge shelf is the new Projects shelf — it pulls real projects from the database and replaces the standalone `ProjectsShelf` section.

## Changes

### 1. `HeroIdBadge.tsx` — kill the visual jump + clean fold

- Remove the `__bridgeActive` stage re-pinning branch in `update()`. The stage keeps tracking `#home` exactly as during the flip, so there is no teleport when the bridge starts. The bridge section (`#about-projects-bridge`) is sized so the user is still scrolled into the pinned `HeroAboutFlip` while bridge progress runs — we drive folding purely off `__bridgeProgress`, not stage repinning.
- Remove the globe fade-back-in around `tHide`: when `__bridgeProgress > 0` we force globe opacity to `0` immediately and keep lanyard hidden. The back face stays as-is (it's already the visible state at end of flip).
- Replace the tri-fold flap overlay with a **spine-skin overlay** rendered inside the card-back. As `bridge` advances:
  - 0.00–0.15: `cardBackInnerRef` (globe + about content) fades to 0; `spineSkinRef` fades to 1 (covers the whole back face).
  - 0.15–0.55: `cardWrap` `scaleX` collapses `1 → 78/cardWidth` (≈ 0.21) while `scaleY` collapses `1 → 200/cardHeight` (≈ 0.39). No extra rotateY — the card simply shrinks into a spine-shaped rectangle showing the spine artwork.
  - 0.55–1.00: translate to `__bridgeSlotRect.cx/cy` (snaps into the shelf row).
- `spineSkinRef` markup mirrors a `ProjectsShelf` spine exactly: 78×200 box, `linenTexture(color)`, left highlight + right shadow strips, vertical-lr title (`badge.name` or "ABOUT"), year on top, bottom subtitle band ("Portfolio · 2026" / `badge.title`). Color = a walnut from the same palette (`hsl(35 25% 30%)`).
- Remove `flapLeftRef / flapCenterRef / flapRightRef / slabRef / flapsWrapRef` and their refs/JSX.

### 2. `AboutToProjectsBridge.tsx` — becomes the real Projects shelf

- Replace the placeholder `SPINES` array with `useProjects()` from `@/hooks/useSiteData`.
- Render one spine per project using **the same JSX/styles as `ProjectsShelf`** (78×200, `linenTexture(project.color)`, vertical title, year, subtitle, left/right edge strips). Extract a `<ProjectSpine project={p} />` helper that both this bridge and `ProjectsShelf` import, so they stay visually identical.
- Shelf line: keep the single warm-wood drawn line, drawn `0.55 → 0.92` of bridge progress.
- Spines fade/rise in staggered `0.60 + i·0.04`, sitting on the line.
- The "landing slot" becomes the **About spine** at the end of the row. It's a real `ProjectSpine`-shaped placeholder (same 78×200 box, walnut color, "ABOUT / Portfolio · 2026" content) that starts at `opacity: 0` and stays invisible — its only job is to publish `__bridgeSlotRect` so the folding card from `HeroIdBadge` flies exactly into its position. Once `bridge >= 0.98`, fade the placeholder in so the real card "becomes" it and stays put after the user scrolls past.
- Make the spine row left-aligned + horizontally scrollable on overflow, mirroring `ProjectsShelf`'s `overflow-x-auto`.
- Make spines clickable: clicking opens the same detail card / link behavior as `ProjectsShelf` (reuse the existing inline expansion or just navigate to `/projects/:slug`). The About spine on the right is non-interactive.

### 3. `Index.tsx` — remove the duplicate Projects section

- Drop `{ id: "projects", Frame: BookshelfFrame, Section: ProjectsShelf }` from `trailingStations`. The bridge IS the projects station now.
- Add `id="projects"` to the sticky shelf container inside `AboutToProjectsBridge` (and add `scroll-margin-top: 100px` via inline style) so the Assembly Header "Projects" link scrolls here.
- Increase bridge `height` from `200vh` to something like `260vh` so the shelf stays on screen long enough to read after the fold finishes (progress stays at 1, shelf is fully drawn, About spine is parked).

### 4. Shared spine component

- Add `src/components/projects/ProjectSpine.tsx` exporting:
  - `ProjectSpine({ project, color?, onClick?, interactive? })` — the 78×200 spine JSX.
  - `SPINE_COLORS` array (moved out of `ProjectsShelf`).
  - `ABOUT_SPINE_DATA` (title "ABOUT", subtitle "Portfolio · 2026", year "2026", color walnut).
- `ProjectsShelf.tsx` (still kept as the file, but no longer mounted on the page) imports from it. `AboutToProjectsBridge.tsx` and `HeroIdBadge.tsx` import from it.

## Technical notes

- The card-to-spine transform avoids any `rotateY` past 180°. We let the existing flip leave it at 180° and only add `scaleX`/`scaleY` + translate. That guarantees the back-face stays facing the viewer the whole way down.
- `__bridgeSlotRect` is published every rAF (already implemented) so the card tracks the slot through scroll/resize.
- `HeroIdBadge`'s drag handler is disabled whenever `bridge > 0.02` (already true via existing pointerEvents gate).
- `prefers-reduced-motion`: skip all folding, just snap the About spine into place at `bridge = 1`.

## Out of scope

- ProjectsShelf inline-expand card UX (carries over unchanged into the new shelf if we keep it).
- Mobile (< md): bridge stays hidden because `HeroIdBadge` is `hidden md:block`. Mobile uses the standard `ProjectsShelf` — for that we keep `ProjectsShelf` mounted only on mobile in `Index.tsx`.
