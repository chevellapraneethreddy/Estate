import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Hotspot, FurnitureItem } from '../../data/properties';
import { ChevronRightIcon } from '../Common/Icons';
import '../../styles/tour.css';

interface Tour3DViewerProps {
  onHotspotClick?: (hs: Hotspot, roomName: string) => void;
  isPublic?: boolean;
}

export const Tour3DViewer: React.FC<Tour3DViewerProps> = ({ onHotspotClick }) => {
  const {
    properties,
    activePropertyId,
    activeInteriorStyle,
    activePreviewMode,
    activeTimeMode,
    setActiveTimeMode,
    setActivePreviewMode,
    setActiveInteriorStyle
  } = useApp();

  const property = properties.find((p) => p.id === activePropertyId) || properties[0];
  const [activeRoomId, setActiveRoomId] = useState<string>(property.rooms[0]?.id || 'living');
  const activeRoom = property.rooms.find((r) => r.id === activeRoomId) || property.rooms[0];

  // Walkthrough states
  const [isFirstPerson, setIsFirstPerson] = useState<boolean>(true);
  
  // Drag rotation angles
  const [rotX, setRotX] = useState<number>(isFirstPerson ? 0 : 60);
  const [rotY, setRotY] = useState<number>(isFirstPerson ? 0 : -30);
  const [zoom, setZoom] = useState<number>(isFirstPerson ? 0 : -100);

  // Drag handlers
  const isDragging = useRef<boolean>(false);
  const startMouseX = useRef<number>(0);
  const startMouseY = useRef<number>(0);
  const startRotX = useRef<number>(0);
  const startRotY = useRef<number>(0);

  // Keyboard navigation instructions alert state
  const [showWalktip, setShowWalktip] = useState<boolean>(true);

  // Set rotation back when switching view mode
  useEffect(() => {
    if (isFirstPerson) {
      setRotX(0);
      setRotY(0);
      setZoom(0);
    } else {
      setRotX(60);
      setRotY(-30);
      setZoom(-150);
    }
  }, [isFirstPerson]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFirstPerson) return;
      
      const key = e.key.toLowerCase();
      // Rotation left/right
      if (key === 'arrowleft' || key === 'a') {
        setRotY(prev => prev + 10);
      }
      if (key === 'arrowright' || key === 'd') {
        setRotY(prev => prev - 10);
      }
      // Rotation up/down
      if (key === 'arrowup' || key === 'w') {
        setRotX(prev => Math.min(Math.max(prev - 5, -25), 25));
        // Simulate walking bobbing animation
        simulateBob();
      }
      if (key === 'arrowdown' || key === 's') {
        setRotX(prev => Math.min(Math.max(prev + 5, -25), 25));
        simulateBob();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirstPerson]);

  const [bobbing, setBobbing] = useState<boolean>(false);
  const simulateBob = () => {
    setBobbing(true);
    setTimeout(() => setBobbing(false), 200);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startMouseX.current = e.clientX;
    startMouseY.current = e.clientY;
    startRotX.current = rotX;
    startRotY.current = rotY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startMouseX.current;
    const deltaY = e.clientY - startMouseY.current;

    if (isFirstPerson) {
      // First person: Dragging moves the camera rotation directly
      setRotY(startRotY.current - deltaX * 0.4);
      setRotX(Math.min(Math.max(startRotX.current + deltaY * 0.4, -30), 30));
    } else {
      // Orbit view: Orbiting around the model
      setRotY(startRotY.current + deltaX * 0.4);
      setRotX(Math.min(Math.max(startRotX.current - deltaY * 0.4, 20), 85));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => prev + (direction === 'in' ? 25 : -25));
  };

  // Quick Room Jump
  const handleRoomJump = (roomId: string) => {
    simulateBob();
    setActiveRoomId(roomId);
  };

  // Get adjacent rooms to show floor navigation markers
  const getAdjacentRooms = () => {
    return property.rooms.filter((r) => r.id !== activeRoomId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      
      {/* 3D Toolbar settings */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Style selection pill list */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['modern', 'luxury', 'minimalist', 'scandinavian', 'contemporary', 'indian'].map((style) => (
            <button
              key={style}
              onClick={() => setActiveInteriorStyle(style)}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: activeInteriorStyle === style ? 'var(--color-primary)' : 'var(--border-color)',
                background: activeInteriorStyle === style ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                color: activeInteriorStyle === style ? 'var(--color-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)'
              }}
            >
              {style === 'indian' ? 'Traditional Indian' : style}
            </button>
          ))}
        </div>

        {/* Action presets */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={activePreviewMode}
            onChange={(e) => setActivePreviewMode(e.target.value as any)}
            className="form-select"
            style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}
          >
            <option value="furnished">Furnished Version</option>
            <option value="empty">Empty Layout</option>
          </select>

          <select
            value={activeTimeMode}
            onChange={(e) => setActiveTimeMode(e.target.value as any)}
            className="form-select"
            style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}
          >
            <option value="day">Day Mode</option>
            <option value="night">Night Mode</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }} className="upload-row-flex">
        
        {/* Main 3D Canvas Viewport */}
        <div style={{ flexGrow: 1, position: 'relative' }}>
          
          <div 
            className="tour-viewport"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Night multiply layer */}
            <div className={`night-overlay ${activeTimeMode === 'night' ? 'active' : ''}`} />

            {/* 3D room container */}
            <div 
              className="room-3d-container"
              style={{
                transform: `translateZ(${zoom + (isFirstPerson ? 120 : 0)}px) rotateX(${rotX}deg) rotateY(${rotY}deg) ${bobbing ? 'translateY(-2px)' : ''}`,
                transformOrigin: '50% 50% 0px'
              }}
            >
              {/* Floor Plane */}
              <div className={`plane-3d plane-floor floor-${activeInteriorStyle}`} />

              {/* Ceiling Plane (only if in First Person Mode to prevent blocking Orbit Mode bird's eye view) */}
              {isFirstPerson && (
                <div 
                  className="plane-3d plane-ceiling"
                  style={{
                    backgroundColor: activeTimeMode === 'night' ? '#0b0f19' : '#334155'
                  }}
                />
              )}

              {/* Back Wall Plane */}
              <div className={`plane-3d plane-back wall-${activeInteriorStyle}`}>
                <div style={{ padding: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {activeRoom.name}
                </div>
              </div>

              {/* Left Wall Plane */}
              <div className={`plane-3d plane-left wall-${activeInteriorStyle}`} />

              {/* Right Wall Plane */}
              <div className={`plane-3d plane-right wall-${activeInteriorStyle}`} />

              {/* 3D Furniture objects (Only if Furnished is active) */}
              {activePreviewMode === 'furnished' && activeRoom.furniture[activeInteriorStyle]?.map((furniture: FurnitureItem) => {
                // Map layout percentages to 3D room units
                const leftPos = (furniture.x - 50) * 4.8; // scaling from center
                const depthPos = (furniture.y - 50) * 4.8;

                return (
                  <div
                    key={furniture.id}
                    className={`furniture-3d furniture-style-${activeInteriorStyle}`}
                    style={{
                      left: `calc(50% + ${leftPos}px)`,
                      top: `calc(50% + ${depthPos}px)`,
                      width: `${furniture.w * 3}px`,
                      height: `${furniture.h * 3}px`,
                      transform: `translateZ(${-10}px) rotateZ(0deg)`,
                      position: 'absolute'
                    }}
                  >
                    <span>{furniture.name}</span>
                    <span style={{ fontSize: '0.5rem', opacity: 0.7 }}>
                      ({furniture.type})
                    </span>
                  </div>
                );
              })}

              {/* 3D Hotspots */}
              {activeRoom.hotspots.map((hs: Hotspot) => {
                const hsLeft = (hs.x - 50) * 4.8;
                const hsDepth = (hs.y - 50) * 4.8;

                return (
                  <div
                    key={hs.id}
                    className="hotspot-3d"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onHotspotClick) onHotspotClick(hs, activeRoom.name);
                    }}
                    style={{
                      left: `calc(50% + ${hsLeft}px)`,
                      top: `calc(50% + ${hsDepth}px)`,
                      transform: `translateZ(20px)`,
                      '--hotspot-rot': `${-rotY}deg`
                    } as any}
                    title="Click for Specifications"
                  />
                );
              })}

              {/* 3D Floor navigation markers (Adjacent Rooms) */}
              {isFirstPerson && getAdjacentRooms().map((room, idx) => {
                // Distribute adjacent rooms around the edges
                const angle = (idx * (360 / Math.max(getAdjacentRooms().length, 1)) * Math.PI) / 180;
                const dist = 160; // offset distance
                const posX = Math.sin(angle) * dist;
                const posY = Math.cos(angle) * dist;

                return (
                  <div
                    key={room.id}
                    className="move-hotspot"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomJump(room.id);
                    }}
                    style={{
                      left: `calc(50% + ${posX}px)`,
                      top: `calc(50% + ${posY}px)`,
                      transform: `rotateX(90deg) translateZ(0)`
                    }}
                    title={`Walk to ${room.name}`}
                  >
                    <div className="move-hotspot-inner" />
                  </div>
                );
              })}

            </div>

            {/* Viewport UI Controls Layer */}
            <div className="viewport-overlay-left">
              <span className="glass-panel" style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff',
                textTransform: 'uppercase',
                background: 'rgba(15,23,42,0.8)'
              }}>
                {isFirstPerson ? 'First Person Walk' : 'Model Orbit View'}
              </span>
            </div>

            <div className="viewport-overlay-controls">
              <button 
                onClick={() => setIsFirstPerson(prev => !prev)}
                className="overlay-btn"
                title="Toggle Walkthrough Mode"
              >
                {isFirstPerson ? 'Orbit View' : 'Walk View'}
              </button>
              <button 
                onClick={() => handleZoom('in')}
                className="overlay-btn"
                title="Zoom In"
              >
                +
              </button>
              <button 
                onClick={() => handleZoom('out')}
                className="overlay-btn"
                title="Zoom Out"
              >
                -
              </button>
            </div>

            {/* Walkthrough hints */}
            {isFirstPerson && showWalktip && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.9)',
                  fontSize: '0.8rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid var(--color-primary)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 25
                }}
              >
                <span>Navigate room: Drag mouse to pan 360° or use <b>WASD / Arrow Keys</b>. Click floor markers to walk.</span>
                <button 
                  onClick={() => setShowWalktip(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Got it
                </button>
              </div>
            )}

            {/* Active view label overlay */}
            <div className="nav-indicators">
              <span style={{ color: 'var(--color-primary)' }}>●</span>
              <span>{activeRoom.name} ({activeRoom.dimensions})</span>
            </div>

          </div>

        </div>

        {/* Room Navigation Sidebar */}
        <div 
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignSelf: 'stretch',
            flexShrink: 0
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Walkthrough Index
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {property.rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomJump(room.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: activeRoomId === room.id ? 'var(--color-primary)' : 'var(--border-color)',
                  background: activeRoomId === room.id ? 'var(--color-primary-light)' : 'transparent',
                  color: activeRoomId === room.id ? 'var(--color-primary)' : 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeRoomId === room.id ? 700 : 500,
                  fontSize: '0.85rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{room.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{room.dimensions}</span>
                  <ChevronRightIcon size={14} />
                </div>
              </button>
            ))}
          </div>

          <div style={{
            marginTop: 'auto',
            padding: '10px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>AI Interactive Tour</p>
            <p>Select any room to walk in. Click glowing pins to inspect layout features.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
