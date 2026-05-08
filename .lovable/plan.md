## Replace straps with a complete looped lanyard

### What changes

Right now the lanyard is just two short straps that meet at the clip — it looks like a triangle attached to the card. The reference image shows a **full closed ribbon loop** in green that drapes off to one side, with the clip at the bottom of the loop.

Update the SVG block in `src/components/HeroSection.tsx` (lines 137–154) so the lanyard reads as one continuous looped ribbon resting on the mat.

### Visual target

```text
        ___________
       /           \___
      /                \___
     /                     \___
    |                          \___      ← loop drapes
     \                         ___/         to the right,
      \                    ___/             casually slack
       \               ___/
        \    [clip]___/
         \   /
       ___\_/___
      |  hole   |
      |         |
      |  PHOTO  |
      |_________|
```

### Anatomy

1. **Closed ribbon loop** — single continuous SVG `<path>` forming an asymmetric oval/teardrop loop above the clip. Uses two roughly parallel curves (outer + inner edge of the ribbon) with the same green tone as the reference, but tuned to our palette (`hsl(140 35% 38%)` body, `hsl(140 40% 48%)` highlight edge, `hsl(140 30% 28%)` shadow edge). Width ~10px to read as fabric.
2. **Asymmetric drape** — loop is taller on the right and bulges outward (right side ~140% of left), suggesting the ribbon is slack and falling naturally, like the photo. Slight twist near the top where the ribbon would fold on itself (small overlapping path with darker green).
3. **Clip stays** — the existing plastic clip (lines 152–153) remains where the loop meets the card; both ends of the loop tuck into it.
4. **Drop shadow** — soft shadow under the loop only (offset down-right ~3px, blur 4px) so it sits on the mat, not floating.
5. **SVG canvas** — viewBox grows to `0 0 240 140` (taller + wider on the right) so the loop has room. `marginBottom: -6` stays so the clip kisses the card.

### Color note

The reference is bright kelly green; we'll use a **muted forest green** that fits the dark-walnut + dark-green-blueprint palette already in the hero. No bright saturated greens.

### Motion / layout

No changes to motion, hover, card body, hole, photo, or text. Card width and tilt unchanged. Only the lanyard SVG markup is rewritten.

### Files

- `src/components/HeroSection.tsx` — replace the `<svg>` block at lines 137–154 with the new looped-ribbon SVG (~25 lines).
