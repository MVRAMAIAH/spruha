import { AlertTriangle, CheckCircle2, Users, Calculator } from 'lucide-react';

export function ScoreDisplay({ score, size = 'md', type = 'civic' }) {
  const color = type === 'civic' ? 'var(--civic-primary)' : 'var(--mla-primary)';
  
  return (
    <div className={`score-badge ${size}`}>
      <span className="score-value" style={{ color }}>
        {typeof score === 'number' ? score.toFixed(1) : '—'}
      </span>
      <span className="score-max">/5</span>
    </div>
  );
}

export function ScoreBar({ score, type = 'civic', label }) {
  const percent = score ? (score / 5) * 100 : 0;
  
  return (
    <div style={{ marginBottom: 'var(--space-2)' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '2px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{score ? score.toFixed(1) : '—'}</span>
        </div>
      )}
      <div className="score-bar">
        <div className={`score-bar-fill ${type}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function DataBadge({ category }) {
  const classMap = {
    demo: 'badge-demo',
    verified: 'badge-verified',
    citizen: 'badge-citizen',
    calculated: 'badge-calculated',
  };
  
  const labelMap = {
    demo: { label: 'Demo Data', icon: <AlertTriangle size={12} /> },
    verified: { label: 'Verified', icon: <CheckCircle2 size={12} /> },
    citizen: { label: 'Citizen Ratings', icon: <Users size={12} /> },
    calculated: { label: 'Calculated', icon: <Calculator size={12} /> },
  };

  const { label, icon } = labelMap[category] || { label: category, icon: null };
  
  return (
    <span className={`badge ${classMap[category] || 'badge-demo'}`}>
      {icon} {label}
    </span>
  );
}
