
# Integrate Library → Toolbox → Final Workbench choreography

## What the uploaded code does
A single pinned scroll section (~600vh) with three beats:
1. **Library recedes** — two bookshelves with spines scroll up and fade.
2. **3D toolbox flies & opens** — CSS-perspective 6-face box (W=800, H=240, D=500) lifts from a slot, scales to viewport, rotates −90° X to look down into it, lid hinges 125°, 3-column foam skill tray (InnerApp) appears on the floor.
3. **Toolbox lands on desk** — rotates back, shrinks, slides to bottom-left of `FinalWorkbench` (field-notes board, contact laptop, plant, lamp, mug, notebook+pen).

Single `useScroll` + `useSpring` drives everything — no handoff seams.

## Files
**Replace**
- `src/components/ToolboxToSkillsBridge.tsx` — rewritten to host the uploaded pinned-scroll choreography (same export name, no Index.tsx move needed).

**New**
- `src/components/skills/FinalWorkbench.tsx` — uploaded content, background layers stripped.
- `src/components/skills/skillsData.ts` — fallback SKILLS/CERTIFICATES defaults.

**Update**
- `src/index.css` — append `.send-workbench-section`, `.field-notes-board`, `.contact-laptop`, `.final-toolbox`, `.workbench-plant`, `.desk-lamp`, `.workbench-mug`, `.notebook-pen`, `.hide-scrollbar`, `@keyframes shimmer`. **All CSS transforms kept verbatim.** No token edits.
- `src/pages/Index.tsx` — drop trailing `contact` station (writing + thinking stay). FinalWorkbench is the new closing frame.
- `src/components/AboutToProjectsBridge.tsx` — remove `__toolboxTakeoverProgress` publish + shelf fade tied to it (new section owns its own intro/library recap).

**Not changed**: Hero/About flip, AssemblyHeader, ProjectsShelf, ThinkingWall, WritingDesk, MarginDoodles, Entropy, ghost grid, `--bd-*` tokens, fonts, routing, Supabase.

## "Remove the background" — concretely
- `App.tsx` → `<ConstellationBg />` removed.
- `FinalWorkbench.tsx` → top constellation SVG/radial-gradient wrapper + `<div className="desk-plane" />` removed. All desk props kept.
- `index.css` → do NOT copy `body { background }` or `.desk-plane`. Everything else copied verbatim.

Result: toolbox + workbench props float on the existing walnut + ghost-grid background.

## Margins stay visible (new requirement)
The new pinned section mounts **inside** `.margin-content-wrapper` (same as today), so `MarginDoodles` continue to render in the left/right margins throughout the entire library→toolbox→workbench scroll. The pinned sticky stage uses `position: sticky` within that wrapper — it never goes `position: fixed` full-viewport — so the margin doodle SVGs on either side remain fully visible and the central panel respects the same gutter as the rest of the site.

To ensure the toolbox 3D animation (which uses `position: absolute` over the sticky stage) doesn't visually bleed into the margins, the sticky stage gets `overflow: visible` for the 3D flight but the scenery layers (FinalWorkbench desk props) are clipped to the central panel via a wrapper with the existing panel max-width. Margin doodles render on top via their existing fixed positioning.

## Wire-up (technical)
- Rename uploaded `App.tsx` default export into `ToolboxToSkillsBridge.tsx`. Keep `useScroll({ target: containerRef })` + `useSpring`. Outer 600vh wrapper becomes the section root.
- Skills data: read from `useSiteContent("skills", "groups")` (same source as current `ToolboxInterior`), map into the 3-column foam tray; fall back to `skillsData.ts`.
- FinalWorkbench contact block: wire email/linkedin/resume to `useSiteContent("contact", ...)` if available; defaults already match `gauthambiju02@gmail.com`.
- Rewrite imports `motion/react` → `framer-motion`. `lucide-react` + `framer-motion` already in deps — no installs.
- Slot the toolbox lifts from sits inside the library recap panel of the same pinned section — seam stays in one viewport.
- Remove orphaned `__toolboxTakeoverProgress`, `__toolboxRect`, `__toolboxInFlight` globals from `AboutToProjectsBridge.tsx`.
- `#skills` anchor on the new section root; `#contact` anchor on the FinalWorkbench wrapper inside it — AssemblyHeader nav resolves correctly.

## Section order after change
```text
Hero/About flip
Projects shelf
[NEW] Pinned: library recap → 3D toolbox opens → skills → FinalWorkbench (= contact)
Thinking wall
Writing desk
```

## Verification
- Build passes.
- One scroll: library recedes → toolbox lifts/opens centered → skills tray readable → lands on desk with laptop/board. No empty frames.
- MarginDoodles visible in left/right margins through the entire pinned scroll.
- AssemblyHeader #skills and #contact land correctly.
- No doubled dark backgrounds.
