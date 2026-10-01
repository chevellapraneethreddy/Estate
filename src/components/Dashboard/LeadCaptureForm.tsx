import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Lead } from '../../context/AppContext';
import { CheckIcon } from '../Common/Icons';

interface LeadCaptureFormProps {
  propertyName: string;
  propertyType: string;
  onSuccess?: (lead: Lead) => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ propertyName, propertyType, onSuccess }) => {
  const { addLead, whatsappSequences, sendWhatsAppMessage } = useApp();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [budget, setBudget] = useState<string>('$500,000 - $750,000');
  const [timeline, setTimeline] = useState<string>('Within 3 Months');
  const [familySize, setFamilySize] = useState<number>(3);
  const [location, setLocation] = useState<string>('Marina District');

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoredLead, setScoredLead] = useState<Lead | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    // AI Lead Scoring System
    let intentScore = 50; // Base
    let readinessScore = 40;

    // Budget weighting
    if (budget.includes('1.2M') || budget.includes('750k')) {
      intentScore += 20;
    } else {
      intentScore += 10;
    }

    // Timeline weighting
    if (timeline === 'Immediate') {
      readinessScore += 50;
      intentScore += 20;
    } else if (timeline === 'Within 3 Months') {
      readinessScore += 35;
      intentScore += 10;
    } else if (timeline === 'Within 6 Months') {
      readinessScore += 20;
    } else {
      readinessScore += 5;
    }

    // Family size fits property type check
    if (propertyType === 'villa' && familySize >= 3) {
      intentScore += 10;
    } else if (propertyType === 'apartment' && familySize <= 3) {
      intentScore += 10;
    }

    const conversionProbability = Math.round((intentScore + readinessScore) / 2);
    
    let classification: Lead['classification'] = 'cold';
    if (conversionProbability >= 75) {
      classification = 'hot';
    } else if (conversionProbability >= 45) {
      classification = 'warm';
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone,
      budget,
      preferredType: propertyType.charAt(0).toUpperCase() + propertyType.slice(1),
      moveTimeline: timeline,
      familySize,
      preferredLocation: location,
      intentScore: Math.min(intentScore, 100),
      readinessScore: Math.min(readinessScore, 100),
      conversionProbability: Math.min(conversionProbability, 100),
      classification,
      stage: 'new',
      notes: `Qualified automatically via Landing Page inquiry form. Initial classification: ${classification.toUpperCase()}.`,
      createdAt: new Date().toISOString()
    };

    addLead(newLead);
    setScoredLead(newLead);
    setSubmitted(true);

    // Simulate WhatsApp automation sequence trigger (Brochure Sequence)
    const activeSequence = whatsappSequences.find(s => s.id === 'seq-1');
    if (activeSequence && activeSequence.isActive) {
      setTimeout(() => {
        sendWhatsAppMessage(
          phone,
          `Hi ${name}! Thanks for checking out ${propertyName}. We have generated a personalized 3D tour brochure for you. Click here to download: https://propvision.ai/brochures/${newLead.id}.pdf`,
          'sent',
          `${propertyName}_brochure.pdf`,
          'pdf'
        );
      }, 1000);
    }

    if (onSuccess) {
      onSuccess(newLead);
    }
  };

  return (
    <div className="card" style={{ padding: '28px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
      {submitted && scoredLead ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div style={{
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <CheckIcon size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Inquiry Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Our AI Lead Qualification engine has scored your profile.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>BUYING INTENT</span>
                <span style={{ color: 'var(--color-primary)' }}>{scoredLead.intentScore}%</span>
              </div>
              <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${scoredLead.intentScore}%`, background: 'var(--color-primary)', height: '100%', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>READINESS SCORE</span>
                <span style={{ color: 'var(--color-accent)' }}>{scoredLead.readinessScore}%</span>
              </div>
              <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${scoredLead.readinessScore}%`, background: 'var(--color-accent)', height: '100%', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CLASSIFICATION</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: scoredLead.classification === 'hot' ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                  🔥 {scoredLead.classification} Lead
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CONVERSION PROBABILITY</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {scoredLead.conversionProbability}%
                </div>
              </div>
            </div>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
            A personalized PDF brochure and floor plan have been sent to your WhatsApp number. Check your messages!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '4px' }}>Request Property Details</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Fill in your criteria to get pricing and receive the official digital brochure.
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: '4px' }}>
            <label className="form-label">Full Name *</label>
            <input 
              type="text" 
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: '4px' }}>
              <label className="form-label">Email *</label>
              <input 
                type="email" 
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: '4px' }}>
              <label className="form-label">Phone *</label>
              <input 
                type="tel" 
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: '4px' }}>
              <label className="form-label">Target Budget</label>
              <select 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                className="form-select"
                style={{ padding: '8px 10px', fontSize: '0.85rem' }}
              >
                <option value="$300,000 - $500,000">$300k - $500k</option>
                <option value="$500,000 - $750,000">$500k - $750k</option>
                <option value="$750,000 - $1,200,000">$750k - $1.2M</option>
                <option value="$1,200,000 - $2,000,000">$1.2M - $2.0M</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: '4px' }}>
              <label className="form-label">Move-in Timeline</label>
              <select 
                value={timeline} 
                onChange={(e) => setTimeline(e.target.value)}
                className="form-select"
                style={{ padding: '8px 10px', fontSize: '0.85rem' }}
              >
                <option value="Immediate">Immediate</option>
                <option value="Within 3 Months">Within 3 Months</option>
                <option value="Within 6 Months">Within 6 Months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: '4px' }}>
              <label className="form-label">Residing Family Size</label>
              <input 
                type="number"
                value={familySize}
                onChange={(e) => setFamilySize(Number(e.target.value))}
                className="form-input"
                min={1}
                max={10}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: '4px' }}>
              <label className="form-label">Location Preference</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
                placeholder="e.g. Marina District"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              padding: '10px',
              fontSize: '0.9rem',
              width: '100%',
              marginTop: '6px'
            }}
          >
            Submit Inquiry & Qualify
          </button>
        </form>
      )}
    </div>
  );
};
