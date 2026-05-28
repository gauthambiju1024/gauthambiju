## 1. Root-cause fix: duplicate "MORE ABOUT ME" spine when scrolling back/forth

**Cause:** in `AboutToProjectsBridge.tsx` the About-spine visibility is gated by a *one-shot* `landedRef.current.about` guard. Once `bridge >= 1.0` it sets the spine to `opacity: 1` and then *never updates it again*. When the user scrolls back up, `bridge` drops below `1.0` but the shelf spine stays visible, while `HeroIdBadge`'s flying spine reappears — producing two spines simultaneously.

The same problem exists for `landedRef.current.slot` (slot opacity is force-locked).

**Fix:** make the About-spine purely scroll-reactive — remove the one-shot guards entirely and drive opacity directly from `bridge`:
- `opacity = bridge >= 1.0 ? 1 : 0` every frame
- `pointerEvents = bridge >= 1.0 ? "auto" : "none"`
- `slot.style.opacity = 0` every frame (or leave it as a static inline style and stop touching it in the RAF)

Also clear `flightRectRef` in `HeroIdBadge` whenever `flatSpineActive` is false (it already does) — confirm the flying-spine fade window `0.985 → 1.0` matches the shelf-spine snap at `1.0`. Tighten to a hard handoff at exactly `bridge >= 1.0` so there is never an overlap frame in either direction.

## 2. Slower, more elegant spine entrance

In the `ARCHIVE` block of `AboutToProjectsBridge.tsx`:
- Widen the archive window: `archWinStart = 0.86`, `archWinEnd = 1.05` *clamped* so it begins as About is still being shelved and runs past 1.0 so the last spines finish gracefully even at the very end.
- Lengthen each spine's individual span (`archSpan`) from `0.22` of the window to `~0.45` for a longer, softer arrival.
- Soften the easing: replace the cubic ease-out with a smoother `easeOutQuint` and reduce the overshoot — rotateY peaks at `8°` (not `14°`), translateZ from `180px` (not `260px`), scale from `1.18` (not `1.35`).
- Same easing applied to the toolbox so it lands at the same gentle pace.
- Stagger ordering: dominant **row-by-row top→bottom**, secondary left→right within each row — feels more like shelves filling than a diagonal sweep.

## 3. PROJECTS header: top-shelf treatment, label on the LEFT

- Move the `PROJECTS` label `<span>` from `right: 0` to `left: 0` (same padding/background ink-cover trick).
- Replace the thin 7px header plank with the **same wooden plank treatment used by category rows** (full plank + drawn rule on top + cap shadow) so it visually reads as the topmost shelf.
- Re-time the header draw to be the **first** thing that animates in the bridge (start ~`0.70`, end ~`0.80`), left→right, in sync with its rule stroke — both driven by one shared progress value.

## 4. Bigger toolbox

Increase the toolbox SVG wrapper from `150 × 118` to `220 × 174` and bump the drop-shadow accordingly. Keep `viewBox="0 0 96 76"` so the artwork scales uniformly. Ensure its bottom-right anchoring inside the bottom row remains correct.

## 5. NEW transition: Toolbox → Skills top-view (Stage 2 bridge)

Today `SkillsToolbox` is rendered as a separate trailing station in `src/pages/Index.tsx`. We will turn it into a continuous scroll-driven transition that flows directly from the shelf toolbox.

### Behavior

As the user scrolls past the shelf:
1. The shelf toolbox (bottom-right of the projects shelf) detaches and **flies to viewport center**, scaling up.
2. At center it **flips open along the X-axis** (lid swinging up / top-down camera tilt) revealing the *inside* of the toolbox seen from above.
3. Inside the open toolbox sits the **Skills content** (categorised wells with chips), laid out as compartments inside the tray — visually identical material (the same warm-grey tray, engraved label plates, chip styling already in `SkillsToolbox.tsx`).
4. Continued scroll settles the open toolbox as the section view; subsequent scroll triggers the next station (Thinking / Writing / Contact).

