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
  /** Optional target rotation; when set, phi/theta lerp smoothly toward this. */
  targetPhi?: number;
  targetTheta?: number;
}

const Globe = ({ className, config = GLOBE_CONFIG, targetPhi, targetTheta }: GlobeProps) => {
  const phiRef = useRef(config.phi || 1.2);
  const thetaRef = useRef(config.theta || -0.3);
  const targetPhiRef = useRef<number | undefined>(targetPhi);
  const targetThetaRef = useRef<number | undefined>(targetTheta);
  const widthRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  useEffect(() => { targetPhiRef.current = targetPhi; }, [targetPhi]);
  useEffect(() => { targetThetaRef.current = targetTheta; }, [targetTheta]);

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
      const tp = targetPhiRef.current;
      const tt = targetThetaRef.current;
      if (tp !== undefined) {
        // Wrap delta into [-pi, pi] so we take the short way around.
        let d = tp - phiRef.current;
        d = ((d + Math.PI) % (Math.PI * 2)) - Math.PI;
        phiRef.current += d * 0.05;
      } else if (!pointerInteracting.current) {
        phiRef.current += 0.004;
      }
      if (tt !== undefined) {
        thetaRef.current += (tt - thetaRef.current) * 0.05;
      }
      state.phi = phiRef.current + r;
      state.theta = thetaRef.current;
      state.width = widthRef.current * 2;
      state.height = widthRef.current * 2;
    },
    [r]
  );

  const onResize = () => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

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
