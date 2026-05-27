I’ll make one surgical fix in `src/components/HeroIdBadge.tsx` only.

Plan:
1. Keep the current transition timing, path, shelf landing, and shelf fade behavior unchanged.
2. Restore the persistent visible spine during the close/shrink phase so there is no blank/disappear frame before flight.
3. Preserve the real 3D book spine while the book is rotating/closing by keeping `spineSkinRef` visible through that phase.
4. Make the external `flyingSpineRef` visible from the bridge start again, but layer it behind/under the 3D spine until launch so it does not flatten the book visually.
5. At flight start, cleanly hand off from the 3D book spine to the flying spine using the same deterministic coordinates already used by the “perfect” transition.
6. Do not touch `AboutToProjectsBridge.tsx`, shelf timing, project shelf animation, scroll ranges, or layout.