### Structure

- Create `src/components/ToolboxToSkillsBridge.tsx` — pinned section (~`220vh`), receives a `MotionValue` from a parent `useScroll` like `HeroAboutFlip` does. Drives:
  - `flyT (0 → 0.35)`: shelf-toolbox rect → centred large rect (uses `(window as any).__toolboxRect` published by `AboutToProjectsBridge`).
  - `flipT (0.35 → 0.7)`: `rotateX` from `0°` to `-78°` (top-down view) on a 3D container; lid SVG rotates open along its hinge; tray contents fade/scale in.
  - `settleT (0.7 → 1.0)`: lock the open top-down toolbox view, contents become fully interactive.
- Inside the open toolbox, render a new `<ToolboxInterior />` that consumes admin data via `useSiteContent("skills", "groups")` and falls back to the existing hard-coded `skillGroups`. Reuse the existing tray / well / chip styles from `SkillsToolbox.tsx` so it is visually consistent with the closed-toolbox SVG (same warm-grey palette, engraved labels, mono type).
- Publish the toolbox rect from `AboutToProjectsBridge`:
  ```ts
  (window as any).__toolboxRect = toolboxRef.current?.getBoundingClientRect()
  ```
  on every RAF, so the bridge can capture a seamless start point.
- Remove `SkillsToolbox` from the `trailingStations` array in `src/pages/Index.tsx` and replace its slot with `<ToolboxToSkillsBridge />` rendered inside `margin-content-wrapper` before the remaining stations. The `#skills` anchor moves onto the new bridge's settle phase so nav links still land correctly.

### Admin wiring

- Reuse the existing `site_content` table pattern (same as hero/about/journey). Add a single row `section="skills"`, `key="groups"` whose `value` JSON has the shape:
  ```json
  {
    "groups": [
      { "title": "Product", "icon": "wrench",
        "skills": [{ "name": "User Research", "context": "...", "project": "Homeofarm" }] }
    ]
  }
  ```
- In `AdminContent.tsx` add a `Skills` tab/editor (or reuse the generic JSON editor already used for other sections) that lets the admin add/remove groups and chips. Icon field is a small dropdown of the three existing inline SVGs (`wrench`, `gear`, `caliper`).
- `ToolboxInterior` reads via `useSiteContent("skills", "groups")`, falls back to the hardcoded defaults, and renders identical chip/well markup so nothing visually regresses.

No database migration is needed — `site_content` already supports arbitrary `section/key/value` rows; the admin just inserts the new row through the existing UI flow.

## Files changed

- `src/components/AboutToProjectsBridge.tsx` — kill `landedRef` guards (1); retime + ease archive window (2); restyle header + label left (3); enlarge toolbox SVG wrapper (4); publish `__toolboxRect` (5).
- `src/components/HeroIdBadge.tsx` — tighten flying-spine handoff to exactly `bridge >= 1.0` so there is no double-render frame in either scroll direction (1).
- `src/components/ToolboxToSkillsBridge.tsx` — **new** pinned scroll-driven transition (5).
- `src/components/skills/ToolboxInterior.tsx` — **new** admin-driven skills grid rendered inside the open toolbox (5).
- `src/hooks/useSiteData.ts` — no change (existing `useSiteContent` used).
- `src/pages/admin/AdminContent.tsx` — add Skills section editor (5).
- `src/pages/Index.tsx` — remove `SkillsToolbox` from `trailingStations`, mount `ToolboxToSkillsBridge`, keep `#skills` anchor (5).

## Notes / non-goals

- No DB schema migration; admin storage reuses the existing `site_content` JSON pattern.
- Visual style of chips/wells is preserved exactly — only their container becomes the open toolbox tray.
- Reduced-motion users skip the flip and see the toolbox interior as a static section.
