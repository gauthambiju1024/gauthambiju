import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { gridTexture, corkTexture, leatherTexture, paperTexture } from "../textures";

// All props centered on origin, sit on y=0 plane.

export const MatProp = () => {
  const tex = useMemo(() => gridTexture(), []);
  return (
    <RoundedBox args={[0.7, 0.024, 0.5]} radius={0.02} smoothness={4} castShadow receiveShadow position={[0, 0.012, 0]}>
      <meshPhysicalMaterial map={tex} color="#2d5a3d" roughness={0.78} metalness={0.02} clearcoat={0.2} clearcoatRoughness={0.6} />
    </RoundedBox>
  );
};

export const CorkboardProp = () => {
  const tex = useMemo(() => corkTexture(), []);
  return (
    <group>
      {/* walnut bevelled frame */}
      <RoundedBox args={[0.7, 0.05, 0.5]} radius={0.012} smoothness={4} castShadow receiveShadow position={[0, 0.04, 0]}>
        <meshPhysicalMaterial color="#3a2510" roughness={0.55} metalness={0.15} clearcoat={0.5} clearcoatRoughness={0.35} />
      </RoundedBox>
      {/* inset cork */}
      <mesh castShadow position={[0, 0.071, 0]}>
        <boxGeometry args={[0.62, 0.012, 0.42]} />
        <meshStandardMaterial map={tex} roughness={0.95} />
      </mesh>
      {[
        { p: [-0.18, 0, -0.1] as [number,number,number], c: "#fde68a", r: -0.1 },
        { p: [0.12, 0, 0.05] as [number,number,number], c: "#fbb6ce", r: 0.15 },
        { p: [-0.05, 0, 0.12] as [number,number,number], c: "#a7f3d0", r: -0.05 },
      ].map((n, i) => (
        <group key={i} position={[n.p[0], 0.078, n.p[2]]} rotation={[0, n.r, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.004, 0.12]} />
            <meshStandardMaterial color={n.c} roughness={0.85} />
          </mesh>
          {/* chrome push pin */}
          <mesh position={[0.045, 0.008, -0.045]} castShadow>
            <sphereGeometry args={[0.008, 16, 16]} />
            <meshPhysicalMaterial color="#e8e8ee" metalness={1} roughness={0.15} clearcoat={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const BookProp = () => {
  const tex = useMemo(() => leatherTexture(), []);
  return (
    <group rotation={[0, 0.1, 0]}>
      {/* leather cover */}
      <RoundedBox args={[0.42, 0.12, 0.58]} radius={0.012} smoothness={4} castShadow receiveShadow position={[0, 0.06, 0]}>
        <meshPhysicalMaterial map={tex} color="#5a2e1a" roughness={0.6} clearcoat={0.45} clearcoatRoughness={0.4} />
      </RoundedBox>
      {/* cream pages */}
      <mesh position={[0.005, 0.06, 0]}>
        <boxGeometry args={[0.40, 0.10, 0.56]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.9} />
      </mesh>
      {/* embossed gold band */}
      <mesh position={[0, 0.121, 0.18]}>
        <boxGeometry args={[0.42, 0.002, 0.06]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.121, -0.18]}>
        <boxGeometry args={[0.42, 0.002, 0.04]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.25} clearcoat={1} />
      </mesh>
      {/* silk bookmark */}
      <mesh position={[0.06, 0.122, 0.2]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.001, 0.34]} />
        <meshStandardMaterial color="#a8281e" roughness={0.5} />
      </mesh>
    </group>
  );
};

export const CardProp = () => {
  return (
    <group rotation={[0, -0.15, 0]}>
      <RoundedBox args={[0.36, 0.01, 0.22]} radius={0.008} smoothness={4} castShadow receiveShadow position={[0, 0.005, 0]}>
        <meshPhysicalMaterial color="#f1ead7" roughness={0.7} clearcoat={0.35} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* embossed brass mark */}
      <mesh position={[0.13, 0.011, -0.07]}>
        <boxGeometry args={[0.04, 0.0025, 0.04]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* letterpress line */}
      <mesh position={[-0.05, 0.011, 0.04]}>
        <boxGeometry args={[0.18, 0.0015, 0.005]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const NotebookProp = () => {
  const paper = useMemo(() => paperTexture(), []);
  return (
    <group>
      {/* left page tented */}
      <mesh castShadow receiveShadow position={[-0.18, 0.025, 0]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.36, 0.04, 0.5]} />
        <meshStandardMaterial map={paper} color="#f4ead8" roughness={0.9} />
      </mesh>
      {/* right page tented */}
      <mesh castShadow receiveShadow position={[0.18, 0.025, 0]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[0.36, 0.04, 0.5]} />
        <meshStandardMaterial map={paper} color="#f4ead8" roughness={0.9} />
      </mesh>
      {/* spine */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.012, 0.5]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.7} />
      </mesh>
      {/* fountain pen lying diagonally on right page */}
      <group position={[0.18, 0.05, -0.02]} rotation={[0, 0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.32, 12]} />
          <meshPhysicalMaterial color="#0e0e10" metalness={0.4} roughness={0.3} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0.13, 0]} castShadow>
          <cylinderGeometry args={[0.0085, 0.0085, 0.06, 12]} />
          <meshPhysicalMaterial color="#e8e8ee" metalness={1} roughness={0.15} clearcoat={1} />
        </mesh>
      </group>
      {/* black ribbon bookmark */}
      <mesh position={[0, 0.058, 0.28]}>
        <boxGeometry args={[0.018, 0.001, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
      </mesh>
    </group>
  );
};

export const ToolboxProp = () => {
  return (
    <group>
      {/* brushed steel chassis */}
      <RoundedBox args={[0.5, 0.16, 0.32]} radius={0.015} smoothness={4} castShadow receiveShadow position={[0, 0.08, 0]}>
        <meshPhysicalMaterial color="#8a1f17" metalness={0.6} roughness={0.4} clearcoat={0.7} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* dark seam */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.5, 0.005, 0.32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
      </mesh>
      {/* rubber-grip handle */}
      <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.07, 0.014, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#0e0e0e" roughness={0.95} />
      </mesh>
      {/* brass latches */}
      {[-0.14, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 0.13, 0.161]} castShadow>
          <boxGeometry args={[0.05, 0.025, 0.006]} />
          <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.22} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
};

export const CompassProp = () => {
  return (
    <group>
      {/* brass body */}
      <mesh castShadow receiveShadow position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.036, 48]} />
        <meshPhysicalMaterial color="#d4a85a" metalness={1} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* engraved bezel ring */}
      <mesh position={[0, 0.039, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.155, 0.18, 64]} />
        <meshPhysicalMaterial color="#a98740" metalness={1} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* dial face */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.003, 48]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.6} />
      </mesh>
      {/* needle */}
      <mesh position={[0, 0.045, 0]} rotation={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.012, 0.18, 4]} />
        <meshPhysicalMaterial color="#a8281e" metalness={0.4} roughness={0.3} clearcoat={0.6} />
      </mesh>
      {/* center pivot */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.014, 24, 24]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* glass dome */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          ior={1.45}
          thickness={0.05}
          roughness={0.05}
          metalness={0}
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
};

export const EnvelopeProp = () => {
  return (
    <group rotation={[0, 0.2, 0]}>
      <RoundedBox args={[0.46, 0.016, 0.3]} radius={0.006} smoothness={4} castShadow receiveShadow position={[0, 0.008, 0]}>
        <meshPhysicalMaterial color="#efe4cf" roughness={0.85} clearcoat={0.15} />
      </RoundedBox>
      {/* flap */}
      <mesh position={[0, 0.018, 0]} rotation={[-0.18, 0, 0]} castShadow>
        <planeGeometry args={[0.46, 0.18]} />
        <meshPhysicalMaterial color="#e6d7b8" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* domed wax seal */}
      <mesh position={[0, 0.024, 0]} castShadow>
        <sphereGeometry args={[0.028, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#8a1a14" roughness={0.4} clearcoat={0.7} clearcoatRoughness={0.25} />
      </mesh>
    </group>
  );
};
