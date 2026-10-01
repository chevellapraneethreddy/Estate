import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Common/Header';
import { LandingPage } from './views/LandingPage/LandingPage';
import { AppDashboard } from './views/AppDashboard/AppDashboard';
import { PropertyLanding } from './views/PropertyLanding/PropertyLanding';
import { AuthFlows } from './views/Auth/AuthFlows';
import { ThreeDEditor } from './views/ThreeDEditor/ThreeDEditor';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global Application Header */}
      <Header />

      {/* Main View Router */}
      <div style={{ flexGrow: 1 }}>
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'dashboard' && <AppDashboard />}
        {currentView === 'property-landing' && <PropertyLanding />}
        {currentView === 'editor' && <ThreeDEditor />}
        {(currentView === 'auth-login' || 
          currentView === 'auth-signup' || 
          currentView === 'auth-reset') && <AuthFlows />}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
