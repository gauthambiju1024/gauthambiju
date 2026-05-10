## Fix card clipping + visible ribbon text

### Issue 1 — Card clipped at panel edge

The hero panel (`BlueprintFrame`) wraps the section in `overflow-hidden`, so when the ID card sits/drags past the right edge of the dark green mat it gets cut off. Reference image 2 shows the card hanging fully outside the mat.

**Fix:** In `src/components/desk/frames/BlueprintFrame.tsx`, switch the outer wrapper from `overflow-hidden` to `overflow-visible` (keep `rounded-lg` for the surface; the inner `.stage-fit` container already manages its own bounds). The blueprint background itself stays clipped via the `.blueprint-surface` background, but children (the lanyard + card overlay) can now extend outside the panel — matching the reference where the badge floats over the desk margin.

If allowing all hero children to escape causes layout bleed, we’ll instead keep the frame `overflow-hidden` and lift only the badge overlay out of `HeroSection` into a portal/sibling rendered by `DeskStage` on top of the frame. Default approach: simple `overflow-visible` flip, since `DeskStage` already clips the desk viewport.

### Issue 2 — Ribbon text not legible

The two `<textPath>` strings (`badge.ribbonLeft`, `badge.ribbonRight`) are already rendered along the lanyard but are too dim and the strings repeat only once, so the ribbon reads as plain green. Reference image 2 shows continuous repeating white text along both straps.

**Fix in `src/components/HeroSection.tsx` (lanyard SVG block, ~lines 287–295):**
- Repeat each label several times (e.g. `${label} · ${label} · ${label} · ${label}`) so text fills the curve.
- Bump fill to `hsl(40 30% 96%)` opacity `0.95` (left) / `0.7` (right-back strap).
- Increase `fontSize` to `12`, `letterSpacing` to `4`, `fontWeight="800"`.
- Add `textLength` based on the path length (computed in the same effect that sets `d` on `textPathLeftRef` / `textPathRightRef`) so the text stretches end-to-end, OR simply rely on repetition + `startOffset="0%"`.
- Keep admin-editable `ribbonLeft` / `ribbonRight` fields untouched (still drive the text content).

### Files touched
- `src/components/desk/frames/BlueprintFrame.tsx` — overflow flip
- `src/components/HeroSection.tsx` — ribbon text styling + repetition

No backend or schema changes.