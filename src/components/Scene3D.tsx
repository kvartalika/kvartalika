import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';

function Model({ model }: { model: string }) {
  const gltf = useGLTF(model);
  return <primitive object={gltf.scene} />;
}

export function Scene3D({ model }: { model: string }) {
  return (
    <div className="mx-auto p-4 w-3/5 h-[80vh] bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl overflow-auto touch-pan-y border border-indigo-100">
      <Canvas className="w-full h-full rounded-xl">
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.8} position={[10, 10, 5]} />

        <Suspense
          fallback={
            <Html center>
              <div className="text-indigo-500 font-semibold animate-pulse">Загрузка модели...</div>
            </Html>
          }
        >
          <Model model={model} />
        </Suspense>

        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
