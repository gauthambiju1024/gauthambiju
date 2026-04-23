import * as THREE from "three";

export const Lamp = ({ position = [-1.6, 0, -0.4] as [number,number,number] }) => (
  <group position={position}>
    {/* base */}
    <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.12, 0.14, 0.04, 24]} />
      <meshStandardMaterial color="#2a2522" metalness={0.6} roughness={0.4} />
    </mesh>
    {/* arm */}
    <mesh castShadow position={[0, 0.3, 0]} rotation={[0, 0, 0.3]}>
      <cylinderGeometry args={[0.012, 0.012, 0.55, 12]} />
      <meshStandardMaterial color="#3a322c" metalness={0.7} roughness={0.35} />
    </mesh>
    {/* shade */}
    <mesh castShadow position={[0.18, 0.55, 0]} rotation={[0, 0, -0.6]}>
      <coneGeometry args={[0.18, 0.22, 24, 1, true]} />
      <meshStandardMaterial color="#1a1612" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
    </mesh>
    {/* bulb glow */}
    <pointLight position={[0.18, 0.5, 0]} intensity={1.4} distance={3.5} color="#ffd9a0" castShadow />
    <mesh position={[0.18, 0.46, 0]}>
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshBasicMaterial color="#ffe9b8" />
    </mesh>
  </group>
);

export const Mug = ({ position = [-1.05, 0, 0.15] as [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 0.09, 0]}>
      <cylinderGeometry args={[0.08, 0.07, 0.18, 24]} />
      <meshStandardMaterial color="#1c1814" roughness={0.6} />
    </mesh>
    <mesh position={[0.085, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.05, 0.012, 8, 16, Math.PI]} />
      <meshStandardMaterial color="#1c1814" roughness={0.6} />
    </mesh>
    {/* coffee */}
    <mesh position={[0, 0.175, 0]}>
      <cylinderGeometry args={[0.075, 0.075, 0.005, 24]} />
      <meshStandardMaterial color="#2a1505" roughness={0.3} />
    </mesh>
  </group>
);

export const Plant = ({ position = [-1.55, 0, 0.55] as [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.09, 0.07, 0.12, 16]} />
      <meshStandardMaterial color="#3d2c20" roughness={0.8} />
    </mesh>
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh key={i} position={[Math.cos(i) * 0.04, 0.18 + i * 0.02, Math.sin(i) * 0.04]} rotation={[0.3 * Math.cos(i), i, 0.3 * Math.sin(i)]} castShadow>
        <coneGeometry args={[0.04, 0.16, 6]} />
        <meshStandardMaterial color={`hsl(${100 + i * 10}, 40%, ${25 + i * 4}%)`} roughness={0.85} />
      </mesh>
    ))}
  </group>
);

export const PenHolder = ({ position = [1.25, 0, 0.2] as [number,number,number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, 0.07, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.14, 20]} />
      <meshStandardMaterial color="#1c1814" roughness={0.7} />
    </mesh>
    {[
      { c: "#d4a73a", r: 0.05 },
      { c: "#a8281e", r: -0.05 },
      { c: "#3b6cd9", r: 0.02 },
    ].map((p, i) => (
      <mesh key={i} position={[Math.cos(i * 2) * 0.025, 0.2, Math.sin(i * 2) * 0.025]} rotation={[p.r, 0, p.r * 1.5]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />
        <meshStandardMaterial color={p.c} roughness={0.5} />
      </mesh>
    ))}
  </group>
);

export const Polaroids = ({ position = [1.55, 0, 0.5] as [number,number,number] }) => (
  <group position={position} rotation={[0, -0.2, 0]}>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[i * 0.04, 0.005 + i * 0.005, i * 0.03]} rotation={[0, i * 0.15 - 0.1, 0]} castShadow>
        <boxGeometry args={[0.18, 0.005, 0.22]} />
        <meshStandardMaterial color="#f8f3e3" roughness={0.9} />
      </mesh>
    ))}
  </group>
);
