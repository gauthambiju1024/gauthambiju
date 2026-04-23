

## Make Desk Objects More Realistic

Upgrade the 3D props from stylized primitives to higher-fidelity, photorealistic objects through better geometry, PBR materials, and finer detailing. No new dependencies, no GLB assets — purely procedural improvements within the existing R3F setup.

### 1. Material upgrades (global)

Switch all hero materials to richer PBR config:
- **Wood (desk + book covers)**: layered noise normal map (procedural via `DataTexture`) + anisotropic clearcoat for grain sheen.
- **Brass/gold**: `metalness: 1`, `roughness: 0.22`, warm tint `#c8923a`, subtle `clearcoat`. Add a faint scratch/roughness map (procedural noise) so it isn't mirror-perfect.
- **Leather**: bumpy normal map (procedural noise), `roughness: 0.7`, `sheen: 0.3`, `sheenColor: #2a1208`.
- **Ceramic (mug)**: high `clearcoat: 1`, low `clearcoatRoughness: 0.08`, slight `iridescence` for glaze.
- **Paper**: subtle fiber normal map, `sheen: 0.15`, off-white `#f4ead8`.
- **Glass (compass dome)**: tighten — `transmission: 1`, `ior: 1.52`, `thickness: 0.2`, `roughness: 0.02`, with a thin `attenuationColor`.

Add a new `src/components/desk3d/materials.ts` exporting reusable normal/roughness `DataTexture` generators (wood grain, leather grain, paper fiber, brass micro-scratch) so all props share consistent surface detail.

### 2. Geometry refinements per prop

`src/components/desk3d/props/index.tsx`:
- **BookProp**: replace flat box pages with stacked thin layers (8–12 page slices) so the edge reads as paper, add slight cover bevel via larger `RoundedBox` radius, add raised gold corner brackets, embossed title bar.
- **CompassProp**: add knurled bezel ring (instanced tiny boxes around rim), N/E/S/W tick marks (small extruded boxes), faint cardinal text via emissive plane with procedural texture, replace flat needle with two-tone (red/white) tapered needle made of two `coneGeometry`s back-to-back.
- **NotebookProp**: add many thin page slices (10 per side) for a real book stack, curved page edges via subtle `LatheGeometry` for the outer fore-edge, ink lines on the visible page using a procedural texture (`paperLinedTexture()`), pen gets a tapered nib (`coneGeometry`) and brass clip.
- **MatProp**: add chamfered edge (compose two `RoundedBox`es) and stitched border via thin emissive line.
- **CardProp**: layered (3 cards stacked, slight rotation), torn/deckled top edge (subtle vertex displacement), embossed monogram via small extruded `TextGeometry`-free shape (use `ExtrudeGeometry` from a `THREE.Shape`).
- **ToolboxProp**: add panel seams (thin inset boxes), rivets (tiny instanced spheres along edges), rubber feet at corners, two-tone lid/body.
- **EnvelopeProp**: actual triangular flap built from `Shape` + `ExtrudeGeometry`, pressed wax seal with embossed ring.
- **CorkboardProp**: cork uses higher-res procedural texture (denser specks), notes get curled corners (slight rotation + tiny secondary plane) and string between two pins.

### 3. Decor upgrades

`src/components/desk3d/decor/index.tsx`:
- **Lamp**: articulated arm (two segments + joint sphere), proper shade made via `LatheGeometry` (curved profile), inner emissive bulb sphere, brass base ring, real soft `spotLight` (cone) replacing the `pointLight` for realistic falloff and shadow projection on the desk.
- **Mug**: `LatheGeometry` body for a proper potter's profile (subtle taper + foot), thicker handle (`TorusGeometry` with larger tube), coffee surface with light brown radial gradient texture and slight `clearcoat` for liquid sheen, faint steam wisps (3 transparent `PlaneGeometry`s with noise alpha — static, no animation if `prefers-reduced-motion`).
- **Plant**: replace cones with curved leaf strips made via `Shape` + `ExtrudeGeometry`, soil layer with darker noise texture, pot uses `LatheGeometry` for terracotta profile.
- **PenHolder**: knurled brass surface (instanced micro-grooves), each pen gets a clip + nib.
- **ClosedJournal**: add band closure (thin elastic strap across cover), embossed corner brackets.
- **PolaroidStack**: each polaroid gets a tiny image area (off-white inner rectangle with very faint procedural "photo" gradient), rounded corners.
- **Paperclips**: real paperclip path via `TubeGeometry` along a `CatmullRomCurve3` (the classic double-loop shape) instead of a torus.

### 4. Lighting & shadows

`src/components/desk3d/DeskScene.tsx`:
- Replace the lamp's `pointLight` with a `spotLight` (angle ~0.6, penumbra 0.5, decay 1.6, intensity 2.2) targeting the desk center → realistic warm pool of light.
- Increase shadow map size to 2048 for the key + spot lights (only these two cast shadows; others stay shadow-off for perf).
- Add `ContactShadows` second pass under the lamp area only (smaller, sharper) for grounded lamp base.
- Switch `Environment` preset from `apartment` to `studio` for cleaner reflections on brass/glass; keep `background={false}`.
- Add subtle `fog` (`color #0a0a0a`, near 2.5, far 5) so the desk edges dissolve into background more naturally.

### 5. Performance guardrails

- All procedural textures memoized once in `materials.ts` and shared.
- Page-slice books use `InstancedMesh` where possible.
- Knurling/rivets use `InstancedMesh`.
- Keep total draw calls similar to current via instancing.
- Respect `prefers-reduced-motion`: skip steam, skip needle wobble.

### Files Touched
- `src/components/desk3d/materials.ts` — NEW: shared procedural normal/roughness textures + material factories.
- `src/components/desk3d/textures.ts` — add `paperLinedTexture()`, denser `corkTexture()`, `coffeeTexture()`.
- `src/components/desk3d/props/index.tsx` — geometry + material upgrades for all 8 props.
- `src/components/desk3d/decor/index.tsx` — lathe-based mug/lamp/plant/pot, tube paperclips, articulated lamp.
- `src/components/desk3d/DeskScene.tsx` — spotLight, fog, env preset, larger shadow maps.

### Out of Scope
- No GLB/GLTF model imports, no new npm packages, no asset uploads.
- Layout (18vh strip), camera, parallax, panel, frames, sections, routing — all untouched.
- No changes to `Prop3D.tsx` interaction logic.

