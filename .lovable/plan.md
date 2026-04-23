

## Mobile-friendly Assembly Header

The current `AssemblyHeader` is a single SVG drawn on a 1400-unit canvas (overall progress spine, instrumentation strip, 8 serif station labels on a conveyor belt, and a 228px "Your Product" design box on the right). On a phone the whole SVG just shrinks proportionally — the serif station labels become ~6px tall and the tap targets are smaller than a fingertip, the right-side design box gets pushed off / squeezed, and the instrumentation row becomes illegible noise.

We'll keep the desktop header exactly as it is and add a dedicated mobile variant that swaps in below ~800px (the same breakpoint the header already uses for its margin offsets).

### What the mobile header looks like

A 56px tall fixed bar — same dark glass background, same brass ink palette, same "factory instrumentation" voice — with three elements:

```text
┌──────────────────────────────────────────────────────┐
│ ▓▓▓░░  GB · BUILD.OS    PARTS 03/08    ☰ Home      │
└──────────────────────────────────────────────────────┘
```

1. **Progress bar** (full-width, 2px, top edge of header) — same `progressRef` value that drives the desktop spine, rendered horizontally.
2. **Status row** (single line, monospace, brass ink): `GB · BUILD.OS` on the left, `PARTS NN/08` in the middle, current section name + menu icon on the right. The current section name comes from the same `stage = floor(progress * 8)` logic the desktop header already computes — so the active station stays in sync with scroll.
3. **Menu button** (☰, 44×44 tap target) opens a full-screen sheet listing all 8 stations as large serif italic links (`Home`, `About`, `Work`, `Think`, `Skill`, `Path`, `Write`, `Send`), styled the same as the desktop nav — active station highlighted in the brighter brass tone, completed stations dimmed, upcoming in the base ink color. Tapping a link smooth-scrolls to the panel (same `getBoundingClientRect + scrollTo` logic the desktop uses to bypass `scroll-margin-top`) and closes the sheet.

### What we drop on mobile (and why)

- The conveyor belt animation, rollers, robot arms, sparks, and the live "product being assembled" graphic — pure decoration that doesn't fit and costs frames on a phone.
- The right-hand "Your Product" design box and the preset/draw popover. These are a desktop delight; on mobile the canvas would be tiny and the popover would dominate the screen. The mobile sheet gets a small "Design your product →" link at the bottom that opens the same popover full-screen, so the feature stays reachable without crowding the bar.
- The top instrumentation strip (TRQ/PWR/SRC/OP/UTC) — collapsed into the single status row above.

### Reserved space

`pt-[98px]` on `<main>` becomes `pt-[56px]` below 800px. We'll handle this by reading `useIsMobile()` in `Index.tsx` (or by switching to a Tailwind `pt-[56px] min-[800px]:pt-[98px]` utility on the wrapper) so panels still land correctly under the active bar.

### Technical details

- New file `src/components/AssemblyHeaderMobile.tsx` containing the 56px bar, the progress/stage/menu logic, and the bottom-sheet menu (built with the existing `Sheet` from `src/components/ui/sheet.tsx`, `side="top"`).
- It reuses the same `NAV` array, `INK`/`INK_BRIGHT` constants, and the same scroll-progress/stage math by extracting them into `src/components/assemblyHeader/shared.ts` so both desktop and mobile stay in lock-step.
- The existing `AssemblyHeader.tsx` keeps its current behavior unchanged, but its outer wrapper gets a `hidden min-[800px]:block`. The new mobile component gets `block min-[800px]:hidden`.
- A small `<DesignDrawer>` extraction lets the preset-pick + draw-your-own popover be opened from either the desktop click target or the mobile sheet's "Design your product →" link, so we don't duplicate the canvas/preset code.
- The 3D workbench strip at the bottom of the viewport is untouched.

### Files

- `src/components/AssemblyHeader.tsx` — wrap root in `hidden min-[800px]:block`, extract the design popover into `DesignDrawer`, import shared constants.
- `src/components/AssemblyHeaderMobile.tsx` — new, 56px bar + sheet menu.
- `src/components/assemblyHeader/shared.ts` — new, `NAV`, ink colors, `useScrollProgress` hook, `stageFromProgress` helper.
- `src/components/assemblyHeader/DesignDrawer.tsx` — new, popover/sheet content (presets + canvas) used by both headers.
- `src/pages/Index.tsx` — render both headers; the responsive `hidden`/`block` classes pick which one is visible. Adjust top padding on the content wrapper to `pt-[56px] min-[800px]:pt-[98px]`.

