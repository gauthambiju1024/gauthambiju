
# Fix: restore hero→about, drive fold phases off `bridge` again

## What I broke and why

The user's phase windows (0.04, 0.24, 0.30, 0.58, 0.74…) are meant **relative to the about→projects segment**, not the full page scroll. My last edit applied them to the **outer** `p`, which collides with the hero→about flip that lives at `p ∈ [0.35, 0.72]`.

Concrete fallout:

1. **Hero→About flip destroyed.** `rotYFlip = p2*180 + eInOut(tTurn)*180` and `tTurn = seg(0.24, 0.56, p)`. By the time the About flip starts (`p=0.55`), `tTurn` is already ≈1, so the card snaps an extra 180° and ends front-facing (photo) instead of showing the About panel. That's the "you destroyed everything" symptom.
2. **AboutCardBack invisible immediately.** `cardBackInnerRef.opacity = 1 - tTurn`. At `p=0.55` that's already ~0, so the back panel never reads.
3. **Folded green spine replaced by the yellow ABOUT placeholder.** With the rotateY math broken, the spine back face never faces the camera. What the user sees in the slot is the static `<ProjectSpine data={ABOUT_SPINE_DATA} />` in `AboutToProjectsBridge` (gold-brown — "yellow ABOUT"). The folded card is technically there but oriented wrong, so the placeholder is what reads.

## Fix

Re-introduce a dedicated `bridge` driver for the **about→projects** segment only, and run all 5 spec phases against it. Leave the hero→about flip windows **exactly as they were before this thread**.

```text
Outer p:
  p1 = smoothstep(0.35, 0.55, p)   slide hero card to centre   (unchanged)
  p2 = smoothstep(0.55, 0.72, p)   About flip rotateY 0→180°    (unchanged)

bridge = smoothstep(0.72, 1.00, p)   about→projects segment

Within bridge:
  FOLD   seg(bridge, 0.04, 0.40)   wings fold behind centre
  TURN   seg(bridge, 0.24, 0.56)   packet revolves 180°, spine on
  COLL   seg(bridge, 0.30, 0.60)   shelf rule strokes outward
  FILE   seg(bridge, 0.58, 0.86)   folded spine flies to its slot
  ARCH   seg(bridge, 0.74, 1.00)   library spines rise
```

## File changes

### `src/components/HeroIdBadge.tsx` — `applyTransform`

- Re-compute `bridge = smoothstep(0.72, 1.0, p)` (don't read `__bridgeProgress`; compute locally so the math is self-contained).
- `tFold / tTurn / tFile / tSpineLbl` are now `seg(bridge, …)` not `seg(p, …)`.
- **Single rotateY on `cardWrap`:** `rotY = p2*180 + eInOut(tTurn)*180`. Because `tTurn` starts at `bridge=0.24` (i.e. `p≈0.79`), it can no longer interfere with `p2` (which finishes at `p=0.72`). Spine ends camera-facing at `bridge=1`.
- **AboutCardBack fade** gated on `tTurn` (now bridge-relative): it stays fully visible through the entire hero→about flip and only fades as the packet starts to revolve. Restores the readable About panel.
- **`volRef.opacity`** gated on `tFold > 0.01` (bridge-relative), so wings stay hidden during the hero→about flip.
- **FILE flight** uses bridge-relative `tFile`. Keep the single-scale approach (`min(fileScaleX, fileScaleY)`) so the wrap shrinks proportionally toward the slot.
- **Hide wrap** at `tHide = seg(bridge, 0.86, 0.90)` so the folded card disappears exactly as the slot placeholder fades in.
- **Lanyard / globe** fades remain tied to `p2` and `tFold` as before — restores the original hero→about feel.

### `src/components/AboutToProjectsBridge.tsx`

- Re-introduce the local `bridge = smoothstep(0.72, 1.0, t)` remap (use a local `seg`).
- **COLL**: `strokeDashoffset = ledgeLen * (1 - seg(bridge, 0.30, 0.60))`.
- **ARCH**: per-spine `k = eBack(seg(bridge, 0.74 + i*0.04, 0.98))` so the stagger fits inside ARCH.
- **Slot placeholder hand-off**: keep the `<ProjectSpine>` inside `aboutSlotRef`, but its `opacity = seg(bridge, 0.86, 0.92)`. That way the gold ABOUT spine no longer "replaces" the folded green spine mid-flight — it only appears as the wrap fades.
- Keep `__bridgeProgress` / `__bridgeSlotRect` publishing for FILE's flyDx/flyDy.

### `.lovable/plan.md`
- Replace with the corrected phase mapping (bridge-driven, hero→about untouched).

## Verification at 1001×769

- `p=0–0.35`: hero panel + draggable card, unchanged.
- `p=0.35–0.55`: card slides to centre, unchanged.
- `p=0.55–0.72`: card flips, About panel becomes legible — **fixed**.
- `p≈0.78` (`bridge≈0.20`): wings begin folding behind, About still visible.
- `p≈0.86` (`bridge≈0.50`): packet half-turned, ProjectSpine back fading in, About fading out, shelf rule mid-stroke.
- `p≈0.92` (`bridge≈0.72`): folded green spine arrives in slot, scaled to shelf size — **fold visible, not replaced by the gold placeholder**.
- `p≈0.95` (`bridge≈0.82`): wrap fades; gold ABOUT slot placeholder fades in seamlessly.
- `p=1.00`: full shelf, identical to current end-state.

Only `HeroIdBadge.tsx`, `AboutToProjectsBridge.tsx`, `.lovable/plan.md`. No backend, no deps.
