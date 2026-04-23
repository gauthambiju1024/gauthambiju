import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import {
  gridTexture, corkTexture, leatherTexture, paperTexture, paperLinedTexture,
  leatherNormalTexture, brassRoughnessTexture,
} from "../textures";

// All props centered on origin, sit on y=0 plane.

export const MatProp = () => {
  const tex = useMemo(() => gridTexture(), []);
  return (
    <group>
      {/* under-pad chamfer */}
      <RoundedBox args={[0.74, 0.012, 0.54]} radius={0.024} smoothness={4} receiveShadow position={[0, 0.006, 0]}>
        <meshPhysicalMaterial color="#1c2a20" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.024, 0.5]} radius={0.02} smoothness={4} castShadow receiveShadow position={[0, 0.022, 0]}>
        <meshPhysicalMaterial map={tex} color="#2d5a3d" roughness={0.78} metalness={0.02} clearcoat={0.2} clearcoatRoughness={0.6} />
      </RoundedBox>
      {/* stitched border */}
      {[
        [0, 0.035, 0.245], [0, 0.035, -0.245],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.66, 0.0008, 0.002]} />
          <meshStandardMaterial color="#f4ead8" roughness={0.7} emissive="#f4ead8" emissiveIntensity={0.05} />
        </mesh>
      ))}
    </group>
  );
};

export const CorkboardProp = () => {
  const tex = useMemo(() => corkTexture(), []);
  return (
    <group>
      <RoundedBox args={[0.7, 0.05, 0.5]} radius={0.012} smoothness={4} castShadow receiveShadow position={[0, 0.04, 0]}>
        <meshPhysicalMaterial color="#3a2510" roughness={0.55} metalness={0.15} clearcoat={0.5} clearcoatRoughness={0.35} />
      </RoundedBox>
      <mesh castShadow position={[0, 0.071, 0]}>
        <boxGeometry args={[0.62, 0.012, 0.42]} />
        <meshStandardMaterial map={tex} roughness={0.95} />
      </mesh>
      {[
        { p: [-0.18, 0, -0.1] as [number, number, number], c: "#fde68a", r: -0.1 },
        { p: [0.12, 0, 0.05] as [number, number, number], c: "#fbb6ce", r: 0.15 },
        { p: [-0.05, 0, 0.12] as [number, number, number], c: "#a7f3d0", r: -0.05 },
      ].map((n, i) => (
        <group key={i} position={[n.p[0], 0.078, n.p[2]]} rotation={[0, n.r, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.004, 0.12]} />
            <meshStandardMaterial color={n.c} roughness={0.85} />
          </mesh>
          {/* curled corner */}
          <mesh position={[0.05, 0.004, 0.05]} rotation={[0, 0, -0.15]} castShadow>
            <boxGeometry args={[0.025, 0.002, 0.025]} />
            <meshStandardMaterial color={n.c} roughness={0.85} />
          </mesh>
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
  const nrm = useMemo(() => leatherNormalTexture(), []);
  // build paper page slices
  const pages = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  return (
    <group rotation={[0, 0.1, 0]}>
      {/* leather cover (bottom) */}
      <RoundedBox args={[0.42, 0.018, 0.58]} radius={0.014} smoothness={5} castShadow receiveShadow position={[0, 0.009, 0]}>
        <meshPhysicalMaterial map={tex} normalMap={nrm} normalScale={new THREE.Vector2(0.6, 0.6)} color="#5a2e1a" roughness={0.62} clearcoat={0.4} clearcoatRoughness={0.45} sheen={0.3} sheenColor="#2a1208" />
      </RoundedBox>
      {/* page stack */}
      {pages.map(i => (
        <mesh key={i} position={[0.005, 0.022 + i * 0.0085, 0]} castShadow>
          <boxGeometry args={[0.40, 0.008, 0.56]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#f4ead8" : "#ede2cc"} roughness={0.92} />
        </mesh>
      ))}
      {/* leather cover (top) */}
      <RoundedBox args={[0.42, 0.018, 0.58]} radius={0.014} smoothness={5} castShadow position={[0, 0.118, 0]}>
        <meshPhysicalMaterial map={tex} normalMap={nrm} normalScale={new THREE.Vector2(0.6, 0.6)} color="#5a2e1a" roughness={0.62} clearcoat={0.4} clearcoatRoughness={0.45} sheen={0.3} sheenColor="#2a1208" />
      </RoundedBox>
      {/* embossed gold band */}
      <mesh position={[0, 0.128, 0.18]}>
        <boxGeometry args={[0.42, 0.002, 0.06]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.128, -0.18]}>
        <boxGeometry args={[0.42, 0.002, 0.04]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.25} clearcoat={1} />
      </mesh>
      {/* gold corner brackets */}
      {[[-0.19, 0.27], [0.19, 0.27], [-0.19, -0.27], [0.19, -0.27]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.129, z]} castShadow>
          <boxGeometry args={[0.04, 0.003, 0.04]} />
          <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.28} clearcoat={1} />
        </mesh>
      ))}
      {/* silk bookmark */}
      <mesh position={[0.06, 0.13, 0.2]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.001, 0.34]} />
        <meshStandardMaterial color="#a8281e" roughness={0.5} sheen={0.6} sheenColor="#ff6655" />
      </mesh>
    </group>
  );
};

