import { useState, useEffect } from 'react';
import { Activity, UserCircle } from 'lucide-react';
import { useAuth } from '../stores/authStore';
import { getCivicRankings } from '../services/civicSenseService';
import { getMLARankings } from '../services/mlaWorkService';
import { CONSTITUENCIES } from '../data/constituencies';
import { DISTRICTS } from '../data/districts';
import { MLAS } from '../data/mlas';
import { VOTING_CONFIG } from '../config/constants';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [civicRankings, setCivicRankings] = useState([]);
  const [mlaRankings, setMlaRankings] = useState([]);

  useEffect(() => {
    getCivicRankings().then(setCivicRankings);
    getMLARankings().then(setMlaRankings);
  }, []);

  const totalCivicRatings = civicRankings.reduce((a, r) => a + r.totalRatings, 0);
  const totalMLARatings = mlaRankings.reduce((a, r) => a + r.totalRatings, 0);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'locations', label: 'Locations' },
    { id: 'mlas', label: 'MLAs' },
    { id: 'voting', label: 'Voting' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-slideUp">
          <h1>Admin Panel</h1>
          <p className="subtitle">Platform management and analytics</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="animate-fadeIn">
            <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                  {CONSTITUENCIES.length}
                </div>
                <div className="stat-label">Constituencies</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                  {DISTRICTS.length}
                </div>
                <div className="stat-label">Districts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--civic-primary)' }}>
                  {totalCivicRatings.toLocaleString()}
                </div>
                <div className="stat-label">Civic Ratings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--mla-primary)' }}>
                  {totalMLARatings.toLocaleString()}
                </div>
                <div className="stat-label">MLA Ratings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                  {MLAS.length}
                </div>
                <div className="stat-label">MLAs</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent-warning)' }}>
                  {VOTING_CONFIG.CURRENT_VOTING_PERIOD}
                </div>
                <div className="stat-label">Active Period</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <h3 className="card-title" style={{ color: 'var(--civic-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} /> Civic Sense Overview
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {civicRankings.length} constituencies rated
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                  Avg score: {civicRankings.length > 0
                    ? (civicRankings.reduce((a, r) => a + r.overallScore, 0) / civicRankings.length).toFixed(2)
                    : '—'}/5
                </p>
              </div>
              <div className="card">
                <h3 className="card-title" style={{ color: 'var(--mla-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCircle size={18} /> MLA Work Overview
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {mlaRankings.filter(r => r.totalRatings >= VOTING_CONFIG.MIN_RATINGS_FOR_RANKING).length} MLAs with enough ratings
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                  Avg score: {mlaRankings.length > 0
                    ? (mlaRankings.reduce((a, r) => a + r.overallScore, 0) / mlaRankings.length).toFixed(2)
                    : '—'}/5
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div className="animate-fadeIn">
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Districts ({DISTRICTS.length})</h3>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {DISTRICTS.map((d, i) => (
                  <div key={d.id} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.875rem',
                  }}>
                    <span>{d.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {CONSTITUENCIES.filter(c => c.districtId === d.id).length} constituencies
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MLAs Tab */}
        {activeTab === 'mlas' && (
          <div className="animate-fadeIn">
            <div className="alert alert-warning" style={{ marginBottom: 'var(--space-4)' }}>
              MLA data is currently placeholder (demo data). Replace with verified data before production.
            </div>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
                MLA Records ({MLAS.length})
              </h3>
              <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                {MLAS.slice(0, 50).map(mla => (
                  <div key={mla.id} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.875rem',
                  }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{mla.name}</span>
                      {mla.isDemo && <span className="badge badge-demo" style={{ marginLeft: 8, fontSize: '0.5625rem' }}>DEMO</span>}
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{mla.party}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Voting Tab */}
        {activeTab === 'voting' && (
          <div className="animate-fadeIn">
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Voting Configuration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <ConfigRow label="Current Voting Period" value={VOTING_CONFIG.CURRENT_VOTING_PERIOD} />
                <ConfigRow label="Period Type" value={VOTING_CONFIG.VOTING_PERIOD_TYPE} />
                <ConfigRow label="Min Ratings for Ranking" value={VOTING_CONFIG.MIN_RATINGS_FOR_RANKING} />
                <ConfigRow label="Min Ratings for Display" value={VOTING_CONFIG.MIN_RATINGS_FOR_DISPLAY} />
              </div>
            </div>
            <div className="alert alert-info">
              In production, voting periods and configuration will be managed through this panel 
              with database-backed settings.
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="animate-fadeIn">
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Top Rated Constituencies (Civic Sense)</h3>
            <div className="ranking-list" style={{ marginBottom: 'var(--space-8)' }}>
              {civicRankings.slice(0, 10).map((r, i) => {
                const c = CONSTITUENCIES.find(c => c.id === r.constituencyId);
                return (
                  <div key={r.constituencyId} className="ranking-item">
                    <div className="rank-number">#{i + 1}</div>
                    <div className="rank-info">
                      <h4>{c?.name || 'Unknown'}</h4>
                      <span className="rank-meta">{r.totalRatings} ratings</span>
                    </div>
                    <div className="rank-score">
                      <span style={{ color: 'var(--civic-primary)', fontWeight: 700 }}>
                        {r.overallScore.toFixed(2)}
                      </span>/5
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ marginBottom: 'var(--space-6)' }}>Top Rated MLAs</h3>
            <div className="ranking-list">
              {mlaRankings.slice(0, 10).map((r, i) => {
                const mla = MLAS.find(m => m.id === r.mlaId);
                return (
                  <div key={r.mlaId} className="ranking-item">
                    <div className="rank-number">#{i + 1}</div>
                    <div className="rank-info">
                      <h4>{mla?.name || 'Unknown'}</h4>
                      <span className="rank-meta">{r.totalRatings} ratings</span>
                    </div>
                    <div className="rank-score">
                      <span style={{ color: 'var(--mla-primary)', fontWeight: 700 }}>
                        {r.overallScore.toFixed(2)}
                      </span>/5
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfigRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)',
    }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{String(value)}</span>
    </div>
  );
}
