import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tour3DViewer } from '../../components/Tour/Tour3DViewer';
import { PropertyAssistant } from '../../components/AIAssistant/PropertyAssistant';
import { SiteVisitScheduler } from '../../components/Tour/SiteVisitScheduler';
import { LeadCaptureForm } from '../../components/Dashboard/LeadCaptureForm';
import { MediaExporter } from '../../components/Dashboard/MediaExporter';
import '../../styles/landing.css';

export const PropertyLanding: React.FC = () => {
  const { properties, activePropertyId, setCurrentView, setViewingPropertyId } = useApp();
  const property = properties.find((p) => p.id === activePropertyId) || properties[0];

  const [notification, setNotification] = useState<string | null>(null);

  const handleLeadQualified = (lead: any) => {
    // Show a floating visual toast notification indicating that the background lead engine has qualified them
    setNotification(`AI Engine qualified ${lead.name} as a ${lead.classification.toUpperCase()} Lead (${lead.conversionProbability}% conversion chance) and dispatched to CRM!`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleLogoClick = () => {
    setViewingPropertyId(null);
    setCurrentView('landing');
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* Floating Notification */}
      {notification && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            top: '85px',
            right: '20px',
            zIndex: 150,
            maxWidth: '380px',
            background: 'var(--color-primary-light)',
            border: '2px solid var(--color-primary)',
            color: 'var(--color-primary)',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.85rem',
            fontWeight: 700
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.4rem' }}>🔥</span>
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="prop-hero-header animate-fade-in">
        <div>
          <span 
            onClick={handleLogoClick}
            style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginBottom: '8px', display: 'block' }}
          >
            ← Back to PropVision AI Portal
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>
            {property.name}
          </h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>🏢 {property.type.toUpperCase()}</span>
            <span>📍 {property.location}</span>
            <span>📐 {property.area}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>LISTING PRICE</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {property.price}
          </span>
        </div>
      </section>

      {/* Main Grid: 3D Tour (Left) + AI Assistant (Right) */}
      <section className="prop-grid-body animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 3D Walkthrough Viewport */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-xl)' }}>
            <Tour3DViewer />
          </div>

          {/* Description & specs */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Project Overview</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              {property.description}
            </p>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px' }}>Premium Facilities Included:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {property.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* PDF Brochure / MP4 Video Exporter */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>Brochure & Cinematic Export</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '16px' }}>
              Generate custom vector blueprints PDF or rendering videos instantly.
            </p>
            <MediaExporter propertyId={property.id} />
          </div>

          {/* Inquiry Form (Lead capture & scoring) */}
          <LeadCaptureForm 
            propertyName={property.name} 
            propertyType={property.type} 
            onSuccess={handleLeadQualified}
          />
        </div>

        {/* AI assistant sidebar & Visit Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* AI property assistant chat pane */}
          <div style={{ height: '520px' }}>
            <PropertyAssistant onQualificationChange={handleLeadQualified} />
          </div>

          {/* Site Visit booking scheduler */}
          <SiteVisitScheduler propertyName={property.name} />

        </div>
      </section>

    </div>
  );
};
