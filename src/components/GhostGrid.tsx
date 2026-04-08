import { useEffect, useRef, useState, useCallback } from "react";

const GhostGrid = () => {
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const lastFlashRef = useRef(0);

  const triggerFlash = useCallback(() => {
    const now = Date.now();
    if (now - lastFlashRef.current < 800) return;
    lastFlashRef.current = now;

    setFlash(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setFlash(false), 400);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(".section-panel, .notebook, .blueprint-surface");
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            triggerFlash();
            break;
          }
        }
      },
      { threshold: 0.5 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [triggerFlash]);

  const markColor = "rgba(255,255,255,0.7)";
  const dimColor = "rgba(255,255,255,0.4)";

  return (
    <div className="ghost-grid-container">
      <div className={`ghost-grid-bg ${flash ? "ghost-grid-bg--flash" : ""}`} />
      <svg
        className={`ghost-grid__marks ${flash ? "ghost-grid__marks--flash" : ""}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center crosshair */}
        <line x1="48" y1="50" x2="52" y2="50" stroke={markColor} strokeWidth="0.15" />
        <line x1="50" y1="48" x2="50" y2="52" stroke={markColor} strokeWidth="0.15" />
        <circle cx="50" cy="50" r="1.5" fill="none" stroke={markColor} strokeWidth="0.1" />

        {/* Corner registration marks */}
        <line x1="2" y1="2" x2="6" y2="2" stroke={dimColor} strokeWidth="0.12" />
        <line x1="2" y1="2" x2="2" y2="6" stroke={dimColor} strokeWidth="0.12" />
        <line x1="94" y1="2" x2="98" y2="2" stroke={dimColor} strokeWidth="0.12" />
        <line x1="98" y1="2" x2="98" y2="6" stroke={dimColor} strokeWidth="0.12" />
        <line x1="2" y1="94" x2="6" y2="94" stroke={dimColor} strokeWidth="0.12" />
        <line x1="2" y1="94" x2="2" y2="98" stroke={dimColor} strokeWidth="0.12" />
        <line x1="94" y1="98" x2="98" y2="98" stroke={dimColor} strokeWidth="0.12" />
        <line x1="98" y1="94" x2="98" y2="98" stroke={dimColor} strokeWidth="0.12" />

        {/* Horizontal dimension arrow */}
        <line x1="20" y1="5" x2="80" y2="5" stroke={dimColor} strokeWidth="0.08" />
        <line x1="20" y1="4" x2="20" y2="6" stroke={dimColor} strokeWidth="0.12" />
        <line x1="80" y1="4" x2="80" y2="6" stroke={dimColor} strokeWidth="0.12" />
        <polygon points="20,5 22,4.3 22,5.7" fill={dimColor} />
        <polygon points="80,5 78,4.3 78,5.7" fill={dimColor} />
        <text x="50" y="4" textAnchor="middle" fontSize="1.8" fill={markColor} fontFamily="var(--font-mono)">1200</text>

        {/* Vertical dimension arrow */}
        <line x1="5" y1="20" x2="5" y2="80" stroke={dimColor} strokeWidth="0.08" />
        <line x1="4" y1="20" x2="6" y2="20" stroke={dimColor} strokeWidth="0.12" />
        <line x1="4" y1="80" x2="6" y2="80" stroke={dimColor} strokeWidth="0.12" />
        <polygon points="5,20 4.3,22 5.7,22" fill={dimColor} />
        <polygon points="5,80 4.3,78 5.7,78" fill={dimColor} />
        <text x="4.5" y="51" textAnchor="middle" fontSize="1.8" fill={markColor} fontFamily="var(--font-mono)" transform="rotate(-90, 4.5, 51)">800</text>

        {/* Tick marks along top */}
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((i) => (
          <g key={`th-${i}`}>
            <line x1={i} y1="0" x2={i} y2="1.2" stroke={dimColor} strokeWidth="0.06" />
            {i % 20 === 0 && (
              <text x={i + 0.5} y="2.8" fontSize="1.2" fill={dimColor} fontFamily="var(--font-mono)">{i}</text>
            )}
          </g>
        ))}

        {/* Tick marks along left */}
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((i) => (
          <g key={`tv-${i}`}>
            <line x1="0" y1={i} x2="1.2" y2={i} stroke={dimColor} strokeWidth="0.06" />
            {i % 20 === 0 && (
              <text x="1.8" y={i + 0.5} fontSize="1.2" fill={dimColor} fontFamily="var(--font-mono)">{i}</text>
            )}
          </g>
        ))}

        {/* Quarter-point crosshairs */}
        {[25, 75].map((x) =>
          [25, 75].map((y) => (
            <g key={`qc-${x}-${y}`}>
              <line x1={x - 0.8} y1={y} x2={x + 0.8} y2={y} stroke={dimColor} strokeWidth="0.06" />
              <line x1={x} y1={y - 0.8} x2={x} y2={y + 0.8} stroke={dimColor} strokeWidth="0.06" />
            </g>
          ))
        )}
      </svg>
    </div>
  );
};

export default GhostGrid;
