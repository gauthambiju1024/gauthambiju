

## Engineering Manager's Workbench — Restyled 3D Strip + One Original Interaction

The bottom 12vh strip stays 3D, stops trying to be a navigation menu, and gets reframed as an **engineering manager's workbench at the end of the day**. We'll trade the toy-like props for a curated set of EM-coded objects, snap the materials to the site's blueprint/walnut palette, and add one original interaction — the **"Status Light"** — that turns the desk into a live indicator of where you are in the page, without ever being a menu.

### The new workbench inventory

A real EM's desk is half "thinking tool", half "shipping evidence". We model both, kept to ~10 quiet objects so it reads as composed, not cluttered.

**Left zone — thinking & planning**
- Brass architect's lamp (restyled, dimmer, cream shade) — anchors lighting
- Rolled blueprint tube, leaning
- Hardcover notebook (closed, leather + brass corner), pen resting diagonally on top
- Drafting triangle + mechanical pencil

**Center zone — current work**
- Laptop, lid open ~110°, screen off (faint reflection only)
- Ceramic mug (kept, but recolored matte charcoal with a thin gold rim — no more cartoon)
- Sticky-note stack (3 notes fanned, one with a tiny Caveat scribble)

**Right zone — shipped & people**
- Small stack of books spine-out (3 vols, walnut/cream/gold spines)
- Polaroid stack (sepia, smaller, slightly tilted)
- A single brass paperweight (replaces the scattered paperclips)

**Above the desk (new)**
- A thin **status-light bar** — a 1cm brass strip suspended just above the back edge of the desk, holding 8 tiny LED dots (one per section). This is the interaction surface (described below). It reads as desk hardware, not a nav rail, because the dots are 4px each, unlabeled, and sit on a physical fixture.

Removed: plant, paperclips, the 8 nav-prop shapes (mat/card/book/cork/toolbox/compass/notebook/envelope), the pen-holder (replaced by pen-on-notebook).

### Visual direction

- **Surface**: dark drafting-table top in `hsl(160 20% 16%)` (matches hero blueprint), faint blueprint grid baked at ~6% opacity, soft vignette to dissolve the edges into the page background. No more warm wood plank.
- **Lighting**: one soft top-down key (`#fff8e8`, 0.4) + low cool fill (`#bcd0ff`, 0.2) + the lamp's own warm cone (`#ffd9a0`, 0.35, distance-limited) pooling on the left zone only. Reads as a working desk under a single lamp, not a diorama.
- **Materials**: matte everywhere (`roughness 0.85`, `metalness 0`), with brass accents (`roughness 0.35`, `metalness 0.85`, color `#b89058`) reserved for lamp arm, paperweight, notebook corner, status-light bar, and book gilding. Restrained palette: cream paper, walnut, brass, blueprint-blue cloth — same tokens as the panels above.
- **Fog**: tightened (`2.0 → 4.0`) so the strip dissolves into background instead of showing a horizon line.

### The original interaction — "Status Light"

The brass bar above the desk holds 8 unlabeled 4px LED dots, one per section. As you scroll:

1. **Live position dot** — exactly one LED is lit warm amber (`#ffb86b`) at any moment, corresponding to the section currently dominant on stage. It interpolates *between* dots during transitions, so the light physically slides along the bar in lockstep with `scrollYProgress`. The lit dot also casts a soft real pointlight downward onto the desk surface — so as you scroll, a small warm glow drifts left-to-right across the workbench. That drift is the feedback; it's ambient, not a label.

2. **"Now Building" tag** — a tiny Caveat-script paper tag hangs from the bar by a 1px thread, positioned under the lit dot. The tag shows the current section name in lowercase gold (`projects`, `thinking`, …). It's rendered as a flat `<motion.div>` overlay (HTML, not 3D) so the type stays crisp at any zoom. It fades in only after the user has been on a section for >300ms, so it doesn't strobe during fast scrolls.

3. **Click the LED bar (the only interactive element)** — clicking any of the 8 dots scrolls to that section using the existing `handleJump` math. **But** this is intentionally unobtrusive: dots are 4px, no hover labels, no cursor pointer until you hover within 12px of the bar (an invisible hit-pad expands the target). The header remains the obvious nav. The bar is for the user who has already discovered the metaphor — a delight, not a duty.

