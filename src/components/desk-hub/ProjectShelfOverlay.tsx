import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useSiteData";

const SHELF_BG = "hsl(28 35% 16%)";
const SHELF_EDGE = "hsl(28 40% 10%)";
const LED = "hsl(40 80% 70%)";

const SPINE_PALETTE = [
  "hsl(170 25% 22%)",
  "hsl(350 28% 24%)",
  "hsl(215 28% 22%)",
  "hsl(85 18% 22%)",
  "hsl(15 30% 24%)",
  "hsl(280 18% 24%)",
  "hsl(200 12% 26%)",
  "hsl(35 25% 24%)",
];

const ProjectShelfOverlay = () => {
  const { projects } = useProjects();
  const [hovered, setHovered] = useState<string | null>(null);

  const items = projects.slice(0, 8);

  // Layout in viewBox 1000x600 (matches the 38% × 24% rectangle aspect ~3:1.9, close enough)
  const VB_W = 1000;
  const VB_H = 600;
  const SHELF_TOP = 90;
  const SHELF_H = 360;
  const PLANK_Y = SHELF_TOP + SHELF_H;
  const PLANK_H = 28;
  const PADDING = 60;
  const usableW = VB_W - PADDING * 2;
  const n = Math.max(items.length, 1);
  const spineW = usableW / n;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <radialGradient id="ledGlow" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor={LED} stopOpacity="0.55" />
          <stop offset="60%" stopColor={LED} stopOpacity="0.08" />
          <stop offset="100%" stopColor={LED} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plank" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(28 40% 22%)" />
          <stop offset="100%" stopColor={SHELF_EDGE} />
        </linearGradient>
        <pattern id="grain" width="6" height="100%" patternUnits="userSpaceOnUse">
          <rect width="6" height="100%" fill={SHELF_BG} />
          <line x1="0" y1="0" x2="0" y2="100%" stroke="hsl(28 40% 10%)" strokeWidth="0.4" opacity="0.5" />
        </pattern>
      </defs>

      {/* LED glow above shelf */}
      <ellipse cx={VB_W / 2} cy={SHELF_TOP - 8} rx={VB_W * 0.45} ry={70} fill="url(#ledGlow)" />
      {/* LED bar */}
      <rect x={PADDING + 20} y={SHELF_TOP - 14} width={usableW - 40} height={4} fill={LED} opacity={0.85} rx={2} />

      {/* Shelf back panel (subtle) */}
      <rect x={PADDING - 20} y={SHELF_TOP} width={usableW + 40} height={SHELF_H} fill="hsl(160 25% 6%)" opacity={0.7} />

      {/* Spines */}
      {items.map((p, i) => {
        const isHover = hovered === p.id;
        const baseColor = SPINE_PALETTE[i % SPINE_PALETTE.length];
        // varied heights
        const heightVariance = (i % 3) * 14;
        const sH = SHELF_H - 20 - heightVariance;
        const sX = PADDING + i * spineW + 4;
        const sW = spineW - 8;
        const sY = PLANK_Y - sH;
        const titleShort = p.title.length > 22 ? p.title.slice(0, 21) + "…" : p.title;
        return (
          <g
            key={p.id}
            style={{ cursor: "pointer", transition: "transform 200ms ease", transformOrigin: `${sX + sW / 2}px ${PLANK_Y}px` }}
            transform={isHover ? `translate(0, -8)` : undefined}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link to={`/projects/${p.slug}`} style={{ outline: "none" }}>
              {/* spine body */}
              <rect x={sX} y={sY} width={sW} height={sH} fill={p.color || baseColor} stroke={SHELF_EDGE} strokeWidth={1} />
              {/* spine highlight */}
              <rect x={sX} y={sY} width={3} height={sH} fill="hsl(40 30% 92% / 0.12)" />
              {/* top band */}
              <rect x={sX} y={sY + 14} width={sW} height={2} fill="hsl(40 60% 55% / 0.6)" />
              <rect x={sX} y={sY + sH - 30} width={sW} height={2} fill="hsl(40 60% 55% / 0.6)" />
              {/* vertical title */}
              <text
                x={sX + sW / 2}
                y={sY + sH / 2}
                textAnchor="middle"
                transform={`rotate(-90, ${sX + sW / 2}, ${sY + sH / 2})`}
                fill="hsl(40 30% 92%)"
                fontFamily="'Playfair Display', serif"
                fontSize={Math.min(sW * 0.55, 22)}
                letterSpacing="1.5"
                style={{ pointerEvents: "none" }}
              >
                {titleShort.toUpperCase()}
              </text>
              {/* year at foot */}
              {p.year && (
                <text
                  x={sX + sW / 2}
                  y={sY + sH - 10}
                  textAnchor="middle"
                  fill="hsl(40 30% 92% / 0.6)"
                  fontFamily="ui-monospace, monospace"
                  fontSize={8}
                  letterSpacing="1"
                  style={{ pointerEvents: "none" }}
                >
                  {p.year}
                </text>
              )}
              {/* hit area */}
              <rect x={sX} y={sY} width={sW} height={sH} fill="transparent" />
            </Link>
            {/* hover tooltip */}
            {isHover && (
              <g style={{ pointerEvents: "none" }}>
                <rect
                  x={sX + sW / 2 - 110}
                  y={sY - 44}
                  width={220}
                  height={32}
                  fill="hsl(160 30% 8%)"
                  stroke="hsl(40 25% 92% / 0.5)"
                  strokeWidth={1}
                  rx={2}
                />
                <text
                  x={sX + sW / 2}
                  y={sY - 24}
                  textAnchor="middle"
                  fill="hsl(40 30% 92%)"
                  fontFamily="ui-monospace, monospace"
                  fontSize={11}
                  letterSpacing="1.5"
                >
                  {p.title.toUpperCase()}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Plank */}
      <rect x={PADDING - 30} y={PLANK_Y} width={usableW + 60} height={PLANK_H} fill="url(#plank)" />
      <rect x={PADDING - 30} y={PLANK_Y} width={usableW + 60} height={3} fill="hsl(40 30% 50% / 0.3)" />
      {/* Plank shadow under */}
      <rect x={PADDING - 30} y={PLANK_Y + PLANK_H} width={usableW + 60} height={6} fill="hsl(0 0% 0% / 0.5)" />

      {items.length === 0 && (
        <text x={VB_W / 2} y={SHELF_TOP + SHELF_H / 2} textAnchor="middle" fill="hsl(40 30% 92% / 0.4)" fontFamily="ui-monospace, monospace" fontSize={14}>
          NO PROJECTS YET
        </text>
      )}
    </svg>
  );
};

export default ProjectShelfOverlay;
