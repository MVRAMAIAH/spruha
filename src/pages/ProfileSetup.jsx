import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/authStore';
import { DISTRICTS } from '../data/districts';
import { getConstituenciesByDistrict } from '../data/constituencies';
import { ROUTES } from '../config/constants';

export default function ProfileSetup() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mobile: '',
    districtId: '',
    constituencyId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const constituencies = form.districtId ? getConstituenciesByDistrict(form.districtId) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'districtId' ? { constituencyId: '' } : {}),
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.mobile || form.mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!form.districtId) {
      setError('Please select your district.');
      return;
    }
    if (!form.constituencyId) {
      setError('Please select your assembly constituency.');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        mobile: form.mobile,
        stateId: 'state-ap',
        districtId: form.districtId,
        constituencyId: form.constituencyId,
        profileCompleted: true,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - var(--nav-height))' }}>
      <div className="container" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="animate-slideUp">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--civic-primary)' }}>
                <MapPin size={24} />
              </div>
            </div>
            <h1 style={{ marginBottom: 'var(--space-2)' }}>{t('profile.title')}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t('profile.subtitle')}
            </p>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>{error}</div>}

          <div className="card">
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label className="form-label">{t('profile.google_account')}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user?.photoURL && (
                    <img src={user.photoURL} alt="Profile" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                  )}
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{user?.username || user?.email}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-mobile">{t('profile.mobile_label')}</label>
                <input
                  id="profile-mobile"
                  name="mobile"
                  type="tel"
                  className="form-input"
                  placeholder={t('profile.mobile_placeholder')}
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

              <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
                <p style={{ fontSize: '0.8125rem' }}>
                  {t('profile.info_alert')}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-state">{t('profile.state_label')}</label>
                <select id="profile-state" className="form-select" disabled>
                  <option>Andhra Pradesh</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-district">{t('profile.district_label')}</label>
                <select
                  id="profile-district"
                  name="districtId"
                  className="form-select"
                  value={form.districtId}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('profile.select_district')}</option>
                  {DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-constituency">{t('profile.constituency_label')}</label>
                <select
                  id="profile-constituency"
                  name="constituencyId"
                  className="form-select"
                  value={form.constituencyId}
                  onChange={handleChange}
                  required
                  disabled={!form.districtId}
                >
                  <option value="">
                    {form.districtId ? t('profile.select_constituency') : t('profile.select_district_first')}
                  </option>
                  {constituencies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-civic btn-lg btn-full" 
                id="profile-submit-btn"
                disabled={loading}
                style={{ marginTop: 'var(--space-8)' }}
              >
                {loading ? t('profile.saving') : t('profile.submit_btn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
