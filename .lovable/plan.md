## Goal

1. Show the shelf toolbox **front-on, resting on the plank** (no top-down tilt).
2. Make that *same* toolbox perform the scroll-driven flip into the Skills section using the timing from your scaffold.

No new dependencies — `framer-motion` already exposes the same `useScroll` / `useTransform` / `useSpring` / `motion` APIs as `motion/react`, so `npm install motion` is not needed.

---

## Changes

### 1. `src/components/skills/ToolboxSvg.tsx` — front-view shelf prop

`ToolboxClosed` currently tilts the box (`rotateX: -12deg`, `rotateY: -8deg`), which is why on the shelf it reads as a top-down 3/4 view. Fix:

- Remove the `tilt` prop's default rotation. Render the toolbox with `rotateX: 0deg`, `rotateY: 0deg`, lid closed → pure front face (CORE nameplate, latches, handle visible).
- Recompute the wrapper height from the natural front-view aspect: `height = width * (H_BASE + H_LID) / W` (220 × 0.30 = 66px for the body; +50px for the handle that sticks above).
- Add a light perspective (`perspective: 1200px`) so the rivets/borders still read as dimensional but the face is square-on.
- Keep the `Toolbox3D` internals untouched — only `ToolboxClosed` wrapper changes.

### 2. `src/components/AboutToProjectsBridge.tsx` — shelf slot

- Change the `<a>` wrapper around `<ToolboxClosed />` from the fixed `width:220, height:174` to a height that matches the new front-view aspect (≈ 116px including handle overhang), so the toolbox visually sits *on* the plank instead of floating in a tall blank box.
- Anchor it to the plank bottom (`alignItems: flex-end`).
- No animation logic changes; `__toolboxRect` keeps publishing the new (smaller, front-view) rect so the bridge handoff still lines up exactly.

### 3. `src/components/ToolboxToSkillsBridge.tsx` — match your scaffold timing

Rewrite the keyframes to exactly your scaffold (with continuity from the shelf rect):

```text
smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 20, restDelta: 0.001 })

x      : [0, 0.1, 0.8, 1]            → [shelfDx, 0,      0,      0]
y      : [0, 0.1, 0.8, 1]            → [shelfDy, 0,      0,     40]
scale  : [0, 0.1, 0.2, 0.8, 0.95]    → [shelfS,  shelfS, fitS,   fitS,   fitS*0.85]

rotateX: [0, 0.1, 0.2, 0.8, 0.95]    → ["0deg",  "-15deg","-90deg","-90deg","-15deg"]
rotateY: [0, 0.1, 0.2, 0.8, 0.95]    → ["0deg",  "-5deg", "0deg",  "0deg",  "35deg"]
lidRotX: [0.25, 0.4, 0.65, 0.75]     → ["0deg",  "125deg","125deg","0deg"]

interiorOpacity: [0.40, 0.50, 0.65, 0.72] → [0, 1, 1, 0]
```

- Stage perspective dropped from 2500px → **1200px** to match your scaffold (more pronounced 3D).
- Starting `rotateX/rotateY = 0deg` now matches the shelf prop's front view → seamless visual handoff (no instant rotation snap when the bridge takes over).
- `__skillsFlipActive` still gates so the shelf prop hides once `t > 0.02`.
- Sticky `260vh` section, dark stage background, `ToolboxInterior` on the floor face — all unchanged.

### Out of scope

- About-me spine flicker, projects shelf layout, admin/DB, constellation background, ToolboxInterior content.

---

## Files touched

- `src/components/skills/ToolboxSvg.tsx` — front-view `ToolboxClosed` wrapper
- `src/components/AboutToProjectsBridge.tsx` — shelf slot sizing/anchor
- `src/components/ToolboxToSkillsBridge.tsx` — retimed scroll choreography matching your scaffold
