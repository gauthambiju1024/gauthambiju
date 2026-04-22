
## Builder's Desk — Floating Stage (Final)

The homepage becomes one cinematic skeuomorphic experience: a realistic engineer's desk anchored at the bottom of the viewport, with section "objects" arranged on it like a real workspace. As you scroll, the active object lifts off the desk and floats up into the stage above, becoming the visible section. The Assembly Header stays pinned on top and the Margin Doodles keep drawing in the side gutters — both completely untouched.

### Composition

```text
┌────────────────────────────────────────────────────────────┐
│  AssemblyHeader  (pinned, unchanged)                       │
├──┬──────────────────────────────────────────────────┬──────┤
│M │                                                  │  M   │
│a │     ╔══════════════════════════════╗             │  a   │
│r │     ║      ACTIVE OBJECT           ║   ← stage   │  r   │
│g │     ║   (renders the section)      ║   ~62vh     │  g   │
│i │     ╚══════════════════════════════╝             │  i   │
│n │            soft ground shadow                    │  n   │
│  │──────────────────────────────────────────────────│      │
│D │ 🪔 lamp glow ░░░░░░ ruler along back ░░░░░░ 📚    │  D   │
│o │ 📐 blueprint pinned   📋 corkboard    shelf edge  │  o   │
│o │ 💼 card  📓 notebook (pencil)  🧰 toolbox         │  o   │
│d │ ☕ mug+ring   📜 scroll          ✉ letter tray    │  d   │
│l │──────────────────────────────────────────────────│  l   │
│e │   walnut bevel front edge                        │  e   │
│s │                                                  │  s   │
└──┴──────────────────────────────────────────────────┴──────┘
```

Header, margins, and the central column are independent layers. The desk + stage live only inside the central column — margins and header are not modified, not overlapped, not re-parented.

### The Desk (skeuomorphic, real arrangement)

Sticky to the bottom of the central column, ~32vh tall, viewed at a slight ~12° perspective so it reads as a real surface receding from the viewer.

**Surface**
- Layered walnut wood: deep base (`hsl(22 35% 14%)`) + repeating-linear gradient grain + radial highlight from top-left lamp + subtle SVG noise overlay (3% opacity)
- Front bevel: 3px highlight on top, 12px deep shadow beneath — sells the edge
- Lamp vignette: warm radial (`hsl(38 70% 65% / 0.18)`) emanating from top-left, falls off across the desk
- Faint scratches and a coffee ring stain baked in as SVG

**Object placement (spatial, not a row)**
Back strip (pinboard zone, furthest from viewer):
- 📐 Blueprint sheet — top-left, two brass pins, slight curl on one corner → **Home**
- 📋 Corkboard with overlapping sticky notes — top-center → **Thinking**
- 📚 Bookshelf edge (lower 2 shelves visible) — top-right → **Projects**

Mid surface (working area):
- 💼 Business card on a small leather pad — left of center → **About**
- 📓 Open spiral notebook with pencil resting diagonally — center → **Writing**
- 🧰 Closed toolbox with brass latches — right of center → **Skills**

Front edge (personal items, closest to viewer):
- 📜 Rolled parchment scroll tied with twine — front-left → **Journey**
- ✉ Sealed wax letter in a wire tray — front-right → **Contact**

Ambient props (decorative, non-interactive): brass desk lamp, coffee mug + ring stain, scattered paperclips, a wooden ruler along the back edge, a sharpened pencil at angle near the notebook.

**Object behavior**
- Each object: realistic contact shadow, hover lift (3px) + cursor pointer, hairline mono-caps tooltip on hover
- Click any object → smooth scroll-snap to that section; the object then performs its lift animation into the stage
- When that section is active, the object's spot on the desk shows a soft outlined silhouette + faint gold glow ring (it has been "picked up")
- All object visuals are pure CSS + inline SVG — no images, no new assets

### The Stage (active panel above the desk)

- Top ~62vh of the central column, between header and desk
- Soft top-down key-light gradient + faint warm rim from the lamp side
- Active object renders large, centered, tilted ~−6° on X with a deep blurred ground shadow on the desk below — sells the float
- The actual section content (Hero, About, Projects, etc.) renders **inside** the floating object's frame: the business card *is* the About section, the bookshelf *is* the Projects section, the notebook *is* the Writing section, etc.
- Idle micro-motion when at rest: 3px Y-bob over 4s + 0.3° rotation drift (breathing). Pauses on user interaction.

