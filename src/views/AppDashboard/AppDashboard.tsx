import React, { useState } from 'react';
import { Sidebar } from '../../components/Common/Sidebar';
import { PropertiesList } from './PropertiesList';
import { CRM } from './CRM';
import { WhatsAppAutomation } from './WhatsAppAutomation';
import { Analytics } from './Analytics';
import '../../styles/dashboard.css';

export const AppDashboard: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'properties' | 'crm' | 'whatsapp' | 'analytics'>('properties');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* SaaS Dashboard Sidebar */}
      <Sidebar activeSubView={activeSubView} setActiveSubView={setActiveSubView} />

      {/* Main Dashboard Panel Content Area */}
      <main style={{
        flexGrow: 1,
        padding: '30px 40px',
        overflowY: 'auto',
        background: 'var(--bg-primary)',
        height: 'calc(100vh - 70px)'
      }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
          {activeSubView === 'properties' && <PropertiesList />}
          {activeSubView === 'crm' && <CRM />}
          {activeSubView === 'whatsapp' && <WhatsAppAutomation />}
          {activeSubView === 'analytics' && <Analytics />}
        </div>
      </main>
    </div>
  );
};
export default AppDashboard;
