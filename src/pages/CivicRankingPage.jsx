import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ScoreDisplay, DataBadge } from '../components/common/ScoreDisplay';
import { getCivicRankings } from '../services/civicSenseService';
import { getConstituencyById } from '../data/constituencies';
import { getDistrictById } from '../data/districts';
import { DISTRICTS } from '../data/districts';
import { ROUTES, VOTING_CONFIG } from '../config/constants';

export default function CivicRankingPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  useEffect(() => {
    getCivicRankings().then(data => {
      setRankings(data);
      setLoading(false);
    });
  }, []);

  const filtered = rankings.filter(r => {
    const c = getConstituencyById(r.constituencyId);
    if (!c) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (districtFilter && c.districtId !== districtFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-page page-content">
        <div className="spinner" />
        <p className="loading-text">Loading rankings...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-slideUp">
          <h1>
            <span className="text-gradient-civic">Civic Sense Rankings</span>
          </h1>
          <p className="subtitle">
            All 175 Andhra Pradesh Assembly Constituencies ranked by citizen-submitted civic sense ratings.
          </p>
          <div className="header-badges">
            <DataBadge category="demo" />
            <DataBadge category="calculated" />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Period: {VOTING_CONFIG.CURRENT_VOTING_PERIOD}
            </span>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
          These scores represent aggregated <strong>citizen perceptions of civic behaviour</strong> in each constituency. 
          They are NOT evaluations of elected representatives.{' '}
          <Link to={ROUTES.METHODOLOGY} style={{ fontWeight: 600 }}>Learn how scores are calculated →</Link>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 250, marginBottom: 0 }}>
            <Search size={16} className="search-icon" style={{ left: '12px' }} />
            <input
              type="text"
              placeholder="Search constituencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="ranking-search-input"
            />
          </div>
          <select
            className="form-select"
            style={{ maxWidth: 250 }}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            id="ranking-district-filter"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Stats bar */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>{filtered.length}</div>
            <div className="stat-label">Constituencies</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>
              {(filtered.reduce((a, r) => a + r.totalRatings, 0)).toLocaleString()}
            </div>
            <div className="stat-label">Total Ratings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>
              {filtered.length > 0
                ? (filtered.reduce((a, r) => a + r.overallScore, 0) / filtered.length).toFixed(2)
                : '—'}
            </div>
            <div className="stat-label">Avg Score</div>
          </div>
        </div>

        {/* Ranking List */}
        <div className="ranking-list">
          {filtered.map((ranking, index) => {
            const constituency = getConstituencyById(ranking.constituencyId);
            const district = constituency ? getDistrictById(constituency.districtId) : null;
            const rank = index + 1;

            return (
              <div
                key={ranking.constituencyId}
                className={`ranking-item animate-slideUp ${rank <= 3 ? 'top-3' : ''}`}
                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                <div className="rank-number">#{rank}</div>
                <div className="rank-info">
                  <h4>{constituency?.name || 'Unknown'}</h4>
                  <span className="rank-district">{district?.name || ''} District</span>
                </div>
                <div className="rank-score">
                  <ScoreDisplay score={ranking.overallScore} size="sm" type="civic" />
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
            <p>No constituencies match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
