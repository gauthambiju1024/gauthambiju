
## 3D Desk Props (R3F) + Remove Below-Panel Stage Glow

Two combined refinements: replace the flat CSS desk objects with **real 3D props** rendered with React Three Fiber, AND remove the dark stage lighting/horizon glow that bleeds below the active panel. **Scroll behavior, scroll-driven section flow, header, margins, and the cutting-mat hero all stay exactly as they are.**

Reference image (uploaded) is the target mood: warm wooden desk in the foreground with realistic 3D props (book, notebook, mat, lamp, mug, compass, photos, journal, plant) sitting in front of the active section panel.

### 1. Remove Below-Panel Stage Glow

The "stage area" currently has soft lighting that wraps the panel and a horizon glow under the desk — visually it looks like a theater. Remove these so the panel sits cleanly above the desk with no extra ambient wash.

- `src/components/DeskStage.tsx` — remove three overlay divs:
  - `<div className="stage-light" />` (soft spotlight wash)
  - `<div className="desk-horizon" />` (warm rim light where stage meets desk)
  - `<div className="stage-ground-shadow" />` (floor-shadow ellipse beneath active frame)
- `src/index.css` — delete `.stage-light`, `.desk-horizon`, `.stage-ground-shadow` rules.
- Keep stage layout (`78vh` stage / `22vh` desk), scroll, snap, AnimatePresence — unchanged.

### 2. Real 3D Desk Props (React Three Fiber)

Replace the current CSS-tilted desk + flat slot-shape thumbnails with a **WebGL 3D desk scene** for the bottom 22vh band. The 8 interactive props become real 3D objects you can hover/click; ambient props (lamp, mug, plant, pen holder, paperclips) decorate the desk.

**Dependencies (exact versions per project rules):**
- `three@^0.160`
- `@react-three/fiber@^8.18`
- `@react-three/drei@^9.122.0`

**New component `src/components/desk3d/DeskScene.tsx`:**
- `<Canvas camera={{ position: [0, 1.2, 3.0], fov: 36 }} shadows dpr={[1, 2]} frameloop="demand">`
- Lighting: warm `directionalLight` from upper-left (lamp direction, shadow-casting) + soft `ambientLight` + small `pointLight` inside the lamp shade for the warm glow.
- Wood floor: large `planeGeometry` with a procedurally-generated walnut **CanvasTexture** (no new image assets).
- Tiny mouse parallax on camera (`x` lerps toward `mouse.x * 0.15`) — disabled under reduced-motion.

**8 interactive 3D props (all built from primitives — no GLB):**

| Section | Prop | Geometry |
|---|---|---|
| home | green cutting mat | thin `boxGeometry` + grid CanvasTexture |
| thinking | corkboard | `boxGeometry` + cork-noise texture + tiny note quads |
| projects | leather book | `boxGeometry` + gold trim (`torusGeometry`) |
| about | business card | very thin `boxGeometry`, cream material |
| writing | open notebook | two angled `boxGeometry` pages joined at spine |
| skills | toolbox | red `boxGeometry` + half-`torus` handle |
| journey | brass compass | `cylinderGeometry` + needle (`coneGeometry`) |
| contact | envelope | cream `boxGeometry` + flap (`planeGeometry`) |

**Ambient (non-interactive) decoration:** lamp (cylinder arm + hemisphere shade), coffee mug (cylinder + torus handle), pen holder + pencils, small plant (cone leaves), 2–3 paperclips (torus segments), stack of polaroids (thin boxes).

**Interactions per prop (`Prop3D` wrapper):**
- Hover → cursor pointer + lerp `position.y` up by `0.06` + soft emissive rim.
- Click → calls existing `onSlotClick(sectionId)` from `DeskStage` (unchanged signature) — same scroll-jump behavior.
- Active prop → gentle bob (sin wave on `position.y`) + small blue `pointLight` above it; mirrors today's "active slot" highlight.
- All animation via `useFrame`; no extra libs.

**Performance:**
- `dpr={[1, 2]}`, `frameloop="demand"`, `invalidate()` on hover/active changes; continuous tick only while a prop is active.
- Materials and CanvasTextures memoized once.
- Reduced-motion → static scene, no bob, no parallax.

**Integration:**
- `DeskStage.tsx` keeps the `22vh` bottom band but renders `<DeskScene slots={...} activeId activeId={active.id} onSlotClick={handleJump} />` instead of the current CSS `<Desk>`.
- `Desk.tsx` (CSS desk + flat slot shapes) and the related CSS (`.desk-3d`, `.desk-tilt`, `.desk-slot`, `.prop-3d`, `.prop-side-*`, `.prop-face`, slot positioning) are removed.
- The `slot` config in `src/pages/Index.tsx` switches from CSS `top/left/width/height/rotate` to 3D `position: [x, y, z]` + `rotation: [rx, ry, rz]` + `prop` type. Keeps the same 8 sections in the same conceptual back/mid/front zones, now placed in world space.

### 3. Files

**New**
- `src/components/desk3d/DeskScene.tsx` — Canvas, camera, lighting, floor.
- `src/components/desk3d/Prop3D.tsx` — generic interactive prop wrapper (hover lift, click, active bob, rim light).
- `src/components/desk3d/props/*.tsx` — 8 interactive props (Mat, Corkboard, Book, Card, Notebook, Toolbox, Compass, Envelope).
- `src/components/desk3d/decor/*.tsx` — ambient props (Lamp, Mug, PenHolder, Plant, Paperclips, Polaroids).
- `src/components/desk3d/textures.ts` — CanvasTexture generators (walnut, cork, paper grid, leather).

**Edited**
- `src/components/DeskStage.tsx` — remove 3 glow divs; swap CSS `<Desk>` for `<DeskScene>`.
- `src/pages/Index.tsx` — update each section's `slot` to 3D `position`/`rotation`/`prop`.
- `src/index.css` — remove `.stage-light`, `.desk-horizon`, `.stage-ground-shadow`, `.desk-3d`, `.desk-tilt`, `.desk-slot`, `.prop-3d`, `.prop-face`, `.prop-side-*`. Keep frame skins, `.stage-fit`, `.stage-scroll`, `.stage-float`, `.desk-surface` (now just background fallback).

**Removed**
- `src/components/desk/Desk.tsx` (CSS desk + flat slot shapes — fully replaced by R3F scene).

### Out of Scope
- `AssemblyHeader`, `MarginDoodles`, `Entropy` — untouched.
- All section component internals + frame skins (`BlueprintFrame` cutting mat, etc.) — untouched.
- Scroll behavior, snap, one-viewport-per-section — unchanged.
- No GLB/GLTF assets, no new image files.
- No backend, routing, or admin changes.
