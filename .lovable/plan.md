## Goal

Replace the abstract bridge slab with the **actual ID card from the About section** (same DOM node — same portrait, name, lanyard, back face). When the user scrolls past About, that card tri-folds, rotates to a spine, and drops onto a new minimalist-dense shelf that replaces `ProjectsShelf`. The shelf also carries a `TOOLBOX` slot prepared as the anchor for the next Projects → Skills zoom transition.

---

## 1. Use the same card (not a clone)

`HeroIdBadge` already owns the only ID card on the page and is portaled to `document.body` with `position: fixed`. We extend its existing per-frame transform loop to react to a **second** scroll phase past the About flip.

**`src/components/HeroIdBadge.tsx`** — additive changes only:

- Accept an optional second progress signal `foldProgressMV?: MotionValue<number>` driven by the bridge section's scroll position (0 before bridge, 1 when card has landed).
- Add refs for two new decorative flap layers (`leftFlapRef`, `rightFlapRef`) rendered as **absolute siblings inside `cardWrapRef`**, masking the left third and right third of both card faces. They share the card's `transformStyle: preserve-3d`. Default rotateY 0 — invisible against the card.
- Extend the existing `applyTransform()` loop with a new block keyed off `foldProgressMV`:
  - **f 0.00–0.15** — micro-tilt to −2°, lanyard clip releases (clip fades, lanyard goes slack: existing lanyard opacity already driven by `p2`; we add a separate `lanyardSlackMV` controlled here).
  - **f 0.15–0.45** — tri-fold: left flap `rotateY: -88°`, right flap `rotateY: +88°`, card wrapper `scaleX: 1 → 0.18`. Center crease shadow ramps in via a CSS variable on `cardRef`.
  - **f 0.45–0.70** — wrapper `rotateY: 0 → 90°`; cream face lerps toward walnut `hsl(28 35% 22%)` via a CSS variable; thin gold spine label `GB · 0024` fades in (writing-mode vertical-rl) on a new absolutely-positioned `spineLabelRef`.
  - **f 0.70–1.00** — translate the wrapper from its current fixed position to the **bounding rect of `#projects-shelf-landing-slot`** (read each frame via `getBoundingClientRect()` so it survives layout shifts). Final state: 8px wide × 88px tall walnut spine seated in slot 01.
- `prefers-reduced-motion`: skip flaps and rotation; just cross-fade card → landed spine in 200ms.
- When `foldProgressMV ≥ 0.98`, set `cardWrapRef.style.visibility = 'hidden'` and toggle a `data-card-landed="true"` attribute on `document.body` so the shelf knows to render slot 01 as a filled "GB · 0024" spine instead of a placeholder.
- All transforms compose multiplicatively with the existing About flip transform — order: `translate(landing) translate(drag) rotate(tilt) scale(s) rotateY(aboutFlip + foldRotY) scaleX(foldScaleX)`.

No edits to `cardRef` markup, portrait, lanyard SVG, or `AboutCardBack`. Flaps are pure CSS overlays.

---

## 2. Bridge becomes a scroll driver only

**`src/components/AboutToProjectsBridge.tsx`** — rewrite to a thin, invisible scroll-driver section:

- Renders a `100vh` spacer `<section id="about-to-projects-bridge">` (no visible content; preserves scroll length so the fold has runway).
- Owns the `foldProgressMV` motion value and pushes it into `HeroIdBadge` via a lightweight React context (`CardFoldContext`) created in this file and consumed by `HeroIdBadge`.
- One window-scroll listener + rAF; computes `progress = clamp((scrollY - sectionTop) / sectionHeight, 0, 1)`.
- Renders a faint construction-reveal ledge guide (1px dashed `hsl(var(--brand-gold))` line) at the bottom 10% that draws L→R from progress 0.85→1.0 — reusing the language of station #5 to "land" the card. This is the only visible element.

---

## 3. New minimalist-dense shelf

**`src/components/ProjectsShelfMinimal.tsx`** — new file, fully replaces `ProjectsShelf` in `Index.tsx`. Keeps **every** existing data path:

- Uses `useProjects()`, same sort, same grouping by `category`, same expand/collapse state, same `/projects/:slug` links, same admin pipeline, same realtime subscription.
- Visual: single horizontal walnut ledge `hsl(28 35% 22%)` with a 1px gold top rule and a soft 12px under-shadow. Above the ledge: flat vertical spines, **40–48px wide, 4–8px gap, 88px tall**. Group categories appear as tiny mono labels (`PRODUCT / 04`, `RESEARCH / 03`) stenciled into the ledge itself, not as separate rows.
- Each spine: Playfair Display 11px rotated title (writing-mode vertical-rl), JetBrains Mono 8px year at the foot, 1px inner border in `hsl(var(--brand-gold) / 0.25)`.
- **Slot 01** has `id="projects-shelf-landing-slot"` and is reserved for the folded ID card. When `document.body[data-card-landed="true"]`, it renders a styled "GB · 0024" walnut spine with a thin gold rule (the landed card's resting state). Before landing, it's an empty outlined slot.
- Hover: spine rises 10px, gold outline strengthens, casts a 6px shadow on the ledge. Click: same expand/collapse panel as current shelf — restyled with a 1px gold left rule and `CASE_STUDY · {slug}` mono header but identical content and link behavior.
- **Toolbox slot** — rightmost item on the ledge: ~64×88px muted steel face `hsl(220 8% 32%)` framed in walnut, with `TOOLBOX` (mono 8px) and `03 / 08` stencils, 1px gold handle line across the top, and 4 corner brackets that pulse opacity 0.4↔0.8 every 3s. Carries `id="projects-toolbox-anchor"` and `data-toolbox-anchor="true"`. Non-interactive (no click handler) — purely the anchor and visual affordance for the next Projects → Skills transition.

---

## 4. Wire it in

**`src/pages/Index.tsx`**:

- Import `ProjectsShelfMinimal` and `CardFoldProvider` (exported from the bridge file).
- Wrap the page content in `<CardFoldProvider>` so both `HeroIdBadge` (already portaled) and the bridge share the same `foldProgressMV`.
- Swap `ProjectsShelf` → `ProjectsShelfMinimal` in the `trailingStations` array. No nav id changes.

---

## Out of scope

- Projects → Skills zoom-into-toolbox transition is **prepared** (anchor + visual affordance + landed-state hook) but **not implemented** in this pass.
- No edits to `HeroAboutFlip`, `AboutCardBack`, `AboutGlobe`, `AssemblyHeader`, admin pages, DB, or RLS.
- Mobile (`<800px`): bridge collapses to 0 height and `ProjectsShelfMinimal` falls back to a stacked single-column list; card stays in About.

---

## Files

- **Edit** `src/components/HeroIdBadge.tsx` — add fold context consumer + flap layers + second progress branch in `applyTransform`
- **Rewrite** `src/components/AboutToProjectsBridge.tsx` — thin scroll driver + `CardFoldProvider` + ledge guide
- **New** `src/components/ProjectsShelfMinimal.tsx` — dense ledge with landing slot + toolbox slot
- **Edit** `src/pages/Index.tsx` — provider wrap + shelf swap
