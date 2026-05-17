
# Rewrite the About → Shelf transition

## What's broken today

The screenshot shows the end-state of the bridge: the live shelf is drawn, three spines (CLASSY, VAIDYA, and the static **ABOUT** placeholder) are visible — but the **folding ID card itself never appears in flight**. The "ABOUT" you're seeing is the static `<ProjectSpine data={ABOUT_SPINE_DATA} />` placeholder hard-coded into `AboutToProjectsBridge.tsx`, not the folded card.

Root causes in current `HeroIdBadge.tsx`:

1. **Phase windows are wrong.** Today: `tFold 0–0.36`, `tTurn 0.20–0.52`, `tFile 0.54–0.82` — all evaluated against `bridge` (which is itself a remap of the outer `0.72–1.0` scroll window). They don't match the spec.
2. **No COLL/ARCH stage at all.** The shelf rule + library spines rise on completely different driver values (`AboutToProjectsBridge`'s own `eBack` / `ease(0.42,0.70)`), not synced to a shared `p` parameter.
3. **Static ABOUT placeholder duplicates the folded card.** The `aboutSlotRef` in `AboutToProjectsBridge.tsx` always renders an ABOUT spine, so even when the fold never arrives the slot looks "full" — masking the bug and creating a double-spine when it does.
4. **Wrap is hidden at the wrong time.** `cardWrap.opacity = 1 - smoothstep(0.996, 1, bridge)` plus the early `cardBackInnerRef` fade can leave the packet invisible mid-turn when wing/spine math goes wrong.
5. **3D math is fragile.** `cardWrap` does the About-flip rotateY, then `volRef` does another rotateY inside an already-flipped `backFace`. Stacked transforms make the spine back face occasionally land away from the camera. Needs to be flattened to one rotateY driver per phase.

## New design — single shared progress, five named phases

One driver `p ∈ [0,1]` (the outer scroll, NOT bridge-remapped). All segments use the same `seg(p, a, b) = smoothstep(a, b, p)` helper, exactly matching the user's spec:

```text
FOLD   seg(p, 0.04, 0.40)   wings fold behind centre        (±0 → ±178°)
TURN   seg(p, 0.24, 0.56)   packet revolves 180°, spine on  (0 → 180°)
COLL   seg(p, 0.30, 0.60)   shelf rule strokes outward      (dashoffset → 0)
FILE   seg(p, 0.58, 0.86)   folded spine flies to its slot  (arc + scale)
ARCH   seg(p, 0.74, 1.00)   library spines rise into place  (translateY + opacity)
```

The pre-fold About flip (Hero→About card turnover) keeps its existing window `0.35–0.72`. The new transition starts immediately after, with FOLD opening at `p=0.04` so the wings are already a hair pre-loaded — that's fine because `bridge` isn't the driver anymore, the raw outer `p` is.

## File changes

### `src/components/HeroIdBadge.tsx` — rewrite the `applyTransform` body

- Drop `bridge / __bridgeProgress` as the driver for fold/turn/file. Use the outer `progressMV` directly.
- Add one helper: `const seg = (a, b, x) => smoothstep(a, b, x);`
- Compute `tFold, tTurn, tFile` from the spec windows above. Keep `tAboutFlip = smoothstep(0.55, 0.72, p)` for the existing rotateY card flip.
- **Single rotateY driver on `cardWrap`:** `rotY = tAboutFlip*180 + tTurn*180`. Remove the second rotateY inside `volRef` entirely. This guarantees the spine back face is camera-facing at TURN=1 with no compound-matrix surprises.
- **Wings live inside `backFace` (rotateY 180)** and only rotate themselves around their inner edges by `tFold * 178°` (left +, right −). They never move with TURN — TURN moves the whole `cardWrap`.
- **`spineSkin` (the `<ProjectSpine>` back face)** stays rotated 180° inside `backFace`; its opacity ramps with `seg(0.30, 0.55, p)` (within TURN) so the cream→spine reveal lands on the way around.
- **Fade AboutCardBack with TURN only:** `cardBackInnerRef.opacity = 1 - tTurn`. Not with fold. This guarantees the centre stays readable while wings fold.
- **FILE flight:** unchanged math (arc + scale to `SPINE_WIDTH/SPINE_HEIGHT`) but driven by the new `tFile` window. Scale is applied on `cardWrap`, not `volRef`. Remove `volRef.style.transform` entirely (it's a static overlay container now).
- **Hide the wrap only after FILE lands:** `cardWrap.opacity = 1 - seg(0.86, 0.88, p)` — sharp cut at the end of FILE so the wrap disappears exactly when the static slot spine takes over.
- **Reduced-motion:** if `prefers-reduced-motion`, snap straight to end-state (cardWrap hidden, no fold animation), let the bridge shelf show as today.

### `src/components/AboutToProjectsBridge.tsx` — sync COLL + ARCH to the same `p`

- Replace the local `b = ease(0.72, 1.0, t)` remap with the raw `t = progressMV.get()` and the same `seg` helper.
- **COLL** (shelf rule): `ledgePath.strokeDashoffset = ledgeLen * (1 - seg(0.30, 0.60, t))`.
- **ARCH** (spines rise): for spine `i`, `k = eBack(seg(0.74 + i*0.02, 0.96, t))`. Stagger fits inside the ARCH window. Opacity = `clamp01(k*1.4)`, `translateY = (1-k)*135%`.
- **Remove the static `aboutSlotRef` `<ProjectSpine>` content.** Keep the empty slot box (so layout/`__bridgeSlotRect` still publishes correct coords for FILE to fly to), but render nothing inside until `p >= 0.86`, then fade it in over `seg(0.86, 0.90, t)` as the wrap fades out. This eliminates the double-spine artefact and makes the hand-off invisible.
- Keep `__bridgeSlotRect` publishing every frame — `HeroIdBadge` still reads it for FILE's flyDx/flyDy.

### `.lovable/plan.md`

- Replace current notes with the 5-phase spec, the shared `p` driver, and the bridge-slot hand-off rule.

## Verification at 1001×769 (viewport)

- `p=0.00–0.30`: hero blueprint visible, card sits at rest, draggable.
- `p≈0.45`: About flip mid-way, card centred, rotating to back face — AboutCardBack legible.
- `p≈0.50`: wings begin folding behind, centre still shows AboutCardBack.
- `p≈0.55`: shelf rule begins stroking out across the panel.
- `p≈0.62`: packet half-turned, ProjectSpine back fading in, AboutCardBack fading out.
- `p≈0.75`: packet has arrived at slot, scaled to spine size; first library spines starting to rise.
- `p≈0.90`: wrap hides, static slot spine fades in seamlessly, all library spines settled.
- `p=1.00`: indistinguishable from current end-state in the screenshot, but reached via a visible, continuous fold.

No backend changes. No new dependencies. Only `HeroIdBadge.tsx`, `AboutToProjectsBridge.tsx`, and `.lovable/plan.md`.
