## Goal

Bring back the original scroll-driven ID-card flip from the hero (lanyard, slide, 3D flip — all of it), but change the **landing position** so the flipped card lands in the **right column** of the About panel, with the **globe sitting on the left** (no dashed-border / grid container around it — just the globe).

Everything else from the previous turn stays: journey content on the back of the card, click-to-highlight on the globe, Path/Journey station removed, 7-station nav.

---

## 1. Restore the original flip mechanic

Revert `src/components/HeroAboutFlip.tsx` and `src/components/HeroIdBadge.tsx` to the previous behavior:

- `HeroAboutFlip` becomes a pinned scroll container again with `useScroll` driving `scrollYProgress`. Pin height **`200vh`** (longer than before to give the card a calmer ride and fix the "scrolls away too fast" feel — see motion notes below).
- The flipped `<HeroSection />` blueprint stays as the pinned background panel for phases 0–0.30 like before.
- `HeroIdBadge` keeps the portal-mounted fixed stage, the lanyard SVG + clip, the resting position in the top-right of the hero, drag interaction, and the scroll-driven `applyTransform` pipeline (translate → scale → rotateY).

What changes inside `HeroIdBadge`'s transform math:

- Today the card slides toward the **center of the stage** (`stageCenterX`, `stageCenterY`). Change the destination to the **center of an explicit "about-card-slot" element** that we render in the new About panel's right column.
- Replace the "anchor to hero panel" rect tracking with a small selector layer: the stage still tracks the hero rect during phase 0 (so the card sits in its resting top-right spot above the hero), but during phase 1+ it tracks the **slot rect** (`#about-card-slot`).
  - Implementation: read both `anchor` (hero) and `slot` (about) rects each frame; lerp between them by `p1 = smoothstep(0.30, 0.55, t)`. The stage's `transform: translate3d(...)` interpolates from hero rect to slot rect, and width/height likewise. This keeps the card visually attached as it travels, and naturally lands inside the About column without us having to fight the existing center math.
- Drop the `dxToCenter` / `dyToCenter` / `maxScale` block — once the stage itself is moving toward the slot, the card just sits at its resting offset within the stage. Scale becomes a gentle 1 → ~1.05 to add presence, not a 2-3× zoom.
- Tilt eases out the same way; flip `p2 = smoothstep(0.55, 0.90, t)` stays as before.
- Lanyard fades to 0 across `p1` (not `p2`) since the card is no longer "centered in the void" — once it docks into the About column the lanyard reads as visual noise.

## 2. About panel — two columns, card slot on the right

Rewrite `src/components/AboutSection.tsx`:

- Outer wrapper unchanged (max-w-7xl container, paper background panel, "· 02 — About / Identity Passport" header strip).
- Inner grid: `grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 lg:gap-14 items-center` — **globe left, card right**.
- **Right column**: a sized placeholder `<div id="about-card-slot" />` that matches the card's natural footprint (`width: 360px`, `aspect-ratio: 5/7`, `max-w-full`). This div is empty — it's a layout reservation. The actual card lives in the portal stage and lands here via the flip. Below the slot, render the **detail tray** (the click-to-expand journey detail card from the previous turn).
- **Left column**: the globe rendered without the dashed-border / grid-paper background and without corner ticks. Just `JourneyGlobe` showing the canvas + the small caption underneath. Container is `w-full max-w-[460px] mx-auto aspect-square`.
- Mobile (`< lg`): stack — globe on top, then a fallback static IdentityCard (since the portal flip only runs on `md:block`). Reuse the static `IdentityCard` we already built as the mobile fallback inside the slot when on small screens. The portal stage already hides itself with `hidden md:block`, so on mobile the slot just contains the static card directly.

## 3. Globe — strip the chrome

Edit `src/components/about/JourneyGlobe.tsx`:

- Remove the dashed border, grid-paper background, padding, and the four corner ticks.
- Render only the `<Globe />` canvas inside a transparent `aspect-square max-w-[460px] w-full mx-auto`.
- Keep the caption (location name + coordinates + pulse dot) below.
- Keep the smooth target-rotation behavior (already wired through `targetPhi` / `targetTheta`).

## 4. Journey state lives in About, card reads from About

The portal-mounted card (front + back) needs to know `selectedId` so its back-face rows show the active highlight, and the globe needs `selectedId` to rotate. Both `IdentityCard` (back face) and `JourneyGlobe` are siblings under `AboutSection` — but the card is rendered by `HeroIdBadge`, not by `AboutSection`.

Approach: lift `selectedId` to a tiny module-level store using a `Zustand`-style hook, or just a small React Context placed at `Index.tsx` level wrapping both `HeroAboutFlip` and `AboutSection`.

Pick the lighter option: a `useAboutJourney` zustand-free hook backed by `useSyncExternalStore` over a module-level subscriber set, exported from `src/components/about/journeyStore.ts`. Both `HeroIdBadge`'s back face and `JourneyGlobe` import it. No prop-drilling.

`HeroIdBadge`'s back face is rewritten to render the journey rows from `journeyData.ts` (same content as the static `IdentityCard` back face) and call `setSelected()` on click. The standalone `IdentityCard` component is kept only for mobile fallback rendering.

## 5. Scroll motion polish (the only knob the user complained about)

Inside `HeroIdBadge.applyTransform()`:

- Run the raw `progressMV.get()` through a smoothstep before deriving `p1`/`p2` so wheel jitter is dampened: `tSmooth = smoothstep(0, 1, raw)`.
- Reduce the resting tilt range from `8deg → 0deg` to `5deg → 0deg`.
- Cap scale to `1 → 1.05`.
- Already snapping to 0.5px / 0.001 scale — keep that.

Inside `HeroAboutFlip`:

- Pin height `200vh` (was 135vh). Phase 1 happens slowly across the first viewport scroll, phase 2 across the second.
- After the pin releases, the stage continues tracking `#about-card-slot` (which is in normal flow inside About) — so the card scrolls away naturally with the About panel, no abrupt detach.

## 6. Cleanup

- `src/components/AboutSection.tsx` no longer renders the desktop `IdentityCard` — only the slot + tray + globe. Mobile still uses the static card.
- `src/components/HeroIdBadge.tsx` back-face content is updated to the journey rows with selection state.
- `journeyData.ts`, `JourneyGlobe.tsx` (chrome stripped), and `IdentityCard.tsx` (mobile-only) all stay.
- Section count / nav / panel ids stay at 7 (unchanged from previous turn).

---

## Files touched

- `src/components/HeroAboutFlip.tsx` — restore pinned flip container, height 200vh.
- `src/components/HeroIdBadge.tsx` — restore lanyard + flip; retarget stage to `#about-card-slot` via lerp; rewrite back face to journey rows that drive shared selection.
- `src/components/AboutSection.tsx` — globe-left / card-slot-right grid; mobile static card fallback.
- `src/components/about/JourneyGlobe.tsx` — strip border / grid / corner ticks; transparent container.
- `src/components/about/journeyStore.ts` — new shared `selectedId` store.
- `src/components/about/IdentityCard.tsx` — keep, used only as mobile fallback; reads/writes shared store.

No DB changes. No nav / station-count changes.

## Out of scope

- Re-introducing the Path/Journey nav station (stays removed, 7 stations).
- Trailing panels.
- Lanyard look — visual is preserved as-is.
