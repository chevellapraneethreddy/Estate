import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DownloadIcon, VideoIcon } from '../Common/Icons';

interface MediaExporterProps {
  propertyId: string;
}

export const MediaExporter: React.FC<MediaExporterProps> = ({ propertyId }) => {
  const { properties, activeInteriorStyle } = useApp();
  const property = properties.find((p) => p.id === propertyId) || properties[0];

  // Exporters state
  const [pdfProgress, setPdfProgress] = useState<number>(-1);
  const [videoProgress, setVideoProgress] = useState<number>(-1);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const triggerPDFExport = () => {
    setPdfProgress(0);
    setStatusMessage('Compiling property layout variables...');

    const steps = [
      { prg: 25, msg: 'Calculating room dimensions and floor spaces...' },
      { prg: 60, msg: 'Extracting high-resolution 3D view snapshots...' },
      { prg: 85, msg: 'Building print stylesheet and vector layouts...' },
      { prg: 100, msg: 'Brochure compiled successfully! Starting download...' }
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        setPdfProgress(steps[idx].prg);
        setStatusMessage(steps[idx].msg);
        idx++;
      } else {
        clearInterval(interval);
        downloadMockPDF();
        setTimeout(() => setPdfProgress(-1), 1500);
      }
    }, 600);
  };

  const downloadMockPDF = () => {
    // Generate a simple stylized text representation of the brochure
    const content = `
=========================================
PROPVISION AI PROPERTY BROCHURE
=========================================
Property Name: ${property.name}
Property Type: ${property.type.toUpperCase()}
Location: ${property.location}
Listing Price: ${property.price}
Total Built-up Area: ${property.area}
Selected Interior Theme: ${activeInteriorStyle.toUpperCase()}

AMENITIES INCLUDE:
${property.amenities.map(a => `- ${a}`).join('\n')}

ROOM SPECIFICATIONS:
${property.rooms.map(r => `* ${r.name}: ${r.dimensions} (${r.areaSqFt} sq ft)`).join('\n')}

Generated automatically by PropVision AI Engine.
=========================================
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${property.id}_brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerVideoExport = () => {
    setVideoProgress(0);
    setStatusMessage('Setting up camera checkpoints...');

    const steps = [
      { prg: 15, msg: 'Sweeping Living Salon: Capturing 360 view...' },
      { prg: 40, msg: 'Transitioning to Kitchen: Stitching composite nodes...' },
      { prg: 65, msg: 'Capturing Master Suite: Rendering furnishing assets...' },
      { prg: 85, msg: 'Encoding 1080p HD stream and audio tracks...' },
      { prg: 100, msg: 'Walkthrough video exported! Initiating download...' }
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        setVideoProgress(steps[idx].prg);
        setStatusMessage(steps[idx].msg);
        idx++;
      } else {
        clearInterval(interval);
        downloadMockVideo();
        setTimeout(() => setVideoProgress(-1), 1500);
      }
    }, 700);
  };

  const downloadMockVideo = () => {
    // Generate simple dummy binary representation of video
    const dummyContent = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32]); // mp4 identifier
    const blob = new Blob([dummyContent], { type: 'video/mp4' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${property.id}_cinematic_tour.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      
      {/* PDF Exporter Button */}
      <div style={{ flex: '1 0 200px' }}>
        {pdfProgress >= 0 ? (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>PDF Exporting ({pdfProgress}%)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{statusMessage}</div>
            <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${pdfProgress}%`, background: 'var(--color-primary)', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ) : (
          <button
            onClick={triggerPDFExport}
            className="btn btn-outline"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px' }}
          >
            <DownloadIcon size={18} />
            Download PDF Brochure
          </button>
        )}
      </div>

      {/* Video Exporter Button */}
      <div style={{ flex: '1 0 200px' }}>
        {videoProgress >= 0 ? (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Video Rendering ({videoProgress}%)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{statusMessage}</div>
            <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${videoProgress}%`, background: 'var(--color-accent)', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ) : (
          <button
            onClick={triggerVideoExport}
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px' }}
          >
            <VideoIcon size={18} />
            Export HD Video Tour
          </button>
        )}
      </div>

    </div>
  );
};
