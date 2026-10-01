import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UploadIcon, CheckIcon, BuildingIcon, VideoIcon } from '../../components/Common/Icons';

/**
 * Parses and verifies that a PLY or SPLAT file exists on disk and contains points.
 */
async function verifySplatFile(url: string): Promise<{ success: boolean; error?: string; splats: number }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { success: false, error: "Generate 3D Model First", splats: 0 };
    }
    
    // If it's a binary .splat file, check chunk size multiple
    if (url.endsWith('.splat')) {
      const buffer = await response.arrayBuffer();
      const splats = Math.floor(buffer.byteLength / 32);
      if (splats > 0) {
        return { success: true, splats };
      } else {
        return { success: false, error: "Generate 3D Model First (Empty splat file)", splats: 0 };
      }
    }

    // For PLY files, read as text and verify element vertex count is > 0
    const text = await response.text();
    if (!text.startsWith('ply')) {
      return { success: false, error: "Generate 3D Model First (Invalid format)", splats: 0 };
    }

    const elementVertexRegex = /element\s+vertex\s+(\d+)/;
    const match = text.match(elementVertexRegex);
    if (!match) {
      return { success: false, error: "Generate 3D Model First (Invalid PLY structure)", splats: 0 };
    }

    const splats = parseInt(match[1], 10);
    if (splats > 0) {
      return { success: true, splats };
    } else {
      return { success: false, error: "Generate 3D Model First (0 splats found)", splats: 0 };
    }
  } catch (err: any) {
    return { success: false, error: "Generate 3D Model First", splats: 0 };
  }
}

// Global cached DOM elements to keep the SuperSplat canvas/PCUI instance alive
let cachedMountElement: HTMLDivElement | null = null;
let isInitialized = false;

