import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SendIcon } from '../../components/Common/Icons';

export const WhatsAppAutomation: React.FC = () => {
  const {
    leads,
    whatsappSequences,
    toggleSequenceActive,
    updateSequenceTemplate,
    whatsappMessages,
    sendWhatsAppMessage
  } = useApp();

  // Selected lead for phone simulator
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  // Custom message input inside simulator
  const [typedMessage, setTypedMessage] = useState<string>('');
  
  // Edited sequence editing states
  const [editingSeqId, setEditingSeqId] = useState<string | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<string>('');

  const phoneChatEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for active lead
  const filteredMessages = whatsappMessages.filter(
    (msg) => msg.phone === activeLead?.phone
  );

  useEffect(() => {
    // Scroll chat window inside mock phone
    phoneChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages, selectedLeadId]);

  const handleStartEdit = (seqId: string, currentTemplate: string) => {
    setEditingSeqId(seqId);
    setEditedTemplate(currentTemplate);
  };

  const handleSaveSeq = (seqId: string) => {
    updateSequenceTemplate(seqId, editedTemplate);
    setEditingSeqId(null);
  };

  const handleSendSimulatorMsg = () => {
    if (!typedMessage.trim() || !activeLead) return;

    // Send the message from Builder to Buyer
    sendWhatsAppMessage(activeLead.phone, typedMessage, 'sent');
    const userMsg = typedMessage;
    setTypedMessage('');

    // Simulate Buyer reply after 2 seconds
    setTimeout(() => {
      let buyerReply = "";
      const lower = userMsg.toLowerCase();

      if (lower.includes('brochure') || lower.includes('pdf') || lower.includes('download')) {
        buyerReply = "Got the PDF! Reviewing the dimensions and carpet area now. It looks very well planned.";
      } else if (lower.includes('visit') || lower.includes('schedule') || lower.includes('time') || lower.includes('date')) {
        buyerReply = "Yes, Sunday works for me. Please make sure the sales executive is available at the site.";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        buyerReply = `Hello! Thanks for reaching out about the property. Is the payment plan flexible?`;
      } else {
        buyerReply = "Thank you for the update! I will check the details and let you know if I have any questions.";
      }

      sendWhatsAppMessage(activeLead.phone, buyerReply, 'received');
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', gap: '28px', flexDirection: 'column' }} className="whatsapp-row-flex">
      
      {/* Sequence Editor Panel (Left) */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>WhatsApp Flows</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Set up automated WhatsApp templates and campaigns triggered by customer interactions.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {whatsappSequences.map((seq) => (
            <div
              key={seq.id}
              className="card"
              style={{
                padding: '20px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Row 1: Header & Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{seq.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                    ⚡ Trigger: {seq.triggerEvent} | Delay: {seq.delayText}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: seq.isActive ? 'var(--color-success)' : 'var(--text-muted)' }}>
                    {seq.isActive ? 'Flow Active' : 'Flow Paused'}
                  </span>
                  
                  {/* Custom Toggle Switch */}
                  <button
                    onClick={() => toggleSequenceActive(seq.id)}
                    style={{
                      width: '42px',
                      height: '22px',
                      borderRadius: 'var(--radius-full)',
                      background: seq.isActive ? 'var(--color-primary)' : 'var(--border-color)',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: seq.isActive ? '23px' : '3px',
                      transition: 'left var(--transition-fast)'
                    }} />
                  </button>
                </div>
              </div>

              {/* Row 2: Template message */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {editingSeqId === seq.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea
                      value={editedTemplate}
                      onChange={(e) => setEditedTemplate(e.target.value)}
                      rows={3}
                      className="form-input"
                      style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => setEditingSeqId(null)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveSeq(seq.id)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Save Template
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', whiteSpace: 'pre-line' }}>
                      "{seq.messageTemplate}"
                    </p>
                    <button
                      onClick={() => handleStartEdit(seq.id, seq.messageTemplate)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: '8px',
                        padding: 0
                      }}
                    >
                      ✏ Edit Template Code
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smartphone Simulator Mockup (Right) */}
      <div 
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignSelf: 'flex-start',
          flexShrink: 0
        }}
        className="phone-simulator-container"
      >
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Inspect Conversation For:</label>
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="form-select"
            style={{ width: '100%' }}
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.phone})
              </option>
            ))}
          </select>
        </div>

        {activeLead ? (
          /* Styled Smartphone Frame */
          <div style={{
            background: 'var(--bg-primary)',
            border: '12px solid #1e293b', // Thick outer phone border
            borderRadius: '40px',
            height: '560px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg), 0 0 0 3px rgba(255,255,255,0.05)',
            position: 'relative'
          }}>
            {/* Speaker & camera notch */}
            <div style={{
              width: '120px',
              height: '20px',
              background: '#1e293b',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              borderRadius: '0 0 16px 16px',
              zIndex: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ width: '40px', height: '4px', background: '#475569', borderRadius: 'var(--radius-full)' }} />
            </div>

            {/* WhatsApp Header bar */}
            <div style={{
              background: '#075e54', // Classic WhatsApp Teal
              color: '#ffffff',
              padding: '28px 16px 10px 16px', // offset for notch
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {activeLead.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{activeLead.name}</h4>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>online</span>
              </div>
            </div>

            {/* WhatsApp Chat Wall (scrollable) */}
            <div style={{
              flexGrow: 1,
              padding: '12px 14px',
              background: '#ece5dd', // Classic WhatsApp background color
              backgroundImage: 'radial-gradient(#dfdcd6 10%, transparent 11%)',
              backgroundSize: '12px 12px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '400px'
            }}>
              {filteredMessages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: '#6b7280', fontSize: '0.75rem', background: 'rgba(255,255,255,0.8)', padding: '8px 12px', borderRadius: '8px', maxWidth: '80%' }}>
                  No messages exchanged. Use the triggers in the platform workflow or type a message below.
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSentByAgent = msg.type === 'sent'; // Outgoing from Builder viewpoint
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isSentByAgent ? 'flex-end' : 'flex-start',
                        background: isSentByAgent ? '#dcf8c6' : '#ffffff', // Green outbound, White inbound
                        color: '#303030',
                        padding: '8px 12px',
                        borderRadius: isSentByAgent ? '8px 0px 8px 8px' : '0px 8px 8px 8px',
                        maxWidth: '85%',
                        fontSize: '0.8rem',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      {/* Document Attachment view */}
                      {msg.documentName && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(0,0,0,0.05)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          marginBottom: '4px',
                          borderLeft: '3px solid #075e54'
                        }}>
                          <span style={{ fontSize: '1.2rem' }}>
                            {msg.documentType === 'pdf' ? '📄' : '🎥'}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                              {msg.documentName}
                            </span>
                            <span style={{ fontSize: '0.6rem', color: '#6b7280' }}>
                              {msg.documentType === 'pdf' ? 'PDF Brochure' : 'Cinematic Video'}
                            </span>
                          </div>
                        </div>
                      )}

                      <span style={{ lineHeight: '1.3' }}>{msg.text}</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.55rem', color: '#666' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isSentByAgent && (
                          <span style={{ color: '#34b7f1', fontSize: '0.7rem', lineHeight: 1 }}>✓✓</span> // Blue ticks
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={phoneChatEndRef} />
            </div>

            {/* WhatsApp Input bar */}
            <div style={{
              background: '#f0f0f0',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendSimulatorMsg()}
                style={{
                  flexGrow: 1,
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  background: '#ffffff',
                  outline: 'none',
                  color: '#333'
                }}
              />
              <button
                onClick={handleSendSimulatorMsg}
                style={{
                  background: '#075e54',
                  color: '#fff',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <SendIcon size={14} />
              </button>
            </div>

          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
            No leads currently active to simulate.
          </div>
        )}
      </div>

    </div>
  );
};
