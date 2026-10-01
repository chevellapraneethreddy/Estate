import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Lead } from '../../context/AppContext';
import { CRMIcon, PhoneIcon, MailIcon, XIcon, CalendarIcon } from '../../components/Common/Icons';

export const CRM: React.FC = () => {
  const { leads, updateLeadStage, updateLeadNotes, siteVisits } = useApp();

  // Active drawer state
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const activeLead = leads.find((l) => l.id === selectedLeadId);

  // Notes state
  const [noteText, setNoteText] = useState<string>('');

  const stages: { id: Lead['stage']; label: string; color: string }[] = [
    { id: 'new', label: 'New Lead', color: 'var(--text-muted)' },
    { id: 'contacted', label: 'Contacted', color: 'var(--color-info)' },
    { id: 'qualified', label: 'Qualified', color: 'var(--color-accent)' },
    { id: 'visit', label: 'Site Visit', color: 'var(--color-warning)' },
    { id: 'negotiation', label: 'Negotiation', color: 'var(--color-primary)' },
    { id: 'closed', label: 'Closed', color: 'var(--color-success)' }
  ];

  // Drag and drop HTML5 handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetStage: Lead['stage']) => {
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      updateLeadStage(leadId, targetStage);
    }
  };

  const handleSaveNotes = () => {
    if (!selectedLeadId || !activeLead) return;
    updateLeadNotes(selectedLeadId, noteText);
    alert('Notes saved successfully.');
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setNoteText(lead.notes || '');
  };

  // Find site visits for selected lead
  const getLeadVisits = (lead: Lead) => {
    return siteVisits.filter(
      (v) => v.leadPhone === lead.phone || v.leadName === lead.name
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>Builder CRM Pipeline</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage property leads, track AI qualification scores, and schedule walkthroughs. Drag cards to update stages.
          </p>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        paddingBottom: '16px',
        alignItems: 'flex-start',
        flexGrow: 1,
        minHeight: '450px'
      }}>
        {stages.map((stage) => {
          const columnLeads = leads.filter((l) => l.stage === stage.id);
          
          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              style={{
                flex: '1 0 250px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignSelf: 'stretch'
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid', borderBottomColor: stage.color, paddingBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {stage.label}
                </span>
                <span style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)'
                }}>
                  {columnLeads.length}
                </span>
              </div>

              {/* Column Cards Area */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                overflowY: 'auto',
                flexGrow: 1
              }}>
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onClick={() => openLeadDetails(lead)}
                    className="card"
                    style={{
                      padding: '14px',
                      background: 'var(--bg-secondary)',
                      cursor: 'grab',
                      userSelect: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    {/* Title & Classification Tag */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {lead.name}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        background: lead.classification === 'hot' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: lead.classification === 'hot' ? 'var(--color-danger)' : 'var(--color-warning)'
                      }}>
                        {lead.classification}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      💰 {lead.budget}
                    </div>

                    {/* Intent progress meter */}
                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        <span>Buying Intent</span>
                        <span style={{ fontWeight: 'bold' }}>{lead.intentScore}%</span>
                      </div>
                      <div style={{ width: '100%', background: 'var(--bg-tertiary)', height: '4px', borderRadius: 'var(--radius-full)' }}>
                        <div style={{ width: `${lead.intentScore}%`, background: 'var(--color-primary)', height: '100%', borderRadius: 'var(--radius-full)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Details Drawer overlay */}
      {activeLead && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '450px',
          height: '100vh',
          background: 'var(--bg-secondary)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          borderLeft: '1px solid var(--border-color)',
          zIndex: 110,
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto'
        }} className="animate-fade-in">
          
          {/* Drawer Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <CRMIcon size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Lead Profile</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {activeLead.id}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedLeadId(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
            >
              <XIcon size={24} />
            </button>
          </div>

          {/* Quick Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <MailIcon size={16} />
              <span>{activeLead.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <PhoneIcon size={16} />
              <span>{activeLead.phone}</span>
            </div>
          </div>

          {/* AI Scores Panel */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI Qualification breakdown
            </h4>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Buying Intent</span>
                <span style={{ color: 'var(--color-primary)' }}>{activeLead.intentScore}%</span>
              </div>
              <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: `${activeLead.intentScore}%`, background: 'var(--color-primary)', height: '100%', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Readiness Score</span>
                <span style={{ color: 'var(--color-accent)' }}>{activeLead.readinessScore}%</span>
              </div>
              <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: `${activeLead.readinessScore}%`, background: 'var(--color-accent)', height: '100%', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Conversion Probability</span>
                <span style={{ color: 'var(--color-warning)' }}>{activeLead.conversionProbability}%</span>
              </div>
              <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: `${activeLead.conversionProbability}%`, background: 'var(--color-warning)', height: '100%', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>
          </div>

          {/* Lead Spec details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Requirements Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target Budget</span>
                <span style={{ fontWeight: 700 }}>{activeLead.budget}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Timeline</span>
                <span style={{ fontWeight: 700 }}>{activeLead.moveTimeline}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Family Size</span>
                <span style={{ fontWeight: 700 }}>{activeLead.familySize} Members</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Preferred Location</span>
                <span style={{ fontWeight: 700 }}>{activeLead.preferredLocation}</span>
              </div>
            </div>
          </div>

          {/* Site visit details */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px' }}>Scheduled Site Visits</h4>
            {getLeadVisits(activeLead).length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No site visits booked yet.</p>
            ) : (
              getLeadVisits(activeLead).map((v) => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600, gap: '10px' }}>
                  <CalendarIcon size={16} style={{ color: 'var(--color-warning)' }} />
                  <div>
                    <div>{v.propertyName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {v.date} | {v.timeSlot}
                    </div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', textTransform: 'uppercase', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>
                    {v.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Notes logger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Inquiry Notes & Logs</h4>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              placeholder="Record phone discussions or transaction milestones..."
              className="form-input"
              style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical' }}
            />
            <button
              onClick={handleSaveNotes}
              className="btn btn-primary"
              style={{ padding: '8px 16px', alignSelf: 'flex-end', fontSize: '0.8rem' }}
            >
              Save Custom Notes
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
