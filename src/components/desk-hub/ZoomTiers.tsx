/**
 * Blueprint-line vector zoom tiers.
 * All share viewBox "0 0 1000 1000" and a fixed focus point at (500, 500)
 * so the zoom feels like falling toward one location.
 */

const STROKE = "hsl(40 30% 92%)";
const ACCENT = "hsl(40 70% 60%)";
const FAINT = "hsl(40 30% 92% / 0.18)";

const Grid = ({ step = 50, opacity = 0.06 }: { step?: number; opacity?: number }) => {
  const lines: JSX.Element[] = [];
  for (let i = 0; i <= 1000; i += step) {
    lines.push(<line key={`v${i}`} x1={i} y1={0} x2={i} y2={1000} stroke={STROKE} strokeWidth={0.5} opacity={opacity} />);
    lines.push(<line key={`h${i}`} x1={0} y1={i} x2={1000} y2={i} stroke={STROKE} strokeWidth={0.5} opacity={opacity} />);
  }
  return <g>{lines}</g>;
};

const Crosshair = ({ cx = 500, cy = 500, r = 80, label }: { cx?: number; cy?: number; r?: number; label?: string }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT} strokeWidth={1.2} opacity={0.85}>
      <animate attributeName="r" values={`${r};${r + 8};${r}`} dur="2.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.85;0.4;0.85" dur="2.4s" repeatCount="indefinite" />
    </circle>
    <circle cx={cx} cy={cy} r={3} fill={ACCENT} />
    <line x1={cx - r - 30} y1={cy} x2={cx - r - 6} y2={cy} stroke={ACCENT} strokeWidth={1} />
    <line x1={cx + r + 6} y1={cy} x2={cx + r + 30} y2={cy} stroke={ACCENT} strokeWidth={1} />
    <line x1={cx} y1={cy - r - 30} x2={cx} y2={cy - r - 6} stroke={ACCENT} strokeWidth={1} />
    <line x1={cx} y1={cy + r + 6} x2={cx} y2={cy + r + 30} stroke={ACCENT} strokeWidth={1} />
    {label && (
      <text x={cx + r + 38} y={cy + 4} fill={ACCENT} fontFamily="ui-monospace, monospace" fontSize={14} letterSpacing="2">
        {label}
      </text>
    )}
  </g>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
    {children}
  </svg>
);

/* ---------- Tier 1: Globe wireframe (replaces during transition) ---------- */
export const GlobeWireSVG = () => {
  const cx = 500, cy = 500, R = 360;
  // longitudes
  const longs: JSX.Element[] = [];
  for (let i = 0; i < 12; i++) {
    const k = i / 12;
    const rx = Math.abs(Math.cos(k * Math.PI)) * R;
    longs.push(<ellipse key={`lo${i}`} cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke={STROKE} strokeWidth={0.8} opacity={0.45} />);
  }
  // latitudes
  const lats: JSX.Element[] = [];
  for (let i = 1; i < 8; i++) {
    const a = (i / 8) * Math.PI;
    const ry = Math.sin(a) * R * 0.18;
    const yy = cy - Math.cos(a) * R;
    lats.push(<ellipse key={`la${i}`} cx={cx} cy={yy} rx={Math.sin(a) * R} ry={ry} fill="none" stroke={STROKE} strokeWidth={0.6} opacity={0.35} />);
  }
  return (
    <Frame>
      <Grid />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={STROKE} strokeWidth={1.4} />
      {longs}
      {lats}
      {/* India approximate position dot */}
      <circle cx={cx + 70} cy={cy - 30} r={5} fill={ACCENT} />
      <circle cx={cx + 70} cy={cy - 30} r={14} fill="none" stroke={ACCENT} strokeWidth={1}>
        <animate attributeName="r" values="14;28;14" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0;1" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <text x={cx + 90} y={cy - 26} fill={STROKE} fontFamily="ui-monospace, monospace" fontSize={11} letterSpacing="2" opacity={0.7}>
        EARTH · 0° / 0°
      </text>
    </Frame>
  );
};

