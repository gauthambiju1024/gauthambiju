import { useState } from "react";
import type { Hotspot } from "./hotspots";

interface Props {
  hotspot: Hotspot;
  onActivate: (target: string) => void;
}

const DeskHotspot = ({ hotspot, onActivate }: Props) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Go to ${hotspot.label}`}
      onClick={() => onActivate(hotspot.target)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        position: "absolute",
        left: `${hotspot.left}%`,
        top: `${hotspot.top}%`,
        width: `${hotspot.width}%`,
        height: `${hotspot.height}%`,
        background: "transparent",
        border: hover ? "1px solid hsl(40 60% 60% / 0.6)" : "1px solid transparent",
        borderRadius: 4,
        cursor: "pointer",
        padding: 0,
        boxShadow: hover ? "0 0 32px hsl(40 60% 60% / 0.45), inset 0 0 24px hsl(40 60% 60% / 0.15)" : "none",
        transition: "box-shadow 220ms ease, border-color 220ms ease",
        zIndex: 5,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: -28,
          transform: "translateX(-50%)",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: "clamp(9px, 0.85vw, 12px)",
          letterSpacing: "1.4px",
          color: "hsl(40 30% 92%)",
          background: "hsl(160 30% 8% / 0.85)",
          border: "1px solid hsl(40 25% 92% / 0.4)",
          padding: "3px 8px",
          borderRadius: 2,
          whiteSpace: "nowrap",
          opacity: hover ? 1 : 0,
          transition: "opacity 180ms ease",
          pointerEvents: "none",
        }}
      >
        · {hotspot.label.toUpperCase()}
      </span>
    </button>
  );
};

export default DeskHotspot;
