Two surgical visual changes to `src/components/AboutToProjectsBridge.tsx`. No behaviour/layout changes elsewhere.

## 1. Project spines drop from above (not rise from below)

Currently each spine wrapper starts at `translateY(135%)` (below the shelf rule) and rises into place via `lerp(135 → 0, easeBack)`. That is the "appears from bottom" behaviour you're seeing.

Change so spines fall in from above, mirroring the About-spine flight:

- Initial inline style on each spine wrapper: `transform: translateY(-160%) rotate(-6deg)`
- Animation lerp in the `ARCHIVE` block:
  - `y` goes from `-160 → 0` (above → resting)
  - `rotate` goes from `-6deg → 2deg → 0deg` via a two-segment lerp (first 70% drop, last 30% settle)
  - Keep the existing per-row + per-col stagger (`r * 1.0 + c * 0.18`) and `archWinStart 0.965 → archWinEnd 1.0` window
  - Easing: replace `easeBack` with a smooth cubic-out for the drop, then a small overshoot on rotation only (avoids visual "jump up" from easeBack on Y)
- Apply identical change to the toolbox wrapper's initial transform (it shares the same ref system, so it will auto-pick up the new lerp).

Net effect: every spine + the toolbox glide down from above the shelf ledge with a slight tilt that straightens on landing — same family as the About-spine fly-in.

## 2. Realistic greyscale toolbox on the shelf

Replace the orange/wood `<svg>` (lines ~349–403) with a machined steel toolbox in the same warm-grey palette as the redesigned SkillsToolbox panel. Same dimensions (96×76), same anchor/href, same ref — purely visual swap.

New SVG composition:

- Gradients (added to `<defs>`):
  - `tbBody`: `hsl(220 6% 32%) → hsl(220 6% 18%)` (brushed steel body)
  - `tbLid`: `hsl(220 6% 40%) → hsl(220 6% 24%)` (lid catches light)
  - `tbHandle`: existing chrome stays (`#cfcfcf → #5a5a5a`)
- Body & lid: 1px stroke `hsl(220 8% 10%)`, 2px corner radius (sharper than current)
- Hinge line: `hsl(220 8% 8%)` 1px, plus a 0.5px highlight underneath
- Latches: small chrome rectangles (10×8) using `tbHandle` gradient, dark pivot dot — no yellow
- Label plaque: dark slate rect `hsl(220 8% 14%)` with engraved "TOOLS" text in `hsl(40 8% 70%)` mono
- Feet: dark slate `hsl(220 8% 12%)`
- Top edge highlight: 0.6px `rgba(255,255,255,0.12)` (subtle, not glossy)
- Faint horizontal brushed-metal striations on the body (0.4px lines at 6–8px intervals, `rgba(255,255,255,0.04)`)
- Ground shadow ellipse stays

Result: a grounded, industrial steel toolbox that visually belongs next to the dark book spines and matches the new SkillsToolbox aesthetic — no playful orange/wood.

## Out of scope

- `ProjectsShelf.tsx` (the separate shelf component) — already updated previously, unchanged here.
- `SkillsToolbox.tsx` — unchanged.
- All other animations, spine markup, ledge stroke, About-spine flight, scroll bindings — unchanged.
