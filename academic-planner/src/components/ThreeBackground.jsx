import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Environment, Float, Stars } from "@react-three/drei";
import * as THREE from "three";


function ParallaxRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.mouse.x * 2), 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.mouse.y * 2), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 w-full h-full -z-20 bg-brown-950 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#0b031c" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#a855f7" />
        <pointLight position={[0, -5, 5]} intensity={1} color="#ec4899" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ParallaxRig />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
