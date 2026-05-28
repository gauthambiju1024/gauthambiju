
## 1. Project spines — appearance animation matching the "MORE ABOUT ME" landing

**Reference:** the About spine flies in with: arc (sin curve up then down), slight rotation tilt, scale-down from large to native shelf size, opacity fade-in at the end of the arc — driven by `eInOutCubic` easing.

**Goal:** when the Projects shelf scrolls into view, each project spine should "drop into its slot" with the same physical, weighted feeling — not just fade up. Staggered left-to-right so it reads as books being placed on the shelf one after another.

**File: `src/components/ProjectsShelf.tsx`**

Per-spine entry animation (using framer-motion, already imported):
- **From state:** `opacity: 0`, `y: -80` (above the shelf), `rotate: -8°`, `scale: 1.15`.
- **To state:** `opacity: 1`, `y: 0`, `rotate: 0°`, `scale: 1`.
- **Trigger:** `whileInView` with `viewport={{ once: true, amount: 0.3 }}` on each spine so it fires when the shelf enters.
- **Easing:** custom cubic-bezier `[0.65, 0, 0.35, 1]` (matches `eInOutCubic` used in the About flight) over `0.75s`.
- **Arc feel:** use `keyframes` for `y` — `[-80, -20, 0]` and `rotate` — `[-8, 3, 0]` so the spine arcs down and settles with a small overshoot tilt, mimicking the About spine's `sin`-curve arc and `flightTilt`.
- **Stagger:** `delay: i * 0.09` where `i` is the spine index within the shelf row. Reads as books being placed left-to-right.
- **Landing micro-bounce:** after settle, a tiny `y: [0, -2, 0]` shadow pulse on the existing book-shadow strip (0.2s, delayed to start of land) so the shelf feels the impact.

Keep all existing hover, select, and lift interactions exactly as they are — entry animation runs once, then normal behaviour resumes.

No changes to spine visuals, layout, sizes, or any other component.

---

## 2. Toolbox redesign — approved, proceeding as previously planned

(Same as prior plan: brushed-metal greyscale tray, recessed compartments, engraved labels, SVG line-icons replacing emoji glyphs, metal-tag skill chips, slate tooltip with gold hairline. No behavioural or content changes.)
