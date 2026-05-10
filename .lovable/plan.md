## Final ID Badge: woven lanyard + draggable ID card (admin-editable)

Replace the current looped-ribbon badge in the right column of `src/components/HeroSection.tsx` with the **two-strand woven lanyard + metal clip + draggable ID card** from the final reference, recolored to fit the dark walnut + dark-green-blueprint hero. Card text, ribbon text, and portrait all become admin-editable through the existing `site_content` system. About section is untouched.

### Visual anatomy

```text
   \                              /        ← two woven strands enter from
    \                            /            top of the right column,
     \  PORTFOLIO·2026   GAUTHAM·BIJU /      text running along each strand
      \                            /
       \                          /
        \____ [METAL CLIP] _____/           ← clip rotates to strand tangent
              ║ plastic strap ║
              ╔══════════════╗
              ║   ─ slot ─    ║              ← oval slot punched to dark mat
              ║               ║
              ║ ┌──────────┐  ║              ← rectangular photo (grayscale)
              ║ │  PHOTO   │  ║
              ║ └──────────┘  ║
              ║ GAUTHAM BIJU  ║              ← name (bold mono caps)
              ║ BUILDER · …   ║              ← title (mono, two lines OK)
              ║ - - - - - -   ║              ← dashed divider
              ║ ID · 0024 ▮▮▮ ║              ← id label + barcode
              ╚══════════════╝
```

### Behavior

1. **Draggable card** — Pointer Events (mouse + touch). On drag, the card translates with the cursor and the two SVG strand `<path>` elements + clip `transform` recompute every animation frame via `requestAnimationFrame` and direct DOM mutation (no React re-renders, matching the project's animation memory). On release, the card **springs back to rest** over ~500ms with `cubic-bezier(.22,1,.36,1)`. Drag clamped to ±140px so it stays inside the hero panel.
2. **Strands follow** — two cubic Bézier paths anchored at fixed top points (`x = 55%` left, `x = 75%` right, `y = 0`), end point = the card's center hole-slot rect. Control points come straight from the reference's math (`cp1Y = targetY * 0.2/0.3`, `cp2Y = targetY - 60/50`). Updated only during drag/spring.
3. **Clip rotation** — clip + plastic strap positioned at the slot, rotated to the average tangent of the two strands at the meeting point (`atan2((cp2L+cp2R)/2 → target)`).
4. **Ribbon text** — `<textPath>` along each invisible alignment path, set from admin-editable strings. **Not** click-to-edit (no `prompt()` in production); admins edit via the existing AdminContent UI.
5. **Idle sway** — small 1.5° rocking on mount for ~1.5s, then settles. Cursor `grab`/`grabbing`.

### Visual rules (consistent with site palette)

1. **Lanyard fabric** — replace the reference's bright kelly green woven `<pattern>` with a **muted forest weave** matching the blueprint:
   - Front pattern base `hsl(140 30% 28%)`, threads `hsl(140 35% 38%)` + `hsl(140 25% 18%)`, hairlines at low alpha.
   - Back pattern base `hsl(140 28% 18%)`, threads `hsl(140 30% 22%)` + `hsl(140 20% 12%)`.
   - Stroke width 22, `stroke-linecap="round"`, `feDropShadow` softened to `hsl(160 30% 4% / 0.5)`.
   - Stitched-edge overlay: `stroke-dasharray="2 4"` at 30% opacity (no bright noise).
2. **Strand text** — `font-mono` (JetBrains Mono), 11px, letter-spacing 0.25em, fill `hsl(40 30% 88% / 0.85)` (front) / `hsl(40 30% 88% / 0.55)` (back).
3. **Metal clip** — 24×30 with `linear-gradient(135deg, hsl(0 0% 96%), hsl(0 0% 70%) 50%, hsl(0 0% 44%))`, inset highlight + shadow, dark slot at the bottom. Plastic strap 16×35 frosted gradient, snap dot radial. Filter `drop-shadow(3px 8px 6px hsl(160 30% 4% / 0.5))`.
4. **ID card body** — **cream paper** (not white): `hsl(40 25% 92%)`, border-radius 4, padding `16px 16px 20px`, multi-layer shadow `0 25px 50px hsl(160 30% 4% / 0.45), inset 0 0 0 1px hsl(0 0% 100% / 0.5)`. Rest rotation `8deg` (mirrors reference). Width 240px.
5. **Hole slot** — 45×8 oval at top:10, fill `hsl(160 30% 6%)` (matches the dark hero mat) with inset shadow + thin highlight line so it reads as cut through.
6. **Photo** — full-width × 160px **rectangular** window (per reference, not circular), uses existing `portraitSrc`, `filter: grayscale(1) contrast(1.2)`, inset 1px border. Margin-top 18 (clears the slot), margin-bottom 16.
7. **Name** — `font-mono` weight 700, 13px, letter-spacing 1.5px, `hsl(160 20% 16%)`, left-aligned. Title `font-mono` 9px, letter-spacing 1px, `hsl(160 15% 30% / 0.75)`, line-height 1.5, allows `<br>` for two lines.
8. **Divider** — full width, `1px dashed hsl(160 20% 16% / 0.25)`, margin `16px 0 12px`.
9. **Footer** — flex justify-between: `ID · 0024` left (mono 9px, `hsl(160 20% 16% / 0.7)`); 45×12 barcode right via `repeating-linear-gradient` in `hsl(160 20% 16%)` over the cream background, opacity 0.8.
10. **Mat shadow** — keep the existing radial shadow under the card's **rest position** so the desk metaphor holds; it stays anchored when the card is dragged (card lifts off the desk).

### Admin-editable content

Extend the existing `useSiteContent('hero', 'main')` payload (already has `portrait`) without breaking other fields. New shape:

```ts
{
  name?: string;          // existing
  tagline?: string;       // existing
  location?: string;      // existing
  portrait?: string;      // existing
  badge?: {
    name?: string;        // default "GAUTHAM BIJU"
    title?: string;       // default "BUILDER · THINKER · MAKER"
    idLabel?: string;     // default "ID · 0024"
    ribbonLeft?: string;  // default "GAUTHAM BIJU"
    ribbonRight?: string; // default "PORTFOLIO · 2026"
  };
}
```

- HeroSection reads `hero.badge?.*` with fallbacks to the defaults above.
- **AdminContent** (`src/pages/admin/AdminContent.tsx`) — when editing the `hero / main` row, the existing JSON editor already lets admins add these keys. Add a small inline hint listing the supported `badge` fields so admins know what to fill in. No schema migration needed (already `Json`).
- **Portrait** keeps using the existing `ImageUpload` flow via the `portrait` field — no change.

### Files

- `src/components/HeroSection.tsx` — replace the right-column `motion.div` block (~lines 110–230) with the new interactive lanyard + card (~180 lines). Add `useRef`s, pointer handlers, rAF `updateLanyard()`, `<defs>` with two woven `<pattern>` blocks + shadow filter. Read `hero.badge?.*` with defaults.
- `src/pages/admin/AdminContent.tsx` — add a one-line helper note next to the `hero / main` editor describing the optional `badge` keys (`name`, `title`, `idLabel`, `ribbonLeft`, `ribbonRight`). No structural changes.

No DB migration. No new fonts. No new tokens. About section untouched.
