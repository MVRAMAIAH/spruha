import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Home, UserCircle, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/authStore';
import { ScoreDisplay, DataBadge, ScoreBar } from '../components/common/ScoreDisplay';
import { getConstituencyById } from '../data/constituencies';
import { getDistrictById } from '../data/districts';
import { getMLAByConstituency } from '../data/mlas';
import { getConstituencyCivicDetail, getUserCivicRatings } from '../services/civicSenseService';
import { getMLADetail, getUserMLARating } from '../services/mlaWorkService';
import { ROUTES, CIVIC_SENSE_CATEGORIES, MLA_WORK_CATEGORIES } from '../config/constants';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [civicDetail, setCivicDetail] = useState(null);
  const [mlaDetail, setMlaDetail] = useState(null);
  const [userCivicRatings, setUserCivicRatings] = useState([]);
  const [userMLARating, setUserMLARating] = useState(null);

  const constituency = user?.constituencyId ? getConstituencyById(user.constituencyId) : null;
  const district = constituency ? getDistrictById(constituency.districtId) : null;
  const mla = user?.constituencyId ? getMLAByConstituency(user.constituencyId) : null;

  useEffect(() => {
    if (user && constituency) {
      getConstituencyCivicDetail(constituency.id).then(setCivicDetail);
      getUserCivicRatings(user.id).then(setUserCivicRatings);
    }
    if (user && mla) {
      getMLADetail(mla.id).then(setMlaDetail);
      getUserMLARating(user.id).then(setUserMLARating);
    }
  }, [user, constituency, mla]);

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-fadeIn">
          <h1>{t('dashboard.title')}</h1>
          <p className="subtitle">
            {t('dashboard.subtitle', { name: user?.username })}
          </p>
        </div>

        <div className="grid-2">
          {/* ──── My Profile ──── */}
          <div className="card animate-fadeIn">
            <div className="card-header">
              <h3 className="card-title">{t('dashboard.my_profile')}</h3>
              <Link to={ROUTES.PROFILE_SETUP} className="btn btn-ghost btn-sm">{t('dashboard.edit')}</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <ProfileRow label={t('dashboard.username')} value={user?.username} />
              <ProfileRow 
                label={t('dashboard.email')} 
                value={user?.email} 
                badge={user?.emailVerified ? t('dashboard.verified') : t('dashboard.unverified')} 
                isVerified={user?.emailVerified}
              />
              <ProfileRow label={t('dashboard.mobile')} value={user?.mobile || '—'} />
              <ProfileRow label={t('dashboard.state')} value="Andhra Pradesh" />
              <ProfileRow label={t('dashboard.district')} value={district?.name || '—'} />
              <ProfileRow label={t('dashboard.constituency')} value={constituency?.name || '—'} />
            </div>
          </div>

          {/* ──── My Civic Activity ──── */}
          <div className="card animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>{t('dashboard.my_activity')}</h3>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 'var(--space-4)' }}>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>
                  {userCivicRatings.length}
                </div>
                <div className="stat-label">{t('dashboard.stat_ratings')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>
                  {new Set(userCivicRatings.map(r => r.constituencyId)).size}
                </div>
                <div className="stat-label">{t('dashboard.stat_areas')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--mla-primary)' }}>
                  {userMLARating ? t('dashboard.yes') : t('dashboard.no')}
                </div>
                <div className="stat-label">{t('dashboard.stat_mla')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                  {userCivicRatings.filter(r => r.isOwnConstituency).length > 0 ? t('dashboard.yes') : t('dashboard.no')}
                </div>
                <div className="stat-label">{t('dashboard.stat_own')}</div>
              </div>
            </div>

            {/* Recent Activity */}
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              {t('dashboard.recent_activity')}
            </h4>
            {userCivicRatings.length === 0 && !userMLARating ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {t('dashboard.no_activity')}{' '}
                <Link to={ROUTES.CIVIC_SENSE} style={{ color: 'var(--civic-primary)' }}>{t('dashboard.rate_civic_link')}</Link> or{' '}
                <Link to={ROUTES.MLA_RATING} style={{ color: 'var(--mla-primary)' }}>{t('dashboard.rate_mla_link')}</Link>.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {userCivicRatings.slice(-3).reverse().map(r => {
                  const c = getConstituencyById(r.constituencyId);
                  return (
                    <div key={r.id} style={{
                      padding: 'var(--space-3)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem',
                      display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
                    }}>
                      <Activity size={14} style={{ color: 'var(--civic-primary)' }} />
                      <span>{t('dashboard.rated_civic')} <strong>{c?.name || 'Unknown'}</strong> — {r.overallScore.toFixed(1)}/5</span>
                    </div>
                  );
                })}
                {userMLARating && (
                  <div style={{
                    padding: 'var(--space-3)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
                  }}>
                    <UserCircle size={14} style={{ color: 'var(--mla-primary)' }} />
                    <span>{t('dashboard.rated_mla')} — {userMLARating.overallScore.toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ──── My Constituency ──── */}
        {constituency && (
          <div style={{ marginTop: 'var(--space-10)' }}>
            <div className="section-header">
              <h2><Home size={20} /> {t('dashboard.my_constituency')}</h2>
              <DataBadge category="demo" />
            </div>

            <div className="card animate-fadeIn">
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-1)' }}>{constituency.name}</h2>
                <p style={{ color: 'var(--text-tertiary)' }}>{district?.name} {t('profile.district_label')}</p>
              </div>

              <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
                {/* Civic Sense Section */}
                <div style={{ paddingRight: 'var(--space-4)' }}>
                  <h3 style={{ color: 'var(--civic-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={16} /> {t('nav.civic_sense')}
                  </h3>
                  {civicDetail ? (
                    <div>
                      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 'var(--space-4)' }}>
                        <div className="stat-card" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="stat-value" style={{ color: 'var(--civic-primary)', fontSize: '1.25rem' }}>
                            {civicDetail.insideScore?.toFixed(1) || '—'}
                          </div>
                          <div className="stat-label">{t('dashboard.local_rating')}</div>
                        </div>
                        <div className="stat-card" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="stat-value" style={{ color: 'var(--civic-primary-light)', fontSize: '1.25rem' }}>
                            {civicDetail.outsideScore?.toFixed(1) || '—'}
                          </div>
                          <div className="stat-label">{t('dashboard.outside_rating')}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {CIVIC_SENSE_CATEGORIES.slice(0, 4).map(cat => (
                          <ScoreBar key={cat.id} score={civicDetail.categoryScores?.[cat.id]} type="civic" label={cat.label} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('dashboard.loading')}</p>
                  )}
                </div>

                {/* MLA Work Section — CLEARLY SEPARATED */}
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--space-8)' }}>
                  <h3 style={{ color: 'var(--mla-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCircle size={16} /> {t('dashboard.current_mla')}
                  </h3>
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 600, color: 'var(--mla-primary-light)' }}>{mla?.name || t('dashboard.not_assigned')}</span>
                    {mla?.isDemo && <DataBadge category="demo" />}
                  </div>
                  {mlaDetail ? (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                          {t('dashboard.mla_rating')}
                        </p>
                        <ScoreDisplay score={mlaDetail.overallScore} type="mla" size="lg" />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                          {t('dashboard.ratings_count', { count: mlaDetail.totalRatings.toLocaleString() })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {MLA_WORK_CATEGORIES.slice(0, 4).map(cat => (
                          <ScoreBar key={cat.id} score={mlaDetail.categoryScores?.[cat.id]} type="mla" label={cat.label} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('dashboard.loading')}</p>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-8)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                {t('dashboard.independent_note')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value, badge, isVerified }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: 'var(--space-3) 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{value || '—'}</span>
        {badge && (
          <span style={{
            fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '4px',
            color: isVerified ? 'var(--civic-primary)' : 'var(--accent-warning)',
          }}>
            {isVerified ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
