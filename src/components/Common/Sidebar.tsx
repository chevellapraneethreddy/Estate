import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BuildingIcon, 
  CRMIcon, 
  WhatsAppIcon, 
  AnalyticsIcon,
  UserIcon
} from './Icons';

interface SidebarProps {
  activeSubView: 'properties' | 'crm' | 'whatsapp' | 'analytics';
  setActiveSubView: (view: 'properties' | 'crm' | 'whatsapp' | 'analytics') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSubView, setActiveSubView }) => {
  const { userRole } = useApp();

  const menuItems = [
    {
      id: 'properties' as const,
      label: 'Properties & 3D',
      icon: <BuildingIcon size={20} />,
      roles: ['builder', 'agent']
    },
    {
      id: 'crm' as const,
      label: 'Builder CRM',
      icon: <CRMIcon size={20} />,
      roles: ['builder', 'agent']
    },
    {
      id: 'whatsapp' as const,
      label: 'WhatsApp Automation',
      icon: <WhatsAppIcon size={20} />,
      roles: ['builder']
    },
    {
      id: 'analytics' as const,
      label: 'Property Analytics',
      icon: <AnalyticsIcon size={20} />,
      roles: ['builder', 'agent']
    }
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="glass-panel" style={{
      width: '260px',
      height: 'calc(100vh - 70px)',
      position: 'sticky',
      top: '70px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border-color)',
      padding: '24px 16px',
      gap: '8px',
      flexShrink: 0
    }}>
      <div style={{
        padding: '0 8px 16px 8px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserIcon size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {userRole === 'builder' ? 'Developer Hub' : 'Sales Partner'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              Role: {userRole}
            </span>
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        {visibleItems.map((item) => {
          const isActive = activeSubView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'var(--color-primary-light)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{
        padding: '16px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>PropVision AI Live</p>
        <p>Production Workspace Connected.</p>
      </div>
    </aside>
  );
};
