

## Make Panels Span Full Available Width (Inside Margin Doodles)

Right now the panel stage caps content at `max-w-7xl` (1280px) and adds extra horizontal padding (`px-3 md:px-6`), so on a wide viewport the panels sit in a narrow column even though the `.margin-content-wrapper` already reserves space for the side doodles. We'll let panels fill the full width between the margin doodles.

### Change

In `src/components/DeskStage.tsx`, the stage container currently is:

```tsx
<div className="absolute inset-0 px-3 md:px-6 pt-[88px] pb-1 overflow-hidden">
  <div className="relative w-full h-full max-w-7xl mx-auto overflow-hidden">
```

Update to:

```tsx
<div className="absolute inset-0 px-0 pt-[88px] pb-1 overflow-hidden">
  <div className="relative w-full h-full overflow-hidden">
```

That removes the `max-w-7xl` cap and the side padding. The panels now stretch edge-to-edge inside `.margin-content-wrapper`, which already pads ~`60px + 4px` on each side for the margin doodles (per `src/index.css`). Doodles remain visible and untouched.

### What stays the same

- Vertical scroll + horizontal scroll-driven panel transitions — unchanged.
- Top header offset (`pt-[88px]`) and bottom desk strip (`12vh`) — unchanged.
- Margin doodles, ghost grid, entropy background — untouched (they live outside this wrapper or behind it).
- Individual section components (Hero, Projects, Thinking, etc.) — unchanged. They'll naturally render wider; any internal `max-w-*` they set still applies.
- Reduced-motion fallback — unchanged.

### Files Modified

- `src/components/DeskStage.tsx` — remove `max-w-7xl mx-auto` and side `px-*` from the stage container.

