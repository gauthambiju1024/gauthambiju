import { useRef } from "react";
import * as THREE from "three";
import { useFrame, ThreeEvent, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";

interface Props {
  /** Scroll progress 0..1 */
  progress: MotionValue<number>;
  /** EOD 0..1 — dims idle dots */
  eod: MotionValue<number>;
  count: number;
  onJump: (i: number) => void;
}

const BAR_WIDTH = 3.2;
const BAR_Y = 0.62;
const BAR_Z = -0.25;

/**
 * A thin brass bar suspended above the back of the desk, holding N tiny LED dots.
 * The active position (from scrollYProgress) is a continuous amber light that slides
 * between dots; a real pointlight travels beneath it casting a warm pool on the desk.
 * Clicking a dot jumps to that section.
 */
const StatusLightBar = ({ progress, eod, count, onJump }: Props) => {
  const lightRef = useRef<THREE.PointLight>(null!);
  const travelerRef = useRef<THREE.Mesh>(null!);
  const dotsRef = useRef<(THREE.Mesh | null)[]>([]);
  const { invalidate } = useThree();

  const dotX = (i: number) => {
    if (count <= 1) return 0;
    const half = BAR_WIDTH / 2 - 0.15;
    return -half + (i / (count - 1)) * (half * 2);
  };

  useFrame(() => {
    const p = Math.max(0, Math.min(1, progress.get()));
    const idxF = p * (count - 1);
    const activeIdx = Math.round(idxF);
    const half = BAR_WIDTH / 2 - 0.15;
    const x = -half + idxF * (half * 2 / Math.max(1, count - 1));
    const e = eod.get();

    if (travelerRef.current) {
      travelerRef.current.position.x = x;
      const mat = travelerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.2 - e * 0.6;
    }
    if (lightRef.current) {
      lightRef.current.position.x = x;
      lightRef.current.intensity = 1.2 - e * 0.5;
    }
    dotsRef.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      const isActive = i === activeIdx;
      const base = isActive ? 0.25 : 0.06 - e * 0.04;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, base, 0.15);
    });
    invalidate();
  });

  return (
    <group position={[0, BAR_Y, BAR_Z]}>
      {/* brass bar */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[BAR_WIDTH, 0.02, 0.025]} />
        <meshPhysicalMaterial color="#b8862f" metalness={1} roughness={0.32} clearcoat={1} />
      </mesh>
      {/* thin wire suspensions */}
      <mesh position={[-BAR_WIDTH / 2 + 0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.0015, 0.0015, 0.6, 6]} />
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[BAR_WIDTH / 2 - 0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.0015, 0.0015, 0.6, 6]} />
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* idle LED dots */}
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[dotX(i), -0.012, 0.014]}>
          <mesh
            ref={(el) => (dotsRef.current[i] = el)}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              onJump(i);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "";
            }}
          >
            {/* invisible hit pad via scale */}
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshStandardMaterial color="#ffb86b" emissive="#ffb86b" emissiveIntensity={0.06} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* active traveling light dot */}
      <mesh ref={travelerRef} position={[0, -0.012, 0.018]}>
        <sphereGeometry args={[0.016, 20, 20]} />
        <meshStandardMaterial color="#ffd9a0" emissive="#ffb86b" emissiveIntensity={2.2} roughness={0.2} />
      </mesh>
      {/* real pointlight casting pool on desk */}
      <pointLight ref={lightRef} position={[0, -0.05, 0.05]} intensity={1.2} color="#ffc98a" distance={1.8} decay={2} />
    </group>
  );
};

export default StatusLightBar;
