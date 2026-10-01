import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../context/AppContext';
import { SunIcon, MoonIcon } from './Icons';

const HamburgerIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

export const Header: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    userRole, 
    setUserRole, 
    isLoggedIn, 
    setIsLoggedIn, 
    currentView, 
    setCurrentView,
    setViewingPropertyId
  } = useApp();

  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentView !== 'landing') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const sectionIds = ['action-demo', 'features', 'pricing', 'faq'];
      const scrollPosition = window.scrollY + 120; // 120px offset for sticky header

      let currentActive = '';
      
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
      
      if (isAtBottom) {
        currentActive = 'faq';
      } else {
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              currentActive = id;
              break;
            }
          }
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleLogoClick = () => {
    setViewingPropertyId(null);
    setCurrentView('landing');
    setMobileMenuOpen(false);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    setUserRole(role);
    if (role === 'customer') {
      setViewingPropertyId('emerald-bay');
      setCurrentView('property-landing');
    } else {
      setViewingPropertyId(null);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('auth-login');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      borderBottom: '1px solid var(--border-color)',
      height: '70px'
    }}>
      <div 
        onClick={handleLogoClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: '800',
          fontSize: '1.2rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          PV
        </div>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.5px'
        }}>
          Prop<span style={{ color: 'var(--color-primary)' }}>Vision AI</span>
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Navigation for non-logged-in/landing view */}
        {(currentView === 'landing' || currentView === 'dashboard') && (
          <nav className="landing-nav desktop-only">
            <a 
              href="#action-demo" 
              onClick={(e) => handleNavClick(e, 'action-demo')}
              className={activeSection === 'action-demo' ? 'active' : ''}
            >
              Product Demo
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, 'features')}
              className={activeSection === 'features' ? 'active' : ''}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, 'pricing')}
              className={activeSection === 'pricing' ? 'active' : ''}
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleNavClick(e, 'faq')}
              className={activeSection === 'faq' ? 'active' : ''}
            >
              FAQ
            </a>
          </nav>
        )}

        {/* Role Simulator Selector */}
        <div className="desktop-only" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-tertiary)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-primary)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Role Play:
          </span>
          <select 
            value={userRole}
            onChange={handleRoleChange}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              paddingRight: '4px'
            }}
          >
            <option value="builder">Builder / Developer</option>
            <option value="agent">Sales Agent</option>
            <option value="customer">Buyer / Customer</option>
          </select>
        </div>

        {/* Dark/Light Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>

        {isLoggedIn ? (
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => {
                if (userRole === 'customer') {
                  setViewingPropertyId('emerald-bay');
                  setCurrentView('property-landing');
                } else {
                  setViewingPropertyId(null);
                  setCurrentView('dashboard');
                }
              }}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Dashboard
            </button>
            <div style={{
              width: '1px',
              height: '20px',
              background: 'var(--border-color)'
            }} />
            <button 
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setCurrentView('auth-login')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Log In
            </button>
            <button 
              onClick={() => setCurrentView('auth-signup')}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Get Started
            </button>
          </div>
        )}

        {/* Hamburger Menu Trigger */}
        {(currentView === 'landing' || currentView === 'dashboard') && (
          <button 
            className="hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (currentView === 'landing' || currentView === 'dashboard') && (
        <div className="mobile-nav-overlay glass-panel">
          <div className="mobile-nav-links">
            <a 
              href="#action-demo" 
              onClick={(e) => handleNavClick(e, 'action-demo')}
              className={activeSection === 'action-demo' ? 'active' : ''}
            >
              Product Demo
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, 'features')}
              className={activeSection === 'features' ? 'active' : ''}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, 'pricing')}
              className={activeSection === 'pricing' ? 'active' : ''}
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleNavClick(e, 'faq')}
              className={activeSection === 'faq' ? 'active' : ''}
            >
              FAQ
            </a>
          </div>

          <div className="mobile-menu-divider" />

          {/* Role Simulator inside mobile drawer */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'var(--bg-tertiary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-primary)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Role Play Simulator:
            </span>
            <select 
              value={userRole}
              onChange={(e) => {
                handleRoleChange(e);
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%'
              }}
            >
              <option value="builder">Builder / Developer</option>
              <option value="agent">Sales Agent</option>
              <option value="customer">Buyer / Customer</option>
            </select>
          </div>

          <div className="mobile-menu-divider" />

          {/* CTA Buttons in mobile menu */}
          <div className="mobile-nav-actions">
            {isLoggedIn ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (userRole === 'customer') {
                      setViewingPropertyId('emerald-bay');
                      setCurrentView('property-landing');
                    } else {
                      setViewingPropertyId(null);
                      setCurrentView('dashboard');
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('auth-login');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  Log In
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('auth-signup');
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

