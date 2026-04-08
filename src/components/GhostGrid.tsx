import { useEffect, useRef, useState, useCallback } from "react";

const GhostGrid = () => {
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const lastFlashRef = useRef(0);

  const triggerFlash = useCallback(() => {
    const now = Date.now();
    if (now - lastFlashRef.current < 800) return; // debounce
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

  return (
    <div className={`ghost-grid ${flash ? "ghost-grid--flash" : ""}`}>
      {/* Construction lines SVG overlay */}
      <svg
        className="ghost-grid__marks"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center crosshair */}
        <line x1="940" y1="520" x2="980" y2="520" stroke="currentColor" strokeWidth="0.8" />
        <line x1="960" y1="500" x2="960" y2="540" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="960" cy="520" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" />

        {/* Horizontal dimension arrow — top center */}
        <line x1="660" y1="40" x2="1260" y2="40" stroke="currentColor" strokeWidth="0.5" />
        <line x1="660" y1="34" x2="660" y2="46" stroke="currentColor" strokeWidth="0.7" />
        <line x1="1260" y1="34" x2="1260" y2="46" stroke="currentColor" strokeWidth="0.7" />
        {/* Arrowheads */}
        <polygon points="660,40 670,37 670,43" fill="currentColor" />
        <polygon points="1260,40 1250,37 1250,43" fill="currentColor" />
        <text x="960" y="36" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="var(--font-mono)">600</text>

        {/* Vertical dimension arrow — left */}
        <line x1="40" y1="200" x2="40" y2="880" stroke="currentColor" strokeWidth="0.5" />
        <line x1="34" y1="200" x2="46" y2="200" stroke="currentColor" strokeWidth="0.7" />
        <line x1="34" y1="880" x2="46" y2="880" stroke="currentColor" strokeWidth="0.7" />
        <polygon points="40,200 37,210 43,210" fill="currentColor" />
        <polygon points="40,880 37,870 43,870" fill="currentColor" />
        <text x="36" y="545" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="var(--font-mono)" transform="rotate(-90, 36, 545)">680</text>

        {/* Corner tick marks */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={`tick-h-${i}`}>
            <line x1={320 * i} y1="0" x2={320 * i} y2="8" stroke="currentColor" strokeWidth="0.4" />
            <text x={320 * i + 2} y="16" fontSize="7" fill="currentColor" fontFamily="var(--font-mono)" opacity="0.7">{320 * i}</text>
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <g key={`tick-v-${i}`}>
            <line x1="0" y1={360 * i} x2="8" y2={360 * i} stroke="currentColor" strokeWidth="0.4" />
            <text x="12" y={360 * i + 4} fontSize="7" fill="currentColor" fontFamily="var(--font-mono)" opacity="0.7">{360 * i}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default GhostGrid;
