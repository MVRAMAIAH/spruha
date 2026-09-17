import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/authStore';
import { ROUTES } from '../config/constants';

export default function AuthPage() {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  // If already authenticated and profile is complete, redirect to dashboard or intended route
  if (isAuthenticated) {
    if (user?.profileCompleted) {
      navigate(from, { replace: true });
    } else {
      navigate(ROUTES.PROFILE_SETUP, { replace: true });
    }
    return null;
  }

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const dbUser = await loginWithGoogle();
      
      // If profile is not complete, send them to setup
      if (!dbUser.profileCompleted) {
        navigate(ROUTES.PROFILE_SETUP);
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(t('auth.error_generic') || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - var(--nav-height))' }}>
      <div className="container" style={{ maxWidth: 440, width: '100%' }}>
        <div className="card animate-fadeIn" style={{ padding: 'var(--space-8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{t('auth.welcome')}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              {t('auth.subtitle')}
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <div style={{ marginTop: 'var(--space-6)' }}>
            
            <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                {t('auth.select_language')}
              </label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('te')}
                  className="btn"
                  style={{
                    flex: 1,
                    background: i18n.language === 'te' ? 'var(--civic-primary)' : 'var(--bg-elevated)',
                    color: i18n.language === 'te' ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${i18n.language === 'te' ? 'var(--civic-primary)' : 'var(--border-strong)'}`
                  }}
                >
                  <Globe size={16} style={{ marginRight: '6px' }} />
                  తెలుగు
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className="btn"
                  style={{
                    flex: 1,
                    background: i18n.language === 'en' ? 'var(--civic-primary)' : 'var(--bg-elevated)',
                    color: i18n.language === 'en' ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${i18n.language === 'en' ? 'var(--civic-primary)' : 'var(--border-strong)'}`
                  }}
                >
                  <Globe size={16} style={{ marginRight: '6px' }} />
                  English
                </button>
              </div>
            </div>

            <button 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className="btn btn-lg btn-full" 
              style={{ 
                background: 'white', 
                color: 'black', 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                border: '1px solid transparent',
              }}
            >
              {loading ? (
                t('auth.connecting')
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {t('auth.continue_with_google')}
                </>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-4)' }}>
              {t('auth.terms')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
