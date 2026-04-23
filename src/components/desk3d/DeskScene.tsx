import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import { woodTexture, deskAlphaMask } from "./textures";
import Prop3D from "./Prop3D";
import { MatProp, CorkboardProp, BookProp, CardProp, NotebookProp, ToolboxProp, CompassProp, EnvelopeProp } from "./props";
import { Lamp, Mug, Plant, PenHolder, ClosedJournal } from "./decor";

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

const FeatheredFloor = () => {
  const wood = useMemo(() => woodTexture(), []);
  const alpha = useMemo(() => deskAlphaMask(), []);
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[2.6, 96]} />
      <meshStandardMaterial
        map={wood}
        alphaMap={alpha}
        transparent
        roughness={0.82}
        metalness={0.06}
        depthWrite={false}
      />
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
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {/* No background color, no fog — canvas is fully transparent so the page bleeds through. */}

      <ambientLight intensity={0.3} />
      {/* warm key */}
      <directionalLight
        position={[-2.5, 3.5, 2]}
        intensity={1.0}
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
      {/* cool rim */}
      <directionalLight position={[2.8, 2.2, -2]} intensity={0.4} color="#9ec0ff" />

      <Suspense fallback={null}>
        <Environment preset="apartment" background={false} />
        <FeatheredFloor />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={4} blur={2.4} far={1.4} resolution={512} color="#000" />

        <Lamp />
        <Mug />
        <Plant />
        <PenHolder />
        <ClosedJournal />

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
