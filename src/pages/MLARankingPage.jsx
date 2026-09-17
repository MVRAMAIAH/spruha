import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ScoreDisplay, DataBadge } from '../components/common/ScoreDisplay';
import { getMLARankings } from '../services/mlaWorkService';
import { getMLAById } from '../data/mlas';
import { getConstituencyById } from '../data/constituencies';
import { getDistrictById, DISTRICTS } from '../data/districts';
import { ROUTES, VOTING_CONFIG } from '../config/constants';

export default function MLARankingPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  useEffect(() => {
    getMLARankings().then(data => {
      setRankings(data);
      setLoading(false);
    });
  }, []);

  const filtered = rankings.filter(r => {
    const mla = getMLAById(r.mlaId);
    const c = mla ? getConstituencyById(mla.constituencyId) : null;
    if (!mla || !c) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!mla.name.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q)) return false;
    }
    if (districtFilter && c.districtId !== districtFilter) return false;
    return true;
  });

  const minRatings = VOTING_CONFIG.MIN_RATINGS_FOR_RANKING;

  if (loading) {
    return (
      <div className="loading-page page-content">
        <div className="spinner" />
        <p className="loading-text">Loading MLA rankings...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-slideUp">
          <h1>
            <span className="text-gradient-mla">Citizen Rating of MLA Work</span>
          </h1>
          <p className="subtitle">
            Aggregated citizen-submitted assessments of MLA work across Andhra Pradesh constituencies.
          </p>
          <div className="header-badges">
            <DataBadge category="demo" />
            <DataBadge category="calculated" />
          </div>
        </div>

        <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)' }}>
          These scores represent aggregated <strong>citizen-submitted ratings</strong> and should not be interpreted 
          as an independent audit of MLA performance. Minimum {minRatings} ratings required for ranking.{' '}
          <Link to={ROUTES.METHODOLOGY} style={{ fontWeight: 600 }}>Learn how scores work →</Link>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 250, marginBottom: 0 }}>
            <Search size={16} className="search-icon" style={{ left: '12px' }} />
            <input
              type="text"
              placeholder="Search MLA or constituency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="mla-ranking-search"
            />
          </div>
          <select
            className="form-select"
            style={{ maxWidth: 250 }}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            id="mla-ranking-district-filter"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--mla-primary)' }}>{filtered.length}</div>
            <div className="stat-label">MLAs Rated</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--mla-primary)' }}>
              {filtered.reduce((a, r) => a + r.totalRatings, 0).toLocaleString()}
            </div>
            <div className="stat-label">Total Ratings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--mla-primary)' }}>
              {filtered.filter(r => r.totalRatings >= minRatings).length}
            </div>
            <div className="stat-label">Ranked (≥{minRatings} ratings)</div>
          </div>
        </div>

        {/* Ranking List */}
        <div className="ranking-list">
          {filtered.map((ranking, index) => {
            const mla = getMLAById(ranking.mlaId);
            const constituency = mla ? getConstituencyById(mla.constituencyId) : null;
            const district = constituency ? getDistrictById(constituency.districtId) : null;
            const rank = index + 1;
            const hasEnoughRatings = ranking.totalRatings >= minRatings;

            return (
              <div
                key={ranking.mlaId}
                className={`ranking-item animate-slideUp ${rank <= 3 && hasEnoughRatings ? 'top-3' : ''}`}
                style={{
                  animationDelay: `${Math.min(index * 30, 300)}ms`,
                  opacity: hasEnoughRatings ? 1 : 0.6,
                }}
              >
                <div className="rank-number">
                  {hasEnoughRatings ? `#${rank}` : '—'}
                </div>
                <div className="rank-info">
                  <h4>{mla?.name || 'Unknown MLA'}</h4>
                  <span className="rank-district">
                    {constituency?.name || ''} · {district?.name || ''} District
                  </span>
                  {!hasEnoughRatings && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{
                        fontSize: '0.6875rem',
                        color: 'var(--accent-warning)',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}>
                        Not enough ratings for ranking ({ranking.totalRatings}/{minRatings})
                      </span>
                    </div>
                  )}
                </div>
                <div className="rank-score">
                  <ScoreDisplay score={ranking.overallScore} size="sm" type="mla" />
                  <div className="rank-meta">
                    {ranking.totalRatings.toLocaleString()} ratings
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon" style={{ marginBottom: '16px', color: 'var(--text-tertiary)' }}><Search size={32} /></div>
            <h3>No Results</h3>
            <p>No MLAs match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
