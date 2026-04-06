

## Plan: Deeper Skeuomorphic Details

Push the tactile realism further across all sections without changing content, layout, or structure. Each section gets physical details that reinforce its metaphor.

### Changes

**1. `src/index.css` — New texture classes and enhanced materials**

- **New `.pushpin`** class: CSS circle with radial gradient (red/dark-red), a pin shadow, and a tiny metallic highlight — for ThinkingWall cards
- **New `.tape-realistic`** class: Semi-transparent tape strip with wrinkled edge effect via box-shadow, slight yellowish tint
- **New `.stitched-border`** class: Dashed border with contrasting thread color, simulating leather stitching around the notebook
- **New `.wax-seal`** class: Circular element with red radial gradient, embossed "GB" feel, for timeline nodes
- **New `.wood-shelf-ledge`** class: Bottom border with wood grain gradient and a front-lip highlight for ProjectsShelf
- **Enhance `.notebook`**: Add a stitched inner border using `outline` with dashed style (thread effect along the leather edge)
- **Enhance `.whiteboard-bg`** (cork board): Add pushpin shadow holes at corners, deepen the cork noise texture
- **Enhance `.toolbox-bg`**: Add a latch/handle highlight stripe at the top (horizontal metallic gradient bar)
- **New `.aged-paper`** class: Subtle yellowed vignette via inset box-shadow for the Journey section background
- **New `.ink-line`** class: Timeline vertical line with slight irregularity via a repeating gradient that alternates opacity (ink-drawn feel)

**2. `src/components/ThinkingWall.tsx` — Pushpins on sticky notes**

- Replace the plain circle pin decoration (line 103) with the new `.pushpin` class element — a realistic red pushpin with shadow and metallic highlight
- Add tape-realistic strips on "diagram" type cards instead of the flat transparent div

**3. `src/components/SkillsToolbox.tsx` — Brass corner brackets**

- Add L-shaped gold corner brackets (pseudo-elements or small divs) at the top-left and bottom-right of each skill group card
- Add a small brass rivet dot before each skill chip label

**4. `src/components/JourneyTimeline.tsx` — Wax seals and ink line**

- Replace the vertical `bg-border` line with the `.ink-line` class for a hand-drawn feel
- Replace plain timeline dots with `.wax-seal` elements — red circles with embossed gradient
- Current node keeps the pulse animation but styled as a glowing wax seal

**5. `src/components/WritingDesk.tsx` — Drafting table details**

- Add a faint blue grid overlay behind the editorial section (architect's drafting paper)
- Add corner photo-mount marks on article cards (small L-brackets in muted color)

**6. `src/components/ContactClosing.tsx` — Sealed envelope feel**

- Add a decorative envelope flap shape at the top of the section using a CSS triangle/trapezoid (border trick or clip-path)
- Style the signature "— GB" with a subtle ink splatter decoration (small CSS dots scattered near it)

**7. `src/pages/Index.tsx` — Notebook stitching**

- Add the `.stitched-border` effect to the notebook container (dashed outline simulating thread along the leather binding edge)

### What does NOT change
- Section content, layout, order, or structure
- Typography, color system, routing, data fetching
- Responsive behavior and animations

