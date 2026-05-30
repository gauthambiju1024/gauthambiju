# Plan — Cinematic scroll pacing

Goal: give each pinned section its own scroll runway and add inertial smooth scrolling site-wide so the page feels slower and more deliberate.

## 1. Global smooth scroll (Lenis)

- Add `lenis` (`bun add lenis`).
- Create `src/components/SmoothScroll.tsx` that mounts a Lenis instance with `duration: 1.4`, `easing: t => 1 - Math.pow(1 - t, 3)`, `wheelMultiplier: 0.85`, `touchMultiplier: 1`, and drives `requestAnimationFrame`.
- Mount it once in `src/main.tsx` (above `<App />`) so it covers every route.
- Disable when `prefers-reduced-motion: reduce`.
- Lenis dispatches normal scroll events, so existing `useScroll`/scroll listeners (HeroAboutFlip, ToolboxToSkillsBridge, DeskStage) keep working — they just receive smoother values.

## 2. Per-section runway lengths

All three pinned sections use the "100vh sticky inside a tall section" pattern. The scrollable runway = `sectionHeight − 100vh`. Updating section height changes pacing without breaking the animation math (each uses `scrollYProgress` 0→1).

| Section | File | Current height | New height | Resulting runway |
|---|---|---|---|---|
| Hero ↔ About flip | `src/components/HeroAboutFlip.tsx` (line 27) | `340vh` | `275vh` | 175vh scroll |
| Skills toolbox flip | `src/components/ToolboxToSkillsBridge.tsx` (line ~219, `height: "340vh"`) + internal `skillsRunway = vh * 1.2` | `340vh` total, `1.2` multiplier | `470vh` total, multiplier `1.85` | 185vh skills + 185vh desk |
| Desk stage (8 panels) | `src/components/DeskStage.tsx` (line ~131, `height: sections.length * 100vh`) | `N × 100vh` | `N × 165vh` (≈65% slower per panel) | per-panel runway 165vh |

In `ToolboxToSkillsBridge`, also update the two internal constants:
- `const skillsRunway = vh * 1.85;` (was `1.2`)
- `const deskP = clamp((scrollPx - skillsRunway) / (vh * 1.85));` (was `/ skillsRunway` with same value — keep symmetric at 1.85)
- Keep `Index.tsx`'s `marginTop: "-140vh"` overlap unchanged (the negative margin is relative to the previous section's bottom, so the longer runway naturally extends the pin).

The `about` / `projects` anchor markers inside `HeroAboutFlip` stay at the same percentage positions, so nav-link jumps still land on the correct visual state.

## 3. Verification

- Scroll from top to desk scene; confirm each phase (card lift, flip, shelf land, toolbox lift, toolbox flip, toolbox fly-to-desk, laptop reveal) reads clearly without rushing.
- Confirm Assembly Header nav links still scroll to the correct anchor.
- Confirm reduced-motion users get native scroll (Lenis disabled) and existing animations still complete.

## Out of scope

- No visual/layout changes to any section.
- No changes to the desk scene composition, toolbox interior, or certificates grid.
