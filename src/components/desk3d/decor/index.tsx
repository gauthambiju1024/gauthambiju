import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

export const Lamp = ({ position = [-1.6, 0, -0.4] as [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.12, 0.14, 0.04, 32]} />
      <meshPhysicalMaterial color="#c79a45" metalness={1} roughness={0.3} clearcoat={1} />
    </mesh>
    <mesh castShadow position={[0, 0.3, 0]} rotation={[0, 0, 0.3]}>
      <cylinderGeometry args={[0.012, 0.012, 0.55, 16]} />
      <meshPhysicalMaterial color="#b8862f" metalness={1} roughness={0.32} />
    </mesh>
    <mesh castShadow position={[0.18, 0.55, 0]} rotation={[0, 0, -0.6]}>
      <coneGeometry args={[0.18, 0.22, 32, 1, true]} />
      <meshPhysicalMaterial color="#15110d" metalness={0.5} roughness={0.45} clearcoat={0.3} side={THREE.DoubleSide} />
    </mesh>
    <pointLight position={[0.18, 0.5, 0]} intensity={1.6} distance={3.8} color="#ffd9a0" castShadow />
    <mesh position={[0.18, 0.46, 0]}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color="#fff1cf" />
    </mesh>
  </group>
);

export const Mug = ({ position = [-1.05, 0, 0.15] as [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 0.09, 0]}>
      <cylinderGeometry args={[0.08, 0.07, 0.18, 32]} />
      <meshPhysicalMaterial color="#1c1814" roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.2} />
    </mesh>
    <mesh position={[0.085, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.05, 0.012, 12, 24, Math.PI]} />
      <meshPhysicalMaterial color="#1c1814" roughness={0.35} clearcoat={0.6} />
    </mesh>
    <mesh position={[0, 0.175, 0]}>
      <cylinderGeometry args={[0.075, 0.075, 0.005, 32]} />
      <meshPhysicalMaterial color="#2a1505" roughness={0.2} clearcoat={0.5} />
    </mesh>
  </group>
);

export const Plant = ({ position = [-1.55, 0, 0.55] as [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.09, 0.07, 0.12, 24]} />
      <meshPhysicalMaterial color="#3d2c20" roughness={0.7} clearcoat={0.3} />
    </mesh>
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh key={i} position={[Math.cos(i) * 0.04, 0.18 + i * 0.02, Math.sin(i) * 0.04]} rotation={[0.3 * Math.cos(i), i, 0.3 * Math.sin(i)]} castShadow>
        <coneGeometry args={[0.04, 0.16, 8]} />
        <meshStandardMaterial color={`hsl(${100 + i * 10}, 40%, ${25 + i * 4}%)`} roughness={0.85} />
      </mesh>
    ))}
  </group>
);

export const PenHolder = ({ position = [1.25, 0, 0.2] as [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 0.07, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.14, 32]} />
      <meshPhysicalMaterial color="#c79a45" metalness={1} roughness={0.32} clearcoat={1} />
    </mesh>
    {/* fountain pen */}
    <mesh position={[0.02, 0.2, 0.01]} rotation={[0.04, 0, 0.06]} castShadow>
      <cylinderGeometry args={[0.007, 0.007, 0.24, 12]} />
      <meshPhysicalMaterial color="#0e0e10" metalness={0.4} roughness={0.3} clearcoat={0.8} />
    </mesh>
    <mesh position={[0.025, 0.31, 0.012]} rotation={[0.04, 0, 0.06]} castShadow>
      <cylinderGeometry args={[0.0075, 0.0075, 0.05, 12]} />
      <meshPhysicalMaterial color="#e8e8ee" metalness={1} roughness={0.15} clearcoat={1} />
    </mesh>
    {/* wood pencil */}
    <mesh position={[-0.025, 0.2, -0.01]} rotation={[-0.05, 0, -0.07]} castShadow>
      <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
      <meshStandardMaterial color="#d4a73a" roughness={0.7} />
    </mesh>
    {/* red marker */}
    <mesh position={[-0.005, 0.2, 0.025]} rotation={[0.02, 0, 0.03]} castShadow>
      <cylinderGeometry args={[0.008, 0.008, 0.2, 12]} />
      <meshStandardMaterial color="#a8281e" roughness={0.45} />
    </mesh>
  </group>
);

export const ClosedJournal = ({ position = [1.55, 0, 0.5] as [number,number,number] }) => (
  <group position={position} rotation={[0, -0.25, 0]}>
    <RoundedBox args={[0.32, 0.05, 0.42]} radius={0.012} smoothness={4} castShadow receiveShadow position={[0, 0.025, 0]}>
      <meshPhysicalMaterial color="#3a1f12" roughness={0.55} clearcoat={0.45} clearcoatRoughness={0.35} />
    </RoundedBox>
    {/* page edge */}
    <mesh position={[0, 0.025, 0.21]}>
      <boxGeometry args={[0.3, 0.04, 0.005]} />
      <meshStandardMaterial color="#efe4cf" roughness={0.9} />
    </mesh>
    {/* embossed gold mark */}
    <mesh position={[0, 0.051, 0]}>
      <boxGeometry args={[0.06, 0.002, 0.06]} />
      <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.22} clearcoat={1} />
    </mesh>
  </group>
);
