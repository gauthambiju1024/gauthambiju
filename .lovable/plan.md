
# About → Projects bridge — implementation plan

A pinned, scroll-driven transition that folds the blueprint surface of About into a single book spine, then lands it on a freshly-drawn shelf ledge using construction-reveal language. Atmosphere first, no new content, fully consistent with the Builder's Desk system.

## Where it lives

- New component: `src/components/AboutToProjectsBridge.tsx`.
- Mounted in `src/pages/Index.tsx` between `<HeroAboutFlip />` and the first trailing station (Projects), inside `.margin-content-wrapper`.
- No nav entry — this is transitional, not a destination. `panelIds` arrays unchanged.
- No DB, no edits to `HeroAboutFlip`, `ProjectsShelf`, or `AssemblyHeader`.

## Scroll geometry

```text
section height: 180vh (gives ~80vh of scroll travel)
sticky inner:   top: 100px (clears AssemblyHeader), height: calc(100vh - 100px)
local progress: (scrollY − pinTop) / (pinHeight − viewportHeight), clamped 0..1
```

Single window-scroll listener + `requestAnimationFrame` flag, mutating refs only (no React re-renders during scroll). Same pattern as `MarginDoodles` and the assembly belt.

## Phased choreography (t in 0..1)

```text
A  0.00 – 0.15   Settle      blueprint slab visible, grid intensifies,
                             top caption "Filing this away."
B  0.15 – 0.45   Tri-fold    left flap rotateY  0 →  +88°
                             right flap rotateY 0 →  -88°
                             slab scaleX        1 →  0.12
                             top caption fades out
C  0.45 – 0.70   Rotate      slab rotateY 0 → 90° (spine edge to viewer)
                             color lerp: hsl(160 20% 16%) → hsl(170 25% 24%)
                             vertical "PROJECTS · 2022—NOW" label fades in
                             spine title in Playfair, tracking 0.3em
D  0.70 – 1.00   Land        slab translateY 0 → +18vh (drops onto ledge)
                             ledge SVG: stroke-dashoffset draws L→R
                             4 corner brackets + 2 dimension lines
                             ("W:78mm SPINE_01", "REV: A") fade in
                             bottom caption "Selected work — pull a spine."
                             fades in last
```

All easing via small `clamp01` + linear segments — feels mechanical and on-brand for the assembly aesthetic.

## DOM structure (essentials)

```tsx
<section ref={pinRef} id="about-projects-bridge" style={{height: '180vh'}}>
  <div className="sticky" style={{top: 100, height: 'calc(100vh - 100px)'}}>
    <div className="absolute inset-0" style={{perspective: 2200}}>
      <div ref={topCapRef}   className="absolute top-10 ..." />
      <div ref={slabRef}     style={{transformStyle: 'preserve-3d', ...}}>
        <div ref={leftFlap}  style={{transformOrigin: 'right center'}} />
        <div ref={center}    />
        <div ref={rightFlap} style={{transformOrigin: 'left center'}} />
        <div ref={spineLbl}  /* vertical writing-mode title */ />
      </div>
      <svg ref={ledgeRef}    /* drawn via stroke-dashoffset */ />
      <div ref={dimsRef}     /* corner brackets + mono labels */ />
      <div ref={botCapRef}   className="absolute bottom-10 ..." />
    </div>
  </div>
</section>
```

Each flap and the center share the same blueprint background (4-layer grid + gold accent rules) so the fold looks like one continuous surface creasing inward. The "Builder's Desk" gold (`hsl(38 60% 52%)`) is used for dimension labels and the ledge line — same ink language as the margin doodles.

## Visual ingredients (reused from existing system)

- Blueprint grid: same 4-layer `linear-gradient` recipe as `.blueprint-surface`.
- Walnut/teal target color: `hsl(170 25% 24%)` — matches `SPINE_COLORS[0]` from `ProjectsShelf`.
- Mono labels: JetBrains Mono, 9–10px, `tracking-[0.25em]`, gold ink — same as Assembly Header and corner brackets.
- Caveat captions: Builder's Desk handwritten voice.
- Stroke-dashoffset draw-in: same technique as `MarginDoodles`.
- Corner brackets + dimension lines: same vocabulary as `.corner-brackets` / `.dimension-line` utilities in `index.css`.

## Edge cases

- `prefers-reduced-motion`: collapse to 200ms cross-fade — render the final state (spine on ledge with bottom caption) immediately, skip the fold/rotate.
- Mobile (<800px): keep the same animation but reduce slab size to `82vw × 38vh` and disable the 3D perspective (set `perspective: 'none'`) — the fold becomes a simple scaleX collapse, still reads as "filing away".
- AssemblyHeader stage indicator: this bridge has no panel id so it inherits the in-between "no station" state; tested visually with the existing pinned About panel pattern.

## Files touched

- New: `src/components/AboutToProjectsBridge.tsx` (~280 lines, single file, self-contained).
- Edit: `src/pages/Index.tsx` — import + mount the bridge once, between `<HeroAboutFlip />` and the trailing-stations `map`.

## Verification

- Build passes.
- Manual scroll check at 1053×801 desktop and at 390px mobile.
- Console-log-free; no runtime warnings; no layout shift in the Projects shelf below.
- Reduced-motion media query confirmed via DevTools emulation.

That's it — quiet on the page, expensive-looking, zero new metaphors.
