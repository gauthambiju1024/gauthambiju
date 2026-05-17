
# Fix the fold: hide what's behind, drop the spine crossfade

## What's wrong in the screenshot

The folded packet shows the two dark wings closed over the centre, but the **AboutCardBack is still legible on the left and right** (`ABOUT … OVERVIEW … Notes on How I`, `EXPERIENCE … UX … matters.`). That's because:

- Wings are an *overlay* sitting on top of `AboutCardBack`. When they rotate behind, they expose the unchanged full-width `AboutCardBack` underneath.
- `AboutCardBack` is full-width with no clip — it just fades opacity later during TURN, which the user doesn't want anyway.
- A separate `spineSkin` ramps in via opacity (the "crossfade") which the user explicitly doesn't want.

The mental model the user wants is real paper: as the card folds in thirds, the **whole card visually narrows to its centre column**. The closed packet IS the spine. No crossfade, no peek-through.

## Fix

Two structural changes in `HeroIdBadge.tsx`. No changes to `AboutToProjectsBridge.tsx`.

### 1. Clip the whole back face to its centre column as FOLD progresses

Apply a `clip-path: inset(0 X% 0 X%)` on **both** `cardRef` (front) and `backFaceRef` (back), where `X = 33.333 * eInOut(tFold)`.

- At `tFold = 0`: `inset(0 0 0 0)` → full card visible as today.
- At `tFold = 1`: `inset(0 33.333% 0 33.333%)` → only the centre column (≈SPINE_WIDTH proportions) remains visible. Everything outside that band — including the `AboutCardBack` left/right thirds, the slot, the photo on the front — is geometrically clipped, not just faded. Nothing "behind" can leak.

This makes the card *physically* shrink to spine-width as it folds. The clip is on the card itself, so:
- `cardBackInnerRef` opacity ramp can be **removed** (no crossfade).
- `backSlotRef` opacity ramp can be **removed**.
- `spineSkinRef` opacity ramp can be **removed** — it's just always on.

### 2. Wings become a pure visual flourish on top of the clipping card

The wings (`foldLeftRef`, `foldRightRef`) keep folding behind around their inner edges, exactly as today. But their **front faces become near-transparent** (just a 1px inner-edge crease shadow, no cream fill). That way:

- At rest (`tFold=0`, wings hidden via `volRef.opacity=0`), nothing changes.
- During fold, the wings' rotation reveals their dark linen **backs** sweeping behind the shrinking centre column — selling the physical "tucking behind" without any cream wing covering live About content.
- The clip on `backFaceRef` is what removes the left/right About content; the wings just add the 3D fold cue.

### 3. SpineSkin always-on, sized to the surviving centre column

`spineSkinRef` (the `<ProjectSpine>` back face) is repositioned to `left: 33.333%; width: 33.334%` so it lives exactly inside the unclipped band. It keeps `transform: rotateY(180deg) backface-visibility: hidden`.

- Throughout FOLD: hidden via backface culling — camera sees the cream front of `backFace` (clipped centre column).
- During TURN: the packet rotates 180°. The cream centre column rotates away; the `<ProjectSpine>` back face rotates into view. **No crossfade — the spine appears solely because the packet turned.**

### 4. Remove the AboutCardBack & slot opacity ramps

In `applyTransform`:
- Delete the `cardBackInnerRef.style.opacity = 1 - tTurn` block.
- Delete the `backSlotRef.style.opacity` block.
- Delete the `spineSkinRef.style.opacity = tSpineLbl` line.
- Remove the unused `tSpineLbl` variable.

### 5. Apply the clip in `applyTransform`

```ts
const clipPct = (33.333 * fE).toFixed(3);
const clipCSS = `inset(0 ${clipPct}% 0 ${clipPct}%)`;
if (cardRef.current)     cardRef.current.style.clipPath = clipCSS;
if (backFaceRef.current) backFaceRef.current.style.clipPath = clipCSS;
```

Add `clipPath: "inset(0 0 0 0)"` to both elements' inline styles so the property is set at mount.

## Verification at 1001×769

- `bridge=0`: card unchanged, About panel readable end-to-end.
- `bridge≈0.10`: wings appear, beginning to rotate behind; card visibly starts narrowing — left/right About content slides out of view by clipping (not fading).
- `bridge≈0.30`: card is now ~half-width, wings at ~45° behind, no About content peeks through the sides.
- `bridge≈0.40` (FOLD done): card is exactly centre-column width, looks like a closed cream packet of the right spine proportions; wings hidden behind.
- `bridge≈0.45`: TURN begins; packet rotates.
- `bridge≈0.56` (TURN done): `<ProjectSpine>` back face is camera-facing, perfectly sized to the spine slot. No crossfade — it just appeared as the packet turned.
- `bridge≈0.86`: FILE flight lands the spine in the shelf slot; placeholder fades in to take over at 0.86–0.92.

Files: `src/components/HeroIdBadge.tsx`, `.lovable/plan.md`. No backend.
