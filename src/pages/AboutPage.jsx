import { Link } from 'react-router-dom';
import { ROUTES, APP_META } from '../config/constants';

export default function AboutPage() {
  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header animate-slideUp">
          <h1>About {APP_META.NAME}</h1>
          <p className="subtitle">{APP_META.DESCRIPTION}</p>
        </div>

        <div className="card animate-slideUp" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
            {APP_META.NAME} is a neutral, data-driven platform that empowers citizens of 
            Andhra Pradesh to participate in two separate civic evaluation systems: evaluating 
            the civic responsibility of communities and assessing the work of their elected MLAs.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            We believe in transparency, privacy, and data integrity. This platform does not 
            represent any political party, government body, or official agency. All ratings are 
            citizen-submitted perceptions.
          </p>
        </div>

        <div className="card animate-slideUp" style={{ marginBottom: 'var(--space-6)', animationDelay: '100ms' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>What This Platform Is NOT</h3>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', lineHeight: 1.7 }}>
            <li>Not a voting platform for elections</li>
            <li>Not affiliated with any political party</li>
            <li>Not an official government system</li>
            <li>Not an independent audit of MLA performance</li>
            <li>Not a platform for political campaigning</li>
          </ul>
        </div>

        <div className="card animate-slideUp" style={{ marginBottom: 'var(--space-6)', animationDelay: '200ms' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Privacy & Security</h3>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', lineHeight: 1.7 }}>
            <li>Individual ratings are never publicly exposed</li>
            <li>Only aggregated results are displayed</li>
            <li>Email and mobile numbers are never shared</li>
            <li>Duplicate vote prevention ensures data integrity</li>
            <li>All comments are moderated before publication</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <Link to={ROUTES.METHODOLOGY} className="btn btn-outline btn-lg">
            View Full Methodology →
          </Link>
        </div>
      </div>
    </div>
  );
}
