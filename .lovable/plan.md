## Fix the invisible globe

### Diagnosis
`src/components/Globe.tsx` has three combined defects:

- `let width = 0` in the function body is reborn every render, so the per-frame `onRender` (recreated when `r` changes) reads `width = 0` and pushes `state.width = 0` into cobe.
- `contain: "layout paint size"` collapses the canvas's intrinsic size; combined with the empty portal stage at mount the initial `offsetWidth` is `0`, so `createGlobe` is called with a zero buffer.
- The `ResizeObserver` is attached to the canvas itself; with `size` containment it doesn't always fire when the parent grows from `0` to the real size.

### Fix (single file: `src/components/Globe.tsx`)

Replace the file with the version below:

- Use `useRef` for `width` (and `phi`) so closures share one mutable value across renders.
- Observe the **parent** element with `ResizeObserver` instead of the canvas, and read `parent.clientWidth`.
- Drop `size` from `contain` (keep `layout paint`).
- Defer `createGlobe` until the parent has a non-zero width; if it's still `0` at mount, wait for the first `ResizeObserver` callback.

### Code

```tsx
import createGlobe, { COBEOptions } from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 1.2,
  theta: -0.3,
  dark: 1,
  diffuse: 0.3,
  mapSamples: 16000,
  mapBrightness: 1.8,
  baseColor: [1, 1, 1],
  markerColor: [0.1, 0.5, 1],
  glowColor: [1, 1, 1],
  markers: [
    { location: [25.7895, 55.9432], size: 0.07 },
    { location: [23.2156, 72.6369], size: 0.07 },
    { location: [9.7132, 76.6841], size: 0.07 },
    { location: [22.7196, 75.8577], size: 0.07 },
  ],
};

interface GlobeProps {
  className?: string;
  config?: COBEOptions;
}

const Globe = ({ className, config = GLOBE_CONFIG }: GlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const widthRef = useRef(0);
  const phiRef = useRef(config.phi ?? 1.2);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback(
    (state: Record<string, number>) => {
      if (!pointerInteracting.current) phiRef.current += 0.004;
      state.phi = phiRef.current + r;
      const w = widthRef.current * 2;
      state.width = w;
      state.height = w;
    },
    [r]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement | null;

    const measure = () => {
      const w =
        (parent?.clientWidth ?? 0) ||
        canvas.clientWidth ||
        canvas.offsetWidth ||
        0;
      widthRef.current = w;
      return w;
    };

    let globe: ReturnType<typeof createGlobe> | null = null;
    const tryInit = () => {
      if (globe) return;
      const w = measure();
      if (w <= 0) return;
      globe = createGlobe(canvas, {
        ...config,
        width: w * 2,
        height: w * 2,
        onRender,
      });
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
    };

    tryInit();

    const ro = new ResizeObserver(() => {
      measure();
      tryInit();
    });
    if (parent) ro.observe(parent);
    ro.observe(canvas);
    window.addEventListener("resize", measure);

    return () => {
      globe?.destroy();
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) =>
        updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
      }
      onPointerUp={() => updatePointerInteraction(null)}
      onPointerOut={() => updatePointerInteraction(null)}
      onMouseMove={(e) => updateMovement(e.clientX)}
      onTouchMove={(e) =>
        e.touches[0] && updateMovement(e.touches[0].clientX)
      }
      className={cn(
        "w-full h-full opacity-0 transition-opacity duration-700",
        className
      )}
      style={{ contain: "layout paint", cursor: "grab", aspectRatio: "1 / 1" }}
    />
  );
};

export default Globe;
```

### Why this works

- `widthRef` is a single mutable cell; every closure (the original `onRender`, every re-rendered `onRender`, the resize callback) reads/writes the same value. cobe's per-frame `state.width` is always current.
- `tryInit()` defers `createGlobe` until the parent actually has width, so the WebGL buffer is created at the right size on the first frame the About flip reveals it.
- Observing the parent guarantees we get a callback when the portal stage grows from `0×0` to its tracked size.
- Removing `size` from `contain` lets the canvas participate in layout normally.

### Out of scope
No other files change. `AboutGlobe.tsx`, `HeroIdBadge.tsx`, and the cobe config remain as-is.
