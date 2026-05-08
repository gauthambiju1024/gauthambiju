

## Replace the portrait block with a tilted ID badge on a lanyard, lying on the desk mat

Right now the right side of the hero shows a clean technical "Profile" portrait inside corner brackets with dimension labels. Swap it for a small **employee ID card** with the user's photo, hanging from a fabric **ribbon/lanyard**, casually resting on the blueprint mat at a slight rotation — like someone tossed it on the desk.

### Visual target

```text
       ╲                ╱
        ╲   ribbon     ╱
         ╲            ╱
          ╲▄▄▄▄▄▄▄▄▄▄╱      ← metal clip + hole
          │ ┌──────┐ │
          │ │ photo│ │      ← portrait in card window
          │ └──────┘ │
          │ NAME     │
          │ role     │      ← typographic ID details
          │ ─ ─ ─ ─  │
          │ ID 0024  │
          └──────────┘
            (slight tilt, soft shadow on mat)
```

The whole assembly is rotated `~ -6°` so it feels dropped, not staged. A faint diffuse drop-shadow under the card sells the "lying on the mat" feel.

### Anatomy of the badge

1. **Ribbon / lanyard** — two thin strips of fabric forming a V that meets at the top of the card.
   - Width: 14px each strip.
   - Color: a muted accent that lives in the existing palette — `hsl(40 30% 70%)` (warm linen, matches `hsl(40 30% 85%)` text). 
   - Inner hairline stitch detail: a 1px lighter line down the middle (`hsl(40 30% 78%)`) to suggest weave.
   - Optional tiny "GB" or hash mark printed in mono on one strap (8px, near the top), reinforcing the technical/blueprint tone.

2. **Metal clip + grommet**
   - A small rounded rectangle clip (8×16, `hsl(0 0% 70%)`) bridging the two ribbon ends to the card's top edge.
   - A circular hole (4px) punched through the top center of the card.

3. **Card body**
   - ~190px wide × ~250px tall (responsive: `clamp(160px, 14vw, 200px)`).
   - Background `hsl(40 25% 92%)` (cream paper, like other Builder's Desk surfaces).
   - 1px hairline border `hsl(160 15% 30% / 0.25)`.
   - Inner padding ~10px.
   - Rounded corners 4px.

4. **Photo window**
   - The existing `portraitSrc` image, fit into a square window (~140×140) centered near the top of the card.
   - Subtle inner shadow + 1px frame line in `hsl(160 20% 16% / 0.3)`.
   - Slight desaturation (`grayscale(0.4) contrast(1.05)`) to feel like a printed ID photo.

5. **Card text (mono, technical)**
   - Name: `hero?.name ?? "Gautham Biju"` — uppercase, 11px, tracking 0.15em, color `hsl(160 20% 16%)`.
   - Role line: `Builder · Thinker · Maker` — 8px, tracking 0.25em, muted `hsl(160 15% 30% / 0.7)`.
   - Thin dashed divider (matches existing dashed-border idiom).
   - `ID · 0024` and a tiny barcode-strip (just 8 vertical bars of varying width, decorative) at the bottom — selling the "credential" concept while staying in the design system.

6. **Shadow on the mat**
   - A soft, slightly offset elliptical shadow under the lower half of the card: `box-shadow: 4px 8px 24px hsl(160 30% 5% / 0.4)`.
   - Ribbon casts a fainter shadow too (achieved via `filter: drop-shadow(...)` on the wrapper SVG/group).

### Motion

- Initial mount: ribbon "drops" — small `rotate: -10° → -6°` and `y: -8 → 0` over 700ms with a gentle ease-out.
- On hover (desktop only): the badge tilts back to `-3°` and lifts 2px with a 200ms transition, like nudging a card on the desk. No constant looping motion — this is a still object.
- Respects `prefers-reduced-motion`: drop-in disabled, shows static at `-6°`.

### Layout integration

- Replaces the entire `Right — Portrait` block (lines 111–150 of `src/components/HeroSection.tsx`).
- The right column keeps the same flex slot and width footprint so the headline column stays unchanged.
- Removes the "— Profile —", corner brackets, "2E00" right-side dimension line, "160 PX" bottom dimension line, and "Builder · Thinker · Maker" caption — all of that information now lives *on the card itself*, which is more cohesive.

### Implementation notes (technical)

- Build the ribbon + clip with inline SVG (single `<svg>` overlaying the card top, ~80px tall), so the angles and the V-meeting-point at the clip are pixel-perfect across sizes. The card body remains a normal flex `<div>` so text/image layout stays accessible.
- Tilt the entire assembly with a parent wrapper: `style={{ transform: 'rotate(-6deg)' }}`, motion handled via framer-motion `initial`/`animate`.
- Mat shadow as a sibling `::before` pseudo OR a `<div>` with `filter: blur(12px)` and offset.
- All colors via existing tokens / inline HSL matching the rest of the file (no new design tokens needed).
- No new dependencies. No image generation needed — reuses `portraitSrc`.

### Files

- `src/components/HeroSection.tsx` — replace the Right column portrait block (lines 111–150) with the new `IDBadge` markup. Keep imports of `motion` and `portraitSrc` as-is.

### Out of scope

- No changes to the headline column, CTAs, top bar, or tagline pill.
- No changes to other panels, the assembly header, or the console rail.
- No new files unless the badge grows beyond ~80 lines, in which case it can be extracted to `src/components/hero/IDBadge.tsx` — but starting inline keeps the diff small.

