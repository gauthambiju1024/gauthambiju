## Goal

Turn the About section into a premium "identity passport": ID card on one side, interactive globe on the other. The card is fully visible the moment About enters the viewport (no waiting for a flip). The Path/Journey station is removed and its content is compressed onto the back of the card with click-to-expand details that drive the globe.

---

## 1. Section structure & navigation (8 → 7 stations)

Remove Journey/Path as a standalone station everywhere.

- `src/pages/Index.tsx`: drop `journey` from `panelIds` (passed to both headers) and from `trailingStations`. Stop importing `JourneyTimeline`, `ScrollFrame`. Final order: `home, about, projects, thinking, skills, writing, contact`.
- `src/components/AssemblyHeader.tsx`: shrink the `NAV` array to 7 entries (`Home, About, Work, Think, Skill, Write, Send`); replace every hardcoded `8` (station loop, `i / 7` denominators, `Math.floor(p * 8)`, `partCount`/`prtRef` cap, `i < 8` in parts loops) with `7` / `i / 6`. Keep the belt visuals; only the count changes.
- `src/components/AssemblyHeaderMobile.tsx`: same — drop the Path/Journey entry and update any `8`-based counters or progress math.
- Delete the `JourneyTimeline` import and section. Leave `src/components/JourneyTimeline.tsx` and `ScrollFrame.tsx` files in place (unused) so we don't break anything that still references them; they can be deleted in a follow-up.

QA: verify the belt distributes 7 labels evenly, the active highlight tracks the right station as you scroll, and the mobile menu shows 7 items.

---

## 2. About section — new two-column layout

Replace the current pinned hero+flip approach for About with a normal, content-driven panel that sits right after Hero.

- `src/components/HeroAboutFlip.tsx`: shrink to a hero-only pinned section. Remove the flip-driving scroll progress, the `#about` anchor, and the portal `HeroIdBadge`. Pin height drops to `100vh`; it just renders the `BlueprintFrame` + `HeroSection` and moves on. Keep the pin so the hero still feels "stationary" while you start scrolling.
- New file `src/components/AboutSection.tsx` (replaces current usage; the existing AboutSection file can be overwritten):
  - Outer: `<section id="about">` wrapped in the same `max-w-7xl mx-auto px-2 md:px-4 lg:px-8 my-6 md:my-8` container as the trailing stations in `Index.tsx`. Wrap content in a frame consistent with the rest (reuse `BusinessCardFrame` or a lightweight blueprint frame — pick whichever already matches the cream/blueprint palette best; default `BusinessCardFrame`).
  - Inner grid: `grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-8 lg:gap-12 items-center`. ID card on the **left**, globe on the **right** (card is the anchor, globe supports).
  - Mobile: stacks card on top, globe below at reduced height.
- `src/pages/Index.tsx`: insert `<AboutSection />` (inside the same wrapper pattern) directly after `<HeroAboutFlip />`, before the trailing stations loop.

---

## 3. ID card — keep the look, make it static-first and flippable on click

New component `src/components/about/IdentityCard.tsx`. Reuses the visual language of the existing `HeroIdBadge` card (cream paper `hsl(40 25% 92%)`, ink text `hsl(160 20% 16%)`, slot at top, dashed divider, mono labels, brass-tinted shadow, barcode strip) but is **not** scroll-driven and **not** portaled.

- Card sits in normal flow at ~`width: 360px`, `max-w-full`. Visible as soon as About enters viewport. No initial flip, no opacity ramp — just a gentle `framer-motion` fade-in (`opacity 0→1`, `y 12→0`, 0.5s ease-out, `viewport={{ once: true, margin: "-15%" }}`).
- Hover: subtle 3D tilt only — `whileHover={{ rotateX: -2, rotateY: 2, scale: 1.01 }}`, no parallax following the cursor. `transformStyle: preserve-3d`, `perspective: 1400` on the wrapper.
- Flip: a small "Flip ↻" affordance in the corner toggles `flipped` state. Card uses two faces with `backfaceVisibility: hidden`; rotateY(0|180) animated with `transition={{ type: "spring", stiffness: 120, damping: 20 }}`.
- **Front face** (data sourced from existing `useSiteContent("hero", "main")` badge with sensible fallbacks):
  - Slot + portrait (existing portrait, grayscale + slight contrast — same as today)
  - `Gautham Biju` (display, bold mono)
  - Role line: `Engineer × MBA × Product Builder`
  - Location: `India · Kerala`
  - Identity chips row (4 small bordered tags): `Product`, `Strategy`, `Design`, `Technology`
  - Bottom: `ID · 0024` + barcode strip (kept from current design)