4. **End-of-day mode (the original bit)** — after **30 seconds of no scroll and no pointer movement**, the workbench enters an "EOD" state:
   - The lamp dims to ~40%.
   - The status-light bar dims all dots except the active one.
   - The laptop lid animates closed over ~1.2s.
   - A tiny brass clock (the paperweight, repurposed visually with a faint clock face decal) ticks once and pauses.
   - First scroll or mousemove → everything restores in 0.4s.
   
   This makes the desk feel *alive* and *managed* — it responds to your attention, not just your scroll. No other portfolio does this. It costs almost nothing (one timer + a few opacity/rotation tweens) and reinforces the EM theme: a workbench that gets put away at the end of the day.

### Behavior changes in code

- `Prop3D`'s click + hover-lift + halo + ground-ring — removed. Props are decoration only. Cursor stays default over the canvas except within the 12px LED hit-pad.
- `slot` field on each `SectionConfig` (in `src/pages/Index.tsx` + `DeskStage.tsx` types) — removed. Props live at fixed positions inside `DeskScene`.
- `DeskScene` no longer takes `slots` or `onSelect`. It takes `progress` (the existing `scrollYProgress` MotionValue) and `onJump(index)`.
- Frameloop changes from `"always"` to `"demand"` + `invalidate()` on scroll-progress changes, EOD enter/exit, and lamp/laptop tweens. Idle pages stop spending GPU.
- Shadow map drops from 2048 → 1024 (strip is only 12vh; difference invisible).

### What stays the same

- All scroll mechanics in `DeskStage.tsx` — 1:1 vertical→horizontal mapping, GAP, opacity crossfade, centered menu jumps, anchor spans, reduced-motion fallback.
- AssemblyHeader is still the only navigation. Status-light bar is a discoverable shortcut, not a replacement.
- Strip height (12vh), seam-fade gradient, vertical rhythm.
- Three.js / R3F / drei stack — no new dependencies, no version changes.
- Margin doodles, ghost grid, entropy background, all 8 section components.
- Reduced-motion: EOD mode disabled; status light jumps to active dot instantly; lamp/laptop static.

### Files modified

- `src/components/desk3d/DeskScene.tsx` — new `DraftingTop` surface, new lighting + fog, frameloop `"demand"`, prop list trimmed and rearranged into left/center/right zones, mounts new `StatusLightBar` and `EODController`. Removes `slots` rendering, `onSelect`, `Prop3D` usage.
- `src/components/desk3d/decor/index.tsx` — restyle `Lamp` (brass + cream + dimmable via prop), recolor `Mug` (matte charcoal + gold rim), `PolaroidStack` (sepia, smaller). Remove `Plant`, `Paperclips`, `PenHolder`. Add new components: `BlueprintTube`, `DraftingTriangle`, `LaptopClosable` (animated lid), `BookStack`, `StickyNotes`, `BrassPaperweight`, `NotebookWithPen`.
- `src/components/desk3d/textures.ts` — add `draftingTopTexture()` (dark green base + faint blueprint grid + vignette) and `paperTexture()` (for sticky notes + polaroids). Existing exports kept for now.
- `src/components/desk3d/StatusLightBar.tsx` *(new)* — the suspended brass bar with 8 LED dots. Consumes `progress` to animate the lit position + downward pointlight; exposes `onJump(i)` via 12px hit-pads.
- `src/components/desk3d/EODController.tsx` *(new)* — invisible component inside the Canvas; tracks idle time via window listeners, drives a single `eod` MotionValue (0→1) that lamp / laptop / status bar / paperweight all subscribe to.
- `src/components/desk3d/Prop3D.tsx`, `src/components/desk3d/props/index.tsx` — no longer imported; left in place for a follow-up cleanup pass to keep this diff safe.
- `src/components/DeskStage.tsx` — drop `slots3D` derivation, remove `slot` from `SectionConfig` type, pass `progress={scrollYProgress}` and `onJump={(i) => handleJump(sections[i].id)}` to `<DeskScene>`. Add a thin DOM overlay (`<motion.div>` in Caveat gold) for the "Now Building" tag, positioned to track the status light horizontally.
- `src/pages/Index.tsx` — remove `slot: { … }` from each section config.

### Why this lands

- It actually looks like an EM's desk: planning tools left, current work center, shipped artifacts right — the same mental model EMs use for their week.
- The Status Light is novel — most portfolios use a scroll progress bar; nobody uses a physical lamp on a 3D desk that doubles as both indicator and shortcut.
- EOD mode gives the page a soul without adding chrome. It's the kind of detail people screenshot and share.
- Zero conflict with the AssemblyHeader: the bar is small, unlabeled, and physically attached to a desk fixture — it reads as hardware, not menu.
- Faster than today: demand frameloop + 10 props instead of 15 + smaller shadow map.

