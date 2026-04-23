import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import { draftingTopTexture, deskHorizontalAlpha } from "./textures";
import { Mug, PolaroidStack } from "./decor";
import {
  LaptopClosable,
  BookStack,
  StickyNotes,
  BlueprintTube,
  DraftingTools,
  NotebookWithPen,
  BrassPaperweight,
} from "./workbench/WorkbenchDecor";
import StatusLightBar from "./workbench/StatusLightBar";
import { useEOD } from "./workbench/useEOD";

interface DeskSceneProps {
  progress: MotionValue<number>;
  activeId: FrameId;
  sectionCount: number;
  onJump: (i: number) => void;
}

const DraftingTop = () => {
  const top = useMemo(() => draftingTopTexture(), []);
  const alpha = useMemo(() => deskHorizontalAlpha(), []);
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[8, 2.4]} />
      <meshStandardMaterial
        map={top}
        alphaMap={alpha}
        transparent
        roughness={0.88}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
};

const Parallax = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const { camera, mouse, invalidate } = useThree();
  useFrame(() => {
    if (reduceMotion) return;
    const tx = mouse.x * 0.1;
    const ty = 0.42 + mouse.y * 0.03;
    const nx = THREE.MathUtils.lerp(camera.position.x, tx, 0.05);
    const ny = THREE.MathUtils.lerp(camera.position.y, ty, 0.05);
    if (Math.abs(nx - camera.position.x) > 0.0005 || Math.abs(ny - camera.position.y) > 0.0005) {
      camera.position.x = nx;
      camera.position.y = ny;
      camera.lookAt(0, 0.05, 0.3);
      invalidate();
    }
  });
  return null;
};

/** Subscribes to scroll progress + EOD and re-invalidates demand frameloop. */
const Invalidator = ({ progress, eod }: { progress: MotionValue<number>; eod: MotionValue<number> }) => {
  const { invalidate } = useThree();
  useEffect(() => {
    const u1 = progress.on("change", () => invalidate());
    const u2 = eod.on("change", () => invalidate());
    return () => { u1(); u2(); };
  }, [progress, eod, invalidate]);
  return null;
};

/** Lamp with EOD dimming. */
const WorkbenchLamp = ({ eod }: { eod: MotionValue<number> }) => {
  const spot = useRef<THREE.SpotLight>(null!);
  const bulb = useRef<THREE.MeshBasicMaterial>(null!);
  const { invalidate } = useThree();
  useFrame(() => {
    const v = eod.get();
    const i = 2.0 - v * 1.4;
    if (spot.current && Math.abs(spot.current.intensity - i) > 0.005) {
      spot.current.intensity = i;
      invalidate();
    }
    if (bulb.current) {
      const c = 1 - v * 0.6;
      bulb.current.color.setRGB(1, 0.95 * c, 0.82 * c);
    }
  });
  const shadeGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push(new THREE.Vector2(0.06 + t * 0.13, t * 0.22));
    }
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group position={[-2.0, 0, -0.05]}>
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.04, 48]} />
        <meshPhysicalMaterial color="#c79a45" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      <mesh castShadow position={[0.05, 0.22, 0]} rotation={[0, 0, 0.45]}>
        <cylinderGeometry args={[0.013, 0.013, 0.4, 16]} />
        <meshPhysicalMaterial color="#b8862f" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      <mesh castShadow position={[-0.04, 0.4, 0]}>
        <sphereGeometry args={[0.022, 24, 24]} />
        <meshPhysicalMaterial color="#a8822f" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      <mesh castShadow position={[-0.12, 0.5, 0]} rotation={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 16]} />
        <meshPhysicalMaterial color="#b8862f" metalness={1} roughness={0.3} clearcoat={1} />
      </mesh>
      <group position={[-0.2, 0.55, 0]} rotation={[Math.PI, 0, 0.6]}>
        <mesh geometry={shadeGeo} castShadow>
          <meshPhysicalMaterial color="#efe4cf" metalness={0.1} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={shadeGeo} scale={[0.97, 0.97, 0.97]}>
          <meshStandardMaterial color="#fff4d6" roughness={0.5} side={THREE.BackSide} emissive="#ffe1a8" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <mesh position={[-0.2, 0.5, 0.04]}>
        <sphereGeometry args={[0.04, 24, 24]} />
        <meshBasicMaterial ref={bulb} color="#fff1cf" />
      </mesh>
      <spotLight
        ref={spot}
        position={[-0.2, 0.5, 0.05]}
        target-position={[-0.6, 0, 0.4]}
        angle={0.65}
        penumbra={0.6}
        intensity={2.0}
        distance={4.5}
        decay={1.6}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </group>
  );
};

const DeskScene = ({ progress, sectionCount, onJump }: DeskSceneProps) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(m.matches);
    const h = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);

  const eod = useEOD(30000, reduceMotion);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.42, 1.6], fov: 48 }}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <fog attach="fog" args={["#0a0a0a", 2.0, 4.0]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[1.5, 2.0, 0.6]} intensity={0.4} color="#fff8e8" />
      <directionalLight position={[-1.8, 1.4, -0.6]} intensity={0.2} color="#bcd0ff" />

      <Suspense fallback={null}>
        <DraftingTop />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={5} blur={2.6} far={1.4} resolution={512} color="#000" />

        {/* Left zone — thinking & planning */}
        <WorkbenchLamp eod={eod} />
        <BlueprintTube />
        <NotebookWithPen />
        <DraftingTools />

        {/* Center zone — current work */}
        <LaptopClosable eod={eod} />
        <Mug position={[-0.55, 0, 0.5]} />
        <StickyNotes />

        {/* Right zone — shipped & people */}
        <BookStack />
        <PolaroidStack position={[1.2, 0, 0.55]} />
        <BrassPaperweight eod={eod} />

        {/* Status light bar above the back of the desk */}
        <StatusLightBar progress={progress} eod={eod} count={sectionCount} onJump={onJump} />

        <Parallax reduceMotion={reduceMotion} />
        <Invalidator progress={progress} eod={eod} />
      </Suspense>
    </Canvas>
  );
};

export default DeskScene;