export const CardProp = () => {
  return (
    <group rotation={[0, -0.15, 0]}>
      {/* stack of 3 cards */}
      {[0, 1, 2].map(i => (
        <RoundedBox
          key={i}
          args={[0.36, 0.008, 0.22]} radius={0.008} smoothness={4} castShadow receiveShadow
          position={[i * 0.004, 0.004 + i * 0.009, i * 0.003]}
          rotation={[0, i * 0.04 - 0.04, 0]}
        >
          <meshPhysicalMaterial color="#f1ead7" roughness={0.7} clearcoat={0.35} clearcoatRoughness={0.3} />
        </RoundedBox>
      ))}
      {/* embossed brass mark */}
      <mesh position={[0.13, 0.034, -0.07]}>
        <boxGeometry args={[0.04, 0.0025, 0.04]} />
        <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[-0.05, 0.033, 0.04]}>
        <boxGeometry args={[0.18, 0.0015, 0.005]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.05, 0.033, 0.055]}>
        <boxGeometry args={[0.12, 0.0015, 0.003]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const NotebookProp = () => {
  const paper = useMemo(() => paperTexture(), []);
  const lined = useMemo(() => paperLinedTexture(), []);
  return (
    <group>
      {/* page stacks (10 each side) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`l${i}`} castShadow receiveShadow position={[-0.18, 0.008 + i * 0.0035, 0]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.36, 0.0035, 0.5]} />
          <meshStandardMaterial color={i === 9 ? "#ffffff" : "#f0e6d0"} roughness={0.92} />
        </mesh>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`r${i}`} castShadow receiveShadow position={[0.18, 0.008 + i * 0.0035, 0]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.36, 0.0035, 0.5]} />
          <meshStandardMaterial color={i === 9 ? "#ffffff" : "#f0e6d0"} roughness={0.92} />
        </mesh>
      ))}
      {/* visible top page with lines (right) */}
      <mesh position={[0.18, 0.0445, 0]} rotation={[-Math.PI / 2 - 0.05, 0, 0]}>
        <planeGeometry args={[0.34, 0.48]} />
        <meshStandardMaterial map={lined} roughness={0.92} />
      </mesh>
      {/* spine */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.025, 0.014, 0.5]} />
        <meshPhysicalMaterial map={paper} color="#2a1a10" roughness={0.6} sheen={0.2} />
      </mesh>
      {/* fountain pen */}
      <group position={[0.18, 0.052, -0.02]} rotation={[0, 0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.32, 16]} />
          <meshPhysicalMaterial color="#0e0e10" metalness={0.5} roughness={0.25} clearcoat={0.9} />
        </mesh>
        {/* nib */}
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.008, 0.04, 16]} />
          <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.2} clearcoat={1} />
        </mesh>
        {/* cap */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <cylinderGeometry args={[0.0085, 0.0085, 0.06, 16]} />
          <meshPhysicalMaterial color="#e8e8ee" metalness={1} roughness={0.12} clearcoat={1} />
        </mesh>
        {/* clip */}
        <mesh position={[0.009, 0.13, 0]} castShadow>
          <boxGeometry args={[0.003, 0.05, 0.004]} />
          <meshPhysicalMaterial color="#d4a73a" metalness={1} roughness={0.2} clearcoat={1} />
        </mesh>
      </group>
      {/* black ribbon bookmark */}
      <mesh position={[0, 0.06, 0.28]}>
        <boxGeometry args={[0.018, 0.001, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} sheen={0.4} sheenColor="#444" />
      </mesh>
    </group>
  );
};

