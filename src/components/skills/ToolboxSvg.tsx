import { MotionValue, motion, MotionStyle } from "framer-motion";
import React, { CSSProperties } from "react";

/**
 * Landscape 3D toolbox — single source of truth.
 * - Used statically (scaled-down) as the shelf prop in AboutToProjectsBridge.
 * - Used dynamically (motion-value driven) as the centrepiece of the
 *   Toolbox→Skills flip in ToolboxToSkillsBridge.
 *
 * Base unit dimensions (in CSS px before scale): W × (H_BASE + H_LID).
 * Wrap in a sized container; pass `scale` to fit. Internally renders 3D with
 * `transform-style: preserve-3d` and the <Face> helper.
 */

export const TBX_W = 800;
export const TBX_H_BASE = 160;
export const TBX_H_LID = 80;
export const TBX_D = 500;

type FaceProps = {
  w: number;
  h: number;
  transform: string;
  className?: string;
  children?: React.ReactNode;
  bg?: string;
  innerBlur?: boolean;
  pointerEvents?: CSSProperties["pointerEvents"];
};

const Face = ({
  w,
  h,
  transform,
  className = "",
  children,
  bg = "bg-[#1f2125]",
  innerBlur = false,
  pointerEvents = "none",
}: FaceProps) => (
  <div
    className={`absolute left-1/2 top-1/2 [backface-visibility:hidden] ${className} ${bg}`}
    style={{
      width: w,
      height: h,
      marginLeft: -w / 2,
      marginTop: -h / 2,
      transform,
      pointerEvents,
    }}
  >
    {innerBlur && (
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] pointer-events-none" />
    )}
    {children}
  </div>
);

const Latch = ({ label }: { label: string }) => (
  <div className="w-20 h-16 bg-[rgba(10,14,18,0.96)] rounded-b shadow-[0_6px_15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(184,146,74,0.2)] flex flex-col items-center justify-end pb-2 border border-[rgba(184,146,74,0.40)] relative overflow-hidden">
    <div className="absolute flex justify-between w-full px-2 top-3">
      <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
    </div>
    <span className="absolute top-1 font-mono text-[8px] font-bold text-[#e5c47a] opacity-40 tracking-widest pl-0.5 mix-blend-overlay">
      {label}
    </span>
    <div className="absolute top-2 w-[80%] h-1 bg-[rgba(184,146,74,0.2)] rounded-full" />
    <div className="w-6 h-4 bg-[#0a0e12] rounded border border-[rgba(184,146,74,0.40)] shadow-[inset_0_2px_4px_rgba(184,146,74,0.1),inset_0_-2px_4px_rgba(0,0,0,0.9)]" />
  </div>
);

const LidLatchStub = () => (
  <div className="w-20 h-10 bg-[rgba(10,14,18,0.96)] rounded-t-lg shadow-[inset_0_2px_10px_rgba(184,146,74,0.1)] border border-[rgba(184,146,74,0.40)] border-b-0 relative overflow-hidden">
    <div className="absolute bottom-2 w-[80%] left-[10%] h-1 bg-[rgba(184,146,74,0.3)] rounded-full shadow-inner" />
    <div className="absolute flex justify-between w-full px-[6px] bottom-5">
      <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
    </div>
  </div>
);