### Scroll Choreography

One tall scroll container with 8 snap stops (`8 × 100vh`). The header, stage, and desk are all sticky inside it. A single `useScroll` + `useTransform` derives `activeIndex` and a normalized `t` (0→1) per section.

Per-section transition (3 phases):
1. **0 → 30%** — outgoing object descends back to its real desk spot: translateY down to slot, rotateX forward, scale to thumbnail size, shadow tightens and darkens
2. **30 → 50%** — empty stage moment; desk fully visible and breathing; ambient lamp glow more apparent
3. **50 → 100%** — incoming object lifts off its slot: translateY up into stage, rotateX back to −6°, scale up, shadow softens and spreads

**Signature animation per object** (so transitions feel distinct, not repetitive):
- Blueprint — unrolls horizontally (scaleX 0→1 with paper-curl SVG mask) as it lifts
- Business card — tumble-flips 180° on Y while rising; lands face-up
- Bookshelf — tilts forward, books cascade-fade in left-to-right (40ms stagger)
- Corkboard — pushpins drop in first, then notes stagger-fade with slight rotation jitter
- Toolbox — lid hinges open mid-rise (rotateX on the lid), tools settle with a tiny bounce
- Scroll — twine unties, parchment unfurls vertically (height 0→full)
- Notebook — opens like a book (left page rotateY 0→180°), reveals spread
- Letter — wax seal cracks, envelope flap opens, letter slides out and unfolds in two creases

All animations: transform + opacity only (GPU). Spring config: `stiffness 110, damping 20, mass 0.9` for primary motion; tween `0.4s ease-out` for cascades.

**Snap & input**
- `scroll-snap-type: y mandatory` on the scroll container
- Keyboard: ↑/↓ and PgUp/PgDn step between sections
- Header pills (existing) and desk objects both deep-link via smooth scroll to the matching snap point

### Header & Margin Doodles — UNCHANGED

- **AssemblyHeader**: not touched. No prop changes, no style changes, no behavior changes. Continues to render exactly as today, pinned at the top of the viewport. Its existing pill highlighting (driven by `IntersectionObserver` on `panelIds`) keeps working because each section still has its own `id` and occupies its own viewport-height snap region.
- **MarginDoodles**: not touched. Continues to render in left/right gutters, fully active, drawing on scroll across the entire scroll container length. The desk + stage live only inside `.margin-content-wrapper`'s inner column, so the gutters are never overlapped or interfered with.
- **Entropy** background particles: unchanged, sit behind everything.

### Light Re-theme of Existing Sections (wrappers only, content untouched)

To make the metaphors hold inside their floating frames, four sections get a **wrapper-only** re-theme. All copy, data, hooks, and inner layout are preserved exactly:
- **ThinkingWall** → corkboard background + pushpin accents on note cards (already close)
- **WritingDesk** → spiral binding edge + ruled-paper background (already close)
- **ContactClosing** → letter / envelope motif with wax-seal accent
- **JourneyTimeline** → unrolled parchment background with deckled top/bottom edges

`HeroSection`, `AboutSection`, `ProjectsShelf`, `SkillsToolbox` keep their current internals; their existing visual language already matches their object frame.

### Visual System

Reuses every existing token verbatim — no new colors, no new fonts:
- Gold `--primary` for active glows, foil accents, key strokes
- Walnut browns for desk surface
- Notebook off-white, blueprint green, corkboard tan from current palette
- Fonts: Playfair Display, Space Grotesk, Caveat, JetBrains Mono
- Shadows use existing soft-shadow tokens; new keyframes only

### Polish (the "Airbnb-level" details)

- Object shadows on the desk are **two-layer**: a tight contact shadow (2px blur, dark) + a soft ambient shadow (24px blur, low opacity) — grounds objects realistically
- Stage shadow on lifted object **scales inversely** to object height — as it rises, shadow grows softer and wider, then tightens as it descends
- Lamp glow **subtly intensifies** on the currently-active object (warm rim light), then relaxes during the empty-stage moment
- Hovering a desk object plays a tiny `0.4s` lift + a faint paper rustle (CSS only — no audio)
- First-visit micro-onboarding: on initial load, the blueprint performs its lift animation automatically, and a thin Caveat-font label "scroll to explore" appears under the stage for 3s then fades
- Reduced-motion: all 3D transforms and idle motion disabled; sections render as a normal vertical stack, with the desk shown once at the very bottom of the page as a decorative still life
- Focus-visible rings on all interactive desk objects; full keyboard reachability with logical tab order matching desk layout (back-row left→right, then mid-row, then front-row)

