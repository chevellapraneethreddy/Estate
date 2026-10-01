import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../context/AppContext';
import { LockIcon, MailIcon, UserIcon } from '../../components/Common/Icons';

export const AuthFlows: React.FC = () => {
  const { currentView, setCurrentView, setIsLoggedIn, setUserRole } = useApp();

  // Inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('builder');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      setUserRole(selectedRole);
      setCurrentView('dashboard');
    }, 1200);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !company) {
      setError('Please fill in all registration fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      setUserRole(selectedRole);
      setCurrentView('dashboard');
    }, 1200);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your recovery email.');
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`A recovery password link has been successfully dispatched to ${email}. Check your inbox!`);
      setEmail('');
    }, 1500);
  };

  const renderLogin = () => (
    <div className="card animate-fade-in" style={{ padding: '36px 32px', width: '100%', maxWidth: '420px', margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
          Sign in to access your PropPilot builder CRM.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-danger)', color: '#fff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Account Role</label>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value as any)} 
            className="form-select"
          >
            <option value="builder">Builder / Developer</option>
            <option value="agent">Sales Partner Agent</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}>
              <MailIcon size={16} />
            </span>
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label className="form-label">Secret Password</label>
            <span 
              onClick={() => { setError(null); setCurrentView('auth-reset'); }}
              style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Forgot secret password?
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}>
              <LockIcon size={16} />
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '24px', paddingTop: '16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Do not have a builder account?{' '}
        <span 
          onClick={() => { setError(null); setCurrentView('auth-signup'); }}
          style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
        >
          Register here
        </span>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="card animate-fade-in" style={{ padding: '36px 32px', width: '100%', maxWidth: '450px', margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Create Developer Account</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
          Get immediate access to automatic 3D walkthrough generators.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-danger)', color: '#fff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        <div className="form-group">
          <label className="form-label">Role Focus</label>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value as any)} 
            className="form-select"
          >
            <option value="builder">Builder / Property Developer</option>
            <option value="agent">Realtor / Real Estate Agency</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Company / Builder Name</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="e.g. Prestige Developers"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}>
              <UserIcon size={16} />
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Professional Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}>
              <MailIcon size={16} />
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Create Secret Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="At least 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}>
              <LockIcon size={16} />
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '24px', paddingTop: '16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Already have a builder account?{' '}
        <span 
          onClick={() => { setError(null); setCurrentView('auth-login'); }}
          style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
        >
          Log in here
        </span>
      </div>
    </div>
  );

  const renderReset = () => (
    <div className="card animate-fade-in" style={{ padding: '36px 32px', width: '100%', maxWidth: '400px', margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Reset Password</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
          Retrieve access to your PropPilot developer space.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-danger)', color: '#fff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'var(--color-primary)', color: '#fff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Registered Email</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}>
              <MailIcon size={16} />
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          disabled={loading}
        >
          {loading ? 'Dispatched Request...' : 'Send Recovery Link'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '24px', paddingTop: '16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Remembered credentials?{' '}
        <span 
          onClick={() => { setError(null); setSuccessMsg(null); setCurrentView('auth-login'); }}
          style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
        >
          Log in here
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {currentView === 'auth-login' && renderLogin()}
      {currentView === 'auth-signup' && renderSignup()}
      {currentView === 'auth-reset' && renderReset()}
    </div>
  );
};
