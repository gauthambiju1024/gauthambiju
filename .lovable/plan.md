# Plan: Fix "nothing is visible" — decouple hero fade from card visibility

## Cause

`HeroIdBadge` portals the card/lanyard to `<body>` and uses a per-frame loop that walks the `#home` element's parent chain multiplying opacities, then applies that to the stage. When `heroFade` drops `#home` to opacity 0, the card stage also goes to 0 — so the hero, the card, and the ribbon all disappear together.

## Fix

Apply `heroFade` to an inner wrapper that does NOT contain the `id="home"` anchor.

### `src/components/HeroAboutFlip.tsx`

Move `id="home"` onto the always-opaque outer container; put `heroFade` only on the inner BlueprintFrame wrapper.

```
<div id="home" className="absolute inset-0">
  <motion.div className="absolute inset-0" style={{ opacity: heroFade }}>
    <BlueprintFrame t={tDummy} active={true}>
      <HeroSection />
    </BlueprintFrame>
  </motion.div>
</div>
```

Now:
- The `#home` anchor stays at opacity 1, so the card stage stays at opacity 1.
- The blueprint visuals still fade to 0 between 0.30 → 0.55 as desired.
- The card + lanyard remain fully visible across the entire flip.

## Files

- `src/components/HeroAboutFlip.tsx` only.

## Acceptance

- After the hero fades out, the ID card and ribbon are still clearly visible centered on the dark desk, then flip to reveal the back. No empty dark screen.
