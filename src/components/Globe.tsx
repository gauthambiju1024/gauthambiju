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
  // Sepia/paper tones matching the website
  baseColor: [0.51, 0.39, 0.33], // Primary sepia hsl(16, 21%, 42%)
  markerColor: [0.36, 0.44, 0.55], // Accent blue hsl(214, 21%, 45%)
  glowColor: [0.51, 0.39, 0.33], // Primary sepia glow
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
  let phi = config.phi || 1.2;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
      if (!pointerInteracting.current) phi += 0.004;
      state.phi = phi + r;
      state.width = width * 2;
      state.height = width * 2;
    },
    [r]
  );

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
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
        "w-full h-full opacity-0 transition-opacity duration-1000",
        className
      )}
      style={{ contain: "layout paint size", cursor: "grab" }}
    />
  );
};

export default Globe;
