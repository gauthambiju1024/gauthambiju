

## Restrict mobile header to mobile only

**Problem:** `AssemblyHeaderMobile` renders at all viewport widths because it has no responsive class. The desktop `AssemblyHeader` already self-hides below 800px via `hidden min-[800px]:block`, but the mobile variant has no matching `min-[800px]:hidden` guard, so on a 1178px desktop viewport both bars stack.

**Fix:** Wrap the mobile header in `Index.tsx` so it only appears below 800px — mirroring the desktop header's breakpoint exactly.

### Change

In `src/pages/Index.tsx`, replace:

```tsx
<AssemblyHeaderMobile panelIds={[...]} />
```

with:

```tsx
<div className="block min-[800px]:hidden">
  <AssemblyHeaderMobile panelIds={[...]} />
</div>
```

That's it. One file, one wrapper div. The 800px breakpoint matches the one `AssemblyHeader` already uses, so there's a clean handoff with no overlap and no gap.

### Files

- `src/pages/Index.tsx` — wrap `<AssemblyHeaderMobile>` in `block min-[800px]:hidden`.