- **Back face** — compressed career passport. Header: `· JOURNEY  ·  STAMPED 2026`. Body: a vertical list of 5 entries, each a clickable row with a small left ink-stamp dot, label, sublabel, and year range:
  1. `IIT Gandhinagar` — Mechanical Engineering + Electrical Minor — `2018–2022`
  2. `Accenture` — IAM / Technology Internship — `2021`
  3. `Crayon Software Experts` — Marketplaces Internship — `2022`
  4. `IIM Indore` — MBA / Product, Strategy, Business — `2023–2025`
  5. `BNY Mellon` — Early Talent Analyst, Risk & Compliance — `2025–`
  Each row toggles `selectedId` (single-open). Active row gets a stamped background (`hsl(160 20% 16% / 0.06)`), bolder ink, and a small "● ACTIVE" mono tag. Clicking the same row collapses.
- A compact **detail tray** appears below the card (in the same column, not on the card) when a row is selected, showing: `Role / Context`, `What I worked on`, `Skills used`, `Key takeaway`. Animated open with `framer-motion` `height: auto + opacity` (250ms). Use placeholder copy structured for easy editing later.
- Data: define the 5 entries in `src/components/about/journeyData.ts` so the IdentityCard, detail tray, and globe can all import the same source. Each entry includes `{ id, label, subtitle, period, location: { lat, lng, name }, role, work, skills[], takeaway }`.

---

## 4. Globe — reuse existing `Globe.tsx`, react to selection

Keep `src/components/Globe.tsx` (the COBE-based dark globe) — it already matches the engineering aesthetic. Wrap it in `src/components/about/JourneyGlobe.tsx`:

- Accepts `selectedLocation?: { lat: number; lng: number; name: string }` and `journeyLocations: typeof journey`.
- Builds the `markers` array from all journey locations (size 0.05) plus the selected one at size 0.09 with brighter `markerColor`.
- When `selectedLocation` changes, smoothly rotate `phi`/`theta` toward the target. Achieve this by passing a controlled `phi`/`theta` target into `Globe` — small extension to `Globe.tsx`: accept optional `targetPhi`, `targetTheta`, and inside `onRender` lerp `state.phi` and `state.theta` toward those targets (`current += (target - current) * 0.05`). Default behavior (auto-rotate) is preserved when no target is provided.
- Add a small caption under the globe: mono label showing the selected location name + coordinates, with a tiny pulse ring SVG. When nothing is selected, show `IDLE · AUTO ROTATE`.
- Sizing: `w-full aspect-square max-w-[460px] mx-auto`. Wrap in a soft blueprint container (1px dashed border, faint grid background) so it reads as part of the drafting language. No competing labels or chrome.

---

## 5. Scroll motion refinements

The About section is no longer pinned/flipped, which already removes the worst of the jitter. Apply gentle, eased motion only:

- In `AboutSection.tsx`, use `useScroll({ target: sectionRef, offset: ["start end", "end start"] })` and pipe through `useSpring(progress, { stiffness: 60, damping: 20, mass: 0.6 })`.
- Drive only mild ranges on the wrapper: `opacity 0.92 → 1 → 1 → 0.92`, `y 24 → 0 → 0 → -24`, `scale 0.985 → 1 → 1 → 0.985`. No rotateX/rotateY on the wrapper.
- The IdentityCard's own hover tilt is independent (max ±2°).
- Honor `prefers-reduced-motion`: skip transforms entirely.

For the Hero pin in `HeroAboutFlip.tsx`: simplify pinHeight to `100vh` and remove the flip transform pipeline so the hero behaves like a normal sticky panel — eliminating the previous jitter source entirely.

---

## Out of scope

- Lanyard SVG / portal stage in `HeroIdBadge` (removed wholesale by step 2; file can stay in repo unused for now).
- Trailing station internals (Projects, Thinking, Skills, Writing, Contact).
- Admin content schema changes — IdentityCard reads existing badge fields and falls back to literals.
- Final journey copy — placeholder copy with the structure the user can edit later via `journeyData.ts`.

---

## Files touched

- `src/pages/Index.tsx` — drop journey, insert `<AboutSection />`.
- `src/components/HeroAboutFlip.tsx` — strip flip + portal badge, become a plain hero pin.
- `src/components/AssemblyHeader.tsx` — 8 → 7 nav.
- `src/components/AssemblyHeaderMobile.tsx` — 8 → 7 nav.
- `src/components/Globe.tsx` — optional `targetPhi`/`targetTheta` lerp.
- `src/components/AboutSection.tsx` — new two-column layout (overwrite existing file).
- `src/components/about/IdentityCard.tsx` — new.
- `src/components/about/JourneyGlobe.tsx` — new.
- `src/components/about/journeyData.ts` — new.

No DB / RLS changes.
