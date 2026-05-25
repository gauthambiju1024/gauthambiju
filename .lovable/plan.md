## Final plan — one real spine, no portal duplicate

### Answer to your question
You're right. There is no good reason to keep two spines. The portal "flying spine" exists only because earlier code needed a free-flying element outside the card's 3D context. We can drop it entirely and use the **real `closedSpineRef` spine** as the one and only About spine through every phase.

### What changes

**File:** `src/components/HeroIdBadge.tsx`

1. **Delete the portal flying spine** (`flyingSpineRef` div + its per-frame block). No second renderer anywhere.

2. **Restore the original home → about flip** exactly as it was before the recent edits:
   - slide-to-center, scale, rotateY flip, lanyard fade, globe fade-in, book close — all reverted to the previous good timing
   - `spineSkinRef` (perpendicular plane) re-enabled so the closing book reads as real 3D
   - `closedSpineRef` re-enabled so the hinge-side spine face is visible during close
   - no opacity:0 / visibility:hidden hacks on these refs

3. **Promote `closedSpineRef` to the single continuous About spine.**
   - It is the visible side spine while the book closes (real 3D, attached to the card).
   - When filing begins, instead of spawning a new element, we **detach `closedSpineRef` visually** by switching its positioning from `absolute` inside the rotating book to `fixed` in viewport coordinates, seeded with its current `getBoundingClientRect()` at that exact frame. Same DOM node, same artwork, same size — just a coordinate-space swap with zero visual delta.
   - The bezier filing arc + damped settle then drive that same node into the shelf slot.
   - After landing, the same node stays put as the clickable About spine.

4. **Card wrap hides cleanly** once the spine has detached, so the empty book frame doesn't linger behind the flying spine.

5. **Shelf side (`AboutToProjectsBridge.tsx`)** — unchanged role:
   - keeps publishing `__bridgeSlotRect` as the geometry target
   - its own About spine stays hidden (no duplicate renderer)

### Why this fixes both complaints
- **Home → about transition** is restored because we revert to the previous flip behavior and stop hiding the real 3D spine refs.
- **Spine looks 3D and consistent** because the visible spine during close is the actual perpendicular `spineSkinRef` + `closedSpineRef` geometry inside the book's preserve-3d context.
- **No appear/disappear/reappear** because there is literally one DOM node playing the spine role from first reveal through final landing.
- **No crossfade, no size jump, no position pop** because the handoff is a same-node coordinate-space swap seeded from the live rect.

### Technical details
- Replace the absolute→fixed swap with a single ref that toggles a `data-filing` flag at the frame where `fileRaw > 0`.
- On that flag, set `position: fixed`, capture `rect = closedSpineRef.getBoundingClientRect()`, and from then on write `transform: translate3d(x, y, 0)` in viewport space along the existing bezier.
- Keep size at 28×200 throughout. No scale, no rotate after detach.
- On landing (`fileT >= 1`), pin to `__bridgeSlotRect`, enable pointer-events, wire click → `open-about-popup`.

### Acceptance criteria
- Home → about flip matches the earlier good version.
- Side spine looks like a real 3D book edge during close.
- Exactly one About spine exists on screen at all times.
- No crossfade, no jump, no size change at any handoff.
- Lands in shelf slot and remains clickable.