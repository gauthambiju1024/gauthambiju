

## Replace PRESETS Array in AssemblyHeader.tsx

### What
Replace the existing 5 preset sketches (drone, lamp, phone, chair, rocket) with the user's new 5 presets: drone.v4, rocket.v2, plane.v1, phone.v2, satellite.

### Changes — 1 file

**`src/components/AssemblyHeader.tsx`**
- Find the `const PRESETS: Sketch[] = [` block and replace the entire array contents through the closing `];` with the user-provided preset data.
- No other changes needed — the popover grid and header preview read from this array automatically.

