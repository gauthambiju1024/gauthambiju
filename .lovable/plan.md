Plan

1. Make the shelf target deterministic
- In `src/components/AboutToProjectsBridge.tsx`, move the About spine slot to the start of the top shelf row instead of appending it after the project spines.
- This makes “MORE ABOUT ME” the first spine on the topmost shelf every time.

2. Publish a fixed top-shelf target
- Keep `aboutSlotRef`, but it will now represent that first top-shelf slot.
- Publish that slot rect as the filing target, not a later/dynamic project-relative position.
- The target will remain tied to the fixed top-shelf slot, so the hero spine does not chase shifting row/project layout.

3. Simplify the hero filing motion
- In `src/components/HeroIdBadge.tsx`, keep the target snapshot once when filing begins.
- Fly the spine in one straight eased movement to the fixed first top-shelf slot.
- Use the same easing for translate and shrink so it does not dip, rise, or disintegrate.

4. Preserve current scope
- No U-shaped filing motion.
- No width increase.
- Keep shelf spine height matching existing project spines.
- Keep mobile behavior unchanged.
- Do not touch `HeroAboutFlip.tsx`, `AboutCardBack.tsx`, or unrelated sections.