

## Plan: Integrate Build-Story Components (Builder Character, Schematic Callouts, Panel Bleeds)

Three new decorative layers that make the panels feel like one continuous build document instead of isolated sections on a dark background.

### What Gets Added

1. **BuilderCharacter** — A small line-drawn stick figure fixed in the left gutter that travels down with scroll and changes pose per section (drafting at Hero, writing at About, shelving at Projects, etc.). Desktop only.

2. **SchematicCallout** — Architect-style dashed connectors between panels that draw themselves on scroll, with gold mono-font labels ("measured → written → shelved → pinned → equipped → walked → written up → sent"). Alternating left/right sides.

3. **PanelBleed** — Static SVG "residue" at the bottom of each panel — pencil marks under blueprint, ink under notebook, sawdust under shelf, marker drips under whiteboard, etc.

### Changes

#### 1. New files: `src/components/build-story/`
- `BuilderCharacter.tsx` — copied from upload
- `SchematicCallout.tsx` — copied from upload
- `PanelBleed.tsx` — copied from upload
- `index.ts` — barrel export

#### 2. `src/pages/Index.tsx`
- Import all three components
- Add `<BuilderCharacter />` at the top level (fixed position, no layout impact)
- Add `<SchematicCallout />` between each pair of panels with alternating sides and narrative labels
- Add `<PanelBleed />` inside each panel wrapper with the correct variant
- Refactor the panel loop to render callouts and bleeds inline (unroll the map or enrich the data array with bleed variant and callout labels)

#### 3. Remove `<GhostGrid />` (replaced by these richer layers)
- Remove import and usage from Index.tsx
- Optionally keep `src/components/GhostGrid.tsx` and its CSS if you want to reuse later, or delete

### Panel-to-Variant Mapping

| Panel | Bleed Variant | Callout Before |
|---|---|---|
| Hero (blueprint) | `"blueprint"` | — |
| About (notebook) | `"notebook"` | `"measured" → "written"` (left) |
| Projects (shelf) | `"shelf"` | `"written" → "shelved"` (right) |
| Thinking (whiteboard) | `"whiteboard"` | `"shelved" → "pinned"` (left) |
| Skills (toolbox) | `"toolbox"` | `"pinned" → "equipped"` (right) |
| Journey | `"journey"` | `"equipped" → "walked"` (left) |
| Writing (editorial) | `"editorial"` | `"walked" → "written up"` (right) |
| Contact | `"contact"` | `"written up" → "sent"` (left) |

### Files: 5
1. `src/components/build-story/BuilderCharacter.tsx` — new (from upload)
2. `src/components/build-story/SchematicCallout.tsx` — new (from upload)
3. `src/components/build-story/PanelBleed.tsx` — new (from upload)
4. `src/components/build-story/index.ts` — new barrel export
5. `src/pages/Index.tsx` — integrate all three components, remove GhostGrid