export const ToolboxProp = () => {
  const brassRough = useMemo(() => brassRoughnessTexture(), []);
  return (
    <group>
      {/* body */}
      <RoundedBox args={[0.5, 0.10, 0.32]} radius={0.014} smoothness={4} castShadow receiveShadow position={[0, 0.05, 0]}>
        <meshPhysicalMaterial color="#7a1a13" metalness={0.6} roughness={0.42} clearcoat={0.65} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* lid */}
      <RoundedBox args={[0.5, 0.06, 0.32]} radius={0.014} smoothness={4} castShadow position={[0, 0.13, 0]}>
        <meshPhysicalMaterial color="#8a1f17" metalness={0.6} roughness={0.4} clearcoat={0.7} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* seam */}
      <mesh position={[0, 0.10, 0]}>
        <boxGeometry args={[0.5, 0.002, 0.32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
      </mesh>
      {/* rivets along edges */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-0.2 + i * 0.08, 0.10, 0.161]} castShadow>
          <sphereGeometry args={[0.006, 12, 12]} />
          <meshPhysicalMaterial color="#c0c0c8" metalness={1} roughness={0.3} clearcoat={1} />
        </mesh>
      ))}
      {/* rubber feet */}
      {[[-0.22, 0.14], [0.22, 0.14], [-0.22, -0.14], [0.22, -0.14]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.005, z]}>
          <cylinderGeometry args={[0.018, 0.02, 0.01, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
        </mesh>
      ))}
      {/* handle */}
      <mesh position={[0, 0.20, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.07, 0.014, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#0e0e0e" roughness={0.95} />
      </mesh>
      {/* brass latches */}
      {[-0.14, 0.14].map((x, i) => (
        <group key={i} position={[x, 0.10, 0.161]}>
          <mesh castShadow>
            <boxGeometry args={[0.05, 0.025, 0.006]} />
            <meshPhysicalMaterial color="#d4a73a" metalness={1} roughnessMap={brassRough} roughness={0.25} clearcoat={1} />
          </mesh>
          <mesh position={[0, -0.012, 0.003]} castShadow>
            <boxGeometry args={[0.04, 0.012, 0.004]} />
            <meshPhysicalMaterial color="#b88820" metalness={1} roughness={0.3} clearcoat={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const CompassProp = () => {
  const brassRough = useMemo(() => brassRoughnessTexture(), []);
  // knurling around bezel
  const knurls = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  return (
    <group>
      {/* brass body */}
      <mesh castShadow receiveShadow position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.036, 64]} />
        <meshPhysicalMaterial color="#d4a85a" metalness={1} roughnessMap={brassRough} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* knurled bezel */}
      {knurls.map(i => {
        const a = (i / knurls.length) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.182, 0.036, Math.sin(a) * 0.182]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.006, 0.012, 0.012]} />
            <meshPhysicalMaterial color="#c89540" metalness={1} roughness={0.35} clearcoat={1} />
          </mesh>
        );
      })}
      {/* engraved bezel ring */}
      <mesh position={[0, 0.039, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.155, 0.18, 64]} />
        <meshPhysicalMaterial color="#a98740" metalness={1} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* dial face */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.003, 64]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.6} />
      </mesh>
      {/* cardinal tick marks */}
      {[0, 1, 2, 3].map(i => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={`tick-${i}`} position={[Math.cos(a) * 0.13, 0.0425, Math.sin(a) * 0.13]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.012, 0.001, 0.024]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        );
      })}
      {/* minor ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
        return (
          <mesh key={`mtick-${i}`} position={[Math.cos(a) * 0.135, 0.0425, Math.sin(a) * 0.135]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.005, 0.001, 0.012]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
          </mesh>
        );
      })}
      {/* needle - red half */}
      <mesh position={[0, 0.046, 0.04]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.012, 0.10, 4]} />
        <meshPhysicalMaterial color="#a8281e" metalness={0.4} roughness={0.3} clearcoat={0.6} />
      </mesh>
      {/* needle - white half */}
      <mesh position={[0, 0.046, -0.04]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.012, 0.10, 4]} />
        <meshPhysicalMaterial color="#f4ead8" metalness={0.2} roughness={0.4} clearcoat={0.5} />
      </mesh>
      {/* center pivot */}
      <mesh position={[0, 0.052, 0]} castShadow>
        <sphereGeometry args={[0.014, 24, 24]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* glass dome */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.16, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          ior={1.52}
          thickness={0.2}
          roughness={0.02}
          metalness={0}
          transparent
          opacity={0.5}
          attenuationColor="#cce0ff"
          attenuationDistance={1}
        />
      </mesh>
    </group>
  );
};

export const EnvelopeProp = () => {
  // triangular flap built via Shape
  const flapGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.23, 0);
    shape.lineTo(0.23, 0);
    shape.lineTo(0, -0.13);
    shape.lineTo(-0.23, 0);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.002, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);
  return (
    <group rotation={[0, 0.2, 0]}>
      <RoundedBox args={[0.46, 0.016, 0.3]} radius={0.006} smoothness={4} castShadow receiveShadow position={[0, 0.008, 0]}>
        <meshPhysicalMaterial color="#efe4cf" roughness={0.85} clearcoat={0.18} sheen={0.2} sheenColor="#fff8e0" />
      </RoundedBox>
      <mesh geometry={flapGeo} position={[0, 0.018, 0.001]} castShadow>
        <meshPhysicalMaterial color="#e6d7b8" roughness={0.85} side={THREE.DoubleSide} sheen={0.15} />
      </mesh>
      {/* domed wax seal */}
      <mesh position={[0, 0.024, -0.04]} castShadow>
        <sphereGeometry args={[0.028, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#8a1a14" roughness={0.4} clearcoat={0.85} clearcoatRoughness={0.2} sheen={0.3} sheenColor="#ff5544" />
      </mesh>
      {/* embossed seal ring */}
      <mesh position={[0, 0.025, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.018, 0.024, 32]} />
        <meshPhysicalMaterial color="#6a1208" metalness={0.2} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
