
## Goal

Replace the current trifold-into-spine animation with a cleaner, more cinematic transition: after the About-face flip completes, the ID card **rotates in place to reveal its spine**, **narrows to spine width**, then **falls onto the shelf slot** with a subtle tumble. The shelf spine on landing is the same `ProjectSpine` already used on the bookshelf (with text).

## Animation timeline (driven by `bridge = smoothstep(0.72, 1.0, p)`)

```text
bridge   0.00 ─────── 0.45 ─── 0.55 ─────────── 1.00
         │   spine     │  hold  │   fall to slot │
         │  reveal     │        │   + tumble     │
         │ (rotateY    │        │                │
         │  +180°,     │        │                │
         │  narrow X,  │        │                │
         │  crossfade) │        │                │
```

- **tSpine (0.00 → 0.45)** — `scaleX` lerps `1 → SPINE_WIDTH/CARD_WIDTH` (~0.30). Wrapper rotates an additional `+180°` on Y on top of the About flip (so total rotateY goes 180° → 360°, landing back face-forward but now showing the spine skin). Card-back content (`AboutCardBack`) cross-fades **out**, `ProjectSpine` overlay cross-fades **in**.
- **0.45 → 0.55** — brief hold so the eye registers the spine.
- **tFall (0.55 → 1.00)** — fly to `__bridgeSlotRect.cx/cy` with `eOut` easing; `scaleY` lerps to `SPINE_HEIGHT/CARD_HEIGHT`; add a small `rotateZ` wobble (-6° → 0°) for the tumble.
- **settled (≥ 0.96)** — hand off to the live shelf spine (cardWrap opacity → 0).

## Spine skin (on back face)

A new `spineSkinRef` layer inside the back face:
- Renders `<ProjectSpine data={ABOUT_SPINE_DATA} />` at its native 78×200.
- Absolutely centered, scaled UP to fill the card via `scale(CARD_WIDTH/SPINE_WIDTH, CARD_HEIGHT/SPINE_HEIGHT)` at `tSpine=0`, lerping to `scale(1,1)` at `tSpine=1` — counteracting the wrapper's narrowing so the spine art stays correctly sized as the card shrinks.
- Opacity: `eInOut(tSpine)` (fades in as About fades out).

## Back-face content gating

- `cardBackInnerRef` opacity = `(p2 > 0.5 ? 1 : 0) * (1 - tSpine)` → About content visible only between flip-complete and spine-reveal-start.
- `backSlotRef` opacity = same (slot hides as we become a spine).
- `backFaceRef.background/shadow` → keep CARD_BG/shadow during tSpine ramp, fade to transparent at `tSpine > 0.6` so only the spine art remains.

## Code changes (single file: `src/components/HeroIdBadge.tsx`)

1. **Remove** `volRef`, `panelLRef`, `panelCRef`, `panelRRef` refs and the entire trifold packet JSX block (lines 531–634).
2. **Remove** `tFold`, `tTurn`, `tShrink`, `tFile`, `foldActive`, `eInOut` (local fold version) — keep one shared `eInOut`.
3. **Add** `spineSkinRef` (HTMLDivElement). Render a sibling to `cardBackInnerRef` containing `<ProjectSpine data={ABOUT_SPINE_DATA} />` wrapped in a centering/scaling div.
4. **Rewrite** the per-frame section after `p2`:
   - `const tSpine = seg(0.00, 0.45, bridge);`
   - `const tFall  = seg(0.55, 1.00, bridge);`
   - `const settled = bridge > 0.96;`
   - `rotYFlip = p2 * 180 + tSpine * 180;`
   - `scaleX = baseScale + (SPINE_WIDTH/CARD_WIDTH  - baseScale) * eInOut(tSpine);`
   - `scaleY = baseScale + (SPINE_HEIGHT/CARD_HEIGHT - baseScale) * eOut(tFall);`
   - `rotZ   = -6 * tFall * (1 - tFall) * 4;` (peaks mid-fall, returns to 0)
   - Fly offsets gated by `tFall > 0` using existing `__bridgeSlotRect`.
5. **Update** back-face style gating to use `tSpine` (replace all `foldActive` references).
6. **Update** spine skin transform per-frame:
   - `spineSkinRef.style.opacity = eInOut(tSpine).toString();`
   - inverse-scale: `scale(${CARD_WIDTH/SPINE_WIDTH * (1 - tSpine) + tSpine}, ${CARD_HEIGHT/SPINE_HEIGHT * (1 - tSpine) + tSpine})`
7. **Keep** unchanged: slide-to-center (p1), About flip (p2), lanyard/globe fades (now gated by `tSpine` instead of `tFold`), drag, `__bridgeSlotRect` contract with `AboutToProjectsBridge`, shelf hand-off via `settled`.

## Out of scope

- `AboutToProjectsBridge.tsx` (already publishes slot rect; no changes).
- `ProjectSpine.tsx` (reused as-is).
- Mobile (`hidden md:block` stage unchanged).
