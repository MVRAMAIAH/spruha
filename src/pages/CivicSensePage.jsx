import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Info, CheckCircle2, ArrowRight, Home, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/authStore';
import StarRating from '../components/common/StarRating';
import { ScoreDisplay, DataBadge, ScoreBar } from '../components/common/ScoreDisplay';
import { CIVIC_SENSE_CATEGORIES, ROUTES, VOTING_CONFIG } from '../config/constants';
import { getConstituencyById, getOtherConstituencies, CONSTITUENCIES } from '../data/constituencies';
import { getDistrictById } from '../data/districts';
import { submitCivicRating, hasRatedConstituency, getConstituencyCivicDetail } from '../services/civicSenseService';

export default function CivicSensePage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [categoryScores, setCategoryScores] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: '', success: '' });
  const [alreadyRated, setAlreadyRated] = useState({});
  const [ownCivicDetail, setOwnCivicDetail] = useState(null);
  const [ownScores, setOwnScores] = useState({});
  const [ownSubmitStatus, setOwnSubmitStatus] = useState({ loading: false, error: '', success: '' });

  const userConstituency = user?.constituencyId ? getConstituencyById(user.constituencyId) : null;
  const userDistrict = userConstituency ? getDistrictById(userConstituency.districtId) : null;

  useEffect(() => {
    if (userConstituency) {
      getConstituencyCivicDetail(userConstituency.id).then(setOwnCivicDetail);
    }
  }, [userConstituency]);

  const filteredConstituencies = useMemo(() => {
    let list = user?.constituencyId
      ? getOtherConstituencies(user.constituencyId)
      : [...CONSTITUENCIES];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }

    if (districtFilter) {
      list = list.filter(c => c.districtId === districtFilter);
    }

    return list.slice(0, 30);
  }, [user, searchQuery, districtFilter]);

  const handleSelectConstituency = async (constituency) => {
    setSelectedConstituency(constituency);
    setCategoryScores({});
    setSubmitStatus({ loading: false, error: '', success: '' });

    if (user) {
      const rated = await hasRatedConstituency(user.id, constituency.id);
      setAlreadyRated(prev => ({ ...prev, [constituency.id]: rated }));
    }
  };

  const handleSubmitRating = async () => {
    if (!user || !selectedConstituency) return;

    const missing = CIVIC_SENSE_CATEGORIES.filter(cat => !categoryScores[cat.id]);
    if (missing.length > 0) {
      setSubmitStatus({ loading: false, error: `Please rate all categories.`, success: '' });
      return;
    }

    setSubmitStatus({ loading: true, error: '', success: '' });
    try {
      await submitCivicRating(user.id, user.constituencyId, selectedConstituency.id, categoryScores);
      setSubmitStatus({ loading: false, error: '', success: 'Rating submitted successfully.' });
      setAlreadyRated(prev => ({ ...prev, [selectedConstituency.id]: true }));
    } catch (err) {
      setSubmitStatus({ loading: false, error: err.message, success: '' });
    }
  };

  const handleSubmitOwnRating = async () => {
    if (!user || !userConstituency) return;

    const missing = CIVIC_SENSE_CATEGORIES.filter(cat => !ownScores[cat.id]);
    if (missing.length > 0) {
      setOwnSubmitStatus({ loading: false, error: `Please rate all categories.`, success: '' });
      return;
    }

    setOwnSubmitStatus({ loading: true, error: '', success: '' });
    try {
      await submitCivicRating(user.id, user.constituencyId, userConstituency.id, ownScores);
      setOwnSubmitStatus({ loading: false, error: '', success: 'Your rating has been submitted.' });
      const detail = await getConstituencyCivicDetail(userConstituency.id);
      setOwnCivicDetail(detail);
    } catch (err) {
      setOwnSubmitStatus({ loading: false, error: err.message, success: '' });
    }
  };

  const overallScore = useMemo(() => {
    const scores = Object.values(categoryScores);
    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [categoryScores]);

  return (
    <div className="page-content">
      <div className="container">
        {/* Page Header */}
        <div className="page-header animate-fadeIn">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--civic-primary)', border: '1px solid var(--border-subtle)' }}>
              <Users size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '2px' }}>{t('civic.title')}</h1>
              <p className="subtitle" style={{ fontSize: '1rem', margin: 0 }}>
                {t('civic.subtitle')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <DataBadge category="demo" />
          </div>
        </div>

        <div className="alert alert-info" style={{ marginBottom: 'var(--space-8)' }}>
          <Info size={16} />
          <div>
            <strong>Important:</strong> {t('civic.info_alert')}{' '}
            <Link to={ROUTES.MLA_RATING} style={{ color: 'var(--mla-primary-light)', fontWeight: 500 }}>{t('civic.mla_link')}</Link>.
          </div>
        </div>

        {!isAuthenticated && (
          <div className="alert alert-warning" style={{ marginBottom: 'var(--space-8)' }}>
            <Info size={16} />
            <div>
              <Link to={ROUTES.AUTH} style={{ color: 'var(--accent-warning)', fontWeight: 500, textDecoration: 'underline' }}>{t('civic.signin_btn')}</Link> {t('civic.signin_desc')}
            </div>
          </div>
        )}

        <div className="grid-2">
          {/* ──── SECTION A: Other Constituencies ──── */}
          <div>
            <div className="section-header">
              <h2>{t('civic.rate_constituency')}</h2>
            </div>

            {/* Search */}
            <div className="search-bar">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="form-input"
                placeholder="Search constituencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Constituency list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {filteredConstituencies.map(c => {
                const dist = getDistrictById(c.districtId);
                const isSelected = selectedConstituency?.id === c.id;
                const rated = alreadyRated[c.id];

                return (
                  <div
                    key={c.id}
                    className="card"
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--civic-primary)' : 'var(--border-subtle)',
                      background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-card)',
                      transition: 'all var(--transition-fast)'
                    }}
                    onClick={() => handleSelectConstituency(c)}
                  >
                    <div className="flex-between">
                      <div>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{c.name}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                          {dist?.name}
                        </p>
                      </div>
                      {rated && (
                        <CheckCircle2 size={16} className="text-civic" />
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredConstituencies.length === 0 && (
                <div className="empty-state">
                  <p>No constituencies found.</p>
                </div>
              )}
            </div>
          </div>

          {/* ──── Rating Form ──── */}
          <div>
            {selectedConstituency ? (
              <div className="card animate-fadeIn" style={{ borderTop: '2px solid var(--civic-primary)' }}>
                <div className="card-header" style={{ alignItems: 'center' }}>
                  <div>
                    <h3>{selectedConstituency.name}</h3>
                    <p className="card-subtitle">
                      {getDistrictById(selectedConstituency.districtId)?.name} {t('profile.district_label')}
                    </p>
                  </div>
                </div>

                {alreadyRated[selectedConstituency.id] && !submitStatus.success ? (
                  <div className="alert alert-info" style={{ marginTop: 'var(--space-4)' }}>
                    <Info size={16} />
                    {t('civic.already_rated')}
                  </div>
                ) : submitStatus.success ? (
                  <div className="alert alert-success" style={{ marginTop: 'var(--space-4)' }}>
                    <CheckCircle2 size={16} />
                    {submitStatus.success}
                  </div>
                ) : !isAuthenticated ? (
                  <div className="alert alert-warning" style={{ marginTop: 'var(--space-4)' }}>
                    <Info size={16} />
                    <div><Link to={ROUTES.AUTH} style={{ fontWeight: 500, textDecoration: 'underline' }}>{t('civic.signin_btn')}</Link> {t('civic.signin_desc')}</div>
                  </div>
                ) : (
                  <div style={{ marginTop: 'var(--space-6)' }}>
                    {submitStatus.error && (
                      <div className="alert alert-error">
                        <Info size={16} />
                        {submitStatus.error}
                      </div>
                    )}

                    {CIVIC_SENSE_CATEGORIES.map(cat => (
                      <div className="rating-category" key={cat.id}>
                        <div className="rating-category-info">
                          <div className="cat-label">{cat.label}</div>
                          <div className="cat-description">{cat.description}</div>
                        </div>
                        <StarRating
                          value={categoryScores[cat.id] || 0}
                          onChange={(val) => setCategoryScores(prev => ({ ...prev, [cat.id]: val }))}
                          showLabel
                        />
                      </div>
                    ))}

                    {overallScore > 0 && (
                      <div className="rating-overall">
                        <h3>{t('civic.overall')}</h3>
                        <ScoreDisplay score={overallScore} size="lg" type="civic" />
                      </div>
                    )}

                    <button
                      onClick={handleSubmitRating}
                      className="btn btn-civic btn-lg btn-full"
                      disabled={submitStatus.loading}
                      style={{ marginTop: 'var(--space-6)' }}
                    >
                      {submitStatus.loading ? t('civic.submitting') : t('civic.submit')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', borderStyle: 'dashed' }}>
                <Users size={32} style={{ color: 'var(--border-strong)', margin: '0 auto var(--space-4)' }} />
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>{t('civic.select_location')}</h3>
              </div>
            )}

            {/* ──── SECTION B: My Constituency ──── */}
            {isAuthenticated && userConstituency && (
              <div className="card" style={{ marginTop: 'var(--space-6)' }}>
                <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                  <h2 style={{ fontSize: '1.125rem' }}>
                    <Home size={18} className="text-civic" />
                    {t('dashboard.my_constituency')}
                  </h2>
                </div>

                <div style={{
                  background: 'var(--bg-elevated)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: 'var(--text-primary)', marginBottom: '2px', fontSize: '1rem' }}>
                        {userConstituency.name}
                      </h3>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                        {userDistrict?.name} {t('profile.district_label')}
                      </p>
                    </div>
                  </div>
                  
                  {ownCivicDetail && (
                    <div style={{ marginTop: 'var(--space-4)' }}>
                      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <div className="stat-card" style={{ background: 'var(--bg-card)', padding: 'var(--space-3)' }}>
                          <div className="stat-value" style={{ color: 'var(--civic-primary)', fontSize: '1.25rem' }}>
                            {ownCivicDetail.insideScore?.toFixed(1) || '—'}
                          </div>
                          <div className="stat-label">{t('dashboard.local_rating')}</div>
                        </div>
                        <div className="stat-card" style={{ background: 'var(--bg-card)', padding: 'var(--space-3)' }}>
                          <div className="stat-value" style={{ color: 'var(--civic-primary)', fontSize: '1.25rem', opacity: 0.8 }}>
                            {ownCivicDetail.outsideScore?.toFixed(1) || '—'}
                          </div>
                          <div className="stat-label">{t('dashboard.outside_rating')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {ownSubmitStatus.success ? (
                  <div className="alert alert-success">
                    <CheckCircle2 size={16} /> {ownSubmitStatus.success}
                  </div>
                ) : (
                  <>
                    {ownSubmitStatus.error && (
                      <div className="alert alert-error">
                        <Info size={16} /> {ownSubmitStatus.error}
                      </div>
                    )}

                    {CIVIC_SENSE_CATEGORIES.map(cat => (
                      <div className="rating-category" key={`own-${cat.id}`}>
                        <div className="rating-category-info">
                          <div className="cat-label">{cat.label}</div>
                        </div>
                        <StarRating
                          value={ownScores[cat.id] || 0}
                          onChange={(val) => setOwnScores(prev => ({ ...prev, [cat.id]: val }))}
                          size="sm"
                        />
                      </div>
                    ))}

                    <button
                      onClick={handleSubmitOwnRating}
                      className="btn btn-outline btn-full"
                      disabled={ownSubmitStatus.loading}
                      style={{ marginTop: 'var(--space-4)' }}
                    >
                      {ownSubmitStatus.loading ? t('civic.submitting') : t('civic.submit')}
                    </button>
                  </>
                )}
              </div>
            )}

            <div style={{ marginTop: 'var(--space-6)' }}>
              <Link to={ROUTES.CIVIC_RANKINGS} className="btn btn-primary btn-full">
                {t('civic.view_rankings')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
