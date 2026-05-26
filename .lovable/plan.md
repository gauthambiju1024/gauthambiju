## I understand the issue

The current frames show this failure:

1. Spine is visible.
2. Spine starts moving.
3. Spine disappears completely, leaving only a thin center line / empty background.
4. Shelf appears later.

That is not the transition you want. You want the **same visible spine** to stay continuously present: shrink from the about/book spine, then fly, then land into the shelf slot without disappearing, popping, crossfading, or reappearing.

## Actual cause

The current code still relies on multiple visual owners:

- `spineSkinRef` inside the 3D book
- `flyingSpineRef` as a separate absolute element
- `aboutSpineRef` on the shelf
- shelf rules and shelf opacity appearing on their own timing

Even after syncing `closeT` and `flyT`, the flying spine can still fail because its start target is only captured **after** the book wrapper is hidden. If the measured 3D `spineSkinRef` rect is edge-on / zero-ish / unstable at that exact frame, the flying spine never gets a valid full visual state. That creates the blank frame you attached.

## Fix to implement

### 1. Make the flying spine the single persistent visual owner during the whole bridge

In `src/components/HeroIdBadge.tsx`, change the handoff logic so:

- `flyingSpineRef` becomes visible as soon as the bridge begins, not only after `closeT >= 1`.
- While `closeT` is running, it is positioned directly on top of the in-book spine and follows the shrink.
- Once `closeT` reaches 1, the same `flyingSpineRef` starts the shelf flight from that exact position.
- `spineSkinRef` can be hidden once the persistent spine takes over, so there is no double-image or crossfade.

This removes the fragile “hide book, then reveal another element” moment entirely.

### 2. Use stable geometry instead of measuring an edge-on 3D element at the worst frame

Do not depend on `spineSkinRef.getBoundingClientRect()` at the handoff frame.

Instead compute a deterministic start rect from known values already in the animation:

- card wrapper center position
- card scale
- `BOOK_SPINE_W`
- `SPINE_HEIGHT`
- current bridge/shrink progress

This guarantees the flying spine always has a valid visible position and size.

### 3. Keep the spine visible until the shelf slot is already visible

In `src/components/AboutToProjectsBridge.tsx`, adjust shelf/About-spine timing so:

- the shelf About spine appears **before or exactly as** the flying spine fades out
- the flying spine does not fade out until the shelf About spine is present
- no frame has both opacity paths at 0

### 4. Remove the “thin line only” failure mode

The vertical line in the third attached frame means the project shelf rule/slot line is showing while the spine is gone. The fix will ensure:

- the spine opacity remains `1` through the mid-flight
- shelf rules may draw, but never replace the spine visually
- only after landing does the flying spine yield to the shelf spine

## Expected result

The sequence becomes:

```text
book/about spine visible
→ same spine narrows/shrinks elegantly
→ same spine flies toward shelf
→ same spine lands in first shelf slot
→ shelf version takes over only after it is already underneath
```

No disappearance. No blank center-line frame. No shelf-only reappearance. No crossfade between visibly different states.