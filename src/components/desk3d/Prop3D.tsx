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
    if (active && !reduceMotion) {
      targetLift = 0.05 + Math.sin(performance.now() * 0.002) * 0.02;
    } else if (hovered) {
      targetLift = 0.07;
    }
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + targetLift, Math.min(1, dt * 8));
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
        <pointLight position={[0, 0.6, 0.2]} intensity={0.6} distance={1.2} color="#5b8cff" />
      )}
      {(hovered || active) && (
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.42, 48]} />
          <meshBasicMaterial color={active ? "#7aa3ff" : "#ffd9a0"} transparent opacity={active ? 0.55 : 0.35} />
        </mesh>
      )}
      {/* contact shadow */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

export default Prop3D;
