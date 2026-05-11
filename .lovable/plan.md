## Two small About-card fixes

### 1. ID-card slot persists through the flip
The slot (the black "hole" at the top of the card) is only on the front face in `HeroIdBadge.tsx`, so as the card rotates the hole appears to vanish.

Fix: render an identical slot element at the top of the back-face JSX in `HeroIdBadge.tsx`, mirroring the front (same `top: 8`, `width: 38`, `height: 7`, same colour and inset shadow). Both faces now show the slot, so it reads as a real punched-through hole during and after the flip.

### 2. Globe starts framed on the marked region (full rotation kept)
Keep the existing slow continuous spin — just choose the starting angle so the marker cluster is centred on first reveal.

In `src/components/about/AboutGlobe.tsx`:
- Compute the mean of the markers' `[lat, lng]` once.
- Set the initial cobe orientation from that mean:
  - `phi  = ((180 - meanLng) * Math.PI / 180)`  ← cobe rotates the globe under the camera; this puts `meanLng` directly under the viewer.
  - `theta = (meanLat * Math.PI / 180) * 0.6`   ← gentle latitudinal tilt so we look slightly down at the cluster (clamped factor keeps it from looking pole-on).
- Pass them through `COBEOptions` instead of the hard-coded `phi: 1.2, theta: -0.3`.

In `src/components/Globe.tsx`:
- `phiRef` is already initialised from `config.phi`, so the spin starts from this value and continues forward at the existing slow rate (`0.0006` rad/frame ≈ one revolution every ~3 minutes).
- No oscillation — the marker cluster sits centred for ~80–90 seconds before drifting around the back, then comes around again.

### Files touched
- `src/components/HeroIdBadge.tsx` — mirror slot onto back face.
- `src/components/about/AboutGlobe.tsx` — derive initial `phi` / `theta` from markers.

### Out of scope
`Globe.tsx` rotation logic, lanyard, card geometry, admin editor.
