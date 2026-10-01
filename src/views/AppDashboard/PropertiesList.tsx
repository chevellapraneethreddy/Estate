import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Property, Room } from '../../data/properties';
import { generateHouseSplat } from '../../utils/splatGenerator';
import { Tour3DViewer } from '../../components/Tour/Tour3DViewer';
import { HunyuanModelViewer } from '../../components/Tour/HunyuanModelViewer';
import { MediaExporter } from '../../components/Dashboard/MediaExporter';
import { 
  UploadIcon, 
  CopyIcon, 
  EyeIcon, 
  CheckIcon 
} from '../../components/Common/Icons';

export const PropertiesList: React.FC = () => {
  const { 
    properties, 
    activePropertyId, 
    setActivePropertyId, 
    setCurrentView,
    addProperty,
    activeInteriorStyle,
    setActiveInteriorStyle,
    setActivePreviewMode
  } = useApp();

  // Form states
  const [propertyName, setPropertyName] = useState<string>('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'villa' | 'commercial'>('apartment');
  const [areaSqFt, setAreaSqFt] = useState<number>(1200);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [price, setPrice] = useState<string>('$550,000');
  const [location, setLocation] = useState<string>('Grand Avenue, Block C');

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Upload progress states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Generation progress states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatus, setGenerationStatus] = useState<string>('');

  // Completion states
  const [newlyGeneratedProperty, setNewlyGeneratedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'floorplan' | '3d' | 'furnished'>('floorplan');
  const [copiedPropId, setCopiedPropId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep preview mode aligned with selected tab
  useEffect(() => {
    if (activeTab === '3d') {
      setActivePreviewMode('empty');
    } else if (activeTab === 'furnished') {
      setActivePreviewMode('furnished');
    }
  }, [activeTab, setActivePreviewMode]);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(uploadedFile.type)) {
      setError('Invalid file format. Please upload JPG, PNG, or PDF floor plans.');
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    
    setError(null);
    setFile(uploadedFile);
    
    if (uploadedFile.type !== 'application/pdf') {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
    } else {
      // PDF representation placeholder URL
      setPreviewUrl('pdf-placeholder');
    }
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
    fileInputRef.current?.click();
  };

  const handleUploadAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag-and-drop a floor plan file (PDF, PNG, JPG).');
      return;
    }
    if (!propertyName.trim()) {
      setError('Please enter a project name.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setNewlyGeneratedProperty(null);

    // Simulate file upload
    let uPrg = 0;
    const uploadInterval = setInterval(() => {
      uPrg += 10;
      if (uPrg <= 100) {
        setUploadProgress(uPrg);
      } else {
        clearInterval(uploadInterval);
        setIsUploading(false);
        startGenerationPipeline();
      }
    }, 150); // 1.5 seconds total
  };

  const startGenerationPipeline = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus('Initializing neural scan engine...');

    const pipelineSteps = [
      { prg: 15, msg: 'Floor Plan Analysis: Vectorizing structural wall borders and layouts...' },
      { prg: 35, msg: 'Room Detection: Segmenting carpet area into individual chambers...' },
      { prg: 55, msg: '3D Model Generation: Extruding walls, door swings, and window bays...' },
      { prg: 75, msg: 'AI Furnishing: Populating bedrooms, salons, and cabinets...' },
      { prg: 90, msg: 'Walkthrough Creation: Synthesizing camera routes and walkthrough nodes...' }
    ];

    // Prepare FormData
    const formData = new FormData();
    formData.append('image', file!);
    formData.append('projectName', propertyName);
    formData.append('layoutType', propertyType);
    formData.append('area', String(areaSqFt));
    formData.append('bedrooms', String(bedrooms));
    formData.append('bathrooms', String(bathrooms));
    formData.append('location', location || 'Developer Lot 1');
    formData.append('salePrice', price || '$650,000');

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < pipelineSteps.length) {
        setGenerationProgress(pipelineSteps[currentStep].prg);
        setGenerationStatus(pipelineSteps[currentStep].msg);
        currentStep++;
      }
    }, 4000); // Progress ticks every 4 seconds

    fetch('/api/generate-3d', {
      method: 'POST',
      body: formData
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Generation request failed on the backend.');
        }
        return res.json();
      })
      .then((data) => {
        clearInterval(progressInterval);
        setGenerationProgress(100);
        setGenerationStatus('Export Assets: Building brochures and rendering 3D tour segments...');
        
        // Finalize after showing 100% for a brief moment
        setTimeout(() => {
          finalizePropertyGeneration(data.modelUrl, data.previewImage);
        }, 1000);
      })
      .catch((err) => {
        clearInterval(progressInterval);
        setIsGenerating(false);
        setError(`Failed to generate 3D model: ${err.message || err}`);
        console.error(err);
      });
  };

  const finalizePropertyGeneration = (modelUrl: string, previewImage: string) => {
    // Generate dynamic room specs based on form values
    const generatedRooms: Room[] = [
      {
        id: 'living',
        name: 'Living Salon',
        dimensions: `${Math.round(Math.sqrt(areaSqFt * 0.45))}ft x ${Math.round(Math.sqrt(areaSqFt * 0.3)) }ft`,
        areaSqFt: Math.round(areaSqFt * 0.45),
        x: 0, y: 0, w: 60, h: 50,
        hotspots: [
          {
            id: 'gen-l-hs1',
            label: 'Central Lounge',
            details: 'Spacious lounge designed around structural layouts.',
            x: 50, y: 55,
            specifications: {
              modern: 'Low-profile charcoal sectional, dark media cabinet.',
              luxury: 'Plush velvet wrap-around sofa with gold trims, marble table.',
              minimalist: 'Cream linen futon, monolithic sandstone table.',
              scandinavian: 'Light grey wool bench, wood coffee table.',
              contemporary: 'Asymmetric black leather sofa, steel geometric console.',
              indian: 'Teakwood swing, brass standing lamps, terracotta carpet.'
            }
          }
        ],
        furniture: {
          modern: [
            { id: 'g-f1', name: 'Grey Modular Sofa', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'g-f2', name: 'Oak Table', type: 'table', x: 35, y: 30, w: 25, h: 10 }
          ],
          luxury: [
            { id: 'g-f1', name: 'Velvet Sofa Set', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'g-f2', name: 'Marble Table', type: 'table', x: 35, y: 30, w: 25, h: 10 }
          ],
          minimalist: [
            { id: 'g-f1', name: 'Plain Linen Sofa', type: 'sofa', x: 30, y: 48, w: 35, h: 20 },
            { id: 'g-f2', name: 'Stone Table Block', type: 'table', x: 38, y: 32, w: 20, h: 8 }
          ],
          scandinavian: [
            { id: 'g-f1', name: 'Wool Sofa Set', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'g-f2', name: 'Birch Coffee Table', type: 'table', x: 35, y: 30, w: 25, h: 10 }
          ],
          contemporary: [
            { id: 'g-f1', name: 'Asymmetric Sectional', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'g-f2', name: 'Geometric Steel Table', type: 'table', x: 35, y: 30, w: 25, h: 10 }
          ],
          indian: [
            { id: 'g-f1', name: 'Carved Teakwood Sofa Set', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'g-f2', name: 'Teakwood Coffee Table', type: 'table', x: 35, y: 30, w: 25, h: 10 }
          ]
        }
      },
      {
        id: 'kitchen',
        name: 'Modular Kitchen & Dining',
        dimensions: `${Math.round(Math.sqrt(areaSqFt * 0.25))}ft x ${Math.round(Math.sqrt(areaSqFt * 0.2)) }ft`,
        areaSqFt: Math.round(areaSqFt * 0.25),
        x: 60, y: 0, w: 40, h: 50,
        hotspots: [
          {
            id: 'gen-k-hs1',
            label: 'Preparation Island',
            details: 'Equipped with custom counters and sinks.',
            x: 50, y: 40,
            specifications: {
              modern: 'Black composite counter, induction cooktop.',
              luxury: 'Marble waterfall counter, gold touchless tap.',
              minimalist: 'Microcement counter, hidden cabinet setup.',
              scandinavian: 'Birch prep counter, white oak trim drawers.',
              contemporary: 'Stainless steel workspace, steel panels.',
              indian: 'Granite counter, brass containers, clay pot planter.'
            }
          }
        ],
        furniture: {
          modern: [{ id: 'g-k1', name: 'Kitchen Counter', type: 'cabinet', x: 20, y: 10, w: 60, h: 15 }],
          luxury: [{ id: 'g-k1', name: 'Luxury Marble Island', type: 'table', x: 20, y: 15, w: 60, h: 25 }],
          minimalist: [{ id: 'g-k1', name: 'Seamless Ledge Counter', type: 'fixture', x: 25, y: 10, w: 50, h: 15 }],
          scandinavian: [{ id: 'g-k1', name: 'Ash Wood Workstation', type: 'table', x: 20, y: 15, w: 60, h: 20 }],
          contemporary: [{ id: 'g-k1', name: 'Steel Island Prep Desk', type: 'table', x: 20, y: 15, w: 60, h: 22 }],
          indian: [{ id: 'g-k1', name: 'Granite Table & Brass Shelves', type: 'table', x: 20, y: 15, w: 60, h: 25 }]
        }
      },
      {
        id: 'bedroom',
        name: 'Master Suite',
        dimensions: `${Math.round(Math.sqrt(areaSqFt * 0.3))}ft x ${Math.round(Math.sqrt(areaSqFt * 0.35)) }ft`,
        areaSqFt: Math.round(areaSqFt * 0.3),
        x: 0, y: 50, w: 60, h: 50,
        hotspots: [
          {
            id: 'gen-b-hs1',
            label: 'Orthopedic King Setup',
            details: 'Equipped with ambient lighting and smart charge docks.',
            x: 40, y: 40,
            specifications: {
              modern: 'Low grey padded frame, LED headboard strip.',
              luxury: 'Gold post canopy frame, velvet panels, crystal lamps.',
              minimalist: 'Low Japanese wood frame, light sheets.',
              scandinavian: 'Light oak wood frame, white soft duvets.',
              contemporary: 'Floating platform bed, metallic sheets.',
              indian: 'Poster bed, hand-carved pillars, traditional printed throw.'
            }
          }
        ],
        furniture: {
          modern: [{ id: 'g-b1', name: 'King Platform Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 }],
          luxury: [{ id: 'g-b1', name: 'Velvet King Canopy Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 }],
          minimalist: [{ id: 'g-b1', name: 'Low Japanese Bed Frame', type: 'bed', x: 15, y: 25, w: 40, h: 40 }],
          scandinavian: [{ id: 'g-b1', name: 'Birch Wood Bed Frame', type: 'bed', x: 15, y: 25, w: 40, h: 40 }],
          contemporary: [{ id: 'g-b1', name: 'Curved Metallic Platform Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 }],
          indian: [{ id: 'g-b1', name: 'Rosewood Four-Poster Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 }]
        }
      }
    ];

    const propertyId = `prop-${Date.now()}`;
    const generatedProperty: Property = {
      id: propertyId,
      name: propertyName,
      type: propertyType,
      description: `A custom-generated ${propertyType} built from uploaded floor plan vector dimensions. Optimized with personalized layout style selections.`,
      price: price || '$650,000',
      location: location || 'Developer Lot 1',
      area: `${areaSqFt.toLocaleString()} sq ft`,
      bedrooms,
      bathrooms,
      amenities: ['24/7 Security System', 'Integrated Smart Hub', 'Custom Ventilation', 'Energy-Efficient Insulation'],
      rooms: generatedRooms,
      has3DModel: true,
      modelUrl: modelUrl,
      previewImage: previewImage
    };

    addProperty(generatedProperty);
    setNewlyGeneratedProperty(generatedProperty);
    setActivePropertyId(generatedProperty.id);
    setIsGenerating(false);
    setActiveTab('3d');
  };

  const getStepStatus = (stepIndex: number) => {
    const boundaries = [0, 15, 35, 55, 75, 90, 100];
    const prev = boundaries[stepIndex - 1];
    const curr = boundaries[stepIndex];

    if (generationProgress > curr) {
      return 'completed';
    } else if (generationProgress > prev && generationProgress <= curr) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const handleCopyLink = (propId: string) => {
    const mockUrl = `${window.location.origin}/view/${propId}`;
    navigator.clipboard.writeText(mockUrl);
    setCopiedPropId(propId);
    setTimeout(() => setCopiedPropId(null), 2000);
  };

  const handleLaunchLandingPage = (propId: string) => {
    setActivePropertyId(propId);
    setCurrentView('property-landing');
  };

  const handleEditInSuperSplat = (propId: string) => {
    setActivePropertyId(propId);
    setCurrentView('editor');
  };

  const resetUploadWorkspace = () => {
    setFile(null);
    setPreviewUrl(null);
    setPropertyName('');
    setNewlyGeneratedProperty(null);
    setError(null);
  };

  const getFilePreviewMarkup = () => {
    if (!file) return null;
    if (file.type === 'application/pdf') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px' }}>
          <span style={{ fontSize: '2.5rem' }}>📄</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700 }}>PDF Document Validated</span>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ height: '110px', overflow: 'hidden', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#090d16', padding: '4px' }}>
          <img src={previewUrl || ''} alt="Preview" style={{ height: '100%', maxWidth: '100%', objectFit: 'contain' }} />
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>✓ {file.name}</span>
      </div>
    );
  };

  // 6 Pipeline steps array
  const stepsList = [
    { title: 'Floor Plan Analysis', desc: 'Vectorizing structural wall borders and outlines' },
    { title: 'Room Detection', desc: 'Identifying room names, areas, and space coordinates' },
    { title: '3D Model Generation', desc: 'Extruding walls and scaling door/window openings' },
    { title: 'AI Furnishing', desc: 'Placing room fixtures, beds, dining sets, and sofas' },
    { title: 'Walkthrough Creation', desc: 'Synthesizing interactive cameras and walk paths' },
    { title: 'Export Assets', desc: 'Generating brochure PDF files and walkthrough media' }
  ];

  const interiorStyles = [
    { id: 'modern', label: 'Modern' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'scandinavian', label: 'Scandinavian' },
    { id: 'contemporary', label: 'Contemporary' },
    { id: 'indian', label: 'Traditional Indian' }
  ];

  const property = newlyGeneratedProperty || properties.find(p => p.id === activePropertyId) || properties[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 1. Main Header Title */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Upload Floor Plan and Generate 3D Property
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Convert 2D blueprint drawings into photorealistic furnished 3D walks, property marketing brochures, and shareable links.
        </p>
      </div>

      {/* 2. Workspace Viewport (Upload Zone / Progress / Completion Showcase) */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
        
        {/* State A: File Uploading progress indicator */}
        {isUploading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '10px' }}>Uploading Floor Plan...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Sending blueprint file "{file?.name}" to PropVision AI processing nodes.
            </p>
            <div style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-tertiary)', height: '10px', borderRadius: 'var(--radius-full)', margin: '0 auto 12px auto', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, background: 'var(--color-primary)', height: '100%', transition: 'width 0.1s ease-out' }} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>{uploadProgress}% Uploaded</span>
          </div>
        )}

        {/* State B: AI Generation Pipeline */}
        {isGenerating && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '10px',
                letterSpacing: '1px'
              }}>
                PROCESSING BLUEPRINT
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>AI Generation Pipeline</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', minHeight: '20px' }}>
                {generationStatus}
              </p>
            </div>

            {/* Steps grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {stepsList.map((step, idx) => {
                const status = getStepStatus(idx + 1);
                return (
                  <div 
                    key={idx}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-lg)',
                      background: status === 'active' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: status === 'active' ? 'var(--color-primary)' : status === 'completed' ? 'var(--border-color)' : 'transparent',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      opacity: status === 'pending' ? 0.45 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {status === 'completed' && (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <CheckIcon size={12} strokeWidth={3} />
                        </div>
                      )}
                      {status === 'active' && (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--color-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                      )}
                      {status === 'pending' && (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--text-muted)', background: 'transparent' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {idx + 1}. {step.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Master Progress Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ width: '100%', background: 'var(--bg-tertiary)', height: '8px', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${generationProgress}%`, background: 'var(--color-primary)', height: '100%', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {generationProgress}% Overall Pipeline Progress
              </span>
            </div>

          </div>
        )}

        {/* State C: Newly Generated Property Card (Showcase viewport) */}
        {newlyGeneratedProperty && !isGenerating && !isUploading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Success message banner */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'rgba(16, 185, 129, 0.08)', 
              border: '1px solid #10b981', 
              padding: '16px 24px', 
              borderRadius: 'var(--radius-lg)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h4 style={{ color: '#10b981', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>✓</span> Generation Completed Successfully!
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  The 2D blueprint has been processed into a furnished 3D model: "{newlyGeneratedProperty.name}".
                </p>
              </div>

              <button 
                onClick={resetUploadWorkspace}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Upload New Plan
              </button>
            </div>

            {/* Workspace split: Left (Large Previews Tabs Window) & Right (Metadata & Actions) */}
            <div style={{ display: 'flex', gap: '28px', flexDirection: 'row', flexWrap: 'wrap' }} className="upload-row-flex">
              
              {/* Left Side: interactive previews frame */}
              <div style={{ flex: 1.6, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Tabs bar selector */}
                <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', padding: '4px', gap: '4px' }}>
                  <button 
                    onClick={() => setActiveTab('floorplan')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: activeTab === 'floorplan' ? 'var(--bg-secondary)' : 'transparent',
                      color: activeTab === 'floorplan' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    📐 2D Floor Plan
                  </button>

                  <button 
                    onClick={() => setActiveTab('3d')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: activeTab === '3d' ? 'var(--bg-secondary)' : 'transparent',
                      color: activeTab === '3d' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    🏠 Generated 3D Preview
                  </button>

                  <button 
                    onClick={() => setActiveTab('furnished')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: activeTab === 'furnished' ? 'var(--bg-secondary)' : 'transparent',
                      color: activeTab === 'furnished' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    🛋️ AI Furnishing
                  </button>
                </div>

                {/* Tab content viewport window */}
                <div style={{
                  height: '420px',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  position: 'relative'
                }}>
                  
                  {activeTab === 'floorplan' && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' }}>
                      {file?.type === 'application/pdf' ? (
                        <div style={{ textAlign: 'center', color: '#1e293b' }}>
                          <span style={{ fontSize: '5rem', display: 'block', marginBottom: '12px' }}>📊</span>
                          <h4 style={{ fontWeight: 800 }}>Vector Floor Plan Blueprint</h4>
                          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                            {file.name}
                          </p>
                        </div>
                      ) : (
                        <img 
                          src={previewUrl || ''} 
                          alt="Uploaded Floor Plan" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      )}
                    </div>
                  )}

                  {activeTab === '3d' && (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      {property?.modelUrl?.endsWith('.glb') ? (
                        <HunyuanModelViewer
                          modelUrl={property.modelUrl}
                          previewImage={property.previewImage || ''}
                          projectName={property.name}
                        />
                      ) : (
                        <>
                          <Tour3DViewer />
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: 'rgba(9, 13, 22, 0.8)',
                            backdropFilter: 'blur(4px)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#fff',
                            zIndex: 10
                          }}>
                            🏢 Base Structure Mode (Empty)
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === 'furnished' && (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      {property?.modelUrl?.endsWith('.glb') ? (
                        <HunyuanModelViewer
                          modelUrl={property.modelUrl}
                          previewImage={property.previewImage || ''}
                          projectName={property.name}
                        />
                      ) : (
                        <>
                          <Tour3DViewer />
                          
                          {/* Floating style switcher overlays */}
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(9, 13, 22, 0.85)',
                            backdropFilter: 'blur(8px)',
                            padding: '8px 12px',
                            borderRadius: '24px',
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            maxWidth: '90%',
                            zIndex: 10,
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            {interiorStyles.map((style) => (
                              <button
                                key={style.id}
                                onClick={() => setActiveInteriorStyle(style.id)}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '12px',
                                  border: 'none',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  background: activeInteriorStyle === style.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                  color: '#fff',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {style.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                </div>

              </div>

              {/* Right Side: property info and asset export download center */}
              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {newlyGeneratedProperty.type} Layout
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px', marginBottom: '8px' }}>
                    {newlyGeneratedProperty.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {newlyGeneratedProperty.description}
                  </p>
                </div>

                {/* Specs row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Total Carpet Area</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{newlyGeneratedProperty.area}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Rooms Placed</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{newlyGeneratedProperty.rooms.length} Areas</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Target Valuation</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{newlyGeneratedProperty.price}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Project Location</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{newlyGeneratedProperty.location}</span>
                  </div>
                </div>

                {/* Asset download actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block' }}>
                    Export Real-Time Walkthrough Assets
                  </span>

                  <MediaExporter propertyId={newlyGeneratedProperty.id} />

                  {/* Share & Edit actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px dashed var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
                    <button
                      onClick={() => handleEditInSuperSplat(newlyGeneratedProperty.id)}
                      className={newlyGeneratedProperty.has3DModel ? "btn btn-primary" : "btn btn-secondary"}
                      disabled={!newlyGeneratedProperty.has3DModel}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        fontSize: '0.85rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        background: newlyGeneratedProperty.has3DModel ? 'var(--color-primary)' : 'var(--bg-tertiary)', 
                        boxShadow: newlyGeneratedProperty.has3DModel ? 'var(--shadow-glow)' : 'none', 
                        fontWeight: 700,
                        cursor: newlyGeneratedProperty.has3DModel ? 'pointer' : 'not-allowed',
                        opacity: newlyGeneratedProperty.has3DModel ? 1 : 0.6
                      }}
                    >
                      {newlyGeneratedProperty.has3DModel ? '🛠️ Edit in SuperSplat' : '⚠️ Generate 3D Model First'}
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleLaunchLandingPage(newlyGeneratedProperty.id)}
                        className="btn btn-outline"
                        style={{ flexGrow: 1, padding: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <EyeIcon size={14} />
                        Launch Walkthrough Page
                      </button>

                      <button
                        onClick={() => handleCopyLink(newlyGeneratedProperty.id)}
                        className="btn btn-secondary"
                        style={{ padding: '10px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <CopyIcon size={14} />
                        {copiedPropId === newlyGeneratedProperty.id ? 'Copied Link!' : 'Share Walk'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* State D: Primary Form & Upload drag zone */}
        {!isUploading && !isGenerating && !newlyGeneratedProperty && (
          <form onSubmit={handleUploadAndGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {error && (
              <div style={{ background: 'var(--color-danger)', color: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '28px', flexDirection: 'row', flexWrap: 'wrap' }} className="upload-row-flex">
              
              {/* Drag Area */}
              <div style={{ flex: 1.2, minWidth: '300px' }}>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  style={{
                    height: '320px',
                    border: '2px dashed',
                    borderColor: dragActive ? 'var(--color-primary)' : 'var(--border-color)',
                    background: dragActive ? 'var(--color-primary-light)' : 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: '24px',
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                  />
                  
                  {file ? (
                    getFilePreviewMarkup()
                  ) : (
                    <>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                        <UploadIcon size={44} />
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Drag and drop floor plan, or browse files
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '300px' }}>
                        Supports high-resolution PDF blueprints, PNG diagrams, or JPG drawings (up to 10MB).
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Specs parameters fields */}
              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>Project Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Skyline Heights Penthouse"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>Layout Type</label>
                    <select 
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial Space</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>Total Area (Sq Ft)</label>
                    <input 
                      type="number" 
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>Bedrooms count</label>
                    <input 
                      type="number" 
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="form-input"
                      min={1}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>Bathrooms count</label>
                    <input 
                      type="number" 
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="form-input"
                      min={1}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>Target Sale Price</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $450,000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>Lot / Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Marina District Lot 4"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '1rem',
                width: '100%',
                marginTop: '10px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              Generate 3D House Model
            </button>
          </form>
        )}

      </div>

      {/* 3. Portfolio section for existing properties (listed secondary below) */}
      {properties.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px', marginTop: '10px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Previously Generated Properties
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
              Select a property layout below to launch its share links, review analytics, or download brochures.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {properties.map((prop) => {
              const isActive = activePropertyId === prop.id;
              return (
                <div
                  key={prop.id}
                  className="card"
                  style={{
                    padding: '24px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      ACTIVE IN VIEWPORT
                    </div>
                  )}



                  {/* Header info */}
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {prop.type}
                    </span>
                    <h4 
                      onClick={() => handleLaunchLandingPage(prop.id)}
                      style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 6px 0', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {prop.name}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', minHeight: '36px' }}>
                      {prop.description}
                    </p>
                  </div>

                  {/* Specs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '10px 0', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Area</span>
                      <span style={{ fontWeight: 700 }}>{prop.area}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rooms</span>
                      <span style={{ fontWeight: 700 }}>{prop.rooms.length} Areas</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Price</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{prop.price}</span>
                    </div>
                  </div>

                  {/* Export buttons & Edit option */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                        Export Assets
                      </span>
                      <MediaExporter propertyId={prop.id} />
                    </div>

                    <button
                      onClick={() => handleEditInSuperSplat(prop.id)}
                      className={prop.has3DModel ? "btn btn-outline" : "btn btn-secondary"}
                      disabled={!prop.has3DModel}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        fontSize: '0.8rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px',
                        cursor: prop.has3DModel ? 'pointer' : 'not-allowed',
                        opacity: prop.has3DModel ? 1 : 0.6
                      }}
                    >
                      {prop.has3DModel ? '🛠️ Edit in SuperSplat' : '⚠️ Generate 3D Model First'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                    <button
                      onClick={() => handleLaunchLandingPage(prop.id)}
                      className="btn btn-outline"
                      style={{ flexGrow: 1, padding: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <EyeIcon size={14} />
                      Launch Walk
                    </button>

                    <button
                      onClick={() => handleCopyLink(prop.id)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      title="Copy Share Link"
                    >
                      <CopyIcon size={14} />
                      {copiedPropId === prop.id ? 'Copied!' : 'Share'}
                    </button>
                    
                    <button
                      onClick={() => setActivePropertyId(prop.id)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '0.8rem', fontWeight: 700 }}
                      disabled={isActive}
                    >
                      Select
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
