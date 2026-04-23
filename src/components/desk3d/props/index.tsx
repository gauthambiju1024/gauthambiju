import { useMemo } from "react";
import * as THREE from "three";
import { gridTexture, corkTexture, leatherTexture, paperTexture } from "../textures";

// All props are centered on origin and sit on y=0 plane.

export const MatProp = () => {
  const tex = useMemo(() => gridTexture(), []);
  return (
    <mesh castShadow receiveShadow position={[0, 0.012, 0]}>
      <boxGeometry args={[0.7, 0.024, 0.5]} />
      <meshStandardMaterial map={tex} color="#2d5a3d" roughness={0.85} metalness={0} />
    </mesh>
  );
};

export const CorkboardProp = () => {
  const tex = useMemo(() => corkTexture(), []);
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[0.7, 0.05, 0.5]} />
        <meshStandardMaterial color="#3a2510" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.071, 0]}>
        <boxGeometry args={[0.66, 0.012, 0.46]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      {[
        { p: [-0.18, 0.005, -0.1] as [number,number,number], c: "#fde68a", r: -0.1 },
        { p: [0.12, 0.005, 0.05] as [number,number,number], c: "#fbb6ce", r: 0.15 },
        { p: [-0.05, 0.005, 0.12] as [number,number,number], c: "#a7f3d0", r: -0.05 },
      ].map((n, i) => (
        <mesh key={i} position={[n.p[0], 0.078 + n.p[1], n.p[2]]} rotation={[0, n.r, 0]} castShadow>
          <boxGeometry args={[0.12, 0.004, 0.12]} />
          <meshStandardMaterial color={n.c} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

export const BookProp = () => {
  const tex = useMemo(() => leatherTexture(), []);
  return (
    <group rotation={[0, 0.1, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[0.42, 0.12, 0.58]} />
        <meshStandardMaterial map={tex} color="#5a2e1a" roughness={0.7} />
      </mesh>
      {/* pages */}
      <mesh position={[0.005, 0.06, 0]}>
        <boxGeometry args={[0.40, 0.10, 0.56]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.9} />
      </mesh>
      {/* gold trim */}
      <mesh position={[0, 0.121, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.10, 0.13, 32]} />
        <meshStandardMaterial color="#d4a73a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

export const CardProp = () => {
  return (
    <group rotation={[0, -0.15, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.005, 0]}>
        <boxGeometry args={[0.36, 0.01, 0.22]} />
        <meshStandardMaterial color="#f1ead7" roughness={0.85} />
      </mesh>
      <mesh position={[0.13, 0.011, -0.07]}>
        <boxGeometry args={[0.04, 0.002, 0.04]} />
        <meshStandardMaterial color="#3b6cd9" roughness={0.5} />
      </mesh>
    </group>
  );
};

export const NotebookProp = () => {
  const paper = useMemo(() => paperTexture(), []);
  return (
    <group>
      {/* left page */}
      <mesh castShadow receiveShadow position={[-0.18, 0.025, 0]} rotation={[0, 0, 0.04]}>
        <boxGeometry args={[0.36, 0.04, 0.5]} />
        <meshStandardMaterial map={paper} color="#f4ead8" roughness={0.9} />
      </mesh>
      {/* right page */}
      <mesh castShadow receiveShadow position={[0.18, 0.025, 0]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[0.36, 0.04, 0.5]} />
        <meshStandardMaterial map={paper} color="#f4ead8" roughness={0.9} />
      </mesh>
      {/* spine */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.01, 0.5]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.7} />
      </mesh>
    </group>
  );
};

export const ToolboxProp = () => {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[0.5, 0.16, 0.32]} />
        <meshStandardMaterial color="#a8281e" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.5, 0.005, 0.32]} />
        <meshStandardMaterial color="#000" roughness={0.6} />
      </mesh>
      {/* handle */}
      <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.012, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* latch */}
      <mesh position={[0, 0.13, 0.161]}>
        <boxGeometry args={[0.06, 0.03, 0.005]} />
        <meshStandardMaterial color="#d4a73a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

export const CompassProp = () => {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
        <meshStandardMaterial color="#c9a35a" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.031, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.005, 32]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.7} />
      </mesh>
      {/* needle */}
      <mesh position={[0, 0.038, 0]} rotation={[0, 0.4, 0]}>
        <coneGeometry args={[0.012, 0.18, 4]} />
        <meshStandardMaterial color="#a8281e" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>
    </group>
  );
};

export const EnvelopeProp = () => {
  return (
    <group rotation={[0, 0.2, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.008, 0]}>
        <boxGeometry args={[0.46, 0.016, 0.3]} />
        <meshStandardMaterial color="#efe4cf" roughness={0.85} />
      </mesh>
      {/* flap */}
      <mesh position={[0, 0.018, 0]} rotation={[-0.15, 0, 0]}>
        <planeGeometry args={[0.46, 0.16]} />
        <meshStandardMaterial color="#e6d7b8" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* wax seal */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.006, 16]} />
        <meshStandardMaterial color="#8a1a14" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
};
