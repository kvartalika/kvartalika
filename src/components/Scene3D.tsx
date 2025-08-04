import {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {Html, OrbitControls, useGLTF, useProgress} from '@react-three/drei';

interface Scene3DProps {
  model: string;
}

const LoaderOverlay = () => {
  const {progress} = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-white/90 p-4 rounded shadow">
        <div className="text-indigo-600 font-semibold">Загрузка 3D модели...</div>
        <div className="text-sm text-gray-500">{Math.round(progress)}%</div>
        <div className="w-32 h-1 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{width: `${progress}%`}}
          />
        </div>
      </div>
    </Html>
  );
};

function Model({model}: { model: string }) {
  const gltf = useGLTF(model, true);
  return <primitive object={gltf.scene} />;
}

export default function Scene3D({model}: Scene3DProps) {
  useGLTF.preload(model);

  return (
    <div className="mx-auto p-4 w-full max-w-[75vw] h-[80vh] bg-gradient-to-br from-indigo-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
      <Canvas
        className="w-full h-full rounded-xl"
        dpr={[1, 2]}
        camera={{position: [0, 2, 5], fov: 50}}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          intensity={0.8}
          position={[5, 5, 5]}
        />
        <Suspense fallback={<LoaderOverlay />}>
          <Model model={model} />
        </Suspense>
        <OrbitControls
          enableZoom
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          makeDefault
        />
      </Canvas>
    </div>
  );
}