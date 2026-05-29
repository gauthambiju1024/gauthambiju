
## Scope

Stop after the toolbox + flip-open transition is in place. The interior skills grid will use the existing admin-backed skills source (`ToolboxInterior` already reads from `useSiteContent("skills", "groups")`), styled as the foam-cutout grid from the reference, but NOT re-wired or schema-changed.

## What changes

### 1. New shared toolbox artwork — `src/components/skills/ToolboxSvg.tsx` (rewrite)

Replace the small flat SVG with three React components that render the **landscape 3D toolbox** from the reference (W=800, H_BASE=160, H_LID=80, D=500 base proportions, but expressed as a self-scaling 3D unit driven by a `scale` prop):

- `ToolboxClosed3D({ scale })` — full 6-face base + 6-face lid assembly, lid closed (rotateX=0). Used as the static, scaled-down shelf prop AND as the starting frame of the flip. Contains: dark `#0a0e12` faces, gold-tinted borders, corner rivets, hazard stripes, twin latches with "L-01"/"R-02" plaques, central "CORE SYS_MDL" nameplate, carbon-fiber overlays, layered handle on the lid front, metal corner brackets. Uses `transform-style: preserve-3d` and the `<Face>` helper.
- `ToolboxLid3D({ rotateX, scale })` — only the lid sub-assembly with its hinge transform-origin (`50% 100% -D/2`) and a `rotateX` motion-value prop for the scroll-driven hinge open.
- `ToolboxBase3D({ scale, children })` — only the base sub-assembly, with a slot for the interior content on its top-face (the "floor" the lid opens to reveal).

The old flat `ToolboxClosed` / `ToolboxLidOnly` / `ToolboxBodyOnly` exports are removed.

### 2. Shelf prop — `src/components/AboutToProjectsBridge.tsx`

Replace the inline `<ToolboxClosed width={220} height={174} />` with `<ToolboxClosed3D scale={0.22} />` inside a 220×174 wrapper. The wrapper still:
- registers as the last cell of the bottom shelf row
- carries the existing rise-into-row archive animation
- publishes `window.__toolboxRect` for the next bridge
- handles the `#skills` link / `transformOrigin: "bottom right"` for the next handoff

No animation logic changes here — only the artwork.

### 3. Toolbox→Skills bridge — `src/components/ToolboxToSkillsBridge.tsx` (rewrite)

Rebuild as a scroll-driven 3D flip mirroring the reference's behavior, scoped to the existing pinned 260vh section. Stage uses `[perspective:2500px]` and a `[transform-style:preserve-3d]` 3D container sized W×(H_BASE+H_LID).

Scroll-progress timeline (`useScroll` + `useSpring` for elegant smoothing, consistent with project conventions):

```text
progress   stage transform                         lid rotateX   interior
0.00       at shelf rect (x,y,scale from           0             hidden
           __toolboxRect), rotX 0, rotY 0
0.05–0.20  fly to centre, rotX → -15°, scale up    0             hidden
0.20–0.30  rotX → -90° (top-down orthographic)     0             hidden
0.30–0.45  hold top-down                           0 → 125°      hidden → fade in
0.45–0.65  hold top-down, lid fully open           125°          fully visible (interactive)
0.65–0.95  rotX → -15°, rotY → 35° (settle on      125° → 0°     fade out → hidden
           desk view)
```

The lid's foam-cutout skills grid (top-face of the base, the "floor") receives an `opacity` motion-value driven by 0.35–0.55 fade-in. This floor face is the only `pointerEvents:auto` face — matching the reference.

The floor face's content is `<ToolboxInterior />` (existing) wrapped in the same foam/grid container styling as the reference's `InnerApp` (foam-pattern background, 3-column grid, skill chips with foam-cutout shadow, screw rivet). `ToolboxInterior` already pulls from admin (`useSiteContent("skills","groups")`) and the existing `DEFAULT_GROUPS` fallback — no admin/schema change.

Starting position uses `window.__toolboxRect` (already published by the shelf bridge) so the 3D toolbox begins exactly on the shelf prop — visual continuity, no blank handoff. As soon as scroll begins, the shelf prop is faded (existing `__bridgeSettled` logic already covers this since the shelf section unpins as we enter the Skills section).

A `useLayoutEffect` measures and re-publishes positions on resize, matching the reference's `update()` pattern.

### 4. Cleanup

- Remove the `closedOpacity/openOpacity/lidRotate/openAssembly` flat-SVG code path from the current `ToolboxToSkillsBridge`.
- Keep `id="skills"`, scroll-margin, and pinned section height (`260vh`) unchanged so `AssemblyHeader` nav targeting is unaffected.
- No changes to `Index.tsx`, admin pages, or DB.

## Out of scope (per "do only till here first")

- Constellation background, leaf decor, "ConstellationBg" from reference — not added.
- Post-skills "settle on desk" workbench scene from reference — not added.
- Certificates / scroll-marker dock / "Scroll to explore" arrow — not added.
- Any admin schema or `useSiteData` changes.
- Changing the existing About→Projects spine flicker / appearance code — already covered in prior turns.

## Acceptance

- Shelf shows the new landscape 3D toolbox (scaled down) in the bottom-right slot, hand-drawn-quality dark-gold aesthetic.
- Scrolling into the Skills section flies the same toolbox to centre, rotates to a top-down view, hinges the lid open, and reveals the admin-backed skills grid styled as foam-cutout tools.
- Scrolling back reverses smoothly with no flicker or blank frame.
