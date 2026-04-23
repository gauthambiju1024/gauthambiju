

## Blend Desk into Background + Premium 3D Props

Two refinements to the existing R3F desk:
1. **Blend the 3D scene seamlessly** into the page background (no visible floor edge, no dark band, no hard horizon).
2. **Upgrade props to feel premium** — better materials (env-mapped reflections, brushed metals, subtle bevels), refined geometry, and softer cinematic lighting.

Scroll, snap, sections, frames, header, and margins remain untouched.

### 1. Seamless Desk Blend

In `src/components/desk3d/DeskScene.tsx`:

- **Transparent canvas, no fill, no fog horizon.** Remove `<color attach="background">` and `<fog>` so the WebGL canvas is fully alpha and the page background shows through.
- **Replace the flat floor plane** with a *radial-fade desk surface*. Keep the wood material but apply a custom shader-free fade via a second overlay plane that fades the floor edges to the page background color using vertex colors / alpha gradient — so there is no visible cutoff line where the desk ends.
- **Drop the hard rectangle** — change floor geometry from `planeGeometry(10,6)` to a smaller `circleGeometry(2.6, 64)` rotated flat, with a `meshStandardMaterial` using the wood texture *plus* a `transparent` alpha-mapped vignette texture (generated procedurally in `textures.ts` as `deskAlphaMask()`) that fades fully to 0 at the rim. Result: desk feathers into nothing.

In `src/components/DeskStage.tsx`:

- Remove the rigid `22vh` bottom band split. Make the `<DeskScene>` container span the **full sticky viewport** (`absolute inset-0`) behind the panel, with `pointer-events-none` on the upper region (handled inside the canvas by raycaster — props are only at the bottom so this is automatic). The active panel sits in front; the desk recedes naturally below and behind it.
- Add a CSS gradient overlay above the canvas (top 60% of viewport) fading from `hsl(var(--background))` solid → transparent, so the upper portion of the 3D scene dissolves into the page color. This guarantees the merge regardless of camera angle.

### 2. Premium 3D Props

In `src/components/desk3d/DeskScene.tsx`:

- **Environment lighting**: add `<Environment preset="apartment" background={false} />` from `@react-three/drei` (already installed) — gives PBR reflections on metals/leather/gold for a premium look without an HDR file.
- **Soft contact shadows**: replace per-prop `circleGeometry` shadow disks with drei's `<ContactShadows opacity={0.45} blur={2.4} far={1.2} />` — single, realistic grounded shadow.
- **Cinematic key light**: warm key (existing) + add a cool rim light from behind-right (`#7aa3ff`, intensity 0.4) for premium two-tone separation.

In `src/components/desk3d/props/index.tsx` — refine each prop:

- **CompassProp** → brass instrument: `meshPhysicalMaterial` with `clearcoat: 1`, `metalness: 1`, `roughness: 0.18`, color `#d4a85a`; add engraved bezel (thin torus rings), glass dome (transparent sphere with `transmission: 0.9`, `ior: 1.45`), refined needle.
- **BookProp** → leather-bound tome: `meshPhysicalMaterial` leather with `clearcoat: 0.4`, embossed gold band (extruded torus), bookmark ribbon (thin curved plane), beveled spine using `RoundedBox` from drei.
- **ToolboxProp** → use drei `<RoundedBox>` for chassis with `radius: 0.015`, brushed steel `metalness: 0.85, roughness: 0.45`, two brass latches, rubber grip on handle (`roughness: 0.95`).
- **NotebookProp** → softcover with `RoundedBox`, page edges with subtle stripes, leather elastic band across cover.
- **MatProp** → cutting mat with rounded corners (`RoundedBox`), subtle bevel, `clearcoat: 0.2` for slight sheen.
- **CorkboardProp** → beveled walnut frame (`RoundedBox`), inset cork, push-pins as small chrome spheres on the notes.
- **CardProp** → letterpress business card with `RoundedBox` + `clearcoat: 0.3`, embossed accent square in brass.
- **EnvelopeProp** → cream paper with subtle fiber texture, refined wax seal as a slightly domed cylinder with `clearcoat: 0.6`.

Decor in `src/components/desk3d/decor/index.tsx`:

- **Lamp** → brass arm + matte black shade, warmer bulb (`#ffd9a0` intensity 1.6).
- **Mug** → ceramic with `clearcoat: 0.5` glaze, subtle rim highlight.
- **PenHolder** → brushed brass cup, three premium pens (one fountain pen with chrome cap).
- Drop **Polaroids** (looks cluttered) — replace with a single **leather-bound journal** sitting closed for ambient richness.

### 3. Active-State Polish

In `src/components/desk3d/Prop3D.tsx`:

- Replace flat ring + pointlight with a **soft volumetric glow disc** (a larger faded plane with additive blending) under the active prop, plus a gentle upward tilt (rotation.x sway) when active, in addition to existing bob.
- Hover: subtle scale 1.04 with spring damping (lerped), plus brighter rim instead of yellow ring.

### Files Changed

- `src/components/desk3d/DeskScene.tsx` — transparent canvas, circle floor with alpha fade, Environment, ContactShadows, rim light, full-viewport sizing.
- `src/components/desk3d/textures.ts` — add `deskAlphaMask()` radial-fade canvas texture.
- `src/components/desk3d/props/index.tsx` — physical materials, RoundedBox geometry, refined details on all 8 props.
- `src/components/desk3d/decor/index.tsx` — premium materials; swap Polaroids for closed journal.
- `src/components/desk3d/Prop3D.tsx` — softer glow + scale-on-hover.
- `src/components/DeskStage.tsx` — full-viewport canvas layer, top fade gradient overlay, remove `22vh` split.

### Out of Scope

- All section components, frames (`BlueprintFrame` etc.), header, margins, scroll behavior, routing, backend.
- No new image assets, no GLB/GLTF, no new dependencies (drei already provides `Environment`, `ContactShadows`, `RoundedBox`).

