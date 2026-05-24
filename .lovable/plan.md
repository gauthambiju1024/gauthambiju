# Hero ID Badge → Shelf Spine — Complete Animation Spec

This is everything needed to rebuild the animation cleanly in Claude, plus a fix for the reversed text bleeding through the front of the ID card on the home page.

---

## Part A — Bug fix on `/`

**Symptom:** On the home page (before any scroll), the back-of-card content (`OVERVIEW`, `ABOUT`, `EDUCATION`, `EXPERIENCE`, footer quote) is visible *mirrored* through the front of the card.

**Root cause:** The back face uses `transform: rotateY(180deg)` + `backfaceVisibility: hidden`. That hides the back face's own surface when facing away, but its *child DOM* (the `AboutCardBack` tree containing `framer-motion` `<motion.div>` elements with `AnimatePresence`) creates nested transform contexts that flatten and re-render on top of the card regardless of the parent's backface rule. Browsers (especially Safari/Chrome with `will-change` on inner motion divs) bleed children through.

**Fix:** Drive the back-face inner visibility from rotation progress `p2` instead of the unrelated `foldActive` flag.

In `HeroIdBadge.tsx` `applyTransform`:

```ts
// Hide back-of-card content until the card has actually flipped past 90°
const backVisible = p2 > 0.5 && !foldActive;
if (cardBackInnerRef.current) {
  cardBackInnerRef.current.style.opacity = backVisible ? "1" : "0";
  cardBackInnerRef.current.style.visibility = backVisible ? "visible" : "hidden";
}
if (backSlotRef.current) {
  backSlotRef.current.style.opacity = backVisible ? "1" : "0";
}
```

Also harden the back face so even if a child paints, it can't show through the front:

```ts
backFaceRef.current.style.visibility = (p2 > 0.01) ? "visible" : "hidden";
```

That kills the home-page bleed-through completely.

---

## Part B — Complete animation context (for rebuild)

### Scene composition

- **Pin section** (`HeroAboutFlip.tsx`): `height: 340vh`, contains a `sticky top-0 h-screen` stage. `useScroll` produces a single `scrollYProgress` MotionValue `p` ∈ [0..1] across the whole pin.
- **Hero panel** (`HeroSection` inside `BlueprintFrame`) sits inside the sticky stage and fades out 0.30→0.55.
- **`AboutToProjectsBridge`** is mounted inside the same sticky stage; it owns the shelf that the card eventually files into.
- **`HeroIdBadge`** is portaled to `document.body` as a `position: fixed` stage that **tracks the hero panel's `getBoundingClientRect()`** every frame via `transform: translate3d(...)` so the badge appears to live inside the hero panel without jitter.

### Constants

- `CARD_WIDTH = 260`, `CARD_HEIGHT = 380`
- `CARD_BG = hsl(40 25% 92%)` (cream)
- `SPINE_WIDTH = 78`, `SPINE_HEIGHT = 200` (matches the shelf spine exactly)
- Resting card position: `top: 90, right: 32, rotate: 8deg` (tilted, hanging from lanyard)

### Driver windows (all on the single `p` ∈ [0..1])

```text
p ∈ [0.00, 0.30]   Idle. Card draggable; lanyard live.
p ∈ [0.30, 0.55]   p1 = smoothstep(.35,.55,p) — slide-to-center + scale-up
p ∈ [0.55, 0.72]   p2 = smoothstep(.55,.72,p) — rotateY 0→180 (About flip)
p ∈ [0.72, 1.00]   bridge = smoothstep(.72,1.0,p) — fold→turn→shrink→fly
                     tFold   = smoothstep(.00, .55, bridge)
                     tTurn   = smoothstep(.62, .82, bridge)
                     tShrink = smoothstep(.82, .92, bridge)
                     tFile   = smoothstep(.92, 1.0, bridge)
                     foldActive = bridge > 0.02
                     settled    = bridge > 0.96
```

### Per-frame transform on the card wrapper

The wrapper (`cardWrapRef`) gets ONE composite transform every frame inside an rAF loop:

```ts
cardWrap.style.transform =
  `translate3d(${tx}px, ${ty}px, 0) ` +
  `rotate(${tilt}deg) ` +              // 8° resting → 0° as p1 ramps
  `scale(${scaleX}, ${scaleY}) ` +     // grows for p1, then shrinks to spine for tShrink
  `rotateY(${p2 * 180}deg)`;           // About flip
```

