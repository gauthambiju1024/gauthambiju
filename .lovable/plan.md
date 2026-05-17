## Final concrete plan — bridge polish

Three precise fixes, all in two files. Geometry, fold widths, and visual design stay exactly as they are now.

---

### Fix 1 — Left/right wings stay transparent when folded
**File:** `src/components/HeroIdBadge.tsx` (wing markup, ~lines 550–611)

Root cause: each wing has a front face with `backfaceVisibility: hidden` and a back face at `translateZ(-0.5px) rotateY(180deg)` also with `backfaceVisibility: hidden`. At ~178° the front face culls, and the back face's z-offset + culling causes the wing to render as see-through against the green spine behind it.

Change:
- Add `background: CARD_BG` and `backfaceVisibility: hidden` to each wing's outer wrapper itself, so the wing is opaque cream from any angle.
- Remove `translateZ(-0.5px)` and `backfaceVisibility: hidden` from the back-face inner div (keep its `rotateY(180deg)` + inset shadow) so it always paints as a solid cream panel with no z-fighting.

Result: when wings rotate to 178°, both fully cover the green center strip with solid cream.

---

### Fix 2 — Project spines never appear
**File:** `src/components/AboutToProjectsBridge.tsx` (~lines 70–74)

Root cause: this effect runs AFTER React has already populated the spine refs via the inline ref callbacks, wiping them back to empty arrays:

```ts
useEffect(() => {
  rulePathRefs.current = new Array(rows.length).fill(null);
  rulePathLens.current = new Array(rows.length).fill(0);
  spineRefs.current = rows.map(() => []);   // erases populated refs
}, [rows]);
```

The rAF loop then iterates empty arrays, spines stay at `translateY(135%)`, clipped under the rule.

Change:
- Remove the `spineRefs.current` reset entirely. Let `registerSpine` populate it during render (ref callbacks fire on every render because a new function identity is returned).
- Keep only `rulePathLens.current.length = rows.length` (don't null out paths either — same identity issue).

---

### Fix 3 — Shelf draw + spine build finish exactly when the About spine lands
**File:** `src/components/AboutToProjectsBridge.tsx` (~lines 112–158)

Today the draw uses `seg(0.10, 0.55, bridge)` and the spine rise uses `seg(0.10, 0.80, bridge)`. Both finish well before the About spine lands at `bridge ≈ 0.94`, so the shelf looks complete long before the packet arrives — inconsistent.

Re-time everything to one synchronized landing window matching the badge's `tFile` (`seg(0.85, 1.00, bridge)`):

| Phase | New window | Notes |
|---|---|---|
| `shelfWrap` fade in | `seg(0.70, 0.80, bridge)` | appears just as the packet starts shrinking |
| Rule draw `drawT` | `seg(0.78, 0.96, bridge)` | per-row stagger so all rules complete by 0.96 |
| Spine rise `archT` | `seg(0.82, 0.98, bridge)` | row+col stagger so the last spine settles right before the About-spine landing |
| About spine fade-in | `(bridge - 0.96) / 0.04` | lands on top of the slot right as `bridge → 1` |

Per-row stagger normalization: replace the current `start = (i / rowCount) * 0.55` with stagger inside the window length so the last row finishes exactly at the window end:

```ts
const winLen = end - start;          // 0.18 for draw, 0.16 for arch
const rowStagger = winLen * 0.3;     // 30% of window for stagger
const perRow = (winLen - rowStagger) / Math.max(1, rowCount);
```

Same approach for spines: clamp `order` so even the last (row, col) finishes at the very end of the arch window.

Result: as the folded packet shrinks and flies to the shelf, the ledge draws in beneath it and the project spines rise to greet the About spine — completing as one motion.

---

### Files
- `src/components/HeroIdBadge.tsx` — wing opacity fix
- `src/components/AboutToProjectsBridge.tsx` — remove ref wipe; re-time draw/arch/fade windows
- `.lovable/plan.md` — replace with this plan

No new dependencies. No DB changes. No layout, fold geometry, or visual design changes beyond what's listed.