import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ConnectorConfig {
  id: string;
  label: string;
  svg: JSX.Element;
  rotation?: number;
}

const connectors: ConnectorConfig[] = [
  {
    id: 'pencil',
    label: 'sketch →',
    rotation: -12,
    svg: (
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="8" y1="12" x2="100" y2="12" stroke="hsl(38, 60%, 52%)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="12" x2="112" y2="12" stroke="hsl(38, 40%, 40%)" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="112,12 106,8 106,16" fill="hsl(220, 15%, 12%)" />
        <line x1="8" y1="12" x2="4" y2="12" stroke="hsl(350, 50%, 55%)" strokeWidth="3" strokeLinecap="round" />
        <line x1="96" y1="9" x2="96" y2="15" stroke="hsl(38, 30%, 45%)" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    id: 'paperclip',
    label: 'attach',
    rotation: 8,
    svg: (
      <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 4 C10 2, 22 2, 22 4 L22 36 C22 40, 10 40, 10 36 L10 12 C10 10, 18 10, 18 12 L18 32"
          stroke="hsl(210, 8%, 65%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: 'marker',
    label: 'brainstorm',
    rotation: -6,
    svg: (
      <svg width="100" height="22" viewBox="0 0 100 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="5" width="70" height="12" rx="3" fill="hsl(220, 60%, 50%)" opacity="0.8" />
        <rect x="80" y="7" width="14" height="8" rx="1" fill="hsl(220, 40%, 35%)" />
        <circle cx="94" cy="11" r="2" fill="hsl(220, 50%, 25%)" />
        <rect x="4" y="7" width="8" height="8" rx="2" fill="hsl(220, 60%, 50%)" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'wrench',
    label: 'build',
    rotation: 15,
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M28 6 C32 10, 32 16, 28 20 L16 32 C14 34, 10 34, 8 32 C6 30, 6 26, 8 24 L20 12 C16 8, 16 4, 20 2 Z"
          stroke="hsl(210, 10%, 50%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="10" cy="30" r="2" fill="hsl(210, 10%, 50%)" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'compass',
    label: 'navigate',
    rotation: 0,
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="15" stroke="hsl(210, 16%, 60%)" strokeWidth="1.2" fill="none" />
        <circle cx="18" cy="18" r="12" stroke="hsl(210, 16%, 70%)" strokeWidth="0.6" fill="none" />
        <polygon points="18,6 20,16 18,18 16,16" fill="hsl(350, 50%, 55%)" opacity="0.7" />
        <polygon points="18,30 16,20 18,18 20,20" fill="hsl(210, 16%, 50%)" opacity="0.5" />
        <circle cx="18" cy="18" r="1.5" fill="hsl(210, 16%, 50%)" />
      </svg>
    ),
  },
  {
    id: 'pen',
    label: 'reflect',
    rotation: -20,
    svg: (
      <svg width="110" height="20" viewBox="0 0 110 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="6" width="70" height="8" rx="2" fill="hsl(220, 15%, 18%)" />
        <rect x="14" y="7" width="8" height="6" rx="1" fill="hsl(38, 50%, 45%)" />
        <polygon points="90,6 98,10 90,14" fill="hsl(38, 50%, 45%)" />
        <circle cx="100" cy="10" r="1.2" fill="hsl(220, 60%, 50%)" opacity="0.6" />
        <path d="M101 11 Q104 13, 108 12" stroke="hsl(220, 60%, 50%)" strokeWidth="0.8" fill="none" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'airplane',
    label: 'send',
    rotation: -8,
    svg: (
      <svg width="44" height="36" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 18 L38 4 L28 18 L38 32 Z"
          stroke="hsl(210, 16%, 60%)"
          strokeWidth="1.2"
          fill="hsl(210, 16%, 84%)"
          fillOpacity="0.3"
          strokeLinejoin="round"
        />
        <line x1="38" y1="4" x2="28" y2="18" stroke="hsl(210, 16%, 55%)" strokeWidth="0.8" />
        <line x1="4" y1="18" x2="28" y2="18" stroke="hsl(210, 16%, 55%)" strokeWidth="0.8" />
      </svg>
    ),
  },
];

interface DeskConnectorProps {
  index: number;
}

const DeskConnector = ({ index }: DeskConnectorProps) => {
  const ref = useRef<HTMLDivElement>(null!);
  const connector = connectors[index % connectors.length];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.7, 1, 0.7, 0]);

  return (
    <div ref={ref} className="desk-connector">
      <motion.div
        style={{ y, opacity, rotate: connector.rotation ?? 0 }}
        className="flex flex-col items-center gap-1"
      >
        <div className="desk-connector-svg">
          {connector.svg}
        </div>
        <span className="font-handwritten text-[11px] tracking-wide" style={{ color: 'hsl(210, 16%, 55%)' }}>
          {connector.label}
        </span>
      </motion.div>
    </div>
  );
};

export default DeskConnector;
