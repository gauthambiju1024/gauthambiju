import { useMemo } from "react";
import Globe from "@/components/Globe";
import type { JourneyEntry } from "./journeyData";
import { useSelectedJourneyId } from "./journeyStore";

interface Props {
  entries: JourneyEntry[];
}

const JourneyGlobe = ({ entries }: Props) => {
  const selectedId = useSelectedJourneyId();
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

  const target = selected
    ? {
        phi: (-selected.location.lng * Math.PI) / 180 + Math.PI / 2,
        theta: ((selected.location.lat * Math.PI) / 180) * 0.6,
      }
    : undefined;

  return (
    <div className="relative w-full">
      <div className="relative mx-auto w-full aspect-square max-w-[460px]">
        <Globe
          className="w-full h-full"
          config={config as any}
          targetPhi={target?.phi}
          targetTheta={target?.theta}
        />
      </div>
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
