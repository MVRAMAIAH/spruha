import { Link } from 'react-router-dom';
import { ShieldAlert, BookOpen, UserPlus, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES, APP_META } from '../../config/constants';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer" id="main-footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand">{APP_META.NAME}</div>
          <p className="footer-description">
            {t('footer.desc')}
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <ShieldAlert size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
        <div>
          <h4 className="footer-heading">{t('footer.platform')}</h4>
          <ul className="footer-links">
            <li>
              <Link to={ROUTES.CIVIC_SENSE} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> {t('nav.civic_sense')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.MLA_RATING} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> {t('nav.rate_mla')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.CIVIC_RANKINGS} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> {t('nav.rankings')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">{t('footer.about')}</h4>
          <ul className="footer-links">
            <li>
              <Link to={ROUTES.ABOUT} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} /> {t('footer.about')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.METHODOLOGY} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} /> {t('footer.methodology')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.AUTH} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserPlus size={14} /> {t('auth.continue_with_google')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {APP_META.NAME} · Civic Tracking Platform</p>
        <p>v{APP_META.VERSION}</p>
      </div>
    </footer>
  );
}