Where:
- `tx, ty` = drag offset + slide-to-center delta + fly-to-slot delta (`tFile` driven).
- `tilt = 8 * (1 - p1)`.
- `baseScale = 1 + (maxScale - 1) * p1`, capped so card fits in `45% × 78%` of stage.
- `targetSx = SPINE_WIDTH / (w/3)`, `targetSy = SPINE_HEIGHT / h` (note `w/3` because after the fold only the center wing is visible).
- `scaleX = lerp(baseScale, targetSx, easeOut(tShrink))`, same for Y.

### The trifold packet (inside the back face)

The back face contains an extra layer `volRef` that is **opacity 0** until `foldActive`, then **opacity 1**. Inside `volRef`:

```text
volRef (perspective from wrapper; transformStyle: preserve-3d; rotateY animates -180° on tTurn)
  panel L  (left:0%,    width:33.33%, transformOrigin: right center)
    .front  → cream slice — clones <AboutCardBack> at CARD_WIDTH shifted left:0    (backface hidden)
    .back   → transparent (rotateY 180, backface hidden)
  panel C  (left:33.33%, width:33.33%, transformOrigin: center)
    .front  → cream slice — clone shifted left:-CARD_WIDTH/3       (backface hidden)
    .back   → <ProjectSpine data={ABOUT_SPINE_DATA} /> at native 78×200,
              wrapped in rotateY(180) + flex-center, transparent bg (backface hidden)
  panel R  (left:66.66%, width:33.33%, transformOrigin: left center)
    .front  → cream slice — clone shifted left:-2*CARD_WIDTH/3   (backface hidden)
    .back   → transparent
```

### Fold + turn math

```ts
const eInOut = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2;

// Wings rotate behind center
panelL.transform = `rotateY(${ eInOut(tFold)*178}deg) translateZ(-5px)`;
panelR.transform = `rotateY(${-eInOut(tFold)*178}deg) translateZ(-5px)`;

// Whole packet revolves; center panel's back (the spine) faces camera
vol.transform = `rotateY(${-180 * eInOut(tTurn)}deg)`;
```

Because `backfaceVisibility: hidden` is set on every `.front`, the cream slices disappear past 90°; the center panel's `.back` (the `ProjectSpine`) appears automatically. The wings have transparent backs so they fade into space.

### Shrink + fly to shelf

- During `tShrink`, the wrapper's `scaleX,scaleY` lerps from `baseScale` to `(SPINE_WIDTH/(w/3), SPINE_HEIGHT/h)` — the visible center-third collapses to exactly the spine footprint.
- During `tFile`, the wrapper translates from current center to `window.__bridgeSlotRect.{cx,cy}` (published every frame by `AboutToProjectsBridge` from the `aboutSlotRef` DOM rect).
- `settled` (`bridge > 0.96`) → wrapper `opacity: 0`, shelf `aboutSpineRef` opacity ramps `0→1` over the same window for an invisible handoff.

### Lanyard + globe layers

- Lanyard SVG paths recomputed every frame from `slotRef.getBoundingClientRect()` (two bezier strands from the top of stage to the metal clip above the card slot). Fades out as `(1 - p2) * (1 - tFold)`.
- Globe (`AboutGlobe`) sits left of card, opacity = `p2 * (1 - tFold)`. Becomes pointer-interactive only when `p2 > 0.5 && tFold < 0.02`.
- Globe markers ↔ tabs: clicking a marker switches `activeTab` and expands the matching entry by `markerId`.

### Refs at a glance

`stageRef, cardRef, cardWrapRef, lanyardLayerRef, globeLayerRef, slotRef, clipRef, cardBackInnerRef, backFaceRef, backSlotRef, volRef, panelLRef, panelCRef, panelRRef` + 6 SVG path refs for the lanyard strokes/textPaths.

### Inter-component contract

- `window.__bridgeSlotRect`  — published by bridge, read by badge for fly target.
- `window.__bridgeProgress`, `__bridgeActive`, `__bridgeSettled` — diagnostic flags.

### Files involved (read order for the rebuild)

```text
src/components/HeroAboutFlip.tsx          ← pin + scroll source
src/components/HeroIdBadge.tsx            ← the card + lanyard + trifold + fly
src/components/AboutToProjectsBridge.tsx  ← shelf + slot rect publisher
src/components/projects/ProjectSpine.tsx  ← shared spine visual (back of center panel = same component)
src/components/about/AboutCardBack.tsx    ← content cloned into all 3 front slices
src/components/about/AboutGlobe.tsx       ← side-panel globe
```

---

## Files to change in this repo

- `src/components/HeroIdBadge.tsx` — apply the Part-A back-face visibility fix only. No other changes.