/* ---------- Tier 2: India outline ---------- */
export const IndiaSVG = () => (
  <Frame>
    <Grid step={40} />
    {/* Stylised India outline path, normalized to viewBox */}
    <g transform="translate(280, 180) scale(1.05)">
      <path
        d="M180,0 L240,30 L290,20 L340,60 L380,50 L410,90 L420,140 L380,180 L400,230 L370,290 L390,350 L360,420 L330,470 L300,520 L260,560 L220,580 L190,560 L170,510 L150,450 L120,400 L90,340 L70,280 L80,220 L60,170 L80,120 L120,70 L150,40 Z"
        fill="hsl(40 30% 92% / 0.04)"
        stroke={STROKE}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* faint state lines */}
      <path d="M120,160 L300,180" stroke={FAINT} strokeWidth={0.6} strokeDasharray="3 4" />
      <path d="M150,260 L370,250" stroke={FAINT} strokeWidth={0.6} strokeDasharray="3 4" />
      <path d="M180,360 L350,340" stroke={FAINT} strokeWidth={0.6} strokeDasharray="3 4" />
    </g>
    <Crosshair cx={500} cy={500} r={60} label="PUNE · 18.52°N 73.86°E" />
    <text x={40} y={40} fill={STROKE} fontFamily="ui-monospace, monospace" fontSize={11} letterSpacing="3" opacity={0.6}>
      INDIA · ZOOM 02 / 04
    </text>
  </Frame>
);

/* ---------- Tier 3: Pune street grid ---------- */
export const PuneSVG = () => {
  const cx = 500, cy = 500;
  const radials: JSX.Element[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    radials.push(
      <line
        key={`r${i}`}
        x1={cx + Math.cos(a) * 80}
        y1={cy + Math.sin(a) * 80}
        x2={cx + Math.cos(a) * 480}
        y2={cy + Math.sin(a) * 480}
        stroke={STROKE}
        strokeWidth={0.7}
        opacity={0.45}
      />
    );
  }
  // ring roads
  const rings = [120, 200, 300, 410].map((r, i) => (
    <circle key={`ring${i}`} cx={cx} cy={cy} r={r} fill="none" stroke={STROKE} strokeWidth={0.7} opacity={0.45} />
  ));
  // grid blocks in NE quadrant
  const blocks: JSX.Element[] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      blocks.push(
        <rect
          key={`b${i}-${j}`}
          x={cx + 60 + i * 55}
          y={cy - 380 + j * 55}
          width={40}
          height={40}
          fill="none"
          stroke={STROKE}
          strokeWidth={0.5}
          opacity={0.3}
        />
      );
    }
  }
  return (
    <Frame>
      <Grid step={25} opacity={0.04} />
      {rings}
      {radials}
      {blocks}
      {/* highlighted block */}
      <rect x={cx - 30} y={cy - 30} width={60} height={60} fill="none" stroke={ACCENT} strokeWidth={1.2} />
      <Crosshair cx={500} cy={500} r={45} label="KORE GAON" />
      <text x={40} y={40} fill={STROKE} fontFamily="ui-monospace, monospace" fontSize={11} letterSpacing="3" opacity={0.6}>
        PUNE · ZOOM 03 / 04
      </text>
    </Frame>
  );
};

/* ---------- Tier 4: Room floorplan ---------- */
export const RoofSVG = () => (
  <Frame>
    <Grid step={25} opacity={0.05} />
    {/* outer walls */}
    <rect x={200} y={180} width={600} height={640} fill="hsl(40 30% 92% / 0.02)" stroke={STROKE} strokeWidth={2.2} />
    {/* interior walls */}
    <line x1={200} y1={460} x2={520} y2={460} stroke={STROKE} strokeWidth={1.6} />
    <line x1={520} y1={180} x2={520} y2={460} stroke={STROKE} strokeWidth={1.6} />
    {/* doors (arcs) */}
    <path d="M 460 460 A 60 60 0 0 1 520 400" fill="none" stroke={STROKE} strokeWidth={1} opacity={0.6} />
    {/* desk */}
    <rect x={300} y={520} width={400} height={120} fill="none" stroke={ACCENT} strokeWidth={1.6} />
    <text x={500} y={590} textAnchor="middle" fill={ACCENT} fontFamily="ui-monospace, monospace" fontSize={14} letterSpacing="3">
      DESK
    </text>
    {/* chair */}
    <rect x={440} y={680} width={120} height={80} fill="none" stroke={STROKE} strokeWidth={1.2} opacity={0.6} />
    {/* bed */}
    <rect x={240} y={220} width={240} height={180} fill="none" stroke={STROKE} strokeWidth={1.2} opacity={0.5} />
    {/* shelves */}
    <rect x={560} y={220} width={220} height={40} fill="none" stroke={STROKE} strokeWidth={1.2} opacity={0.5} />
    <rect x={560} y={290} width={220} height={40} fill="none" stroke={STROKE} strokeWidth={1.2} opacity={0.5} />
    <Crosshair cx={500} cy={580} r={60} label="THE ROOM" />
    <text x={40} y={40} fill={STROKE} fontFamily="ui-monospace, monospace" fontSize={11} letterSpacing="3" opacity={0.6}>
      ROOM · ZOOM 04 / 04
    </text>
  </Frame>
);
