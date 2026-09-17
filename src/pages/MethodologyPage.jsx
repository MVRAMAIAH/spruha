import { Link } from 'react-router-dom';
import { CIVIC_SENSE_CATEGORIES, MLA_WORK_CATEGORIES, VOTING_CONFIG, ROUTES } from '../config/constants';

export default function MethodologyPage() {
  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header animate-slideUp">
          <h1>How Scores Work</h1>
          <p className="subtitle">
            Complete transparency in how civic sense and MLA work ratings are calculated.
          </p>
        </div>

        {/* Civic Sense Methodology */}
        <div className="card civic-card animate-slideUp" style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ color: 'var(--civic-primary)', marginBottom: 'var(--space-6)' }}>
            <span className="section-icon civic"></span>
            Civic Sense Score
          </h2>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>What is rated?</h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Citizens evaluate the <strong>civic behaviour and responsibility of people in a constituency</strong>. 
            This is NOT an evaluation of the MLA or elected representatives.
          </p>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>Categories</h4>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            {CIVIC_SENSE_CATEGORIES.map(cat => (
              <div key={cat.id} style={{
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <strong style={{ fontSize: '0.875rem' }}>{cat.label}</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', maxWidth: '60%', textAlign: 'right' }}>{cat.description}</span>
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>Calculation</h4>
          <div style={{
            background: 'var(--bg-card)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
            fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)',
          }}>
            <p>Per-rating overall = mean(all category scores)</p>
            <p>Constituency overall = mean(all rating overalls)</p>
            <p>Inside perception = mean(ratings from residents)</p>
            <p>Outside perception = mean(ratings from non-residents)</p>
          </div>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>Who can rate?</h4>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Any verified user can rate any constituency (except their own in "Other" section)</li>
            <li>Users rate their own constituency in a separate section</li>
            <li>One rating per constituency per voting period</li>
          </ul>
        </div>

        {/* MLA Work Methodology */}
        <div className="card mla-card animate-slideUp" style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ color: 'var(--mla-primary)', marginBottom: 'var(--space-6)' }}>
            <span className="section-icon mla"></span>
            MLA Work Score
          </h2>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>What is rated?</h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Citizens evaluate the <strong>work of the MLA representing their constituency</strong>.
          </p>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>Categories</h4>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            {MLA_WORK_CATEGORIES.map(cat => (
              <div key={cat.id} style={{
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <strong style={{ fontSize: '0.875rem' }}>{cat.label}</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', maxWidth: '60%', textAlign: 'right' }}>{cat.description}</span>
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>Calculation</h4>
          <div style={{
            background: 'var(--bg-card)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
            fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)',
          }}>
            <p>Per-rating overall = mean(all category scores)</p>
            <p>MLA overall = mean(all rating overalls)</p>
            <p>Minimum ratings for ranking: {VOTING_CONFIG.MIN_RATINGS_FOR_RANKING}</p>
          </div>

          <h4 style={{ marginBottom: 'var(--space-3)' }}>Who can rate?</h4>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Only verified users can rate their own constituency's MLA</li>
            <li>Users CANNOT rate MLAs from other constituencies</li>
            <li>One rating per MLA per voting period</li>
            <li>Optional written comments (moderated)</li>
          </ul>
        </div>

        {/* Important Distinction */}
        <div className="alert alert-warning" style={{ marginBottom: 'var(--space-8)' }}>
          <strong>Important Distinction:</strong> Civic Sense and MLA Work are completely independent measurements. 
          A constituency can have a high civic sense score but a low MLA rating, or vice versa. 
          These are never combined into one "overall constituency score."
        </div>

        {/* Data Categories */}
        <div className="card animate-slideUp">
          <h3 style={{ marginBottom: 'var(--space-5)' }}>Data Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { badge: 'badge-demo', label: '⚠ Demo Data', desc: 'Temporary development data. Will be replaced with real data.' },
              { badge: 'badge-verified', label: '✓ Verified', desc: 'Information from authoritative/verified sources.' },
              { badge: 'badge-citizen', label: '● Citizen Ratings', desc: 'Ratings and perceptions submitted by verified users.' },
              { badge: 'badge-calculated', label: '◈ Calculated', desc: 'Scores derived from aggregating citizen submissions.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span className={`badge ${item.badge}`} style={{ minWidth: 120, justifyContent: 'center' }}>{item.label}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
