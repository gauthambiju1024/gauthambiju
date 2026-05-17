## Plan

Fix the animation sequence so it behaves like a real folded card:

```text
Step 1: About card visible
[ cream left ][ cream center ][ cream right ]

Step 2: both 25% flaps fold inward onto the front
[        solid cream folded packet        ]

Step 3: the entire folded packet flips
[        full green ABOUT ME spine        ]
```

### What is wrong now

The center strip starts revealing the green spine while the side flaps are still folding. That creates the broken half-and-half state shown in your screenshots: one side still looks like the About card while the other side already looks like the spine.

### What I will change

1. **Fold phase: only fold the flaps**
   - Left 25% flap folds inward onto the center.
   - Right 25% flap folds inward onto the center.
   - During this phase, the visible folded packet stays one consistent cream/About-card color.
   - No green spine is allowed to appear during this phase.

2. **Flip phase: flip the whole folded packet together**
   - After the flaps are fully folded, the entire folded packet rotates as one object.
   - The green `ProjectSpine` appears only after this full packet flip begins/passes 90 degrees.
   - Final result is a full green spine, not half spine / half card.

3. **Keep the layout exactly as requested**
   - Preserve the current 25/50/25 proportions.
   - Preserve the card size, shelf timing, bridge path, shrink, and final shelf handoff.
   - Only change the trifold choreography and face visibility.

### Technical implementation

- Update `src/components/HeroIdBadge.tsx` only.
- Stop rotating only the center strip into the spine.
- Add/use a single folded-packet transform layer so the completed folded packet flips as one unit.
- Keep the front folded state cream/opaque.
- Put the green `ProjectSpine` on the back face of the full folded packet, not only the center strip.
- Ensure both side flaps use inward hinge directions and correct `z-index`/`translateZ` so they land visually on top of the center during the fold.

### Validation

- Mid-fold: both flaps move inward toward the center.
- End of fold: the whole visible packet is one cream color.
- During flip: the packet turns as a single solid object.
- Final state: only the complete green ABOUT ME spine is visible, with no cream strip and no half-spine state.