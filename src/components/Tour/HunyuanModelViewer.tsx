import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  // Load the GLTF/GLB model
  const { scene } = useGLTF(url);
  
  // Optional: Traverse scene to adjust materials or shadows
  scene.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      const mesh = node as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh.material) {
        mesh.material.side = THREE.DoubleSide;
      }
    }
  });

  return <primitive object={scene} />;
};

interface HunyuanModelViewerProps {
  modelUrl: string;
  previewImage: string;
  projectName: string;
}

export const HunyuanModelViewer: React.FC<HunyuanModelViewerProps> = ({
  modelUrl,
  previewImage,
  projectName
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = modelUrl;
    link.download = modelUrl.split('/').pop() || `${projectName.replace(/\s+/g, '_')}_model.glb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      
      {/* 1. Header Toolbar with Download button */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 10,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={handleDownload}
          className="btn btn-primary"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-glow)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ⬇️ Download GLB
        </button>
      </div>

      {/* Status Indicators */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: '#fff',
        zIndex: 10
      }}>
        🤖 Hunyuan3D-2.1 Mesh
      </div>

      {/* 2. Visual Preview & 3D Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Render fallback preview image */}
        {previewImage && (loading || error) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f1f5f9',
            zIndex: 5
          }}>
            <img
              src={previewImage}
              alt="Hunyuan3D Model Preview"
              style={{
                maxHeight: '70%',
                maxWidth: '90%',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            {loading && !error && (
              <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                🔄 Loading 3D model environment...
              </div>
            )}
            {error && (
              <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-danger)' }}>
                ⚠️ Error: {error}
              </div>
            )}
          </div>
        )}

        {/* 3D Canvas */}
        {!error && (
          <Canvas
            shadows
            camera={{ position: [0, 1.5, 3.5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            
            <Suspense fallback={null}>
              <Center>
                <Model url={modelUrl} />
              </Center>
            </Suspense>

            {/* Orbit Controls to allow Rotate and Zoom */}
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={1}
              maxDistance={10}
            />
          </Canvas>
        )}
      </div>

      {/* Force complete loading when Canvas finishes rendering */}
      <Suspense fallback={null}>
        <AssetLoader url={modelUrl} onLoad={() => setLoading(false)} onError={(err) => setError(err)} />
      </Suspense>
    </div>
  );
};

// Helper component to notify parent once GLTF loads successfully
interface AssetLoaderProps {
  url: string;
  onLoad: () => void;
  onError: (msg: string) => void;
}

const AssetLoader: React.FC<AssetLoaderProps> = ({ url, onLoad, onError }) => {
  try {
    useGLTF(url);
    React.useEffect(() => {
      onLoad();
    }, [url]);
  } catch (err: any) {
    React.useEffect(() => {
      onError(err?.message || 'Failed to load model asset.');
    }, [url, err]);
  }
  return null;
};
