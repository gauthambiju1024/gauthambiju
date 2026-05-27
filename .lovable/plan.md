You’re right: the handoff is currently happening too late.

## What the actual issue is

The spine already looks correct at the stage shown in your screenshot. But the current code waits until `closeT > 0.995`, meaning it forces the book to keep closing past the point where the visual spine is already usable. That extra closing segment is where the bad frame/visual jump is being introduced.

## Files involved

- `src/components/HeroIdBadge.tsx` — owns the card/book/spine handoff and flight.
- `src/components/AboutToProjectsBridge.tsx` — owns the shelf slot and final shelf spine reveal.

## Do I know what the issue is?

Yes. The handoff threshold is wrong, and the source rect should be captured from the visible spine at the screenshot stage before hiding the original.

## Plan

1. **Move the handoff earlier**
   - Replace the current near-complete-close handoff:
     ```ts
     closeT > 0.995
     ```
   - with an earlier threshold matching your screenshot stage, around:
     ```ts
     closeT >= 0.72
     ```
   - This means no further close animation after the spine visually reaches that clean vertical state.

2. **Capture the visible spine before hiding anything**
   - While the original 3D spine is still visible, read `spineSkinRef.getBoundingClientRect()`.
   - Use that rect as the detached flight spine’s exact starting box.
   - Only after the flight spine is positioned and fully opaque, hide the original card/book wrapper.

3. **Keep the detached spine stationary until flight starts**
   - From handoff threshold to `flyT`, the detached spine remains exactly where the screenshot shows it.
   - When `flyT` begins, it moves from that captured rect to the shelf slot.

4. **Remove the formula-based source position for the handoff**
   - The current fallback math guesses the spine position from card width/scale.
   - I’ll use the actual rendered rect first, and only keep fallback math as emergency backup.

5. **Keep shelf reveal at the end only**
   - The shelf About spine stays hidden until the flight spine is nearly landed.
   - This prevents the double-spine ghost while the flight is happening.

6. **Verify visually**
   - Scroll through the exact transition area in the browser.
   - Check that there is one spine at the screenshot stage, no further close movement, then clean flight to shelf.

<presentation-actions>
  <presentation-open-history>View History</presentation-open-history>
</presentation-actions>

<presentation-actions>
<presentation-link url="https://docs.lovable.dev/tips-tricks/troubleshooting">Troubleshooting docs</presentation-link>
</presentation-actions>