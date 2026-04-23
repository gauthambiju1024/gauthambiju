import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { coffeeTexture, brassRoughnessTexture } from "../textures";

export const Lamp = ({ position = [2.0, 0, -0.05] as [number, number, number] }) => {
  const brassRough = useMemo(() => brassRoughnessTexture(), []);
  // lathe profile for shade
  const shadeGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const r = 0.06 + t * 0.13;
      pts.push(new THREE.Vector2(r, t * 0.22));
    }
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group position={position}>
      {/* base */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.04, 48]} />
        <meshPhysicalMaterial color="#c79a45" metalness={1} roughnessMap={brassRough} roughness={0.28} clearcoat={1} />
      </mesh>
      {/* base ring */}
      <mesh position={[0, 0.045, 0]}>
        <torusGeometry args={[0.13, 0.008, 12, 48]} />
        <meshPhysicalMaterial color="#a8822f" metalness={1} roughness={0.35} clearcoat={1} />
      </mesh>
      {/* lower arm */}
      <mesh castShadow position={[0.05, 0.22, 0]} rotation={[0, 0, 0.45]}>
        <cylinderGeometry args={[0.013, 0.013, 0.4, 16]} />
        <meshPhysicalMaterial color="#b8862f" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* joint */}
      <mesh castShadow position={[-0.04, 0.4, 0]}>
        <sphereGeometry args={[0.022, 24, 24]} />
        <meshPhysicalMaterial color="#a8822f" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* upper arm */}
      <mesh castShadow position={[-0.12, 0.5, 0]} rotation={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 16]} />
        <meshPhysicalMaterial color="#b8862f" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* shade (lathe) */}
      <group position={[-0.2, 0.55, 0]} rotation={[Math.PI, 0, 0.6]}>
        <mesh geometry={shadeGeo} castShadow>
          <meshPhysicalMaterial color="#15110d" metalness={0.6} roughness={0.4} clearcoat={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* inner reflective */}
        <mesh geometry={shadeGeo} scale={[0.97, 0.97, 0.97]}>
          <meshStandardMaterial color="#fff4d6" roughness={0.5} side={THREE.BackSide} emissive="#ffe1a8" emissiveIntensity={0.3} />
        </mesh>
      </group>
      {/* bulb */}
      <mesh position={[-0.2, 0.5, 0.04]}>
        <sphereGeometry args={[0.04, 24, 24]} />
        <meshBasicMaterial color="#fff1cf" />
      </mesh>
      {/* spotlight from shade for realistic warm pool */}
      <spotLight
        position={[-0.2, 0.5, 0.05]}
        target-position={[-0.6, 0, 0.4]}
        angle={0.65}
        penumbra={0.6}
        intensity={2.4}
        distance={4.5}
        decay={1.6}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
};

export const Mug = ({ position = [-1.4, 0, 0.5] as [number, number, number] }) => {
  const coffee = useMemo(() => coffeeTexture(), []);
  // lathe profile for ceramic body
  const bodyGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.07, 0),
      new THREE.Vector2(0.072, 0.005),
      new THREE.Vector2(0.075, 0.02),
      new THREE.Vector2(0.078, 0.06),
      new THREE.Vector2(0.082, 0.12),
      new THREE.Vector2(0.084, 0.17),
      new THREE.Vector2(0.085, 0.18),
      new THREE.Vector2(0.082, 0.181),
      new THREE.Vector2(0.078, 0.179),
    ];
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group position={position}>
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#1c1814" roughness={0.32} clearcoat={1} clearcoatRoughness={0.08} iridescence={0.1} />
      </mesh>
      {/* handle */}
      <mesh position={[0.085, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.05, 0.014, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color="#1c1814" roughness={0.32} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      {/* coffee surface */}
      <mesh position={[0, 0.175, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.005, 48]} />
        <meshPhysicalMaterial map={coffee} color="#3a1f0c" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
    </group>
  );
};

