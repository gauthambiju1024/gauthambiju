## Goal

Delete the current "Layer A leaves + Layer B spine flip" packet in `HeroIdBadge.tsx` and replace it with the reference trifold pattern from `dossier-fold-transition-4.html`, where a real 3-panel volume folds its wings behind the center and then the whole packet revolves to reveal the spine.

## What is wrong with the current approach

The current code fakes the fold with two cream-only flap divs plus a separate "final folded strip" sitting on top. There is no true center panel showing the card's actual content, the wings fold to a blank cream, and the spine face is a sibling layer that has to be opacity-juggled. This is why every fix keeps breaking either the visibility of the middle, the post-flip face, or the perceived motion.

The reference is much simpler: 3 real `.panel` divs (l, c, r) inside one `.vol`. Each panel has a `.front` face that contains a clone of the **full card**, shifted so each panel only shows its own 1/3 strip. The wings rotate ±178° behind, then `.vol` rotates -180° to show the back of the center panel (the spine).

## Plan

### 1. Rebuild the packet markup inside `volRef` (Layer A + Layer B → one `vol`)

Replace lines ~538–658 with this structure:

```text
volRef (perspective inherited from wrapper; preserve-3d)
  panelL  (left:0,   w:33.33%, origin: right center)
    .front  → clone of full About back; shifted left:0
    .back   → dark backing
  panelC  (left:33.33%, w:33.33%)
    .front  → clone of full About back; shifted left:-100%
    .spine  → green ProjectSpine, rotateY(180deg)  ← the back
  panelR  (left:66.66%, w:33.33%, origin: left center)
    .front  → clone of full About back; shifted left:-200%
    .back   → dark backing
```

Each `.front` renders the same `AboutCardBack` content (read-only, `pointerEvents: none`) at full card width (`CARD_WIDTH`), positioned with negative `left` so only that panel's slice is visible. The `.front` has `backfaceVisibility: hidden`. The `.spine` on the center panel is `rotateY(180deg)` so it shows when the packet flips.

(The interactive AboutCardBack below the packet still exists for the unfolded state. Once `foldActive`, we hide the live one — already done via `cardBackInnerRef.opacity = 0` — and the cloned panels carry the visuals.)

### 2. Replace fold/turn math with the reference math

In `applyTransform`, remove the Layer A / Layer B logic. Keep windows but use the reference's geometry:

```ts
// FOLD — wings rotate behind center
const fE = eInOut(tFold);
panelL.style.transform  = `rotateY(${ fE * 178}deg) translateZ(-5px)`;
panelR.style.transform  = `rotateY(${-fE * 178}deg) translateZ(-5px)`;

// TURN — whole packet revolves; spine (back of center) faces us
const tE = eInOut(tTurn);
volRef.style.transform = `rotateY(${-180 * tE}deg)`;
```

No more `spineFaceRef`, no `foldPacketRef` opacity juggling, no Layer-B cream/green pair. The center panel's `.spine` is its own back face — `backfaceVisibility: hidden` on `.front` does the swap automatically at 90°.

Add `eInOut` helper (cubic in-out from the reference).

### 3. Wrapper transform stays the same

The cardWrap continues to own `translate / scale / tilt / rotateY(p2*180)`. The `vol` lives inside the existing back face, so the About flip still flips us into the trifold scene before fold begins.

### 4. Refs and cleanup

- Add `panelLRef`, `panelCRef`, `panelRRef`.
- Remove `foldCenterRef`, `foldLeftRef`, `foldRightRef`, `foldPacketRef`, `spineFaceRef` and all transforms that referenced them.
- Keep `volRef` (now used as the reference's `vol`).

### 5. What stays unchanged

- Pre-fold flow (slide to center, About flip)
- Shrink + Fly-to-shelf (still operate on `cardWrap`)
- Lanyard / globe fades, shelf handoff, opacity at `settled`
- Window timings (`tFold`, `tTurn`, `tShrink`, `tFile`)

## Files

- `src/components/HeroIdBadge.tsx` — only file touched.
