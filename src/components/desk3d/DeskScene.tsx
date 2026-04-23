import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import { woodTexture } from "./textures";
import Prop3D from "./Prop3D";
import { MatProp, CorkboardProp, BookProp, CardProp, NotebookProp, ToolboxProp, CompassProp, EnvelopeProp } from "./props";
import { Lamp, Mug, Plant, PenHolder, Polaroids } from "./decor";

export type PropShape = "mat" | "cork" | "book" | "card" | "notebook" | "toolbox" | "compass" | "envelope";

export interface SlotConfig3D {
  id: FrameId;
  label: string;
  shape: PropShape;
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface DeskSceneProps {
  slots: SlotConfig3D[];
  activeId: FrameId;
  onSelect: (id: FrameId) => void;
}

const SHAPE_MAP: Record<PropShape, () => JSX.Element> = {
  mat: () => <MatProp />,
  cork: () => <CorkboardProp />,
  book: () => <BookProp />,
  card: () => <CardProp />,
  notebook: () => <NotebookProp />,
  toolbox: () => <ToolboxProp />,
  compass: () => <CompassProp />,
  envelope: () => <EnvelopeProp />,
};

const Floor = () => {
  const tex = useMemo(() => woodTexture(), []);
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[10, 6]} />
      <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} />
    </mesh>
  );
};

const Parallax = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const { camera, mouse } = useThree();
  useFrame(() => {
    if (reduceMotion) return;
    const tx = mouse.x * 0.18;
    const ty = 1.05 + mouse.y * 0.05;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.05);
    camera.lookAt(0, 0.05, 0);
  });
  return null;
};

const DeskScene = ({ slots, activeId, onSelect }: DeskSceneProps) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(m.matches);
    const h = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.05, 2.4], fov: 38 }}
      frameloop="always"
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#15100b"]} />
      <fog attach="fog" args={["#15100b", 4, 9]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[-2.5, 3.5, 2]}
        intensity={1.1}
        color="#ffe6c0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={10}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />

      <Suspense fallback={null}>
        <Floor />

        {/* ambient decor */}
        <Lamp />
        <Mug />
        <Plant />
        <PenHolder />
        <Polaroids />

        {/* interactive slots */}
        {slots.map((s) => (
          <Prop3D
            key={s.id}
            id={s.id}
            label={s.label}
            position={s.position}
            rotation={s.rotation}
            active={s.id === activeId}
            onSelect={onSelect}
            reduceMotion={reduceMotion}
          >
            {SHAPE_MAP[s.shape]()}
          </Prop3D>
        ))}

        <Parallax reduceMotion={reduceMotion} />
      </Suspense>
    </Canvas>
  );
};

export default DeskScene;
