import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Settings, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../stores/authStore';
import { ROUTES, APP_META } from '../../config/constants';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to={ROUTES.HOME} className="navbar-brand">
          <img src="/ap-logo.jpg" alt="Logo" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          <span>{APP_META.NAME}</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li>
            <NavLink
              to={ROUTES.CIVIC_SENSE}
              className={({ isActive }) => `civic-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.civic_sense')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={ROUTES.MLA_RATING}
              className={({ isActive }) => `mla-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.rate_mla')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={ROUTES.CIVIC_RANKINGS}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.rankings')}
            </NavLink>
          </li>
          <li>
            <button
              onClick={() => {
                toggleLanguage();
                setMobileOpen(false);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
              title="Change Language"
            >
              <Globe size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {i18n.language === 'en' ? 'TE' : 'EN'}
              </span>
            </button>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <NavLink
                  to={ROUTES.DASHBOARD}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <LayoutDashboard size={16} /> {t('nav.dashboard')}
                </NavLink>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <NavLink
                    to={ROUTES.ADMIN}
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Settings size={16} /> {t('nav.admin')}
                  </NavLink>
                </li>
              )}
              <li>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LogOut size={16} /> {t('nav.logout')}
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to={ROUTES.AUTH}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
