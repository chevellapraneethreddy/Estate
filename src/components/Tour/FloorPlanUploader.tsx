import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Property, Room } from '../../data/properties';
import { UploadIcon } from '../Common/Icons';

interface FloorPlanUploaderProps {
  onGenerationComplete: () => void;
}

export const FloorPlanUploader: React.FC<FloorPlanUploaderProps> = ({ onGenerationComplete }) => {
  const { addProperty } = useApp();
  
  // Form states
  const [propertyName, setPropertyName] = useState<string>('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'villa' | 'commercial'>('apartment');
  const [areaSqFt, setAreaSqFt] = useState<number>(1200);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [price, setPrice] = useState<string>('$450,000');
  const [location, setLocation] = useState<string>('Grand Avenue, Block C');

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Scanning / generation states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    setError(null);
    setFile(uploadedFile);
    
    if (uploadedFile.type !== 'application/pdf') {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
    } else {
      // PDF representation placeholder
      setPreviewUrl('https://images.unsplash.com/photo-1545464693-f1798a373343?auto=format&fit=crop&w=400&q=80');
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

  const handleGenerate3D = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a floor plan file to begin.');
      return;
    }
    if (!propertyName.trim()) {
      setError('Please enter a property name.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const steps = [
      { prg: 15, msg: 'Decoding layout resolution and dimensions...' },
      { prg: 35, msg: 'Analyzing boundary structures and wall layouts...' },
      { prg: 55, msg: 'Extruding 3D walls, ceiling alignments, and floors...' },
      { prg: 75, msg: 'Identifying openings: Placing doors & window bays...' },
      { prg: 90, msg: 'AI Furnishing Engine: Populating rooms based on category...' },
      { prg: 100, msg: 'Synthesizing interactive virtual walkthrough parameters...' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgress(steps[stepIdx].prg);
        setStatusMessage(steps[stepIdx].msg);
        stepIdx++;
      } else {
        clearInterval(interval);
        finalizeGeneration();
      }
    }, 900);
  };

  const finalizeGeneration = () => {
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

    const generatedProperty: Property = {
      id: `prop-${Date.now()}`,
      name: propertyName,
      type: propertyType,
      description: `A custom-generated ${propertyType} built from uploaded floor plan vector dimensions. Optimized with personalized layout style selections.`,
      price: price || '$500,000',
      location: location || 'Developer Lot 1',
      area: `${areaSqFt.toLocaleString()} sq ft`,
      bedrooms,
      bathrooms,
      amenities: ['24/7 Security System', 'Integrated Smart Hub', 'Custom Ventilation', 'Energy-Efficient Insulation'],
      rooms: generatedRooms
    };

    addProperty(generatedProperty);
    setIsProcessing(false);
    onGenerationComplete();
  };

  return (
    <div className="card" style={{ padding: '28px', maxWidth: '800px', margin: '0 auto' }}>
      
      {isProcessing ? (
        /* Processing / scanning screen */
        <div style={{ textAlign: 'center', padding: '40px 0', position: 'relative' }}>
          
          <div style={{ position: 'relative', width: '240px', height: '180px', margin: '0 auto 24px auto', border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Floor Plan Scan" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.5 }}
              />
            )}
            <div className="scanning-grid" />
            <div className="scan-laser" />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>
            PropVision AI Processing
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '24px' }}>
            {statusMessage}
          </p>

          <div style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-tertiary)', height: '8px', borderRadius: 'var(--radius-full)', margin: '0 auto 12px auto', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, background: 'var(--color-primary)', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>{progress}% Completed</span>
        </div>
      ) : (
        /* Form & upload selector screen */
        <form onSubmit={handleGenerate3D} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>Upload Floor Plan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              PropVision AI extrudes walls and places furniture instantly from your uploaded sketches or drawings.
            </p>
          </div>

          {error && (
            <div style={{ background: 'var(--color-danger)', color: '#fff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }} className="upload-row-flex">
            
            {/* File Drag Zone */}
            <div style={{ flex: 1 }}>
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                style={{
                  height: '240px',
                  border: '2px dashed',
                  borderColor: dragActive ? 'var(--color-primary)' : 'var(--border-color)',
                  background: dragActive ? 'var(--color-primary-light)' : 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '20px',
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
                
                {previewUrl ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <img 
                      src={previewUrl} 
                      alt="Floor plan preview" 
                      style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      ✓ {file?.name} Selected
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Click to replace file</span>
                  </div>
                ) : (
                  <>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                      <UploadIcon size={36} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Drag and drop floor plan, or browse
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Supports PDF, PNG, JPG layout sheets.
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Spec Fields */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
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
                  <label className="form-label">Layout Type</label>
                  <select 
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Total Area (Sq Ft)</label>
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
                  <label className="form-label">Bedrooms</label>
                  <input 
                    type="number" 
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="form-input"
                    min={1}
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Bathrooms</label>
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
                  <label className="form-label">Target Price</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $450,000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Marina Block A"
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
              padding: '12px 24px',
              fontSize: '1rem',
              width: '100%',
              marginTop: '10px'
            }}
          >
            Generate 3D House Model
          </button>
        </form>
      )}

    </div>
  );
};
