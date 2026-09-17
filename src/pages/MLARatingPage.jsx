import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Info, CheckCircle2, Lock, ArrowRight, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/authStore';
import StarRating from '../components/common/StarRating';
import { ScoreDisplay, DataBadge, ScoreBar } from '../components/common/ScoreDisplay';
import { MLA_WORK_CATEGORIES, ROUTES, VOTING_CONFIG, COMMENT_CONFIG } from '../config/constants';
import { getConstituencyById } from '../data/constituencies';
import { getDistrictById } from '../data/districts';
import { getMLAByConstituency } from '../data/mlas';
import { submitMLARating, hasRatedMLA, getMLADetail } from '../services/mlaWorkService';

export default function MLARatingPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [categoryScores, setCategoryScores] = useState({});
  const [comment, setComment] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: '', success: '' });
  const [rated, setRated] = useState(false);
  const [mlaDetail, setMlaDetail] = useState(null);

  const userConstituency = user?.constituencyId ? getConstituencyById(user.constituencyId) : null;
  const userDistrict = userConstituency ? getDistrictById(userConstituency.districtId) : null;
  const userMLA = user?.constituencyId ? getMLAByConstituency(user.constituencyId) : null;

  useEffect(() => {
    if (userMLA) {
      getMLADetail(userMLA.id).then(setMlaDetail);
    }
    if (user) {
      hasRatedMLA(user.id).then(setRated);
    }
  }, [userMLA, user]);

  const overallScore = useMemo(() => {
    const scores = Object.values(categoryScores);
    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [categoryScores]);

  const handleSubmit = async () => {
    if (!user || !userMLA) return;

    const missing = MLA_WORK_CATEGORIES.filter(cat => !categoryScores[cat.id]);
    if (missing.length > 0) {
      setSubmitStatus({
        loading: false,
        error: `Please rate all categories.`,
        success: '',
      });
      return;
    }

    setSubmitStatus({ loading: true, error: '', success: '' });
    try {
      await submitMLARating(user.id, user.constituencyId, categoryScores, comment || undefined);
      setSubmitStatus({ loading: false, error: '', success: 'Your MLA work rating has been submitted!' });
      setRated(true);
      const detail = await getMLADetail(userMLA.id);
      setMlaDetail(detail);
    } catch (err) {
      setSubmitStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header animate-fadeIn">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mla-primary)', border: '1px solid var(--border-subtle)' }}>
              <UserCircle size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '2px' }}>{t('mla.title')}</h1>
              <p className="subtitle" style={{ fontSize: '1rem', margin: 0 }}>
                {t('mla.subtitle')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center' }}>
              Period: {VOTING_CONFIG.CURRENT_VOTING_PERIOD}
            </span>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
          <Info size={16} />
          <div>
            {t('mla.info_alert')}{' '}
            <Link to={ROUTES.CIVIC_SENSE} style={{ color: 'var(--civic-primary-light)', fontWeight: 500, textDecoration: 'underline' }}>{t('mla.civic_link')}</Link>.
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', borderStyle: 'dashed' }}>
            <Lock size={32} style={{ color: 'var(--border-strong)', margin: '0 auto var(--space-4)' }} />
            <h3 style={{ marginBottom: 'var(--space-3)' }}>{t('civic.signin_req')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              You need to be signed in and have a registered constituency to rate your MLA.
            </p>
            <Link to={ROUTES.AUTH} className="btn btn-mla btn-lg">{t('civic.signin_btn')}</Link>
          </div>
        ) : !userConstituency ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', borderStyle: 'dashed' }}>
            <MapPin size={32} style={{ color: 'var(--border-strong)', margin: '0 auto var(--space-4)' }} />
            <h3 style={{ marginBottom: 'var(--space-3)' }}>{t('mla.profile_req')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              {t('mla.profile_desc')}
            </p>
            <Link to={ROUTES.PROFILE_SETUP} className="btn btn-mla btn-lg">{t('mla.profile_btn')}</Link>
          </div>
        ) : (
          <>
            {/* MLA Info Card */}
            <div className="card animate-fadeIn" style={{ marginBottom: 'var(--space-6)', borderTop: '2px solid var(--mla-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                <div style={{
                  width: 80, height: 80,
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--mla-primary)',
                  border: '1px solid var(--border-subtle)',
                  flexShrink: 0
                }}>
                  <UserCircle size={40} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                    {t('mla.your_mla')}
                  </p>
                  <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px', fontSize: '1.5rem' }}>
                    {userMLA?.name || t('dashboard.not_assigned')}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                    {userConstituency.name} {t('profile.constituency_label')}
                  </p>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                    {userDistrict?.name} {t('profile.district_label')}
                  </p>
                </div>
                {userMLA?.isDemo && (
                  <div><DataBadge category="demo" /></div>
                )}
              </div>

              {mlaDetail && (
                <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                    <div style={{ minWidth: '150px' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                        {t('mla.current_rating')}
                      </p>
                      <ScoreDisplay score={mlaDetail.overallScore} size="xl" type="mla" />
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
                        {t('dashboard.ratings_count', { count: mlaDetail.totalRatings.toLocaleString() })}
                      </p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {MLA_WORK_CATEGORIES.slice(0, 3).map(cat => (
                        <ScoreBar
                          key={cat.id}
                          score={mlaDetail.categoryScores?.[cat.id]}
                          type="mla"
                          label={cat.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rating Form */}
            <div className="card animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCircle size={20} className="text-mla" />
                {t('mla.rate_work')}
              </h3>

              {rated && !submitStatus.success ? (
                <div className="alert alert-info">
                  <Info size={16} />
                  {t('mla.already_rated')}
                </div>
              ) : submitStatus.success ? (
                <div className="alert alert-success">
                  <CheckCircle2 size={16} />
                  {submitStatus.success}
                </div>
              ) : (
                <>
                  {submitStatus.error && (
                    <div className="alert alert-error">
                      <Info size={16} />
                      {submitStatus.error}
                    </div>
                  )}

                  {MLA_WORK_CATEGORIES.map(cat => (
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
                      <h3>Overall MLA Rating</h3>
                      <ScoreDisplay score={overallScore} size="lg" type="mla" />
                    </div>
                  )}

                  {/* Comment section */}
                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <label className="form-label">{t('mla.optional_comment')}</label>
                    <textarea
                      className="form-textarea"
                      placeholder={t('mla.comment_placeholder')}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={COMMENT_CONFIG.MAX_LENGTH}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="btn btn-mla btn-lg btn-full"
                    disabled={submitStatus.loading}
                    style={{ marginTop: 'var(--space-6)' }}
                  >
                    {submitStatus.loading ? t('civic.submitting') : t('mla.submit')}
                  </button>
                </>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
              <Link to={ROUTES.MLA_RANKINGS} className="btn btn-primary btn-full">
                {t('mla.view_rankings')} <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
