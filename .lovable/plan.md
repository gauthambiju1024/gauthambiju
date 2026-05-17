# Fix blank fold + replace gold spine with project-spine style

## Why the card looked blank

The new vol overlay renders 3 opaque cream panels in front of the live
`AboutCardBack`. During `tSettle` the live content fades out, and the
cloned `<AboutCardBack>` instances inside each panel don't fill their
slots (parent uses `display:flex; flexDirection:column` without `flex:1`
on the child, and `AboutCardBack` has no intrinsic height). Net result:
3 blank cream rectangles covering everything.

The clone approach is overkill anyway — we don't need 3 live copies of
the about content to sell the fold. Simpler structure works better.

## New construction

Keep the live `AboutCardBack` as the CENTER panel's front. Only the two
WINGS are added as new fold elements. The "spine" back-face is a
ProjectSpine-styled element matching the shelf's other spines.

```
backFaceRef (cardWrap back; rotateY 180° + preserve-3d)
├── live AboutCardBack             ← centre front, ALWAYS visible
├── volRef                          ← preserve-3d, opacity ramps with tFold
│   ├── leftWing                    ← absolute, off-screen at rest (left:-33.33%)
│   │   slides in over [0, tFold start] then rotateY +178° (origin right)
│   │   front: cream + crease shadow; back: dark linen
│   ├── rightWing                   ← mirror of leftWing (right edge)
│   └── spineBack                   ← absolute inset 0, transform rotateY(180°)
│       backface-visibility hidden, scaled down on FILE phase so its
│       visible footprint matches the shelf row's SPINE_HEIGHT.
│       Uses the SAME ProjectSpine markup (cream/walnut linen, vertical
│       "ABOUT" text, year cap, subtitle) — NO gold gradient, no
│       crossfade-to-yellow.
└── (slot, header decoration unchanged)
```

Behavior:
- At bridge = 0 → vol opacity 0, wings invisible, AboutCardBack visible
  normally. The card preview matches today's About flip.
- TRIFOLD (b 0–0.36): vol fades in. Wings slide from off-stage onto
  left/right thirds of the card (so a tri-panel composition appears),
  then rotate ±178° around their inner edges, folding behind. Wings carry
  their own dark back so as they fold you SEE the dark backside (true
  fold visual).
- TURN (b 0.30–0.58): whole vol (and the AboutCardBack underneath) rotates
  with cardWrap as currently. The spineBack inside vol is pre-rotated 180°
  with `backface-visibility:hidden`, so it only appears when the packet's
  back faces the camera — that's where the project-spine styled centre
  shows up.
- FILE (b 0.54–0.84): existing arc + scale to `SPINE_WIDTH × SPINE_HEIGHT`.
  Because spineBack uses the same `<ProjectSpine>` proportions, the
  shrunken visual lands matching the other shelf spines naturally — no
  extra height fudging.
- AboutCardBack fade: fade it out only on `tTurn > 0.5` (during the actual
  turn, not during settle), so wings folding don't reveal a blank centre.
  At that point the user is seeing the back side anyway.

## Spine styling

Use a real `<ProjectSpine>` for the back face, with
`data={ABOUT_SPINE_DATA}`, `fallbackColor` left at default cream-walnut.
Wrap it so it fills the full card footprint (260×380), then the FILE phase
scaleX/Y collapses it to `SPINE_WIDTH/260 × SPINE_HEIGHT/380` — exactly
matching the shelf row. No gold gradient, no yellow ABOUT label, no
crossfade. It IS a project spine from the moment the back face shows.

## File changes

### `src/components/HeroIdBadge.tsx`
- Remove all three cloned `<AboutCardBack>` instances from inside vol
  panels.
- Remove the gold `.pf.spine` styling block (cap, year, ABOUT typography,
  PORTFOLIO subtitle, tick).
- Replace centre panel's back face with `<ProjectSpine data={ABOUT_SPINE_DATA} />`
  sized to fill 260×380 with `transform: rotateY(180deg)` and
  `backface-visibility: hidden`.
- Left/right wings: keep front (cream + crease shadow gradient + edge
  shadow on the inner crease) and back (dark linen). Add a slide-in
  transform on tSettle so wings come from off-stage to their thirds
  before rotating, so the at-rest card stays clean.
- AboutCardBack live fade: change from `1 - tSettle` to
  `1 - ease(0.30, 0.55, b)` so it remains visible through TRIFOLD.
- vol opacity: gate on `tFold > 0.01 ? 1 : 0` so at rest the wings are
  hidden entirely.

### `src/components/AboutToProjectsBridge.tsx`
- No change.

### `.lovable/plan.md`
- Update notes to reflect: live AboutCardBack as centre, wings overlay,
  ProjectSpine back face (no gold/yellow), height auto-matches shelf via
  shared SPINE_WIDTH/HEIGHT scale.

## Verification at 1001×769

- b = 0: card looks identical to current About flip — AboutCardBack
  fully visible, no extra panels.
- b ≈ 0.20: wings slid into place, beginning to rotate behind, centre
  still showing AboutCardBack.
- b ≈ 0.40: wings folded behind, dark backs visible, centre crease
  shadowed, packet starting to turn.
- b ≈ 0.60: packet mid-turn, ProjectSpine-styled back appearing.
- b ≈ 0.85: dossier landed in shelf slot at exactly the other spines'
  size, indistinguishable from neighbors.

No backend changes. No new dependencies.
