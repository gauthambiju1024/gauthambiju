

## Reorder: BUILD ▸ then live build at the far right

### Final rail layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│ [section artifact]   contextual actions   [BUILD ▸]   [live build]  │
└─────────────────────────────────────────────────────────────────────┘
   left                  center                  right
```

- **Left zone** — `<ArtifactPreview activeId={activeId} />` (section-specific flat SVG: Blueprint / BookSpines / PinnedNotes / Caliper / MilestoneRail / NotebookTabs / LetterCard / Letterhead, original styling, AnimatePresence cross-fade).
- **Center zone** — contextual action pills, unchanged.
- **Right zone** — flex row, right-aligned: `<BYOPDock />` first, then a thin vertical divider (`w-px h-8 bg-white/[0.08]`), then `<LiveBuild />` pinned to the far right edge of the rail.

The BYOP popover already opens upward (`bottom: calc(100% + 8px)`) so it isn't blocked by the live build sitting to its right.

### Widths / responsive

`gridTemplateColumns: "minmax(160px, 22%) 1fr minmax(320px, 36%)"`.

- `≥900px`: all three zones at full content.
- `700–899px`: live build hides (`hidden min-[900px]:flex`); BUILD ▸ stays.
- `<700px`: artifact hides; only actions + BUILD ▸ remain.

Rail remains fully transparent.

### Internal alignment of BYOPDock

Currently `<BYOPDock>` pins itself to the right of its container with `justify-end pr-3`. Since it's no longer the rightmost element, switch its wrapper to `justify-start pl-2` so BUILD ▸ sits at the left of the shared right zone, and `<LiveBuild>` takes the `pr-3` so it hugs the rail's right edge.

### Files

- `src/components/console/ConsoleRail.tsx` — left zone → `<ArtifactPreview activeId={activeId} />`; right zone → flex row of `<BYOPDock />` + divider + `<LiveBuild />` in that order, justified end. Update grid template.
- `src/components/console/BYOPDock.tsx` — wrapper changes from `justify-end pr-3 pl-2` to `justify-start pl-2`.
- `src/components/console/LiveBuild.tsx` — add `pr-3` to wrapper so it hugs the right edge.

