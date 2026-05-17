# Adopt reference fold + shelf choreography

Scope: only the ID-card fold and the shelf-landing animation. Hero panel,
lanyard, drag, AboutCardBack, AboutGlobe, header, and all other sections are
untouched.

The reference (`dossier-fold-transition-2.html`) drives 6 phases off one scalar
`p ∈ [0,1]`. We adopt the **fold** (TRIFOLD + TURN) and the **shelf**
(DRAW + FILE + ARCHIVE) and drop the globe/constellation/chips/dock layers —
those are already handled by the existing About flip.

## Phase map (local `b = ease(0.72, 1.0, parentProgress)`)

```
TRIFOLD   b 0.00–0.36   left/right panels rotateY  ±178°  (fold BEHIND)
                        eased with eInOut, NOT shrink/scaleX
                        center crease shadow ramps 0.18 → 0.46
TURN      b 0.20–0.52   whole packet (cardWrap) rotateY -180°
                        spine label (centre back face) reads after turn
DRAW      b 0.42–0.70   single shelf ledge path strokeDashoffset L → 0
                        (existing minimal line in AboutToProjectsBridge)
FILE      b 0.54–0.82   dossier flies along an arc into the reserved slot:
                          x = lerp(restingCx, slotCx, eInOut(file))
                          y = lerp(restingCy, slotCy, eInOut(file))
                              + sin(file·π) * -60   (the arc)
                          kx = lerp(1, SPINE_WIDTH/cardW,  eInOut(file))
                          ky = lerp(1, SPINE_HEIGHT/cardH, eInOut(file))
                          settle = sin(file·π) * -3 * (1 - file)  (rot)
ARCHIVE   b 0.70–1.00   live ProjectSpine row rises with eBack stagger:
                          per spine order = row*0.16 + col*0.03
                          translateY 135% → 0
                        slot placeholder reveals only at b ≥ 0.998
```

`eInOut(t) = t<.5 ? 4t³ : 1 - pow(-2t+2,3)/2`
`eBack(t)  = 1 + 2.35·(t-1)³ + 1.35·(t-1)²`

## File changes

### `src/components/HeroIdBadge.tsx`
- Replace the current `tSettle/tFold/tRot/tDrop` math with the four ranges
  above. Drop `shrinkSx/shrinkSy` linear shrink — the FILE phase handles
  both translate AND scale together (kx, ky) plus the arc + settle rotation.
- Flap angles go to **±178°** (true behind-fold), not ±88°. Crease shadow
  on `foldCenterRef` ramps over TRIFOLD.
- Add the packet TURN: `rotateY(-180·eInOut(turn))` applied on top of the
  existing `cardWrap` transform (keep tilt/drag/scale chain).
- FILE phase: instead of separate `dropDx/dropDy * tDrop`, lerp current
  centre → `__bridgeSlotRect.{cx,cy}` with `eInOut(file)` and add the
  `sin(file·π)·-60` arc on Y. Apply `scale(kx, ky)` and `rotate(settle°)`
  in the same transform.
- Spine label (`spineSkinRef`) fades in over `ease(0.30, 0.55, b)` so it's
  legible once TURN exposes the centre back.
- `cardBackInnerRef` opacity = `1 - ease(0.00, 0.18, b)` (settle clears
  AboutCardBack before fold geometry kicks in).
- Card wrap opacity dies only at `b > 0.996` (unchanged).

### `src/components/AboutToProjectsBridge.tsx`
- Keep the single minimal SVG ledge line. Move its draw window to
  `tLedge = ease(0.42, 0.70, b)` (DRAW phase).
- Add ARCHIVE stagger to the `projects.map` row: per index
  `order = 0 + i*0.03`, `k = eBack(ease(order, order+0.36, b))`,
  `translateY = lerp(135, 0, k) + '%'`, `opacity = clamp(k*1.4)`.
- Slot placeholder reveal threshold stays at `b ≥ 0.998`.
- No captions, no dimension marks, no ticks — keep current minimal look.

### `.lovable/plan.md`
- Rewrite the canonical phase table to reflect TRIFOLD/TURN/DRAW/FILE/ARCHIVE
  with the ranges and easings above.

## Verification

At viewport 1001×769 step `parentProgress` through 0.72, 0.82, 0.90, 0.98:
- 0.72: card flat, AboutCardBack faded, crease just visible
- 0.82: flaps fully folded behind, packet mid-turn, spine label appearing,
  ledge line about half-drawn
- 0.90: packet finished turning, dossier mid-arc toward slot at ~spine size,
  first few shelf spines popping in
- 0.98: dossier landed in slot, all shelf spines settled

No other files change. No new dependencies.