export const ThreeDEditor: React.FC = () => {
  const { 
    properties, 
    activePropertyId, 
    setCurrentView 
  } = useApp();

  const property = properties.find((p) => p.id === activePropertyId) || properties[0];

  // Setup the absolute URL of the model served from our public assets
  const modelUrlPath = property?.modelUrl || '';
  const modelUrl = modelUrlPath ? `${window.location.origin}${modelUrlPath}` : '';

  // States
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveProgress, setSaveProgress] = useState<number>(-1);

  // Verification states
  const [validationState, setValidationState] = useState<'verifying' | 'valid' | 'invalid'>('verifying');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [splatCount, setSplatCount] = useState<number>(0);
  const [editorInitializing, setEditorInitializing] = useState<boolean>(!isInitialized);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    
    async function performVerification() {
      if (!property || !property.modelUrl) {
        if (active) {
          setValidationState('invalid');
          setValidationError("Generate 3D Model First");
        }
        return;
      }
      
      if (active) {
        setValidationState('verifying');
        setValidationError(null);
      }
      
      const absoluteUrl = `${window.location.origin}${property.modelUrl}`;
      const result = await verifySplatFile(absoluteUrl);
      
      if (!active) return;
      
      if (result.success) {
        setValidationState('valid');
        setSplatCount(result.splats);
      } else {
        setValidationState('invalid');
        setValidationError(result.error || "Generate 3D Model First");
      }
    }
    
    performVerification();
    
    return () => {
      active = false;
    };
  }, [property]);

  // Mount/initialize SuperSplat direct DOM
  useEffect(() => {
    let active = true;
    
    async function setupEditor() {
      if (!cachedMountElement) {
        cachedMountElement = document.createElement('div');
        cachedMountElement.id = 'supersplat-mount';
        cachedMountElement.style.width = '100%';
        cachedMountElement.style.height = '100%';
      }
      
      if (containerRef.current && !containerRef.current.contains(cachedMountElement)) {
        containerRef.current.appendChild(cachedMountElement);
      }
      
      if (!isInitialized) {
        if (active) setEditorInitializing(true);
        // Dynamically import SuperSplat entrypoint (compiles SCSS & runs main)
        await import('../../supersplat/index');
        isInitialized = true;
      }
      
      if (active) setEditorInitializing(false);

      // Load/import the current property splat model URL directly into same-origin editor context
      if (window.superSplatEvents && active && property?.modelUrl) {
        const absoluteUrl = `${window.location.origin}${property.modelUrl}`;
        window.superSplatEvents.fire('scene.clear');
        window.superSplatEvents.fire('camera.reset');
        window.superSplatEvents.invoke('import', [{
          filename: property.modelUrl.split('/').pop(),
          url: absoluteUrl
        }]);
      }
    }

    if (validationState === 'valid') {
      setupEditor();
    }

    return () => {
      active = false;
      // Detach mount point but preserve inside memory cache
      if (cachedMountElement && cachedMountElement.parentNode) {
        cachedMountElement.parentNode.removeChild(cachedMountElement);
      }
    };
  }, [validationState, property]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'ply' && extension !== 'splat' && extension !== 'glb') {
      setError('Invalid file format. Please upload an exported .ply, .splat, or .glb file from SuperSplat.');
      setUploadedFile(null);
      return;
    }
    setError(null);
    setUploadedFile(file);
    setIsSaved(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (validationState === 'valid') {
      fileInputRef.current?.click();
    }
  };

  const handleSaveScene = () => {
    if (!uploadedFile || validationState !== 'valid' || !property?.modelUrl) return;
    setSaveProgress(0);
    setError(null);

    const filename = property.modelUrl.split('/').pop() || `prop-${property.id}.ply`;

    fetch(`/api/save-model?filename=${filename}`, {
      method: 'POST',
      body: uploadedFile
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save to local storage");
        return res.json();
      })
      .then(data => {
        console.log("Saved scene changes successfully:", data);
        setSaveProgress(100);
        setTimeout(() => {
          setIsSaved(true);
          setSaveProgress(-1);
        }, 300);
      })
      .catch(err => {
        console.error("Save error:", err);
        setError("Error saving file to server: " + err.message);
        setSaveProgress(-1);
      });
  };

  const handleContinueToVideo = () => {
    setCurrentView('dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 70px)', 
      background: 'var(--bg-primary)', 
      color: 'var(--text-primary)',
      overflow: 'hidden' 
    }}>
      
      {/* 1. SuperSplat Editor Canvas Container (Left 75%) */}
      <div style={{ 
        flex: 3, 
        position: 'relative', 
        height: '100%', 
        borderRight: '1px solid var(--border-color)',
        background: '#000'
      }}>
        
        {validationState === 'verifying' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(9, 13, 22, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            zIndex: 10
          }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              border: '3px solid var(--color-primary-light)', 
              borderTopColor: 'var(--color-primary)', 
              animation: 'spin 1s linear infinite' 
            }} />
            <h3 style={{ fontWeight: 800 }}>Verifying 3D Splat Scene...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Checking that a valid 3D Gaussian Splat model exists on disk.
            </p>
          </div>
        )}

        {validationState === 'invalid' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(9, 13, 22, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            zIndex: 10,
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3.5rem' }}>⚠️</div>
            <h2 style={{ fontWeight: 800, color: 'var(--color-danger)' }}>{validationError}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', lineHeight: '1.6' }}>
              SuperSplat cannot be launched because no valid 3D Gaussian Splat model containing points is available. Please generate a 3D house model from the floor plan first.
            </p>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontWeight: 700 }}
            >
              ← Return to Dashboard
            </button>
          </div>
        )}

        {validationState === 'valid' && (
          <>
            {/* SuperSplat dynamic script loading spinner */}
            {editorInitializing && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(9, 13, 22, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                zIndex: 10
              }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  border: '3px solid var(--color-primary-light)', 
                  borderTopColor: 'var(--color-primary)', 
                  animation: 'spin 1s linear infinite' 
                }} />
                <h3 style={{ fontWeight: 800 }}>Initializing SuperSplat Engine...</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Loading WebGL modules and same-origin editor canvas.
                </p>
              </div>
            )}

            {/* Direct mount element wrapper for SuperSplat */}
            <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'block' }} />

            {/* Floating warning info showing loaded URL */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '8px 16px',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 5
            }}>
              <span style={{ color: '#10b981' }}>●</span>
              <span>Same-Origin Active: <a href={modelUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{modelUrlPath.split('/').pop()}</a></span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{splatCount.toLocaleString()} Splats</span>
            </div>
          </>
        )}

      </div>

      {/* 2. Control Panel Sidebar (Right 25%) */}
      <div className="glass-panel" style={{ 
        flex: 1, 
        minWidth: '320px',
        maxWidth: '420px',
        height: '100%', 
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto',
        borderRadius: 0,
        border: 'none',
        borderLeft: '1px solid var(--border-color)',
        boxShadow: 'none'
      }}>
        
        {/* Header navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            ← Cancel
          </button>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.7rem',
            fontWeight: 800,
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            padding: '4px 10px',
            borderRadius: '12px'
          }}>
            3D EDITOR ACTIVE
          </div>
        </div>

        {/* Property Metadata */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Scene
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px', marginBottom: '6px' }}>
            {property?.name || 'No Property Selected'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
            {property?.description || 'Please select a generated property to edit.'}
          </p>
        </div>

        {/* Step-by-Step workflow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', opacity: validationState === 'valid' ? 1 : 0.5 }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
            Editing Guidelines
          </h4>
          
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', lineHeight: '1.4' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>1</div>
            <div>
              <b>Edit inside SuperSplat:</b> Use the brush, crop, and filter tools in the canvas to optimize your 3D house scene.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', lineHeight: '1.4' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>2</div>
            <div>
              <b>Export Scene:</b> Inside SuperSplat, go to <b>File &gt; Export as PLY</b> to download your modifications to your local computer.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', lineHeight: '1.4' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>3</div>
            <div>
              <b>Save Changes:</b> Drag-and-drop the exported file into the dropzone below to store the edited scene in your project's storage.
            </div>
          </div>
        </div>

        {/* Dropzone file uploader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px', opacity: validationState === 'valid' ? 1 : 0.5, pointerEvents: validationState === 'valid' ? 'auto' : 'none' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            Upload Edited Scene
          </span>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            style={{
              height: '140px',
              border: '2px dashed',
              borderColor: dragActive ? 'var(--color-primary)' : 'var(--border-color)',
              background: dragActive ? 'var(--color-primary-light)' : 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '16px',
              textAlign: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".ply,.splat,.glb"
              style={{ display: 'none' }}
            />
            
            {uploadedFile ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.8rem' }}>📦</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  ✓ {uploadedFile.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to save
                </span>
              </div>
            ) : (
              <>
                <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <UploadIcon size={32} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Drop your exported file here
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Accepts modified .ply or .splat files
                </span>
              </>
            )}
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Action button container */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          
          {/* Progress or status bar */}
          {saveProgress >= 0 && (
            <div style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Saving to Storage ({saveProgress}%)</div>
              <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '4px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${saveProgress}%`, background: 'var(--color-primary)', height: '100%', transition: 'width 0.1s ease' }} />
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSaved && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'rgba(16, 185, 129, 0.08)', 
              border: '1px solid #10b981', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <CheckIcon size={10} strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>Scene Saved Successfully</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Model saved to active project storage.</div>
              </div>
            </div>
          )}

          {/* Save Action */}
          <button
            onClick={handleSaveScene}
            className="btn btn-primary"
            disabled={!uploadedFile || isSaved || saveProgress >= 0 || validationState !== 'valid'}
            style={{
              padding: '12px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: uploadedFile && !isSaved && validationState === 'valid' ? 'var(--shadow-glow)' : 'none'
            }}
          >
            <BuildingIcon size={16} />
            Save Scene Changes
          </button>

          {/* Continue / Next Step Action */}
          <button
            onClick={handleContinueToVideo}
            className="btn btn-secondary"
            disabled={!isSaved}
            style={{
              padding: '12px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderColor: isSaved ? 'var(--color-accent)' : 'var(--border-color)',
              color: isSaved ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            <VideoIcon size={16} />
            Continue to Walkthrough Video
          </button>

        </div>

      </div>

    </div>
  );
};

export default ThreeDEditor;
