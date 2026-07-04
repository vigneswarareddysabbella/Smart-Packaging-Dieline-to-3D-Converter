import { Canvas } from "@react-three/fiber";
import { Edges, Grid, OrbitControls, Text, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import useStore from "../../store/useStore.js";
import { buildPanelMeshes, mixTransform } from "../../engine/geometry/buildPanelMeshes.js";

function Panel({ panel, foldProgress, index }) {
  const { position, rotation } = mixTransform(panel, foldProgress);
  const texture = useTexture(panel.textureURL);

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <planeGeometry args={panel.size} />
        <meshStandardMaterial
          map={texture}
          color="#ffffff"
          roughness={0.72}
          metalness={0.05}
          side={2}
        />
        <Edges color="#1e293b" threshold={15} />
      </mesh>
    </group>
  );
}

function EmptyState() {
  return (
    <group position={[0, 0, -0.4]}>
      <mesh position={[0, 0, 0]} rotation={[0.2, -0.45, 0]}>
        <boxGeometry args={[1.8, 1.2, 1.0]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.28} roughness={0.9} />
        <Edges color="#94a3b8" />
      </mesh>
      <Text position={[0, -1.05, 0]} fontSize={0.12} color="#cbd5e1" anchorX="center">
        Upload a dieline to generate panel geometry
      </Text>
    </group>
  );
}

function PanelModel() {
  const panels = useStore((state) => state.panels);
  const imageSize = useStore((state) => state.imageSize);
  const foldProgress = useStore((state) => state.foldProgress);
  const meshes = useMemo(() => buildPanelMeshes(panels, imageSize), [panels, imageSize]);

  if (!meshes.length) return <EmptyState />;

  return (
    <group rotation={[-0.55, -0.5, 0]}>
      {meshes.map((panel, index) => (
        <Panel key={panel.id} panel={panel} foldProgress={foldProgress} index={index} />
      ))}
    </group>
  );
}

export default function Viewer() {
  return (
    <div style={{ height: "100%", background: "#0f172a" }}>
      <Canvas camera={{ position: [0, 3.2, 5], fov: 45 }} shadows>
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={1.7} />
        <directionalLight position={[4, 5, 6]} intensity={2.2} castShadow />
        <PanelModel />
        <Grid args={[8, 8]} cellColor="#334155" sectionColor="#64748b" fadeDistance={18} />
        <OrbitControls makeDefault enableDamping />
      </Canvas>
    </div>
  );
}


