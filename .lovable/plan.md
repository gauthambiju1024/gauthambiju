## Problem

The "down then up" jitter during filing comes from reading `__bridgeSlotRect` **live every frame**. The shelf slot is a normal-flow element scrolling into view, so its viewport `cy` keeps moving while the file phase is running. Combined with `sE` growing from 0→1, the product `(slotCy − curCy) * sE` traces a curved, non-monotonic path → the book dips down, then rises back up to the slot.

## Fix (single file: `src/components/HeroIdBadge.tsx`)

1. **Snapshot the slot target once.** Add a ref `fileTargetRef = useRef<{dx:number; dy:number} | null>(null)`.
2. On every frame in the rAF loop:
   - If `fileT <= 0`: reset `fileTargetRef.current = null` (so a scroll-back re-arms cleanly).
   - The first frame where `fileT > 0`: read `__bridgeSlotRect` **once**, compute the deltas from current centered position, and store them:
     ```ts
     const curCx0 = stageRect.left + restingCenterX + dxToCenter + (-BOOK_SPINE_W/2) * (SPINE_HEIGHT/h);
     const curCy0 = stageRect.top  + restingCenterY + dyToCenter;
     fileTargetRef.current = { dx: slotRect.cx - curCx0, dy: slotRect.cy - curCy0 };
     ```
     (Use the *final* scale `SPINE_HEIGHT/h` for `curCx0` so the snapshot already accounts for where the spine center will land.)
   - Subsequent frames: just `flyDx = target.dx * sE; flyDy = target.dy * sE;` — no live re-read.
3. **Drop the dynamic `(-BOOK_SPINE_W/2) * s` correction** from the per-frame `curCx` math (it's now baked into the snapshot). The wrapper transform stays exactly:
   ```
   translate3d(tx, ty, 0) rotate(tilt) scale(s, s) rotateY(rotYFlip)
   ```
4. **Single ease for translate + scale.** Keep `sE = eOutQuart(fileT)` driving both `s` and `flyDx/flyDy`, so the motion reads as one continuous shrink-into-slot with no inflection.
5. **Fallback** when `__bridgeSlotRect` is null on the arming frame: leave `fileTargetRef.current = null` and try again next frame (no fly applied until target locks in). This prevents a zero-target frame from snapping the book to origin.

## What stays untouched

- `bookRotate` (90° reveal + 90° during fileT), `aboutOpacity`, `closedSpineRef` opacity — unchanged from current build.
- Spine/cover geometry (`BOOK_SPINE_W`, `CARD_HEIGHT`, full-height spine panel) — unchanged.
- `AboutToProjectsBridge.tsx`, `ProjectSpine.tsx`, lanyard/globe gating, home/about behavior — unchanged.

## Why this works

Lerping toward a moving target while easing in is what produces the haphazard arc. Snapshotting the target on entry turns the file phase into a deterministic A→B tween — the book slides straight to its landing point as it shrinks, no detour.
