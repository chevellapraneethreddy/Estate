import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Tour3DViewer } from '../../components/Tour/Tour3DViewer';
import { ChevronRightIcon } from '../../components/Common/Icons';
import blueprintImg from '../../assets/propvision_2d_blueprint.png';
import render3dImg from '../../assets/propvision_3d_render.png';
import { motion } from 'framer-motion';
import '../../styles/landing.css';

// 1. Framer Motion Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  }
};

const staggerContainer = {
  hidden: {},
  visible: { 
    transition: { staggerChildren: 0.1 } 
  }
};

// 2. Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ value, suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const end = value;
    const range = end - start;
    let current = start;
    const increment = end > start ? Math.ceil(range / (duration / 16)) : -1;
    const stepTime = 16; // ~60fps
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration, hasStarted]);

  return (
    <motion.span 
      onViewportEnter={() => setHasStarted(true)}
      viewport={{ once: true, margin: "-50px" }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

// 3. Hero Interactive Showcase Card (Static Connected Product Workflow Card)
export const HeroShowcase: React.FC = () => {
  const steps = [
    {
      num: 'STEP 1',
      title: 'Floor Plan Upload',
      desc: 'PDF, PNG, or JPG drafts',
      icon: '📄',
      bgIcon: 'var(--color-accent-light)',
      colorIcon: 'var(--color-accent)',
      style: { left: '4%', top: '8%' }
    },
    {
      num: 'STEP 2',
      title: 'AI Analysis',
      desc: 'Room & wall detection',
      icon: '🧠',
      bgIcon: 'rgba(139, 92, 246, 0.08)',
      colorIcon: '#8b5cf6',
      style: { left: '35%', top: '41%' }
    },
    {
      num: 'STEP 3',
      title: '3D Model Generated',
      desc: 'Extruded structure',
      icon: '🏠',
      bgIcon: 'var(--color-primary-light)',
      colorIcon: 'var(--color-primary)',
      style: { right: '4%', top: '8%' }
    },
    {
      num: 'STEP 4',
      title: 'Furniture Added',
      desc: 'Smart layout placement',
      icon: '🛋️',
      bgIcon: 'rgba(245, 158, 11, 0.08)',
      colorIcon: '#f59e0b',
      style: { left: '52%', bottom: '10%' }
    },
    {
      num: 'STEP 5',
      title: 'Virtual Tour Ready',
      desc: 'Interactive walkthrough',
      icon: '👁️',
      bgIcon: 'rgba(236, 72, 153, 0.08)',
      colorIcon: '#ec4899',
      style: { left: '4%', bottom: '10%' }
    }
  ];

  return (
    <div className="workflow-map-container">
      {/* Curved SVG Connections */}
      <svg className="workflow-svg-overlay" viewBox="0 0 600 460" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad-1-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="grad-2-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
          <linearGradient id="grad-3-4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="grad-4-5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          
          <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8b5cf6" />
          </marker>
          <marker id="arrow-primary" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--color-primary)" />
          </marker>
          <marker id="arrow-warning" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
          </marker>
          <marker id="arrow-pink" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ec4899" />
          </marker>
        </defs>

        {/* Connection 1 to 2 */}
        <path 
          d="M 214 74 C 280 74, 140 226, 210 226" 
          stroke="url(#grad-1-2)" 
          strokeWidth="2.5" 
          strokeDasharray="5 5" 
          markerEnd="url(#arrow-purple)"
        />
        {/* Connection 2 to 3 */}
        <path 
          d="M 400 226 C 470 226, 320 74, 386 74" 
          stroke="url(#grad-2-3)" 
          strokeWidth="2.5" 
          strokeDasharray="5 5" 
          markerEnd="url(#arrow-primary)"
        />
        {/* Connection 3 to 4 */}
        <path 
          d="M 481 111 C 481 200, 407 240, 407 340" 
          stroke="url(#grad-3-4)" 
          strokeWidth="2.5" 
          strokeDasharray="5 5" 
          markerEnd="url(#arrow-warning)"
        />
        {/* Connection 4 to 5 */}
        <path 
          d="M 312 377 C 280 405, 246 405, 214 377" 
          stroke="url(#grad-4-5)" 
          strokeWidth="2.5" 
          strokeDasharray="5 5" 
          markerEnd="url(#arrow-pink)"
        />
      </svg>

      {/* Floating step cards */}
      {steps.map((s, idx) => (
        <motion.div
          key={idx}
          className="workflow-card-float"
          style={s.style}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
        >
          <div className="workflow-card-icon-wrapper" style={{ background: s.bgIcon, color: s.colorIcon }}>
            {s.icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{s.num}</span>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>{s.title}</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.2 }}>{s.desc}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsLoggedIn, setUserRole, setViewingPropertyId } = useApp();
  
  // Before/After comparison slider drag states
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0-100)
  const isDraggingSlider = useRef<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // FAQ active index
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const startDemo = () => {
    setUserRole('builder');
    setIsLoggedIn(true);
    setViewingPropertyId(null);
    setCurrentView('dashboard');
  };

  // Drag handlers for the comparison slider
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(pct);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSlider.current = true;
    handleSliderMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      isDraggingSlider.current = true;
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider.current) return;
      handleSliderMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingSlider.current || !e.touches[0]) return;
      handleSliderMove(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
      isDraggingSlider.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const faqs = [
    {
      q: "How does the Floor Plan to 3D converter work?",
      a: "PropVision AI uses specialized computer vision models to detect lines representing walls, openings for doors and windows, and space dividers on uploaded drawings. It automatically calculates vectors to extrude 3D heights and outputs a virtual tour structure within minutes."
    },
    {
      q: "Can my prospective property buyers view this on mobile screens?",
      a: "Yes. All shareable walkthrough links are mobile-responsive. Buyers can use tap-to-move hotspots or touch joysticks to navigate through rooms, toggle furniture, and chat with the AI assistant on any iOS or Android browser."
    },
    {
      q: "What is the AI Property Assistant trained on?",
      a: "The assistant reads your uploaded project specifications directly, including room carpet area, pricing sheets, society amenities, and local landmarks, to answer customer queries accurately and qualify leads automatically."
    },
    {
      q: "Does PropVision AI integrate with existing CRM systems?",
      a: "Absolutely. Along with our built-in Kanban dashboard, PropVision AI supports Webhook payloads to push qualified buyer profiles, site visit bookings, and custom conversation transcripts directly to systems like Salesforce, HubSpot, or Zoho."
    }
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background abstract gradient blobs for AI Startup aesthetic */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(6,182,212,0.02) 50%, rgba(0,0,0,0) 100%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '45%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, rgba(16,185,129,0.02) 50%, rgba(0,0,0,0) 100%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* 1. Hero Section */}
      <section className="hero-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left Side Content */}
        <motion.div 
          className="hero-left"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Unicorn tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-primary-light)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: 'var(--color-primary)',
            fontWeight: 800,
            alignSelf: 'flex-start',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
            marginBottom: '-10px'
          }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%' }} />
            Next-Gen Floor Plan to 3D AI
          </div>

          <h1 className="text-gradient" style={{ textAlign: 'left', fontSize: '3.6rem', lineHeight: '1.05', letterSpacing: '-2.5px', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
            Upload a Floor Plan.<br />
            Get a 3D Property Tour.
          </h1>
          <p style={{ textAlign: 'left', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Transform 2D floor plans into interactive 3D walkthroughs, furnished interiors, marketing brochures, and shareable property experiences in minutes.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}>
            <motion.button 
              onClick={startDemo} 
              className="btn btn-primary" 
              style={{ padding: '14px 28px', fontSize: '0.95rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Trial
              <ChevronRightIcon size={16} />
            </motion.button>
            
            <motion.a 
              href="#action-demo" 
              className="btn btn-secondary" 
              style={{ padding: '14px 28px', fontSize: '0.95rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Live Demo
            </motion.a>
          </div>

          {/* Trust indicators glass list */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            {['⚡ 95% Faster Modeling', '🏠 Extruded in Minutes', '🛠️ Built for Developers'].map((tag, i) => (
              <div 
                key={i} 
                className="glass-panel" 
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '10px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side Showcase (Live animated pipeline) */}
        <motion.div 
          className="hero-right"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
        >
          <HeroShowcase />
        </motion.div>
      </section>

      {/* 2. Before/After Interactive Comparison Section */}
      <section id="action-demo" style={{ padding: '100px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="compare-container" style={{ maxWidth: '1100px' }}>
          
          <motion.div 
            style={{ textAlign: 'center', marginBottom: '40px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>
              TRANSFORMATION VIEWPORT
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>See PropVision AI in Action</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px', maxWidth: '620px', margin: '6px auto 0 auto' }}>
              Drag the center slider handles to compare the original 2D floor blueprint layout with the generated 3D visual workspace.
            </p>
          </motion.div>

          <motion.div 
            ref={sliderContainerRef}
            className="compare-slider-wrapper"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            {/* Left Side Panel (Underneath): Clean Architectural 2D Floor Plan */}
            <div className="compare-panel-left">
              <img 
                src={blueprintImg} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  pointerEvents: 'none'
                }} 
                alt="2D Floor Plan" 
              />
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '10px 18px',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 5,
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.1rem' }}>📐</span> 2D Blueprint Layout
              </div>
            </div>

            {/* Right Side Panel (On Top, clipped): Aligned 3D Photorealistic Interior Render */}
            <div 
              className="compare-panel-right"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                transition: isDraggingSlider.current ? 'none' : 'clip-path 0.1s ease-out'
              }}
            >
              <img 
                src={render3dImg} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  pointerEvents: 'none'
                }} 
                alt="AI Generated Furnished 3D Home" 
              />
              <div style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                background: 'rgba(16, 185, 129, 0.9)',
                padding: '10px 18px',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'var(--shadow-glow)',
                zIndex: 5,
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.1rem' }}>✨</span> AI Furnished 3D Home
              </div>
            </div>

            {/* Draggable Slider Bar Handle */}
            <div 
              className="compare-handle"
              style={{ 
                left: `${sliderPosition}%`,
                pointerEvents: 'none'
              }}
            >
              <div className="compare-handle-button">↔</div>
            </div>

          </motion.div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
            * Drag the divider to inspect structural wall lines, doors, and furniture placement.
          </p>
        </div>
      </section>

      {/* 3. Feature Highlights Section */}
      <section id="features" className="features-container" style={{ padding: '100px 24px' }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '50px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>
            PRODUCT CAPABILITIES
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Fully Automated. Built for Scale.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px', maxWidth: '520px', margin: '6px auto 0 auto' }}>
            Everything you need to convert design sketches into high-converting sales tools.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            { icon: '📐', title: '1. Floor Plan to 3D', desc: 'Upload PDF, PNG, or JPG blueprints. Our scanning network vectorizes boundaries and wall lines instantly.' },
            { icon: '🛋️', title: '2. AI Auto Furnishing', desc: 'Automatically furnish room elements. Instantly populate beds, couches, cabinets, and fixtures aligned to room specs.' },
            { icon: '🎥', title: '3. Cinematic Walkthroughs', desc: 'Generate marketing-ready property videos with smooth sweeps, layout showcase, and high-definition MP4 downloads.' },
            { icon: '🔗', title: '4. Share Anywhere', desc: 'Generate share links with one click. Prospects load interactive 3D tours instantly in any mobile or desktop browser.' }
          ].map((feat, idx) => (
            <motion.div 
              key={idx} 
              className="feature-premium-card"
              style={{ 
                padding: '36px 28px', 
                borderRadius: 'var(--radius-xl)', 
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
              }}
              variants={fadeUp}
              whileHover={{ 
                y: -8, 
                borderColor: 'var(--color-primary)', 
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.08), var(--shadow-glow)'
              }}
            >
              {/* Subtle hover gradient border overlay */}
              <div className="hover-glow-border" />
              
              <motion.span 
                style={{ fontSize: '2.5rem', display: 'block' }}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                {feat.icon}
              </motion.span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Social Proof Statistics Section */}
      <section style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="stats-row" style={{ maxWidth: '1000px', padding: '60px 24px' }}>
          {[
            { val: 500, suffix: '+', desc: 'Properties Generated' },
            { val: 95, suffix: '%', desc: 'Faster Modeling Workflow' },
            { val: 90, suffix: '%', desc: 'Cost Reduction' },
            { val: 10000, suffix: '+', desc: 'Virtual Walkthroughs Hosted' }
          ].map((stat, idx) => (
            <div key={idx} className="stats-card" style={{ background: 'transparent', border: 'none', padding: '10px 0' }}>
              <div className="stats-num" style={{ fontSize: '3.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                <AnimatedCounter value={stat.val} suffix={stat.suffix} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', display: 'block' }}>
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Product Reveal Viewport (3D Depth container) */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          <motion.div 
            style={{ marginBottom: '40px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>
              INTERACTIVE REVEAL
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Test the Interactive Walkthrough</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: '6px auto 0 auto' }}>
              Switch interior styles, walk into rooms, and click hotspots. Experience what your property buyers see on share links.
            </p>
          </motion.div>

          {/* 3D Depth container that straightens out on hover */}
          <motion.div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              perspective: 1200,
              transformStyle: 'preserve-3d',
              position: 'relative'
            }}
            initial={{ 
              rotateX: 4,
              rotateY: -2,
              scale: 0.99,
              boxShadow: '0px 8px 30px rgba(0,0,0,0.03), 0px 0px 20px rgba(14,165,233,0.02)'
            }}
            whileHover={{ 
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              boxShadow: '0px 16px 40px rgba(0,0,0,0.06), 0px 0px 30px rgba(16,185,129,0.04)'
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {/* Ambient decorative glow dots */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: '#06b6d4', borderRadius: '50%', boxShadow: '0 0 8px #06b6d4' }} />

            <Tour3DViewer />
          </motion.div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" style={{ padding: '100px 24px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div 
            style={{ textAlign: 'center', marginBottom: '50px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>
              PRICING PLANS
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Flexible Plans for Any Scale</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px', maxWidth: '520px', margin: '6px auto 0 auto' }}>
              Simple transparent pricing built for individual realtors and large property developers.
            </p>
          </motion.div>

          {/* Pricing cards grid */}
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              {
                name: 'Starter Plan',
                price: '$0',
                period: 'forever',
                desc: 'Perfect for individual agents testing interactive 3D property tours.',
                features: [
                  '3 Generated 3D Tours / month',
                  'First-Person Walkthrough mode',
                  'Auto AI Furnishing (Modern Style)',
                  'Basic lead capture inbox'
                ],
                btnText: 'Start Free Trial',
                highlight: false
              },
              {
                name: 'Pro Growth Plan',
                price: '$149',
                period: 'per month',
                desc: 'For builders and agencies looking to accelerate sales cycles.',
                features: [
                  'Unlimited generated properties',
                  'All 6 Interior Styling Themes',
                  'Smart AI Assistant integrations',
                  'PDF Brochure & MP4 Walkthrough downloads',
                  'Automated CRM & WhatsApp sequences'
                ],
                btnText: 'Upgrade to Pro',
                highlight: true
              },
              {
                name: 'Enterprise Plan',
                price: 'Custom',
                period: 'bespoke billing',
                desc: 'For high-volume developers requiring bespoke integrations and APIs.',
                features: [
                  'Custom CAD neural network training',
                  'Multi-agent WhatsApp simulators',
                  'Dedicated account success manager',
                  'API & developer webhook access',
                  'Bespoke visual asset packages'
                ],
                btnText: 'Contact Sales',
                highlight: false
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                style={{
                  padding: '40px 32px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-secondary)',
                  border: plan.highlight ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: plan.highlight ? '0 10px 30px rgba(16, 185, 129, 0.05), var(--shadow-glow)' : 'var(--shadow-md)'
                }}
                variants={fadeUp}
                whileHover={{ 
                  y: -6, 
                  borderColor: plan.highlight ? 'var(--color-primary)' : 'var(--border-color-hover)', 
                  boxShadow: plan.highlight 
                    ? '0 20px 40px rgba(0, 0, 0, 0.06), var(--shadow-glow)'
                    : '0 20px 40px rgba(0, 0, 0, 0.04)'
                }}
              >
                {plan.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    letterSpacing: '0.5px'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{plan.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', minHeight: '40px' }}>{plan.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ {plan.period}</span>
                </div>

                <button 
                  onClick={startDemo}
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', boxShadow: plan.highlight ? 'var(--shadow-glow)' : 'none' }}
                >
                  {plan.btnText}
                </button>

                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: plan.highlight ? 'var(--color-primary)' : 'var(--color-accent)', fontWeight: 'bold' }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. FAQs Accordion */}
      <section id="faq" style={{ padding: '100px 24px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Got questions about PropVision AI capabilities? We have answers.
          </p>
        </div>

        <div className="faq-accordion" style={{ maxWidth: '840px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="faq-item" 
                style={{ 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  marginBottom: '10px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="faq-question"
                  style={{
                    padding: '20px 24px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: 'var(--color-primary)' }}>
                    <ChevronRightIcon size={18} />
                  </span>
                </div>
                {isOpen && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: '0 24px 20px 24px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6'
                    }}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Footer CTA */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-primary)', textAlign: 'center', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, rgba(6,182,212,0.02) 50%, rgba(0,0,0,0) 100%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Generate Your First 3D Tour Today</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Join leading builders and developers who use PropVision AI to showcase layouts, qualify buyer intent, and close properties faster.
          </p>
          <motion.button 
            onClick={startDemo} 
            className="btn btn-primary" 
            style={{ padding: '14px 28px', fontSize: '0.95rem', borderRadius: '12px', boxShadow: 'var(--shadow-glow)' }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Initialize Free Trial
          </motion.button>
        </div>
      </section>

    </div>
  );
};
