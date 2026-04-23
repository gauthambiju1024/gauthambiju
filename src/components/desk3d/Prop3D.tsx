import { ReactNode, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FrameId } from "@/components/desk/frames/FrameTypes";

interface Prop3DProps {
  id: FrameId;
  label: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  active: boolean;
  onSelect: (id: FrameId) => void;
  reduceMotion?: boolean;
  children: ReactNode;
}

const Prop3D = ({ id, label, position, rotation = [0, 0, 0], active, onSelect, reduceMotion, children }: Prop3DProps) => {
  const group = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const { invalidate } = useThree();

  useFrame((_, dt) => {
    if (!group.current) return;
    const baseY = position[1];
    let targetLift = 0;
    let targetScale = 1;
    if (active && !reduceMotion) {
      targetLift = 0.06 + Math.sin(performance.now() * 0.002) * 0.02;
      targetScale = 1.05;
    } else if (hovered) {
      targetLift = 0.05;
      targetScale = 1.04;
    }
    const k = Math.min(1, dt * 8);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + targetLift, k);
    const s = THREE.MathUtils.lerp(group.current.scale.x, targetScale, k);
    group.current.scale.set(s, s, s);
    if (active && !reduceMotion) invalidate();
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; invalidate(); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = ""; invalidate(); }}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
    >
      {children}
      {active && (
        <pointLight position={[0, 0.5, 0.2]} intensity={0.55} distance={1.4} color="#9ec0ff" />
      )}
      {(hovered || active) && (
        <mesh position={[0, 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 48]} />
          <meshBasicMaterial
            color={active ? "#9ec0ff" : "#ffd9a0"}
            transparent
            opacity={active ? 0.22 : 0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};

export default Prop3D;
