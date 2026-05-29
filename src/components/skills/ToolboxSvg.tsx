/**
 * Shared toolbox artwork — single source of truth for the closed shelf toolbox
 * AND the Toolbox→Skills flip. Keeps lid/body visuals identical across both
 * usages. Gradient ids are scoped per-component to avoid SVG id collisions.
 */

const Defs = ({ prefix }: { prefix: string }) => (
  <defs>
    <linearGradient id={`${prefix}-body`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="hsl(220 6% 32%)" />
      <stop offset="0.5" stopColor="hsl(220 6% 24%)" />
      <stop offset="1" stopColor="hsl(220 6% 18%)" />
    </linearGradient>
    <linearGradient id={`${prefix}-lid`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="hsl(220 6% 40%)" />
      <stop offset="1" stopColor="hsl(220 6% 24%)" />
    </linearGradient>
    <linearGradient id={`${prefix}-handle`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="hsl(0 0% 78%)" />
      <stop offset="0.5" stopColor="hsl(0 0% 58%)" />
      <stop offset="1" stopColor="hsl(0 0% 38%)" />
    </linearGradient>
  </defs>
);

interface ClosedProps {
  width?: number | string;
  height?: number | string;
}

/** Full closed-toolbox artwork — what sits on the projects shelf. */
export const ToolboxClosed = ({ width = 220, height = 174 }: ClosedProps) => {
  const p = "tb-closed";
  return (
    <svg width={width} height={height} viewBox="0 0 96 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Defs prefix={p} />
      {/* handle */}
      <path d="M 30 22 Q 48 6 66 22" stroke={`url(#${p}-handle)`} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="22" r="2.2" fill="hsl(220 8% 14%)" />
      <circle cx="66" cy="22" r="2.2" fill="hsl(220 8% 14%)" />
      {/* lid */}
      <rect x="8" y="22" width="80" height="14" rx="2" fill={`url(#${p}-lid)`} stroke="hsl(220 8% 10%)" strokeWidth="1" />
      <line x1="10" y1="24.5" x2="86" y2="24.5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      {/* hinge */}
      <line x1="8" y1="36" x2="88" y2="36" stroke="hsl(220 8% 8%)" strokeWidth="1" />
      <line x1="8" y1="36.7" x2="88" y2="36.7" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      {/* body */}
      <rect x="8" y="36" width="80" height="32" rx="2" fill={`url(#${p}-body)`} stroke="hsl(220 8% 10%)" strokeWidth="1" />
      <line x1="10" y1="42" x2="86" y2="42" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
      <line x1="10" y1="48" x2="86" y2="48" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
      <line x1="10" y1="54" x2="86" y2="54" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
      <line x1="10" y1="60" x2="86" y2="60" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
      {/* latches */}
      <rect x="22" y="32" width="10" height="8" rx="1" fill={`url(#${p}-handle)`} stroke="hsl(220 8% 10%)" strokeWidth="0.7" />
      <rect x="64" y="32" width="10" height="8" rx="1" fill={`url(#${p}-handle)`} stroke="hsl(220 8% 10%)" strokeWidth="0.7" />
      <circle cx="27" cy="36" r="0.9" fill="hsl(220 8% 12%)" />
      <circle cx="69" cy="36" r="0.9" fill="hsl(220 8% 12%)" />
      {/* plaque */}
      <rect x="38" y="48" width="20" height="9" rx="1" fill="hsl(220 8% 14%)" stroke="hsl(220 8% 8%)" strokeWidth="0.5" />
      <text x="48" y="54.4" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" fill="hsl(40 8% 70%)" letterSpacing="0.6">TOOLS</text>
      {/* feet */}
      <rect x="12" y="68" width="6" height="3" rx="0.5" fill="hsl(220 8% 12%)" />
      <rect x="78" y="68" width="6" height="3" rx="0.5" fill="hsl(220 8% 12%)" />
      <line x1="10" y1="37" x2="86" y2="37" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
    </svg>
  );
};

/**
 * Lid + handle + latches only — drawn so the hinge sits at the bottom of the
 * viewBox (y=18). Use `transformOrigin: "bottom center"` and rotateX to swing
 * open. ViewBox 0 0 96 18 covers y=0 (handle apex) → y=18 (hinge line).
 */
export const ToolboxLidOnly = () => {
  const p = "tb-lid";
  return (
    <svg width="100%" height="100%" viewBox="0 0 96 18" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <Defs prefix={p} />
      {/* handle (apex near top of viewBox) */}
      <path d="M 30 6 Q 48 -10 66 6" stroke={`url(#${p}-handle)`} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="6" r="2.2" fill="hsl(220 8% 14%)" />
      <circle cx="66" cy="6" r="2.2" fill="hsl(220 8% 14%)" />
      {/* lid body */}
      <rect x="8" y="6" width="80" height="14" rx="2" fill={`url(#${p}-lid)`} stroke="hsl(220 8% 10%)" strokeWidth="1" />
      <line x1="10" y1="8.5" x2="86" y2="8.5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      {/* latches sit at the bottom of the lid, just above hinge */}
      <rect x="22" y="16" width="10" height="8" rx="1" fill={`url(#${p}-handle)`} stroke="hsl(220 8% 10%)" strokeWidth="0.7" />
      <rect x="64" y="16" width="10" height="8" rx="1" fill={`url(#${p}-handle)`} stroke="hsl(220 8% 10%)" strokeWidth="0.7" />
    </svg>
  );
};

/**
 * Body (open tray seen from front) — same body silhouette as the closed
 * toolbox so the visual identity is preserved during the flip. ViewBox covers
 * y=0 (hinge/top edge) → y=35 (feet).
 */
export const ToolboxBodyOnly = () => {
  const p = "tb-body";
  return (
    <svg width="100%" height="100%" viewBox="0 0 96 35" preserveAspectRatio="none" style={{ display: "block" }}>
      <Defs prefix={p} />
      {/* hinge */}
      <line x1="8" y1="0.5" x2="88" y2="0.5" stroke="hsl(220 8% 8%)" strokeWidth="1" />
      <line x1="8" y1="1.2" x2="88" y2="1.2" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      {/* body */}
      <rect x="8" y="0.5" width="80" height="32" rx="2" fill={`url(#${p}-body)`} stroke="hsl(220 8% 10%)" strokeWidth="1" />
      <line x1="10" y1="6" x2="86" y2="6" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
      <line x1="10" y1="14" x2="86" y2="14" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
      <line x1="10" y1="22" x2="86" y2="22" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
      {/* feet */}
      <rect x="12" y="32.5" width="6" height="3" rx="0.5" fill="hsl(220 8% 12%)" />
      <rect x="78" y="32.5" width="6" height="3" rx="0.5" fill="hsl(220 8% 12%)" />
      <line x1="10" y1="1.5" x2="86" y2="1.5" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
    </svg>
  );
};
