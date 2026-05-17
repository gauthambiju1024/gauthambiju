## Goal
Polish the About→spine transition so it reads as a real "More About Me" project on the shelf, with cleaner, more intentional folding and a click-to-open About popup.

## 1. Spine label: "MORE ABOUT ME"

`src/components/projects/ProjectSpine.tsx`
- Update `ABOUT_SPINE_DATA`:
  - `title: "MORE ABOUT ME"`
  - `subtitle: "Personal · 2026"`
  - keep the green color `hsl(170 25% 28%)`.
- Title rendering already uses vertical writing mode and tracks long strings; verify it fits inside `SPINE_HEIGHT = 200`. If tight, reduce font-size from `13px` to `11px` only for long titles (>12 chars) via a length check, so other project spines stay unchanged.

## 2. Spine behaves like a project (click → About popup)

`src/components/AboutToProjectsBridge.tsx`
- Re-introduce a real, clickable "More About Me" spine in the shelf row, rendered with the same `ProjectSpine` markup as other projects, using `ABOUT_SPINE_DATA`. It is hidden while the folding card is mid-flight and only shown once the choreography settles (`bridge > 0.95`).
- Hook `onClick` on that spine to open an About popup (not navigate). State lives on the bridge.
- The invisible `aboutSlotRef` stays as the geometry target for the flying card so the landing alignment still works.

New component: `src/components/about/AboutPopup.tsx`
- Uses existing `Dialog` (`@/components/ui/dialog`) with a wide, parchment-styled `DialogContent` matching the cream card aesthetic.
- Renders `AboutGlobe` (left) + `AboutCardBack` (right) with the same shared `activeTab` / `expandedId` state used in `HeroIdBadge`.
- Loads `journey` from `useSiteContent("about", "journey")`.

Wiring:
- `AboutToProjectsBridge` owns `popupOpen` state. The clickable About spine toggles it. The popup mounts inside the bridge.
- The folded card itself (still visible in the shelf) also becomes clickable once it settles: tapping it opens the same popup.

## 3. More elegant folding — remove noise, keep intent

`src/components/HeroIdBadge.tsx`

Remove:
- The unused `clipPath = "none"` / `webkitClipPath = "none"` writes on `backFaceRef` and `cardRef` every frame.
- The per-frame `volRef.style.transform = ""` reset.
- `cardWrap.style.opacity = "1"` reassignment every frame.
- Arc bounce (`arcY = Math.sin(tFile*π) * -60`) — replace with a flat ease for a calmer file.
- `settleDeg` micro-wobble during FILE — remove; the spine should land clean.
- Dark linen back faces on left/right wings (lines 574, 617) — they're never seen once the wings fold flush behind the center. Replace with a simple transparent backface so the GPU has less to composite.

Tighten:
- Shorten and overlap the windows so the motion is one continuous gesture, not three sequential ones:
  - `tFold` 0.00–0.34
  - `tTurn` 0.30–0.58 (starts as wings settle)
  - `tFile` 0.55–0.90
- Switch the easing for `tFold`, `tTurn`, `tFile` to a single shared `eOutQuint` (`1 - (1-x)^5`) so they share the same decay curve.
- Cap `flapAngle` at exactly 180° (currently `178`) and use `transformOrigin` already correct on left/right wings.
- Replace the inset shadow ramp on `foldCenterRef` with a single static inset edge highlight; the rotation alone reads as fold depth.
- Add `transition: none` and keep transforms `translate3d` + `scale3d` for sub-pixel snapping.
- During TURN, fade the cream `aboutSurface` inside the center strip from `1` → `0` over `tTurn 0..0.5` and the `ProjectSpine` backface from `0` → `1` over `tTurn 0.4..1`, so the swap happens behind the rotation midpoint and never shows the wrong face through subpixel bleed.

Choreography summary after polish:

```text
0.72 → 0.84   wings fold flush behind center (no bounce, no shadow ramp)
0.78 → 0.88   center strip rotates 180° → green spine face appears
0.85 → 0.95   spine flies to shelf slot, scales to SPINE_WIDTH×SPINE_HEIGHT, lands flat
0.95 → 1.00   shelf spines settle; "More About Me" spine becomes clickable
```

## 4. Plan doc

Update `.lovable/plan.md` to reflect the final, polished choreography and the new popup interaction so future passes don't regress.

## Files touched
- `src/components/projects/ProjectSpine.tsx` — label + subtitle
- `src/components/AboutToProjectsBridge.tsx` — clickable About spine, popup state
- `src/components/about/AboutPopup.tsx` — new component
- `src/components/HeroIdBadge.tsx` — remove noise, retime windows, swap easings, clean center-strip face fade, make settled card clickable
- `.lovable/plan.md` — updated notes