export const Plant = ({ position = [-2.0, 0, 0.0] as [number, number, number] }) => {
  // terracotta lathe profile
  const potGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.06, 0),
      new THREE.Vector2(0.07, 0.02),
      new THREE.Vector2(0.085, 0.1),
      new THREE.Vector2(0.092, 0.13),
      new THREE.Vector2(0.094, 0.14),
      new THREE.Vector2(0.091, 0.14),
    ];
    return new THREE.LatheGeometry(pts, 32);
  }, []);
  // leaf shape
  const leafGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.04, 0.05, 0.04, 0.18, 0, 0.22);
    shape.bezierCurveTo(-0.04, 0.18, -0.04, 0.05, 0, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.004, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.002, bevelSegments: 2 });
  }, []);
  return (
    <group position={position}>
      <mesh geometry={potGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#9a4a2a" roughness={0.85} clearcoat={0.15} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.135, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.01, 32]} />
        <meshStandardMaterial color="#2a1808" roughness={0.95} />
      </mesh>
      {/* leaves */}
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            geometry={leafGeo}
            position={[Math.cos(a) * 0.03, 0.14, Math.sin(a) * 0.03]}
            rotation={[0.4 + Math.cos(i) * 0.2, a, Math.sin(i) * 0.3]}
            castShadow
          >
            <meshStandardMaterial color={`hsl(${100 + (i % 3) * 12}, 45%, ${28 + (i % 4) * 4}%)`} roughness={0.75} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};

export const PenHolder = ({ position = [1.8, 0, 0.4] as [number, number, number] }) => {
  const brassRough = useMemo(() => brassRoughnessTexture(), []);
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.14, 48]} />
        <meshPhysicalMaterial color="#c79a45" metalness={1} roughnessMap={brassRough} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* top rim */}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.08, 0.005, 12, 48]} />
        <meshPhysicalMaterial color="#a8822f" metalness={1} roughness={0.32} clearcoat={1} />
      </mesh>
      {/* black pen */}
      <mesh position={[0.02, 0.2, 0.01]} rotation={[0.04, 0, 0.06]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.24, 16]} />
        <meshPhysicalMaterial color="#0e0e10" metalness={0.5} roughness={0.25} clearcoat={0.9} />
      </mesh>
      <mesh position={[0.022, 0.085, 0.012]} rotation={[Math.PI + 0.04, 0, 0.06]} castShadow>
        <coneGeometry args={[0.007, 0.025, 12]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* pencil */}
      <mesh position={[-0.025, 0.2, -0.01]} rotation={[-0.05, 0, -0.07]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
        <meshStandardMaterial color="#d4a73a" roughness={0.6} />
      </mesh>
      {/* red marker */}
      <mesh position={[-0.005, 0.2, 0.025]} rotation={[0.02, 0, 0.03]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 16]} />
        <meshPhysicalMaterial color="#a8281e" roughness={0.4} clearcoat={0.4} />
      </mesh>
      {/* marker cap */}
      <mesh position={[-0.005, 0.305, 0.025]} rotation={[0.02, 0, 0.03]}>
        <cylinderGeometry args={[0.0085, 0.0085, 0.025, 16]} />
        <meshPhysicalMaterial color="#5a1010" roughness={0.5} clearcoat={0.5} />
      </mesh>
    </group>
  );
};

export const ClosedJournal = ({ position = [2.2, 0, 0.45] as [number, number, number] }) => (
  <group position={position} rotation={[0, -0.25, 0]}>
    <RoundedBox args={[0.32, 0.05, 0.42]} radius={0.014} smoothness={5} castShadow receiveShadow position={[0, 0.025, 0]}>
      <meshPhysicalMaterial color="#3a1f12" roughness={0.55} clearcoat={0.45} clearcoatRoughness={0.35} sheen={0.3} sheenColor="#1a0a04" />
    </RoundedBox>
    {/* page edges */}
    <mesh position={[0, 0.025, 0.21]}>
      <boxGeometry args={[0.3, 0.04, 0.005]} />
      <meshStandardMaterial color="#efe4cf" roughness={0.9} />
    </mesh>
    {/* elastic strap */}
    <mesh position={[-0.06, 0.052, 0]}>
      <boxGeometry args={[0.012, 0.001, 0.42]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
    </mesh>
    {/* gold corners */}
    {[[-0.14, 0.18], [0.14, 0.18], [-0.14, -0.18], [0.14, -0.18]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.051, z]} castShadow>
        <boxGeometry args={[0.035, 0.002, 0.035]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.25} clearcoat={1} />
      </mesh>
    ))}
    {/* monogram */}
    <mesh position={[0, 0.051, 0]}>
      <boxGeometry args={[0.05, 0.002, 0.05]} />
      <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.22} clearcoat={1} />
    </mesh>
  </group>
);

export const PolaroidStack = ({ position = [1.3, 0, 0.55] as [number, number, number] }) => (
  <group position={position} rotation={[0, -0.35, 0]}>
    {[0, 1, 2].map((i) => (
      <group key={i} position={[i * 0.025, 0.005 + i * 0.005, i * 0.018]} rotation={[0, i * 0.18 - 0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.005, 0.2]} />
          <meshPhysicalMaterial color="#f8f3e3" roughness={0.85} clearcoat={0.2} />
        </mesh>
        {/* photo area (off-white) */}
        <mesh position={[0, 0.0028, -0.015]}>
          <planeGeometry args={[0.13, 0.13]} />
          <meshStandardMaterial color={`hsl(${30 + i * 60}, 30%, ${50 + i * 8}%)`} roughness={0.75} />
        </mesh>
      </group>
    ))}
    {/* brass binder clip */}
    <mesh position={[0.04, 0.022, -0.07]} castShadow>
      <boxGeometry args={[0.025, 0.012, 0.018]} />
      <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.25} clearcoat={1} />
    </mesh>
  </group>
);

export const Paperclips = () => {
  // real paperclip path via tube along curve
  const clipGeo = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.022, 0, 0.005),
      new THREE.Vector3(-0.022, 0, -0.005),
      new THREE.Vector3(0.018, 0, -0.005),
      new THREE.Vector3(0.018, 0, 0.008),
      new THREE.Vector3(-0.018, 0, 0.008),
      new THREE.Vector3(-0.018, 0, -0.002),
      new THREE.Vector3(0.014, 0, -0.002),
    ];
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
    return new THREE.TubeGeometry(curve, 64, 0.0018, 8, false);
  }, []);
  const positions: [number, number, number, number][] = [
    [-1.7, 0.005, 0.55, 0.3],
    [-1.66, 0.005, 0.6, -0.2],
    [1.35, 0.005, 0.3, 0.9],
  ];
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} geometry={clipGeo} position={[p[0], p[1], p[2]]} rotation={[0, p[3], 0]} castShadow>
          <meshPhysicalMaterial color="#d4d4dc" metalness={1} roughness={0.25} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
};
