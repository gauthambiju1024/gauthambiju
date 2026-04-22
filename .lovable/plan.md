
## Hero Cutting Mat + 3D Compact Desk + 3D Objects

Three focused refinements to the Builder's Desk experience.

### 1. Hero Frame → Green Cutting Mat

Reskin the `BlueprintFrame` (which wraps `HeroSection`) as a self-healing **green cutting mat** — restoring the original hero look.

- Background: dark green `hsl(160 20% 16%)` with a subtle deeper-green vignette.
- Overlay: faint white grid (1cm major / 2mm minor) using two layered low-opacity `linear-gradient` patterns — the classic cutting-mat look.
- Two opposite corners get 45° diagonal angle hairlines, like a real mat.
- Edge: soft beveled rubber rim (1px inner light line + 2px dark outer shadow) replacing the blue paper-curl.
- Keep the unroll entry animation; only the visual skin changes.
- `HeroSection` itself is unchanged — its light-on-dark text already matches the mat.
- Desk thumbnail for "Home" in `Desk.tsx` (`shape: "blueprint"`) is restyled to a tiny green mat so the desk preview matches the stage.

### 2. 3D Compact Desk + Fit-to-Stage Sections

Make the desk feel like a tilted physical surface, shrink it, and give each section enough room that inner scrolling is rarely needed.

**Desk (3D + smaller)**
- Desk band: `32vh` → **22vh** in `DeskStage.tsx`; stage grows from `68vh` → **78vh**.
- Real 3D tilt on the desk wrapper: `rotateX(38deg)` with `transform-origin: center bottom`, parent `perspective: 1400px`. The desk recedes toward the back wall.
- Warm horizon gradient where stage and desk meet, so the desk visually plugs into the floor.
- Slot positions re-balanced for the now-shorter, foreshortened desk: back row near the receding far edge, mid row middle, front row near the camera. Uniform +10% slot size so back-row items remain readable.
- Stage padding tightened: `pt-[110px]` → `pt-[96px]`, `pb-6` → `pb-2`, `px-12` → `px-8`. Frame `max-w-6xl` → `max-w-7xl`.

**Sections fit the stage**
- Each frame's content wrapper gets a `.stage-fit` utility (clamp-based scaling) so most sections render without overflow.
- For the 3 genuinely long sections (`ProjectsShelf`, `ThinkingWall`, `WritingDesk`), keep a thin styled internal scrollbar bounded to the frame interior — the page itself never needs extra scrolling beyond the one-viewport-per-section that `DeskStage` already drives.

### 3. 3D Desk Objects

The slot thumbnails on the desk become real little **3D props**, not flat rectangles.

- Each `SlotShape` in `Desk.tsx` is wrapped in a `.prop-3d` container with `transform-style: preserve-3d` and gets:
  - A **front face** (the existing shape).
  - A **side wall** (1–6px deep depending on object) using a `::before` pseudo translated `translateZ(-Npx)` plus four thin side strips, painted darker than the front for shadow.
  - A subtle **top highlight strip** for the back edge (catches the lamp).
- Per-shape depth tuned to look real:
  - `blueprint` (cutting mat) — 2px (thin rubber sheet).
  - `card` (business card) — 1.5px (paper).
  - `letter` (envelope) — 2px.
  - `notebook` — 6px (closed book) with multi-page side stripes.
  - `shelf` (bookshelf) — 8px box.
  - `cork` (corkboard) — 5px frame depth.
  - `toolbox` — 7px metal box with rounded top edge.
  - `scroll` — true cylinder (rounded caps using `border-radius: 50%` on side faces, 6px diameter).
- Rest tilt: each object sits at `rotateX(8deg) rotateZ(<slot.rotate>deg)` so the lamp light catches the top edge consistently.
- Hover: `translateZ(14px) rotateX(0deg)` — the object lifts cleanly off the desk plane (replaces the old `translateY(-4px)`).
- Active object: keeps blue rim + a longer, softer ground shadow; the 3D body itself fades to grayscale (already implemented) so the floating stage version reads as the "real" one.
- Lamp behavior: a single CSS variable `--lamp-x: 8%` drives both the desk-lamp glow AND each prop's top-edge highlight intensity, so all props are lit consistently from one direction.

### Files Changed

- `src/index.css` — rewrite `.frame-blueprint` as cutting mat; add `.desk-3d`, `.desk-horizon`, `.stage-fit`, thin-scrollbar utility; add `.prop-3d`, `.prop-face`, `.prop-side`, `.prop-top-light`; tweak `.stage-float` to use `translateZ`.
- `src/components/DeskStage.tsx` — stage 78vh / desk 22vh; tighter padding; `max-w-7xl`; wrap desk in `.desk-3d` perspective container.
- `src/components/desk/Desk.tsx` — apply tilt transform; reposition slots; +10% size; wrap each `SlotShape` in `.prop-3d` with depth side faces; hover uses `translateZ`; restyle "blueprint" thumbnail to green mat.
- `src/components/desk/frames/BlueprintFrame.tsx` — replace blue curl with rubber-edge highlight; wrap children in `stage-fit`.
- Other 7 frame components — wrap children in `stage-fit` (+ thin scrollbar where needed).

### Out of Scope

- `AssemblyHeader`, `MarginDoodles`, `Entropy` — untouched.
- `HeroSection` and other section internals — untouched (only their wrapper frames change).
- No new libraries, no new assets.
