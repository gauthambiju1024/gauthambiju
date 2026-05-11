import { useMemo } from "react";
import Globe from "@/components/Globe";
import type { JourneyEntry } from "./journeyData";

interface Props {
  entries: JourneyEntry[];
  selectedId: string | null;
}

const JourneyGlobe = ({ entries, selectedId }: Props) => {
  const selected = entries.find((e) => e.id === selectedId) || null;

  const config = useMemo(() => {
    const markers = entries.map((e) => ({
      location: [e.location.lat, e.location.lng] as [number, number],
      size: e.id === selectedId ? 0.1 : 0.045,
    }));
    return {
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 1.2,
      theta: -0.3,
      dark: 1,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.6,
      baseColor: [0.95, 0.92, 0.78] as [number, number, number],
      markerColor: selectedId
        ? ([0.95, 0.7, 0.25] as [number, number, number])
        : ([0.4, 0.65, 0.55] as [number, number, number]),
      glowColor: [0.85, 0.82, 0.7] as [number, number, number],
      markers,
    };
  }, [entries, selectedId]);

  // Convert lat/lng to phi/theta target for the globe
  const target = selected
    ? {
        // cobe phi: rotation around vertical axis, 0 at lng=0, +pi at lng=180
        // we want lng to face the camera => phi = lng in radians (with offset for cobe defaults)
        phi: (-selected.location.lng * Math.PI) / 180 + Math.PI / 2,
        theta: (selected.location.lat * Math.PI) / 180 * 0.6,
      }
    : undefined;

  return (
    <div className="relative w-full">
      <div
        className="relative mx-auto w-full aspect-square max-w-[460px]"
        style={{
          border: "1px dashed hsl(160 20% 16% / 0.25)",
          background:
            "radial-gradient(circle at center, hsl(160 25% 10% / 0.08), hsl(160 25% 10% / 0) 70%), repeating-linear-gradient(0deg, transparent 0 24px, hsl(160 20% 16% / 0.06) 24px 25px), repeating-linear-gradient(90deg, transparent 0 24px, hsl(160 20% 16% / 0.06) 24px 25px)",
          padding: 12,
        }}
      >
        <Globe
          className="w-full h-full"
          config={config as any}
          targetPhi={target?.phi}
          targetTheta={target?.theta}
        />

        {/* corner ticks */}
        {[
          { top: -1, left: -1 },
          { top: -1, right: -1 },
          { bottom: -1, left: -1 },
          { bottom: -1, right: -1 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-2"
            style={{
              ...pos,
              borderTop: pos.top !== undefined ? "1px solid hsl(160 20% 16% / 0.5)" : undefined,
              borderBottom: pos.bottom !== undefined ? "1px solid hsl(160 20% 16% / 0.5)" : undefined,
              borderLeft: pos.left !== undefined ? "1px solid hsl(160 20% 16% / 0.5)" : undefined,
              borderRight: pos.right !== undefined ? "1px solid hsl(160 20% 16% / 0.5)" : undefined,
            }}
          />
        ))}
      </div>

      {/* Caption */}
      <div className="mt-4 mx-auto max-w-[460px] flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-card-foreground/70">
        <div className="flex items-center gap-2">
          {selected ? (
            <>
              <span className="relative inline-flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
              </span>
              <span className="text-card-foreground">{selected.location.name}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-card-foreground/30" />
              <span>Idle · Auto Rotate</span>
            </>
          )}
        </div>
        <div className="opacity-60">
          {selected
            ? `${selected.location.lat.toFixed(2)}°, ${selected.location.lng.toFixed(2)}°`
            : "—"}
        </div>
      </div>
    </div>
  );
};

export default JourneyGlobe;
