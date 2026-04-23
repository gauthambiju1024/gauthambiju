import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";

/** Laptop with a lid that closes when `eod` MotionValue approaches 1. */
export const LaptopClosable = ({
  position = [0.0, 0, 0.1] as [number, number, number],
  rotation = [0, 0.1, 0] as [number, number, number],
  eod,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  eod: MotionValue<number>;
}) => {
  const lid = useRef<THREE.Group>(null!);
  const { invalidate } = useThree();
  useFrame(() => {
    if (!lid.current) return;
    const v = eod.get(); // 0 open, 1 closed
    // open ~ -1.92 rad (~110°), closed ~ 0
    const target = THREE.MathUtils.lerp(-1.92, -0.02, v);
    const cur = lid.current.rotation.x;
    if (Math.abs(cur - target) > 0.001) {
      lid.current.rotation.x = THREE.MathUtils.lerp(cur, target, 0.08);
      invalidate();
    }
  });
  return (
    <group position={position} rotation={rotation}>
      {/* base */}
      <RoundedBox args={[0.66, 0.022, 0.44]} radius={0.012} smoothness={4} castShadow receiveShadow position={[0, 0.011, 0]}>
        <meshPhysicalMaterial color="#2a2a2e" roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.3} metalness={0.3} />
      </RoundedBox>
      {/* keyboard well */}
      <mesh position={[0, 0.023, 0.04]}>
        <boxGeometry args={[0.58, 0.001, 0.3]} />
        <meshStandardMaterial color="#141416" roughness={0.8} />
      </mesh>
      {/* trackpad */}
      <mesh position={[0, 0.024, 0.17]}>
        <boxGeometry args={[0.24, 0.001, 0.1]} />
        <meshPhysicalMaterial color="#1a1a1d" roughness={0.35} clearcoat={0.6} />
      </mesh>
      {/* hinge + lid */}
      <group position={[0, 0.022, -0.21]}>
        <group ref={lid} rotation={[-1.92, 0, 0]}>
          <RoundedBox args={[0.66, 0.018, 0.42]} radius={0.012} smoothness={4} castShadow position={[0, 0.009, -0.21]}>
            <meshPhysicalMaterial color="#24242a" roughness={0.5} clearcoat={0.5} clearcoatRoughness={0.25} metalness={0.35} />
          </RoundedBox>
          {/* screen */}
          <mesh position={[0, 0.019, -0.21]}>
            <planeGeometry args={[0.6, 0.37]} />
            <meshPhysicalMaterial color="#0a0e0c" roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} emissive="#1a3328" emissiveIntensity={0.12} />
          </mesh>
          {/* tiny gold logo */}
          <mesh position={[0, 0.0191, -0.01]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.012, 24]} />
            <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.25} clearcoat={1} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/** Stack of 3 hardcover books, spines out. */
export const BookStack = ({ position = [1.55, 0, 0.35] as [number, number, number] }) => {
  const specs = [
    { w: 0.34, h: 0.042, d: 0.22, color: "#5a3318", rot: 0.02 },
    { w: 0.3, h: 0.05, d: 0.2, color: "#7a5d2a", rot: -0.03 },
    { w: 0.28, h: 0.038, d: 0.19, color: "#eae0c8", rot: 0.015 },
  ];
  let y = 0;
  return (
    <group position={position} rotation={[0, -0.3, 0]}>
      {specs.map((b, i) => {
        const el = (
          <group key={i} position={[0, y + b.h / 2, 0]} rotation={[0, b.rot, 0]}>
            <RoundedBox args={[b.w, b.h, b.d]} radius={0.004} smoothness={3} castShadow receiveShadow>
              <meshPhysicalMaterial color={b.color} roughness={0.7} clearcoat={0.25} clearcoatRoughness={0.4} />
            </RoundedBox>
            {/* gold gilt line on spine */}
            <mesh position={[b.w / 2 + 0.001, 0, 0]}>
              <boxGeometry args={[0.001, b.h * 0.3, b.d * 0.5]} />
              <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.3} clearcoat={1} />
            </mesh>
            {/* page edges */}
            <mesh position={[-b.w / 2 + 0.002, 0, 0]}>
              <boxGeometry args={[0.002, b.h * 0.85, b.d * 0.94]} />
              <meshStandardMaterial color="#efe4cf" roughness={0.9} />
            </mesh>
          </group>
        );
        y += b.h;
        return el;
      })}
    </group>
  );
};

