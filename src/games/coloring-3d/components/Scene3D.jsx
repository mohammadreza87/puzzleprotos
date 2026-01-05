import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FullGLBModel } from './FullGLBModel';
import { useColoringStore } from '../hooks/useColoringState';
import { MODELS } from '../data/models';

/**
 * 3D Model loader
 */
const ColorableModel = () => {
  const { currentModel } = useColoringStore();
  const model = MODELS[currentModel];

  if (!model) return null;

  // Full GLB model - load entire scene
  if (model.isFullGLB) {
    return <FullGLBModel modelPath={model.modelPath} />;
  }

  return null;
};

/**
 * 3D Scene Canvas wrapper
 */
export const Scene3D = () => {
  return (
    <Canvas
      camera={{
        position: [8, 6, 8],
        fov: 60,
      }}
      style={{
        width: '100%',
        height: '100%',
        background: '#1a1414',
      }}
      gl={{ antialias: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} />
      <hemisphereLight args={['#87CEEB', '#228B22', 0.3]} />

      {/* 3D Model */}
      <Suspense fallback={null}>
        <ColorableModel />
      </Suspense>

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        minDistance={2}
        maxDistance={30}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
};

export default Scene3D;
