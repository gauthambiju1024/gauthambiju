I’ll fix the filing sequence as one continuous hand-off, not a card-to-book pop.

Plan:
1. Keep the hero item narrow from the close beat through landing
   - Remove the remaining full-card geometry from the visible filing phase.
   - Make the visible object during filing a 28px-wide spine only, matching the shelf slot.
   - Keep the About/front/back card faces hidden once the book starts closing so no large face or mirrored card can bleed through.

2. Align the flying spine exactly to the shelf slot
   - Calculate the flying transform from the spine’s actual center, not the old card center.
   - Use the same width/height target as the shelf About slot so it does not resize abruptly after landing.
   - Fade the flying spine into the shelf spine only at the final overlap, making the transfer invisible.

3. Make project spines appear only after About has visually settled
   - Delay and soften the other project spine rise-in so they start after the About spine is already placed.
   - Replace the current compressed end-window timing with a slightly longer, smoother stagger so it feels gradual rather than sudden.

4. Keep scope tight
   - Only touch the hero badge filing animation and projects bridge shelf timing.
   - No changes to content, routes, mobile behavior, popups, or other sections.