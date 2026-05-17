# Replicate the reference's trifold construction exactly

The current implementation cheats: the "fold" is an opaque cream overlay
placed on top of the back face. When flaps rotate, they don't reveal anything
underneath because they ARE the surface. The reference does something
fundamentally different — it builds a real 3-panel volume where each panel
has its own front and back face, and the spine is the *back of the centre
panel* (not an overlay).

## How the reference builds it

```
#dossier (perspective host)
└── .vol                            ← the whole "packet"; gets rotateY(-180) on TURN
    ├── .panel.l   width:140  origin: right center
    │   ├── .pf.front  ← carries a 420×560 .clone of the card, shifted left:0
    │   └── .pf.back   ← dark linen
    ├── .panel.c   width:140  left:140
    │   ├── .pf.front  ← .clone shifted left:-140 (shows centre third)
    │   └── .pf.spine  ← gold gradient + vertical "ABOUT" text   ← the SPINE
    └── .panel.r   width:140  left:280  origin: left center
        ├── .pf.front  ← .clone shifted left:-280
        └── .pf.back   ← dark linen
```

Critical rules:
- Each `.pf` has `backface-visibility:hidden`.
- `.pf.back` and `.pf.spine` are pre-rotated `rotateY(180deg)` so they sit
  on the opposite face of their panel.
- TRIFOLD rotates only `.panel.l` (+178°) and `.panel.r` (−178°). Because
  the wings carry their own front+back, when they fold behind the centre,
  they show their dark back side from the camera's perspective — exactly
  what the user described as "folding".
- TURN rotates the whole `.vol` by −180°. Now we see the *backs* of all
  three panels. The centre back is `.pf.spine` (gold + ABOUT label), the
  L/R backs are dark — together they form the spine of a filed dossier.

Our overlay approach can't ever look like that because:
1. There's no per-panel back face, so folding wings reveal nothing.
2. The "spine label" sits on the front of the centre panel rotated 180°,
   so it never enters the camera correctly.
3. There's no whole-packet TURN, so we never get the dossier-becomes-spine
   reveal.

## Plan

### `src/components/HeroIdBadge.tsx` — rebuild the fold packet

Replace the `foldSeamsRef` overlay (lines 521–615) with a true `.vol`
construction layered over the existing back face. Wrap the three panels
in a `volRef` div so we can apply the TURN.

Structure (260×380 to match the card; panel width = 86.66):

```
<div volRef                              transformStyle: preserve-3d
     style={transform: rotateY(turnDeg)}>
  <div leftPanelRef   w:33.33%  origin:right center  preserve-3d>
    <div .pf.front>   {clone of back-face slice, left:0}
    <div .pf.back     transform:rotateY(180deg)>  dark linen
  </div>
  <div centerPanelRef w:33.34%  left:33.33%        preserve-3d>
    <div .pf.front>   {clone of back-face slice, left:-86.66}
    <div .pf.spine    transform:rotateY(180deg)>
       <span vertical>{badge.ribbonLeft} · 2026</span>
       crease shadow + cap + tick like reference
    </div>
  </div>
  <div rightPanelRef  w:33.33%  left:66.67%  origin:left center  preserve-3d>
    <div .pf.front>   {clone of back-face slice, left:-173.33}
    <div .pf.back     transform:rotateY(180deg)>  dark linen
  </div>
</div>
```

The `.pf.front` of each panel uses a CSS mask or `overflow:hidden` + a
positioned clone of the back-face DOM (or a snapshot — see note below).

**Clone strategy** — since `AboutCardBack` is a React component with state,
we don't want to literally duplicate it 3× and animate state mismatches.
Two cheap options:
- (A) Render `AboutCardBack` once inside an invisible source div; the three
  `.pf.front` slices use `background-image` from a static cream colour plus
  a CSS-only "page rule" pattern. This keeps the fold visually convincing
  without DOM duplication — but loses the actual content imagery.
- (B) Render `AboutCardBack` three times (same props), each inside its
  panel's `.pf.front`, positioned via `left:0 / -86.66 / -173.33` so they
  reassemble to one continuous card. State is held in the parent
  (`activeTab`, `expandedId`), so all three stay in sync.

I'll use **(B)**. It matches the reference exactly, content survives the
fold, and the panels overflow:hidden so each shows its third.

### Phase math

Keep the four ranges already in place, with one addition for TURN:

```
TRIFOLD  b 0.00–0.36   leftPanel rotateY(+178·eInOut(tFold))
                       rightPanel rotateY(-178·eInOut(tFold))
                       crease shadow on centerPanel ramps 0.18 → 0.46
TURN     b 0.30–0.58   vol rotateY(-180·eInOut(tTurn))
                       spine label opacity = ease(0.40, 0.58, b)
FILE     b 0.54–0.84   arc flight + scale(kx,ky) + settle wobble (unchanged)
ARCHIVE  b 0.70–1.00   shelf spines rise (in AboutToProjectsBridge, unchanged)
```

Remove the `rotYFlip` chain from `cardWrap.transform` during bridge: the
TURN lives on `volRef` now, so the wrap stays at its post-flip orientation
(rotateY(180°) from the About flip). Equivalently: keep `rotYFlip` as-is
(it was already 180° by t≈0.72) and apply the vol TURN on top.

Remove the FILE-phase scaleX/Y from `cardWrap` and apply it to `volRef`
together with the TURN, so the shrinking spine and the rotation share one
transform origin.

### `src/components/AboutToProjectsBridge.tsx`

No structural change. The existing shelf line + eBack stagger already
matches the reference's DRAW + ARCHIVE.

### `.lovable/plan.md`

Update the canonical phase table to describe the new packet construction
(vol + 3 panels with real backs).

## Verification

At 1001×769, step through bridge progress:
- 0.10: wings starting to fold; centre crease darkening; back-face content
  still visible across all three panels (they reassemble seamlessly)
- 0.36: wings fully folded behind; dark backs visible from the side as the
  TURN begins
- 0.50: vol mid-turn; spine label appearing on the centre back
- 0.84: dossier landed as a spine in the shelf slot
- 1.00: all shelf spines settled, slot placeholder revealed

No new dependencies. No backend changes.
