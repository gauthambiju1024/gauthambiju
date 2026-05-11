## Issue
Frames (`BlueprintFrame`, `BookshelfFrame`, etc.) use `h-full` with `absolute inset-0` children. Their parent wrapper in `Index.tsx` only sets `minHeight`, which doesn't give `h-full` children a resolved height — so panels collapse to 0px and nothing is visible.

## Fix (`src/pages/Index.tsx`)
Replace the inner wrapper's `minHeight` style with an explicit `height`:

```tsx
<section key={id} id={id} className="w-full px-0 py-3" style={{ height: "100vh" }}>
  <div className="relative w-full h-full">
    <Frame t={tDummy} active={true}>
      <Section />
    </Frame>
  </div>
</section>
```

- Section gets fixed `height: 100vh` so the inner div's `h-full` resolves.
- Drop `min-h-screen` (redundant once height is fixed).
- Keep top padding on the outer container so the first panel clears the fixed Assembly Header.

That's the only change needed — frames will fill their section and content will be visible.
