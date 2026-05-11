# Plan: Hero fade, ribbon follows the card, wider card with distinct back content

## 1. Hero panel disappears during the flip

In `src/components/HeroAboutFlip.tsx`, restore the full fade:

- `heroFade = useTransform(scrollYProgress, [0.30, 0.55], [1, 0])` (was `[1, 0.85]`).
- Apply to the `#home` motion.div opacity exactly like the earlier version.

By 0.55 (when the card starts flipping), the dark blueprint is gone and the card is the focal element on the desk background.

## 2. Ribbon (lanyard) follows the card to center

Currently in `HeroIdBadge.tsx` the lanyard fades out during phase 1 (`lanyardLayerRef.opacity = 1 - p1`). Change so the lanyard travels with the card and only fades during the flip:

- Remove the `lanyardLayer.opacity = 1 - p1` line.
- Move the lanyard layer with the card by translating `lanyardLayerRef` by `(dxToCenter, dyToCenter)` so its anchor points (top of straps) shift toward the center along with the card. This keeps the straps visually attached to the slot.
- Cross-fade the lanyard out only during phase 2 (the flip): `lanyardLayer.opacity = 1 - p2` so the straps recede as the card rotates and reveals the back. By 0.80 they're gone, matching the back fully facing the viewer.
- The existing `updateLanyard()` call already redraws the bezier each frame to terminate at the slot's current screen position, which now includes the card's translation — so the straps stay attached to the moving card.

Edge case: when the lanyard layer translates, the strap anchor points at the top of the stage (`syL = -8`) move with it. That would visually pull the straps off the top of the screen. To keep the straps anchored to the top of the hero panel while still ending at the moving slot, instead of translating the whole `lanyardLayerRef`, leave the SVG fixed and rely on `updateLanyard()` (which already uses the slot's live screen position) to re-draw the curve from the fixed top anchors to the moving slot. The straps will naturally stretch and curve toward the center as the card travels. Only the metal clip (`clipRef`) — which sits at the slot — needs no extra work; it already follows.

So the actual change is simpler:
- Keep the lanyard SVG layer un-translated.
- Drop the `1 - p1` fade; replace with `1 - p2` so straps stay visible (and stretch) through the slide and only fade during the flip.
- `updateLanyard()` already updates the bezier to the slot's current position every frame, producing the "ribbon follows the card" effect for free.

## 3. Wider ID card + mutually exclusive back content

### Wider card

In `HeroIdBadge.tsx`:

- Card front + back width: `200` → `260` (slightly more horizontal real estate).
- Front portrait area stays roughly square-ish: keep `height: 130` or bump to `150` to maintain proportion.
- Front layout otherwise unchanged.
- Resting `right: 32` stays; the slightly wider card shifts left visually but that's fine.
- Update the per-frame `restingLeft = stageRect.width - 32 - w` already uses `card.offsetWidth`, so no math change needed.

### Back content — distinct from hero/front

The hero front already shows: name, title (BUILDER · THINKER · MAKER), portrait, ID label. The back should NOT repeat name/title. Replace with content the front doesn't carry.

New back layout (top → bottom inside a 260px card):

- Header row: `· REVERSE` (mono small, left) / `02 / 08` (mono small, right) — signals this is "the other side."
- A short positioning statement (1 sentence, ~14 words). Pulled from `hero.back.statement` with a default like: *"I build product systems where AI, business strategy, and human-centered design converge."*
- Three labelled rows ("Stat sheet" feel), each `LABEL` (mono 7.5px, muted) + value (slightly larger):
  - `FOCUS` → "Product · AI workflows · UX strategy"
  - `BASED IN` → "Calicut, IN · Remote-friendly"
  - `WORKING ON` → short freeform line (e.g. "AI-first portfolio tools, agentic ops")
- Divider.
- Footer row: small contact (`gauthambiju.com`) on left, tiny mono `· END` on right. No name, no role title — those are the front.

Data source: extend the `HeroBack` type in `HeroIdBadge.tsx`:

```
type HeroBack = {
  statement?: string;
  focus?: string;
  basedIn?: string;
  workingOn?: string;
  contact?: string;
};
```

All fields have sensible defaults so the card looks complete before the admin fills them in.

## Files to edit

- `src/components/HeroAboutFlip.tsx` — restore `heroFade` to `[1, 0]`.
- `src/components/HeroIdBadge.tsx` — widen card (front + back) to 260, replace lanyard fade trigger from `p1` to `p2`, replace back-face content with the non-overlapping fields above.

## Acceptance

- Scrolling: hero blueprint fades fully to transparent by ~55% scroll progress.
- The card slides to center with the ribbon visibly stretching to follow it (not fading early).
- Ribbon fades only while the card is flipping.
- Card is wider; back face has no repeated info from the front (no name, no portrait, no "BUILDER · THINKER · MAKER"), only complementary "stat sheet" content.
