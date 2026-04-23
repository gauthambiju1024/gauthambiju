import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import { woodTexture, deskHorizontalAlpha } from "./textures";
import Prop3D from "./Prop3D";
import { MatProp, CorkboardProp, BookProp, CardProp, NotebookProp, ToolboxProp, CompassProp, EnvelopeProp } from "./props";
import { Lamp, Mug, Plant, PenHolder, ClosedJournal, PolaroidStack, Paperclips } from "./decor";

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

const PlankFloor = () => {
  const wood = useMemo(() => woodTexture(), []);
  const alpha = useMemo(() => deskHorizontalAlpha(), []);
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[8, 2.4]} />
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
    const tx = mouse.x * 0.12;
    const ty = 0.42 + mouse.y * 0.04;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.05);
    camera.lookAt(0, 0.05, 0.3);
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
      camera={{ position: [0, 0.42, 1.6], fov: 48 }}
      frameloop="always"
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.25} />
      {/* warm key from lamp side */}
      <directionalLight
        position={[2, 1.8, 0.5]}
        intensity={0.7}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={8}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      {/* soft fill */}
      <directionalLight position={[-2, 1.6, 0.8]} intensity={0.35} color="#fff4dd" />
      {/* cool rim */}
      <directionalLight position={[0, 1.2, -2]} intensity={0.3} color="#9ec0ff" />

      <Suspense fallback={null}>
        <Environment preset="apartment" background={false} />
        <PlankFloor />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={5} blur={2.6} far={1.4} resolution={512} color="#000" />

        <Lamp />
        <Mug />
        <Plant />
        <PenHolder />
        <ClosedJournal />
        <PolaroidStack />
        <Paperclips />

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