const Handle = () => (
  <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 w-64 h-[50px] [transform-style:preserve-3d]">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className={`absolute inset-0 border-[14px] ${
          i === 0 ? "border-[#0a0e12]" : "border-[#05080a]"
        } border-b-0 rounded-t-2xl z-0 shadow-sm`}
        style={{ transform: `translateZ(-${i * 4}px)` }}
      />
    ))}
    <div
      className="absolute inset-0 border-[16px] border-[#020304] border-b-0 rounded-t-2xl shadow-[inset_0_0_10px_rgba(0,0,0,1)]"
      style={{ transform: "translateZ(-10px) scale(1.02)" }}
    />
  </div>
);

interface Toolbox3DProps {
  /** Wrapper transforms — supply numbers OR framer motion values. */
  scale?: number | MotionValue<number>;
  rotateX?: string | MotionValue<string>;
  rotateY?: string | MotionValue<string>;
  /** Lid hinge angle (rotateX around its hinge). 0 = closed. */
  lidRotateX?: string | MotionValue<string>;
  /** Content rendered on the floor (top face of base, visible when lid opens). */
  floorContent?: React.ReactNode;
  /** Style overrides for the wrapper. */
  wrapperStyle?: MotionStyle;
}

/**
 * The 3D toolbox. Always renders the full assembly (base + lid). Drive the
 * motion-value props to animate (or pass static values for the shelf prop).
 */
export const Toolbox3D: React.FC<Toolbox3DProps> = ({
  scale = 1,
  rotateX = "0deg",
  rotateY = "0deg",
  lidRotateX = "0deg",
  floorContent,
  wrapperStyle,
}) => {
  const W = TBX_W;
  const H_BASE = TBX_H_BASE;
  const H_LID = TBX_H_LID;
  const D = TBX_D;

  return (
    <motion.div
      className="relative [transform-style:preserve-3d]"
      style={
        {
          width: W,
          height: H_BASE + H_LID,
          rotateX: rotateX as any,
          rotateY: rotateY as any,
          scale: scale as any,
          ...wrapperStyle,
        } as MotionStyle
      }
    >
      {/* ===== BASE ===== */}
      <div
        className="absolute inset-x-0 bottom-0 [transform-style:preserve-3d]"
        style={{ height: H_BASE }}
      >
        {/* Front */}
        <Face
          w={W}
          h={H_BASE}
          transform={`translateZ(${D / 2}px)`}
          className="bg-[#0a0e12] border-x border-b border-t border-[rgba(184,146,74,0.30)] rounded-b-lg shadow-inner overflow-hidden"
        >
          {/* Tech texture */}
          <div className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_4px),repeating-linear-gradient(-45deg,#111_0,#111_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-20 pointer-events-none" />
          {/* Corner rivets */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
          {/* Hazard bars */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[8%] w-[40px] h-[80px] flex gap-[5px] opacity-20 transform -skew-x-12 mix-blend-overlay">
            <div className="w-1.5 h-full bg-yellow-400" />
            <div className="w-1.5 h-full bg-yellow-400" />
            <div className="w-1.5 h-full bg-yellow-400" />
            <div className="w-1.5 h-full bg-yellow-400" />
          </div>
          {/* Latches */}
          <div className="absolute top-0 w-full px-32 flex justify-between z-10">
            <Latch label="L-01" />
            <Latch label="R-02" />
          </div>
          {/* CORE nameplate */}
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="px-8 py-3 bg-[rgba(10,14,18,0.95)] rounded font-mono text-[18px] tracking-[0.4em] text-[#e5c47a] border border-[rgba(184,146,74,0.3)] shadow-[inset_0_2px_1px_rgba(255,255,255,0.05),0_5px_15px_rgba(0,0,0,0.8)] z-10 font-bold uppercase flex flex-col items-center gap-1">
              <span className="text-[#b8924a] font-mono text-[9px] tracking-[0.3em] relative top-1 bg-[rgba(5,8,10,0.92)] px-2 rounded-sm border border-[rgba(184,146,74,0.2)] shadow-inner pb-0.5">
                SYS_MDL
              </span>
              <div className="flex items-center gap-4 mt-1">
                <div className="w-2 h-2 rounded-full bg-[rgba(184,146,74,0.3)] shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.1)]" />
                <span className="drop-shadow-[0_0_10px_rgba(184,146,74,0.4)] text-[22px] font-medium tracking-[0.3em] leading-none">
                  CORE
                </span>
                <div className="w-2 h-2 rounded-full bg-[rgba(184,146,74,0.3)] shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.1)]" />
              </div>
            </div>
          </div>
          {/* Metal corners */}
          <div className="absolute bottom-[-1px] left-[-1px] w-12 h-12 border-l-[3px] border-b-[3px] border-[rgba(184,146,74,0.40)] rounded-bl-lg mix-blend-screen opacity-50" />
          <div className="absolute bottom-[-1px] right-[-1px] w-12 h-12 border-r-[3px] border-b-[3px] border-[rgba(184,146,74,0.40)] rounded-br-lg mix-blend-screen opacity-50" />
        </Face>

        {/* Back */}
        <Face
          w={W}
          h={H_BASE}
          transform={`translateZ(-${D / 2}px) rotateY(180deg)`}
          className="bg-[#0a0e12] border-x border-b border-[rgba(184,146,74,0.30)] rounded-b-lg"
        >
          <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(184,146,74,0.5)_3px,rgba(184,146,74,0.5)_4px)]" />
        </Face>

        {/* Sides */}
        <Face
          w={D}
          h={H_BASE}
          transform={`translateX(-${W / 2}px) rotateY(-90deg)`}
          className="bg-[#0a0e12] border-x border-b border-[rgba(184,146,74,0.3)] rounded-b-lg"
        />
        <Face
          w={D}
          h={H_BASE}
          transform={`translateX(${W / 2}px) rotateY(90deg)`}
          className="bg-[#0a0e12] border-x border-b border-[rgba(184,146,74,0.3)] rounded-b-lg"
        />

        {/* Bottom */}
        <Face
          w={W}
          h={D}
          transform={`translateY(${H_BASE / 2}px) rotateX(-90deg)`}
          bg="bg-[#08090a] rounded-lg"
        />

        {/* Inner foam walls */}
        <Face
          w={W}
          h={H_BASE}
          transform={`translateZ(${D / 2 - 4}px) rotateY(180deg)`}
          bg="bg-[#0b0c0e]"
          innerBlur
        />
        <Face
          w={W}
          h={H_BASE}
          transform={`translateZ(-${D / 2 - 4}px)`}
          bg="bg-[#0b0c0e]"
          innerBlur
        />
        <Face
          w={D}
          h={H_BASE}
          transform={`translateX(-${W / 2 - 4}px) rotateY(90deg)`}
          bg="bg-[#0b0c0e]"
          innerBlur
        />
        <Face
          w={D}
          h={H_BASE}
          transform={`translateX(${W / 2 - 4}px) rotateY(-90deg)`}
          bg="bg-[#0b0c0e]"
          innerBlur
        />

        {/* Floor — interior content lives here */}
        <Face
          w={W}
          h={D}
          transform={`translateY(${H_BASE / 2 - 4}px) rotateX(90deg)`}
          bg="bg-[#050505] rounded-md"
          pointerEvents={floorContent ? "auto" : "none"}
        >
          {floorContent}
        </Face>
      </div>

      {/* ===== LID ===== */}
      <motion.div
        className="absolute inset-x-0 top-0 [transform-style:preserve-3d]"
        style={
          {
            height: H_LID,
            transformOrigin: `50% 100% -${D / 2}px`,
            rotateX: lidRotateX as any,
          } as MotionStyle
        }
      >
        {/* Lid front */}
        <Face
          w={W}
          h={H_LID}
          transform={`translateZ(${D / 2}px)`}
          className="bg-[#0a0e12] border-x border-t border-[rgba(184,146,74,0.30)] rounded-t-lg shadow-[inset_0_2px_10px_rgba(184,146,74,0.05)] overflow-hidden"
        >
          <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_4px),repeating-linear-gradient(-45deg,#111_0,#111_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40" />
          <div className="absolute bottom-0 w-full px-32 flex justify-between z-10">
            <LidLatchStub />
            <LidLatchStub />
          </div>
          <Handle />
          <div className="absolute top-[-1px] left-[-1px] w-12 h-12 border-l-4 border-t-4 border-[rgba(184,146,74,0.40)] rounded-tl-lg mix-blend-screen opacity-50 z-20" />
          <div className="absolute top-[-1px] right-[-1px] w-12 h-12 border-r-4 border-t-4 border-[rgba(184,146,74,0.40)] rounded-tr-lg mix-blend-screen opacity-50 z-20" />
        </Face>

        <Face
          w={W}
          h={H_LID}
          transform={`translateZ(-${D / 2}px) rotateY(180deg)`}
          className="bg-[#0a0e12] border-x border-t border-[rgba(184,146,74,0.3)] rounded-t-lg"
        >
          <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(184,146,74,0.5)_3px,rgba(184,146,74,0.5)_4px)]" />
        </Face>

        <Face
          w={D}
          h={H_LID}
          transform={`translateX(-${W / 2}px) rotateY(-90deg)`}
          className="bg-[#0a0e12] border-[rgba(184,146,74,0.3)] rounded-t-lg"
        />
        <Face
          w={D}
          h={H_LID}
          transform={`translateX(${W / 2}px) rotateY(90deg)`}
          className="bg-[#0a0e12] border-[rgba(184,146,74,0.3)] rounded-t-lg"
        />

        {/* Lid top */}
        <Face
          w={W}
          h={D}
          transform={`translateY(-${H_LID / 2}px) rotateX(90deg)`}
          className="bg-[#0a0e12] border border-[rgba(184,146,74,0.4)] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] rounded-lg"
        >
          <div className="absolute inset-10 border border-[rgba(184,146,74,0.1)] shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded pointer-events-none" />
          <div className="absolute inset-20 border border-[rgba(184,146,74,0.1)] shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded pointer-events-none" />
        </Face>

        {/* Lid inner foam */}
        <Face
          w={W}
          h={H_LID}
          transform={`translateZ(${D / 2 - 4}px) rotateY(180deg)`}
          bg="bg-[#040608]"
          innerBlur
        />
        <Face
          w={W}
          h={H_LID}
          transform={`translateZ(-${D / 2 - 4}px)`}
          bg="bg-[#040608]"
          innerBlur
        />
        <Face
          w={D}
          h={H_LID}
          transform={`translateX(-${W / 2 - 4}px) rotateY(90deg)`}
          bg="bg-[#040608]"
          innerBlur
        />
        <Face
          w={D}
          h={H_LID}
          transform={`translateX(${W / 2 - 4}px) rotateY(-90deg)`}
          bg="bg-[#040608]"
          innerBlur
        />

        {/* Lid inner roof */}
        <Face
          w={W}
          h={D}
          transform={`translateY(-${H_LID / 2 - 4}px) rotateX(-90deg)`}
          className="bg-[#020304] rounded-lg"
        >
          <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#070a0d_0,#070a0d_10px,transparent_10px,transparent_20px)] shadow-[inset_0_0_120px_rgba(0,0,0,1)]" />
        </Face>
      </motion.div>
    </motion.div>
  );
};

/**
 * Convenience wrapper: closed toolbox sized to fit a given pixel width (height
 * computed from the natural aspect ratio). Used as the static shelf prop.
 */
interface ClosedProps {
  width?: number;
  /** Kept for backwards-compat; ignored. Shelf prop is now front-on. */
  tilt?: boolean;
}
export const ToolboxClosed: React.FC<ClosedProps> = ({ width = 220 }) => {
  const ratio = (TBX_H_BASE + TBX_H_LID) / TBX_W;
  const bodyHeight = width * ratio;
  // Handle sticks ~50px above the lid in unit space — account for it so the
  // toolbox sits flush on the shelf plank without being clipped.
  const handleOverhang = 50 * (width / TBX_W);
  const height = bodyHeight + handleOverhang;
  const scale = width / TBX_W;
  return (
    <div
      style={{
        width,
        height,
        perspective: 1400,
        perspectiveOrigin: "50% 50%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: TBX_W,
          height: TBX_H_BASE + TBX_H_LID,
          transform: `scale(${scale})`,
          transformOrigin: "bottom center",
        }}
      >
        <Toolbox3D
          scale={1}
          rotateX="0deg"
          rotateY="0deg"
          lidRotateX="0deg"
        />
      </div>
    </div>
  );
};

