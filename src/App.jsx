import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

function Cube() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} />

        <Cube />

        <Grid />

        <OrbitControls />
      </Canvas>
    </div>
  );
}