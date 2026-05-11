# Plan: Right-size panels + ID card flip into About

## 1. Fix panel sizing (currently slightly too tall)

In `src/pages/Index.tsx`:

- Remove the `pt-[88px]` wrapper and the per-section `py-3` padding (these stack on top of `100vh` so each panel exceeds the viewport).
- Set each section to `height: calc(100vh - 100px)` and add `marginTop: 100px` only to the first section (so subsequent sections stack flush, each one viewport-sized).
- Net result: every panel exactly fills the viewport area below the fixed Assembly Header — matching the previous DeskStage size.

## 2. Pinned scroll-driven ID card → About flip

Goal: as the user scrolls past the hero, the hero panel pins, the floating ID card animates to the center of the viewport, scales up to roughly panel size, then 3D-flips on the Y axis. The back of the card *is* the About (BusinessCardFrame) panel.

### Structural change

Wrap the first two stations (`home` + `about`) in a single pinned container roughly `200vh` tall:

```text
<section id="home-about-pin" style="height: 200vh">
  <div class="sticky top-[100px] h-[calc(100vh-100px)]">
    <FlipStage progress={0..1}>
      <Front> Hero panel (BlueprintFrame + HeroSection) </Front>
      <Back>  About panel (BusinessCardFrame + AboutSection) </Back>
    </FlipStage>
  </div>
</section>
```

Stations 3–8 continue stacking below as plain `100vh - 100px` sections (unchanged behavior).

### Animation phases (driven by scroll progress 0 → 1)

- **0.0 – 0.35** Hero fully visible. ID card sits in its current top-right position (its existing portal-tracking logic still works because the hero section is pinned in viewport).
- **0.35 – 0.55** ID card detaches from hero overlay, animates to viewport center, lanyard fades out, card rotation eases from 8° to 0°, scale grows from 1 → ~3.5 (until it roughly fills the panel area).
- **0.55 – 0.75** Card 3D-flips: `rotateY` 0° → 180°. At 90° we swap visible face from front (portrait/badge) to back (the About panel content). Hero content behind fades out.
- **0.75 – 1.0** Flipped card (now the About panel) settles into the panel bounds; the static About `<section id="about">` becomes the resting state so anchor links and downstream scroll still work.

### Implementation notes

- Use `framer-motion`'s `useScroll({ target: pinRef, offset: ["start start", "end end"] })` + `useTransform` for the progress value.
- New component `src/components/HeroAboutFlip.tsx` owns the pin container, the two faces, and the scroll-linked transforms. It receives `<HeroSection />` and `<AboutSection />` as children/slots so existing components stay untouched.
- Move the ID card markup into the flipping element when progress > 0.35. Easiest approach: the ID card lives inside the FlipStage front face from the start; remove the `createPortal(... document.body)` overlay and render the lanyard+card inside the hero panel. The lanyard tracking math already uses the stage rect, so it still works when the stage is the panel itself.
- Back face uses `transform: rotateY(180deg)` and `backface-visibility: hidden`; front face also `backface-visibility: hidden`. Container needs `transform-style: preserve-3d` and `perspective: 1600px`.
- Disable the flip on viewports `< 800px` (mobile): just render hero and about as normal stacked panels. The existing draggable ID card behavior is already `hidden md:block`.
- Keep `id="about"` on the back face's wrapper so Assembly Header anchor scroll still lands on the About panel.

### Files to change

- `src/pages/Index.tsx` — panel sizing fix; replace first two stations with `<HeroAboutFlip>`.
- `src/components/HeroSection.tsx` — stop portaling the ID card overlay to `document.body`; render it inside the hero section so it can be carried by the flipping stage. Keep all existing lanyard/drag logic.
- `src/components/HeroAboutFlip.tsx` — new pinned flip stage.

### Acceptance

- Each panel from `projects` onward is exactly viewport-height minus header (no extra scroll bleed).
- Scrolling from hero → about pins the hero, ID card centers and grows, then flips on Y to reveal About. Reverse scroll plays in reverse.
- Anchor links (`#about`, `#projects`, etc.) still scroll to correct positions.
- Mobile (<800px) keeps the simple stacked layout with no flip.
