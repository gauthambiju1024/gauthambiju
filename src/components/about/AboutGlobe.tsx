import Globe from "../Globe";
import type { COBEOptions } from "cobe";

export type GlobeMarker = {
  id: string;
  location: [number, number];
  label: string;
};

interface Props {
  markers: GlobeMarker[];
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
}

const AboutGlobe = ({ markers, selectedId, onMarkerClick }: Props) => {
  const config: COBEOptions = {
    width: 800,
    height: 800,
    onRender: () => {},
    devicePixelRatio: 2,
    phi: 1.2,
    theta: -0.3,
    dark: 0,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.95, 0.93, 0.88],
    markerColor: [0.1, 0.25, 0.18],
    glowColor: [0.85, 0.82, 0.75],
    markers: markers.map((m) => ({ location: m.location, size: 0.08 })),
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <div style={{ width: "min(360px, 70%)", aspectRatio: "1 / 1", position: "relative" }}>
        <Globe className="w-full h-full" config={config} />
      </div>
      {/* Marker legend — clickable, drives the back-of-card */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: "90%", pointerEvents: "auto" }}>
        {markers.map((m) => {
          const active = selectedId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onMarkerClick?.(m.id)}
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "1.2px",
                padding: "3px 8px",
                border: `1px solid ${active ? "hsl(40 25% 92%)" : "hsl(40 25% 92% / 0.4)"}`,
                background: active ? "hsl(40 25% 92%)" : "transparent",
                color: active ? "hsl(160 30% 8%)" : "hsl(40 25% 92%)",
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.2s ease",
              }}
            >
              · {m.label.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AboutGlobe;
