
## Fix Panel Order, Content Overflow, and Scroll-Linked Transitions

Four targeted fixes across section ordering, content density, and panel transitions.

### 1. Reorder sections (About before Library, Strategy after Library)

The current section flow in `src/pages/Index.tsx` is:
`Home → Thinking → Projects → About → Writing → Skills → Journey → Contact`

The header (`Navigation.tsx` / `AssemblyHeader`) declares this order:
`Home → About → Projects → Thinking → Skills → Journey → Writing → Contact`

Mapping to the requested vocabulary (Library = Projects, Strategy = Thinking):
**New canonical order**:
`Home → About → Projects (Library) → Thinking (Strategy) → Skills → Journey → Writing → Contact`

This satisfies "About before Library" and "Strategy after Library" and matches the header exactly.

**File changed**: `src/pages/Index.tsx` — reorder the `sections` array entries (slot 3D positions stay attached to each section so the desk layout follows).

### 2. Sync header → panel navigation

Because `DeskStage` derives `activeIndex` from window scroll progress (each section = 100vh of vertical scroll), the existing `scrollIntoView` in `Navigation.tsx` already works **as long as section order in `Index.tsx` matches the nav `navItems` array**. After step 1, both lists are identical → header clicks land on the correct panel automatically.

No code change needed in `Navigation.tsx`. Verify by clicking each nav item maps to the matching panel.

### 3. Compact overflowing panels (Writing + Projects/Library)

Two panels currently overflow the 88vh non-scroll container at 1178×769:

**`src/components/WritingDesk.tsx`** — currently has `py-16 md:py-24`, large featured card, plus 3-card row + "View all" link. Changes:
- Outer wrapper: `py-16 md:py-24` → `py-4`, `px-6 md:px-16` → `px-5 md:px-10`.
- Header rail + title block: `mb-12` → `mb-3`, `mb-10` → `mb-3`; title `text-3xl md:text-4xl` → `text-xl md:text-2xl`; drop the descriptive `<p>` or shrink to `text-xs`.
- Featured card: padding `p-4 md:p-5` → `p-3`; title `text-xl md:text-2xl` → `text-base md:text-lg`; excerpt `line-clamp-2`.
- Article grid: gap `gap-4` → `gap-2.5`; card padding `p-5` → `p-3`; title `text-sm` → `text-xs`; excerpt → `line-clamp-2 text-[11px]`.
- "View all" link: `mt-4` → `mt-2`, `text-xs` → `text-[11px]`.

**`src/components/ProjectsShelf.tsx`** — review and apply the same compaction pattern: shrink section padding to `py-4`, header `mb-3`, card titles to `text-sm`, descriptions clamped to 2 lines, gaps reduced. Cap to 3 books in the horizontal row.

Also do a quick pass on **`AboutSection.tsx`**, **`ThinkingWall.tsx`**, **`JourneyTimeline.tsx`**, **`SkillsToolbox.tsx`**, **`ContactClosing.tsx`** to confirm nothing clips at 769px viewport height; trim padding only where overflow exists.

### 4. Scroll-linked alternating L/R transitions

Currently `DeskStage` already uses `direction = +1` when scrolling forward (next panel), `-1` when scrolling back, and the `slideVariants` translate the entering panel from that side and exit the leaving panel to the opposite side. This **is** scroll-linked.

Improvements to make it feel deliberately alternating and tighter:
- **Alternation by index parity** (instead of pure forward/back): incoming panel slides from **left for even indices, right for odd indices**, regardless of scroll direction. This produces the visible left/right/left/right rhythm the user described. Outgoing panel exits to the opposite side.
- Keep the easing `[0.7, 0, 0.3, 1]` but shorten duration `0.7 → 0.55` for a snappier, more scroll-coupled feel.
- Remove the `boxShadow` leading-edge shadow (it implied a directional drag); replace with a 1.5vh-wide vertical seam gradient on the leading edge for a cleaner cut.

**File changed**: `src/components/DeskStage.tsx` — update `slideVariants` to take parity instead of direction; pass `activeIndex % 2` as `custom`.

```ts
const slideVariants = {
  enter: (parity: number) => ({ x: parity === 0 ? "-100%" : "100%" }),
  center: { x: "0%" },
  exit:  (parity: number) => ({ x: parity === 0 ? "100%"  : "-100%" }),
};
```

### Files to modify

- `src/pages/Index.tsx` — reorder `sections` array.
- `src/components/DeskStage.tsx` — parity-based slide variants, shorter duration, remove boxShadow.
- `src/components/WritingDesk.tsx` — full compaction pass.
- `src/components/ProjectsShelf.tsx` — compaction pass, cap to 3 items.
- `src/components/AboutSection.tsx`, `ThinkingWall.tsx`, `JourneyTimeline.tsx`, `SkillsToolbox.tsx`, `ContactClosing.tsx` — minor padding trims only if overflow detected.

### Out of scope

- 3D desk strip, props, lighting, decor — untouched (slot positions travel with each section in the reorder).
- Header design, routing, backend, doodles, entropy — untouched.
- No new dependencies, no new assets.
