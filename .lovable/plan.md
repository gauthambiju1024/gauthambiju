

## Slim the Console Rail to a Minimal Local Dock + Relocate BYOP

Three coordinated changes: (1) gut Zone 1 of the console rail, (2) move the Assembly Header's "Build Your Product" (BYOP / DESIGN.INPUT) utility down into the right-bottom of the rail and shift the section artifact to the left-bottom, (3) reclaim the freed header space so the assembly track stretches wider.

---

### 1. Console Rail — strip the noise

**Remove entirely:**
- `BuildStatus` component (the `03 / 08` counter, section label echo, progress bar, three-dot LED cluster, "now building · …" caveat line) — it duplicates the assembly header's narrative.
- `STATION_META[*].status` strings (no longer rendered anywhere).
- The center "diagnostic" radial glow under `ActionDock`.
- Per-zone vertical dividers (`border-r border-white/[0.06]`).

**Keep, slimmed:**
- The recessed strip itself: still ~`clamp(72px, 9vh, 96px)` (drop from 12vh → 9vh now that there's less inside).
- Brass top hairline + four corner machining marks (subtle ambiance).
- Blueprint grid background (very low opacity — already there).

### 2. New three-zone layout (artifact ↔ actions ↔ BYOP)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [artifact]      2–4 contextual actions (centered)         [BYOP dock]  │
└────────────────────────────────────────────────────────────────────────┘
   left ~22%                center 1fr                       right ~26%
```

**Left zone — `ArtifactPreview` (moved from right):**
- One small section-specific flat SVG only. No label, no caption.
- Examples already wired: Home → folded blueprint, Projects → book spines, Thinking → pinned notes, Skills → caliper, Writing → notebook tab, Contact → letter slip.
- Tiny hover tooltip (one word, e.g. "blueprint", "spines") via native `title` — the only text allowed in this zone.
- `≤700px`: hidden.

**Center zone — `ActionDock` (trimmed):**
- Hard cap at **4 actions** per station; primary first, secondary muted. Truncate `STATION_META` accordingly:
  - home: `View Work`, `Resume`
  - about: `Bio`, `Contact`
  - projects: `Featured`, `Case Studies`
  - thinking: `Pinned`, `Strategy`
  - skills: `Product`, `Technical`, `Design`
  - journey: `Experience`, `Latest`
  - writing: `Latest`, `Essays`
  - contact: `Copy Email`, `LinkedIn`, `GitHub`
- Same pill style, but center the row (`justify-center`) instead of left-aligned.
- AnimatePresence cross-fade on `activeId` change is kept.

**Right zone — `BYOPDock` (NEW, relocated from header):**
- Lifts the existing `DESIGN.INPUT` / `QUICK·PIC` popover trigger out of `AssemblyHeader.tsx` and re-mounts it inside the rail's right zone.
- Reuses the same Radix Popover content, sketch picker, and brass-accent styling — only the trigger position changes.
- Trigger button: `BUILD ▸` pill, amber accent, fixed 36px height, right-aligned with 12px inset from rail edge.
- Popover anchors **upward** from the rail (`side="top"`, `align="end"`) so it opens over the page, not below the viewport.
- `<700px`: collapses to icon-only (wrench glyph), popover still functional.

### 3. AssemblyHeader — reclaim BYOP's space

In `src/components/AssemblyHeader.tsx`:
- Remove the `DESIGN.INPUT` utility cluster (trigger + popover) from the right side of the header SVG/flex row.
- Re-distribute the freed width to the assembly track: the 8-station belt currently sits in the center column with a fixed right gutter for BYOP. After removal, the track's `max-width` (or grid column) expands by the BYOP width (~140–180px on desktop), so stations breathe more and label spacing increases proportionally.
- Header height unchanged (~90px). Mobile header (`AssemblyHeaderMobile`) is unaffected — its compact menu already has no BYOP slot.

### 4. Files

- `src/components/console/ConsoleRail.tsx` — drop `<BuildStatus>`, swap zone order (artifact left, actions center, BYOP right), update grid template, drop dividers, remove status glow, lower min-height.
- `src/components/console/BuildStatus.tsx` — **delete**.
- `src/components/console/ActionDock.tsx` — center alignment; respect 4-action cap.
- `src/components/console/actionsByStation.ts` — trim each station's `actions` array; remove `status` field from `StationMeta`.
- `src/components/console/ArtifactPreview.tsx` — remove any caption text; add `title` attr for hover label.
- `src/components/console/BYOPDock.tsx` — **new**, hosts the relocated DESIGN.INPUT trigger + popover (extracted from AssemblyHeader).
- `src/components/AssemblyHeader.tsx` — remove DESIGN.INPUT block; expand assembly track to fill freed space.
- `src/components/DeskStage.tsx` — bottom strip height: `clamp(72px, 9vh, 96px)`; pass nothing extra to `ConsoleRail` (no more `progress` prop needed since BuildStatus is gone — but keep prop signature stable, just unused).

### 5. What the user sees

- Bottom strip is half as loud: a single small drawing on the left, 2–4 quiet pill buttons in the middle, and the BYOP "BUILD ▸" trigger anchored bottom-right that opens its sketch picker upward.
- No more `03/08`, no progress bar, no "now building · drafting introduction" caveat — that narrative now lives only in the (wider) assembly header at the top.
- The header's station belt visibly stretches into the space the BYOP control used to occupy.