### Responsive

- **≥1280px**: full experience as described, desk ~32vh, all props visible
- **1024–1279px**: desk ~28vh, ambient props slightly reduced (no ruler, smaller lamp)
- **768–1023px**: desk ~24vh, props minimal, signature animations preserved but scaled down
- **<768px**: desk collapses into a 64px sticky bottom strip showing the 8 object icons in a horizontal scroll-snap row; stage takes near-full viewport; lift/flip animations simplified to fade + scale + slight Y; margin doodles auto-hide as today

### Technical Plan

1. **`src/components/DeskStage.tsx`** (new) — orchestrator. Sets up the 8×100vh scroll container, sticky stage + sticky desk, reads `useScroll`, derives `activeIndex` and per-section `t`, renders `<Stage>` with the active `<ObjectFrame>` and `<Desk>` with all 8 slots. Accepts a `sections` array of `{ id, label, slotPosition, Frame, SectionComponent }`.
2. **`src/components/desk/Desk.tsx`** (new) — sticky bottom band. Pure CSS walnut surface, lamp vignette, SVG ambient props, 8 absolutely-positioned `<DeskSlot>` children at their realistic coordinates. Handles hover, active silhouette, click-to-scroll.
3. **`src/components/desk/frames/`** (new directory) — 8 frame components: `BlueprintFrame`, `BusinessCardFrame`, `BookshelfFrame`, `CorkboardFrame`, `ToolboxFrame`, `ScrollFrame`, `NotebookFrame`, `LetterFrame`. Each wraps `children` (the section component) in its skeuomorphic shell and exports `enter` / `exit` / `idle` Framer variants describing its signature animation.
4. **`src/components/desk/StageObject.tsx`** (new) — generic stage wrapper that consumes a frame's variants + the per-section `t` motion value, applies float/tilt/shadow, and renders the active frame.
5. **`src/pages/Index.tsx`** (rewrite the inner content only) — keep `<Entropy />`, `<MarginDoodles />`, `<AssemblyHeader />` exactly as today. Replace the vertical panel stack inside `.margin-content-wrapper` with `<DeskStage sections={[...]} />`, passing each existing section component wrapped in its matching frame. Section `id`s preserved so header pill highlighting keeps working.
6. **`src/index.css`** — add: `.desk-surface`, `.desk-bevel`, `.desk-lamp`, `.desk-slot`, `.desk-prop-*`, `.stage`, `.stage-light`, `.stage-shadow`, `.frame-blueprint`, `.frame-card`, `.frame-shelf`, `.frame-cork`, `.frame-toolbox`, `.frame-scroll`, `.frame-notebook`, `.frame-letter`. New keyframes: `desk-bob`, `desk-drift`, `lamp-pulse`. Reduced-motion overrides.
7. **Wrapper re-theme** in `ThinkingWall.tsx`, `WritingDesk.tsx`, `ContactClosing.tsx`, `JourneyTimeline.tsx` — outermost wrapper only, content unchanged.
8. **No new dependencies** — Framer Motion, Tailwind, existing CSS tokens only.

### Files Changed
- `src/pages/Index.tsx` (replace center column with DeskStage; header + margins + entropy untouched)
- `src/components/DeskStage.tsx` (new)
- `src/components/desk/Desk.tsx` (new)
- `src/components/desk/StageObject.tsx` (new)
- `src/components/desk/frames/*.tsx` (8 new frame components)
- `src/index.css` (desk + stage + frames + keyframes)
- `src/components/ThinkingWall.tsx`, `WritingDesk.tsx`, `ContactClosing.tsx`, `JourneyTimeline.tsx` (wrapper-only re-theme)

### Out of Scope
- `AssemblyHeader` — no changes
- `MarginDoodles` — no changes
- `Entropy` — no changes
- Section copy, routing, admin, backend — untouched
- No new libraries, no new assets
