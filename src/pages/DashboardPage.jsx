import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Home, UserCircle, Activity } from 'lucide-react';
import { useAuth } from '../stores/authStore';
import { ScoreDisplay, DataBadge, ScoreBar } from '../components/common/ScoreDisplay';
import { getConstituencyById } from '../data/constituencies';
import { getDistrictById } from '../data/districts';
import { getMLAByConstituency } from '../data/mlas';
import { getConstituencyCivicDetail, getUserCivicRatings } from '../services/civicSenseService';
import { getMLADetail, getUserMLARating } from '../services/mlaWorkService';
import { ROUTES, CIVIC_SENSE_CATEGORIES, MLA_WORK_CATEGORIES } from '../config/constants';

export default function DashboardPage() {
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
          <h1>Citizen Dashboard</h1>
          <p className="subtitle">
            Welcome back, {user?.username}. Here's your civic activity overview.
          </p>
        </div>

        <div className="grid-2">
          {/* ──── My Profile ──── */}
          <div className="card animate-fadeIn">
            <div className="card-header">
              <h3 className="card-title">My Profile</h3>
              <Link to={ROUTES.PROFILE_SETUP} className="btn btn-ghost btn-sm">Edit</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <ProfileRow label="Username" value={user?.username} />
              <ProfileRow 
                label="Email" 
                value={user?.email} 
                badge={user?.emailVerified ? 'Verified' : 'Unverified'} 
                isVerified={user?.emailVerified}
              />
              <ProfileRow label="Mobile" value={user?.mobile || '—'} />
              <ProfileRow label="State" value="Andhra Pradesh" />
              <ProfileRow label="District" value={district?.name || '—'} />
              <ProfileRow label="Constituency" value={constituency?.name || '—'} />
            </div>
          </div>

          {/* ──── My Civic Activity ──── */}
          <div className="card animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>My Civic Activity</h3>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 'var(--space-4)' }}>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>
                  {userCivicRatings.length}
                </div>
                <div className="stat-label">Civic Ratings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>
                  {new Set(userCivicRatings.map(r => r.constituencyId)).size}
                </div>
                <div className="stat-label">Areas Evaluated</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--mla-primary)' }}>
                  {userMLARating ? 'Yes' : 'No'}
                </div>
                <div className="stat-label">MLA Rated</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                  {userCivicRatings.filter(r => r.isOwnConstituency).length > 0 ? 'Yes' : 'No'}
                </div>
                <div className="stat-label">Own Area Rated</div>
              </div>
            </div>

            {/* Recent Activity */}
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              Recent Activity
            </h4>
            {userCivicRatings.length === 0 && !userMLARating ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No activity yet. Start by{' '}
                <Link to={ROUTES.CIVIC_SENSE} style={{ color: 'var(--civic-primary)' }}>rating civic sense</Link> or{' '}
                <Link to={ROUTES.MLA_RATING} style={{ color: 'var(--mla-primary)' }}>rating your MLA</Link>.
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
                      <span>Rated civic sense of <strong>{c?.name || 'Unknown'}</strong> — {r.overallScore.toFixed(1)}/5</span>
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
                    <span>Rated MLA work — {userMLARating.overallScore.toFixed(1)}/5</span>
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
              <h2><Home size={20} /> My Constituency</h2>
              <DataBadge category="demo" />
            </div>

            <div className="card animate-fadeIn">
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                <h2 style={{ marginBottom: 'var(--space-1)' }}>{constituency.name}</h2>
                <p style={{ color: 'var(--text-tertiary)' }}>{district?.name} District</p>
              </div>

              <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
                {/* Civic Sense Section */}
                <div style={{ paddingRight: 'var(--space-4)' }}>
                  <h3 style={{ color: 'var(--civic-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={16} /> Civic Sense
                  </h3>
                  {civicDetail ? (
                    <div>
                      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 'var(--space-4)' }}>
                        <div className="stat-card" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="stat-value" style={{ color: 'var(--civic-primary)', fontSize: '1.25rem' }}>
                            {civicDetail.insideScore?.toFixed(1) || '—'}
                          </div>
                          <div className="stat-label">Local Rating</div>
                        </div>
                        <div className="stat-card" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="stat-value" style={{ color: 'var(--civic-primary-light)', fontSize: '1.25rem' }}>
                            {civicDetail.outsideScore?.toFixed(1) || '—'}
                          </div>
                          <div className="stat-label">Outside Rating</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {CIVIC_SENSE_CATEGORIES.slice(0, 4).map(cat => (
                          <ScoreBar key={cat.id} score={civicDetail.categoryScores?.[cat.id]} type="civic" label={cat.label} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
                  )}
                </div>

                {/* MLA Work Section — CLEARLY SEPARATED */}
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--space-8)' }}>
                  <h3 style={{ color: 'var(--mla-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCircle size={16} /> Current MLA
                  </h3>
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 600, color: 'var(--mla-primary-light)' }}>{mla?.name || 'Not Assigned'}</span>
                    {mla?.isDemo && <DataBadge category="demo" />}
                  </div>
                  {mlaDetail ? (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                          MLA WORK RATING
                        </p>
                        <ScoreDisplay score={mlaDetail.overallScore} type="mla" size="lg" />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                          {mlaDetail.totalRatings.toLocaleString()} ratings
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {MLA_WORK_CATEGORIES.slice(0, 4).map(cat => (
                          <ScoreBar key={cat.id} score={mlaDetail.categoryScores?.[cat.id]} type="mla" label={cat.label} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-8)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                Civic Sense and MLA Work ratings are completely independent measurements.
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
