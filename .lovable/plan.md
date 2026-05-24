Plan

1. About spine stays narrow everywhere
- In `src/components/projects/ProjectSpine.tsx`, accept an optional `width` override (or a `narrow` variant) so the About spine renders at `BOOK_SPINE_W` (28) instead of `SPINE_WIDTH` (78).
- The shelf-resident About spine in `AboutToProjectsBridge.tsx` uses this narrow width.
- The hero filing animation already uses the same 28 width, so the visual width is identical from flight → landing → resting click target. No abrupt width change at any point.

2. Filing target = narrow shelf slot
- In `AboutToProjectsBridge.tsx`, the About landing slot becomes a 28-wide, full-height container at the start of the top shelf row.
- `__bridgeSlotRect` is published from this narrow slot, so the hero spine flies to and parks exactly on it.

3. Gradual placement, no final pop
- In `src/components/HeroIdBadge.tsx`, keep the single eased translate+shrink path to the slot.
- Remove the abrupt `settled` opacity flip: the hero card wrap fades smoothly across the final portion of `fileT` while the shelf About spine fades in over the same window, so the handoff is invisible.
- No extra "snap into place" action at the end.

4. Other project spines appear only after About is placed
- In `AboutToProjectsBridge.tsx`, shift the ARCHIVE window so all non-About project spines start rising only after the bridge filing is essentially complete (e.g. archive window starts at ~0.97 instead of 0.82, finishing just after).
- Shelf rules can still draw earlier so the shelves exist when the About spine lands.
- About spine itself becomes interactive at the end of filing, before/while the other projects rise.

5. Out of scope
- No changes to mobile.
- No changes to `HeroAboutFlip.tsx`, `AboutCardBack.tsx`, hero lanyard, globe, or unrelated sections.
- No backend/data changes.