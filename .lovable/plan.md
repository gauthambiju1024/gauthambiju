## Goal
Restore the transition so the About card itself becomes the shelf spine:

- About content is visible during the About state.
- The portrait/front face never reappears during the turn.
- The green folded spine is not replaced by a yellow placeholder.
- No crossfade, no fade-to-placeholder, no visual swap.

## Current problems to fix

1. The code clips the whole card/back face during fold, which can leave the About face looking blank instead of physically folded.
2. `rotYFlip = p2 * 180 + tTurn * 180` rotates the whole card from 180° to 360°, so the portrait/front face becomes visible again during the turn.
3. `cardWrap.style.opacity = 1 - tHide` hides the real folded card, while `aboutSlotRef` fades in a separate `ProjectSpine`; that is the replacement/crossfade the choreography should not have.
4. `ABOUT_SPINE_DATA` is brown/yellow, so the landing spine reads as a different object instead of the folded green spine.

## Implementation plan

### 1. Keep hero → about exactly as-is
Do not change the first transition windows:

```text
0.35–0.55  card slides/scales to center
0.55–0.72  card flips to About back face
```

Only rebuild the `0.72–1.00` About → Projects choreography.

### 2. Stop rotating the whole card back to the portrait
In `HeroIdBadge.tsx`, keep the wrapper card rotation capped at the About-facing side:

```text
card wrapper rotateY = p2 * 180
```

Remove the extra `+ tTurn * 180` from the wrapper. The TURN phase will happen inside the folded center spine, not by rotating the entire ID card back to its portrait face.

### 3. Replace overlay folding with a real segmented card surface
Rework the back face into three physical strips:

```text
[left third] [center spine third] [right third]
```

Each strip carries/clips the actual About-card surface, so at fold start it still looks like one intact About card. During FOLD:

- left strip folds behind around its right edge
- right strip folds behind around its left edge
- center strip remains in place
- hidden backfaces prevent About text/portrait from leaking through

This removes the current “transparent wing overlay + global clip” model that makes the card look blank or fake.

### 4. Make the center strip itself become the green spine
Put the green `ProjectSpine` face on the back side of the center strip and rotate only that center strip during TURN.

Result:

```text
About face visible → card folds → center strip turns → green ABOUT spine visible
```

The portrait face is never part of this second turn.

### 5. Remove all replacement/fade behavior
In `HeroIdBadge.tsx`:

- remove `tHide`
- do not fade `cardWrap` out after filing
- keep the real folded card visible as the final shelf spine

In `AboutToProjectsBridge.tsx`:

- keep the About slot as an invisible layout/target only
- never fade in the slot placeholder spine
- continue publishing `__bridgeSlotRect` so the real folded card can fly into that reserved slot

### 6. Make the landing dimensions match the shelf
Update FILE scaling so the folded center strip lands as `SPINE_WIDTH × SPINE_HEIGHT`, using independent X/Y scale if needed. The visible folded spine should align with the reserved shelf slot instead of being replaced by another element.

### 7. Keep the spine green
Change the About spine color used by the moving card from the current brown/yellow tone to the existing green spine tone, so it reads as the same folded object throughout the choreography.

## Expected choreography after the fix

```text
FOLD   0.04–0.40  actual About card folds into a narrow center strip
TURN   0.24–0.56  center strip flips internally into the green ABOUT spine
COLL   0.30–0.60  shelf rule strokes outward behind it
FILE   0.58–0.86  that same green folded spine flies into the shelf slot
ARCH   0.74–1.00  project spines rise around it
```

No crossfade. No yellow replacement. No portrait flash. The same card becomes the spine and lands in the shelf.