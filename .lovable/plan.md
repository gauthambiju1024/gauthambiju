

## Replace the 3D Desk with a Recessed Blueprint Console Rail

Swap out the bottom 12vh 3D scene (`DeskScene`, props, lamp, status light bar) for a flat, architectural, **section-aware** console strip — three functional zones, no scattered objects, no tabletop perspective.

---

### The new bottom strip

**Container:** `<ConsoleRail>` — a single CSS/SVG component, ~104px tall (clamp 88–120px), full content width, inset into the page.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ░░ thin brass top edge ░░                                                   │
│ ┌──────────────┐ │ ┌─────────────────────────────────┐ │ ┌────────────────┐│
│ │ BUILD STATUS │ │ │   CONTEXTUAL ACTION DOCK        │ │ │ ARTIFACT PREVIEW││
│ │ 03/08 · ABT  │ │ │ [Featured] [Case Studies] [...] │ │ │   ▢▢▢          ││
│ │ ● ● ○  18%   │ │ │                                 │ │ │   blueprint tile││
│ └──────────────┘ │ └─────────────────────────────────┘ │ └────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

**Surface:**
- Base: `linear-gradient(180deg, hsl(220 18% 10%), hsl(220 22% 8%))` (a touch lighter than `--background`)
- Top border: 1px `hsl(38 60% 52% / 0.55)` brass hairline
- Bottom border: 1px `hsl(220 30% 5%)` shadow line
- Inset shadow: `inset 0 2px 8px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.03)`
- Faint blueprint grid overlay: 24px×24px lines at 4% white, 96px majors at 7%
- Two subtle radial spotlight pools (amber `#ffc98a` 6%, blue `#9ec0ff` 4%) under the active action and active artifact — not lamps, just gradient glows
- Vertical zone dividers: 1px `hsl(220 20% 28% / 0.5)`
- Tiny corner machining marks (4 SVG L-brackets) at the four corners

**Typography:** JetBrains Mono for labels/numerics, Space Grotesk for action text, Caveat only for the "now building" handwritten line that already lives above the rail.

---

### Zone 1 — Build Status (left, ~22% width, max 260px)

Static structural readout, updates per active section. **No 3D, no animated belt, no scattered LEDs across the whole bar.**

Stack (vertical, mono):
1. `03 / 08 · ABOUT` — large mono, ink `hsl(36 37% 96%)`
2. Thin progress line — full zone width, 2px, fills `hsl(38 60% 52%)` based on `scrollYProgress` within the active section's slice
3. `now building · about` — Caveat, amber `hsl(43 74% 55%)`, fades on station change (already exists, just relocate inside the rail)
4. Three 6px LED dots in a row: past=dim cool, current=pulsing amber, upcoming=hollow ring. Represents prev / current / next station only

Hover the block → tooltip "Section 3 of 8 · click to jump to top" → click scrolls to current section anchor.

---

### Zone 2 — Contextual Action Dock (center, flex-1)

The functional core. **Driven by an `actionsByStation` map keyed on `activeId`.** Each action is a compact pill button:

- Height 36px, padding `0 14px`
- Border 1px `hsl(220 20% 28%)`, bg `hsl(220 16% 14%)`
- Label: Space Grotesk 13px, ink cream
- Hover: lifts 2px, border becomes brass, faint amber underline
- Active/current: brass border + 1px brass underline + amber dot prefix
- Disabled (placeholder): 40% opacity, cursor not-allowed

**Action map:**

| Station | Actions |
|---|---|
| Home | `View Work` → scroll #projects · `Resume` → /resume.pdf · `What I Build` → scroll #about |
| About | `Bio` · `Now` · `Contact` → scroll #contact |
| Projects | `Featured` · `Case Studies` · `Product` · `AI / PM` (filter chips, set local filter state on `ProjectsShelf` via context) |
| Thinking | `Pinned` · `Strategy` · `Product Essays` (filter `case_studies` by `card_type` / tag) |
| Skills | `Product` · `Technical` · `Design` · `Systems` (filter compartments in `SkillsToolbox`) |
| Journey | `Jump to year ▾` (mono dropdown of years from data) · `Education` · `Experience` |
| Writing | `Latest` · `Product` · `Systems` · `Reflections` (filter `blog_posts` tags) |
| Contact | `Copy Email` (writes to clipboard, toast confirms) · `LinkedIn` · `GitHub` · `Schedule Chat` (cal.link from `site_content`) |

Layout: `flex gap-2 overflow-x-auto`, scrollbar hidden. On `<700px` rail collapses to first 3 actions + `⋯ More` opening a sheet.

