Plan:
1. Change only `src/components/HeroIdBadge.tsx`.
2. Make `flyingSpineRef` the single persistent about spine for the whole handoff:
   - During the end of the book close, it sits exactly on the book spine and keeps the current 3D-looking about-book appearance.
   - During flight, the same DOM element moves to the shelf slot.
3. Remove the “two different spines” swap behavior:
   - Stop fading/hiding the book spine before the persistent spine is already visible.
   - Do not create a separate visual identity for flight.
4. Keep the beginning 3D look, but remove extra artificial depth during travel:
   - Use the current about-book spine skin at the start.
   - As it flies, keep the same `ProjectSpine` face and subtle highlight only, so it does not become a different object.
5. Remove the blank frame by overlapping visibility:
   - The persistent spine becomes visible before the original spine hides.
   - It stays fully visible until the shelf spine is visible, then hides after landing.
6. Do not touch `AboutToProjectsBridge.tsx`, shelf layout, scroll timing, project shelf animation, or any other section.