/** Fanned sticky note stack with a tiny scribble hint. */
export const StickyNotes = ({ position = [0.42, 0, 0.32] as [number, number, number] }) => {
  const notes = [
    { color: "#f4e38a", rot: 0.12, off: [0.0, 0, 0] as [number, number, number] },
    { color: "#f4d0a0", rot: -0.08, off: [0.018, 0.003, 0.01] as [number, number, number] },
    { color: "#e8f0b8", rot: 0.18, off: [-0.012, 0.006, -0.008] as [number, number, number] },
  ];
  return (
    <group position={position}>
      {notes.map((n, i) => (
        <group key={i} position={n.off} rotation={[0, n.rot, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.002, 0.1]} />
            <meshStandardMaterial color={n.color} roughness={0.88} />
          </mesh>
          {/* scribble on top note */}
          {i === 2 && (
            <>
              <mesh position={[-0.015, 0.0015, -0.01]}>
                <boxGeometry args={[0.04, 0.0005, 0.002]} />
                <meshStandardMaterial color="#2a2a2a" />
              </mesh>
              <mesh position={[-0.005, 0.0015, 0.008]}>
                <boxGeometry args={[0.055, 0.0005, 0.002]} />
                <meshStandardMaterial color="#2a2a2a" />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
};

/** Rolled blueprint leaning. */
export const BlueprintTube = ({ position = [-2.1, 0, 0.2] as [number, number, number] }) => {
  return (
    <group position={position} rotation={[0, 0.3, 0.25]}>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 32]} />
        <meshStandardMaterial color="#c8d4c0" roughness={0.9} />
      </mesh>
      {/* blue edge */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.0352, 0.0352, 0.5, 32, 1, true]} />
        <meshStandardMaterial color="#2a4a5a" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* end caps */}
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.037, 0.037, 0.015, 32]} />
        <meshPhysicalMaterial color="#b8862f" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
    </group>
  );
};

/** Drafting triangle + mechanical pencil. */
export const DraftingTools = ({ position = [-1.45, 0, 0.55] as [number, number, number] }) => {
  const triGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.32, 0);
    shape.lineTo(0, 0.2);
    shape.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.004, bevelEnabled: false });
  }, []);
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0.35]}>
      <mesh geometry={triGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#3a5a6a" transparent opacity={0.55} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* pencil on top */}
      <mesh position={[0.12, 0.08, 0.006]} rotation={[0, 0, 0.6]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 12]} />
        <meshStandardMaterial color="#d4a73a" roughness={0.55} />
      </mesh>
    </group>
  );
};

/** Notebook with a pen resting diagonally on top. */
export const NotebookWithPen = ({ position = [-1.1, 0, 0.35] as [number, number, number] }) => (
  <group position={position} rotation={[0, 0.12, 0]}>
    <RoundedBox args={[0.34, 0.028, 0.46]} radius={0.012} smoothness={4} castShadow receiveShadow position={[0, 0.014, 0]}>
      <meshPhysicalMaterial color="#2e1a0e" roughness={0.6} clearcoat={0.4} clearcoatRoughness={0.3} />
    </RoundedBox>
    {/* brass corner */}
    <mesh position={[0.15, 0.029, 0.2]} castShadow>
      <boxGeometry args={[0.03, 0.002, 0.03]} />
      <meshPhysicalMaterial color="#c79a45" metalness={1} roughness={0.25} clearcoat={1} />
    </mesh>
    {/* page edges */}
    <mesh position={[0, 0.014, 0.231]}>
      <boxGeometry args={[0.32, 0.022, 0.003]} />
      <meshStandardMaterial color="#efe4cf" roughness={0.9} />
    </mesh>
    {/* pen resting diagonally */}
    <group position={[0, 0.032, 0]} rotation={[0, 0.7, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.26, 16]} />
        <meshPhysicalMaterial color="#0e0e10" metalness={0.5} roughness={0.25} clearcoat={0.9} />
      </mesh>
      <mesh position={[0.13, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.008, 0.022, 12]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.22} clearcoat={1} />
      </mesh>
    </group>
  </group>
);

/** Brass clock-paperweight; ticks once on EOD. */
export const BrassPaperweight = ({
  position = [1.95, 0, 0.5] as [number, number, number],
  eod,
}: {
  position?: [number, number, number];
  eod: MotionValue<number>;
}) => {
  const hand = useRef<THREE.Mesh>(null!);
  const { invalidate } = useThree();
  useFrame(() => {
    if (!hand.current) return;
    const v = eod.get();
    const target = v * Math.PI * 0.12;
    const cur = hand.current.rotation.y;
    if (Math.abs(cur - target) > 0.001) {
      hand.current.rotation.y = THREE.MathUtils.lerp(cur, target, 0.1);
      invalidate();
    }
  });
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.022, 0]}>
        <cylinderGeometry args={[0.07, 0.075, 0.044, 48]} />
        <meshPhysicalMaterial color="#c79a45" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* face */}
      <mesh position={[0, 0.0442, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.062, 48]} />
        <meshStandardMaterial color="#efe4cf" roughness={0.7} />
      </mesh>
      {/* hand */}
      <mesh ref={hand} position={[0, 0.0444, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.002, 0.045, 0.001]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* center pin */}
      <mesh position={[0, 0.0445, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.003, 16]} />
        <meshPhysicalMaterial color="#8a6a2a" metalness={1} roughness={0.35} />
      </mesh>
    </group>
  );
};