---

### Zone 3 — Adaptive Artifact Preview (right, ~22% width, max 280px)

**One** small flat SVG/CSS object per station — drawn 2D, no perspective, no shadows beyond a 4px soft drop. Animates subtly on station change (200ms fade + 4px slide-up + draw-on stroke for the line art). All artifacts share the same 64px height frame so the rail stays still.

| Station | Artifact |
|---|---|
| Home | Folded blueprint tile (4 rect facets, brass corner clip) + tiny profile chip beside it |
| About | Letterhead card · monogram `GB` |
| Projects | 3 stacked book spines, colors from top 3 `projects.color` |
| Thinking | 4 overlapping pinned notes (yellow/cream squares with brass pin SVGs) |
| Skills | Caliper silhouette + 1 tool chip showing the active filter |
| Journey | Mini horizontal rail with milestone dots; current year highlighted brass |
| Writing | 3 notebook tabs (cream rectangles offset) + count `· 12 essays` |
| Contact | Airmail letter card + small green availability dot + "Open to roles · 2025" |

Each artifact is a tiny stateless SVG component in `src/components/console/artifacts/`.

---

### Motion budget

- Console rail itself: **no idle motion**. Entirely static surface.
- Station change: 220ms cross-fade between zone-1 readout, zone-2 action set, zone-3 artifact. Uses `AnimatePresence mode="wait"` per zone.
- LED dots: only the active dot pulses (1.4s ease-in-out, opacity 0.6↔1.0)
- Progress fill: smooth via `useTransform(scrollYProgress, …)` mapped to the active section slice
- Action hover: 120ms transform + border color
- Reduced motion: pulse and fade disabled, all swaps instantaneous
- The "now building · {label}" Caveat tag is **moved inside the rail's status zone** (replaces the floating positioned tag)

---

### What gets removed

- `DeskScene.tsx` — no longer mounted (file kept for now, just unused)
- `WorkbenchLamp`, `Parallax`, `Invalidator`, `DraftingTop`, `StatusLightBar` — no longer rendered
- All workbench props from the bottom strip: `BlueprintTube`, `NotebookWithPen`, `DraftingTools`, `LaptopClosable`, `Mug`, `StickyNotes`, `BookStack`, `PolaroidStack`, `BrassPaperweight`
- The 1.5vh fade gradient seam (replaced by the rail's own brass hairline)
- The floating absolutely-positioned `now building` tag in `DeskStage`
- `onJump` to LED dots (replaced by status-zone click + action-dock buttons)

The R3F dependencies stay in `package.json` (no purge needed) so the props can be revisited if we want to bring some back as quick illustrations elsewhere — but nothing 3D renders below the viewport anymore.

---

### What stays the same

- `DeskStage` 800vh scroll engine, panel cross-fades, scroll-anchored navigation
- Both `AssemblyHeader` (desktop) and `AssemblyHeaderMobile`
- All 8 panel `Section` and `Frame` components
- `MarginDoodles`, `Entropy`, ghost grid, blueprint hero
- The 12vh footprint at the bottom of `DeskStage` — the rail occupies the same vertical slot, so panel layout above it doesn't move

---

### Files to add

- `src/components/console/ConsoleRail.tsx` — main shell, three zones, station-aware switching
- `src/components/console/BuildStatus.tsx` — left zone
- `src/components/console/ActionDock.tsx` — center zone
- `src/components/console/actionsByStation.ts` — pure data map of actions per `FrameId`
- `src/components/console/ArtifactPreview.tsx` — right zone, switch on `activeId`
- `src/components/console/artifacts/{Blueprint,Letterhead,BookSpines,PinnedNotes,Caliper,MilestoneRail,NotebookTabs,LetterCard}.tsx` — 8 small SVGs

### Files modified

- `src/components/DeskStage.tsx` — replace the bottom-12vh `<DeskScene />` block (and the floating "now building" tag) with `<ConsoleRail activeId={activeId} activeIdx={activeIdx} progress={scrollYProgress} sections={sections} onJump={handleJumpIndex} />`
- `src/index.css` — add `.console-rail` styles (surface gradient, brass edges, blueprint grid, action pill, LED dot)

### Responsive

- `≥1024px`: full three-zone layout, all actions visible
- `700–1023px`: zones at 24% / 1fr / 24%, action dock scrolls horizontally with hidden scrollbar
- `<700px`: rail height drops to 88px, zone 3 (artifact) hidden, zone 2 collapses to 3 actions + `⋯` sheet, zone 1 shows compact `03/08` only

