import { Link } from 'react-router-dom';
import { Shield, Target, Lock, Database, ArrowRight, UserPlus, MapPin, Star, BarChart3, Users, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/authStore';
import { ROUTES, APP_META } from '../config/constants';

export default function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-content" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-20))' }}>
      <div className="container">
        {/* Hero Section */}
        <section style={{ maxWidth: 800, marginBottom: 'var(--space-20)' }} className="animate-fadeIn">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
            fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)',
          }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>V{APP_META.VERSION}</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-strong)' }}></span>
            Platform for Andhra Pradesh
          </div>

          <h1 style={{ marginBottom: 'var(--space-6)' }}>
            Empowering Citizens Through
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Transparent Civic Data.</span>
          </h1>

          <p style={{
            fontSize: '1.25rem', color: 'var(--text-secondary)',
            marginBottom: 'var(--space-8)',
            lineHeight: 1.6, maxWidth: 640
          }}>
            A neutral, data-driven platform where citizens evaluate civic responsibility 
            and MLA work across all 175 Andhra Pradesh constituencies.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link to={isAuthenticated ? ROUTES.CIVIC_SENSE : ROUTES.AUTH} className="btn btn-primary btn-lg">
              Rate Civic Sense
            </Link>
            <Link to={isAuthenticated ? ROUTES.MLA_RATING : ROUTES.AUTH} className="btn btn-outline btn-lg">
              Rate Your MLA <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Two Systems Explanation */}
        <section style={{ marginBottom: 'var(--space-20)' }}>
          <h2 style={{ marginBottom: 'var(--space-8)' }}>
            Two Independent Evaluation Systems
          </h2>
          <div className="grid-2">
            {/* Civic Sense Card */}
            <div className="card card-hover animate-fadeIn" style={{ borderTop: '2px solid var(--civic-primary)' }}>
              <div style={{
                width: 48, height: 48,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--civic-primary)', marginBottom: 'var(--space-5)',
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--civic-primary)' }}>
                Civic Sense Rating
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
                Evaluate the civic behaviour and responsibility of <strong>people and communities</strong> in 
                different constituencies. This is not an evaluation of elected officials.
              </p>
              <ul style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--civic-primary)' }}/> Rate cleanliness, traffic discipline, and more</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--civic-primary)' }}/> Evaluate any constituency in AP</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--civic-primary)' }}/> Differentiates local vs outside perception</li>
              </ul>
              <Link to={ROUTES.CIVIC_SENSE} className="btn btn-outline" style={{ marginTop: 'var(--space-6)', width: '100%' }}>
                Explore Civic Sense
              </Link>
            </div>

            {/* MLA Work Card */}
            <div className="card card-hover animate-fadeIn" style={{ borderTop: '2px solid var(--mla-primary)', animationDelay: '100ms' }}>
              <div style={{
                width: 48, height: 48,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--mla-primary)', marginBottom: 'var(--space-5)',
              }}>
                <UserCircle size={24} />
              </div>
              <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--mla-primary)' }}>
                MLA Work Rating
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
                Assess the work of <strong>your constituency's MLA</strong>. You can only rate 
                the representative officially assigned to your registered home constituency.
              </p>
              <ul style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--mla-primary)' }}/> Rate accessibility, responsiveness, and development</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--mla-primary)' }}/> Strictly locked to your verified location</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--mla-primary)' }}/> Minimum sample sizes required for public ranking</li>
              </ul>
              <Link to={ROUTES.MLA_RATING} className="btn btn-outline" style={{ marginTop: 'var(--space-6)', width: '100%' }}>
                Rate Your MLA
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ marginBottom: 'var(--space-20)' }}>
          <h2 style={{ marginBottom: 'var(--space-8)' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              { icon: UserPlus, title: 'Register', desc: 'Create a secure account and verify your identity.' },
              { icon: MapPin, title: 'Set Location', desc: 'Lock in your district and assembly constituency.' },
              { icon: Star, title: 'Evaluate', desc: 'Provide ratings in two distinct frameworks.' },
              { icon: BarChart3, title: 'Analyze', desc: 'View transparent, aggregated ranking data.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="card animate-fadeIn" style={{ animationDelay: `${i * 100}ms`, border: 'none', background: 'transparent', padding: '0' }}>
                  <div style={{ 
                    width: 40, height: 40, 
                    borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 'var(--space-4)', color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <Icon size={20} />
                  </div>
                  <h4 style={{ marginBottom: 'var(--space-2)' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key Principles */}
        <section style={{ marginBottom: 'var(--space-20)' }}>
          <div className="card" style={{ padding: 'var(--space-10)', background: 'var(--bg-secondary)' }}>
            <h2 style={{ marginBottom: 'var(--space-8)' }}>Platform Principles</h2>
            <div className="grid-2">
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Lock size={24} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ marginBottom: 'var(--space-1)' }}>Privacy-First</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Individual ratings are securely aggregated. Personal data is never publicly exposed.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Target size={24} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ marginBottom: 'var(--space-1)' }}>Neutral & Unbiased</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Not affiliated with any political organization. Purely driven by citizen perception.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Database size={24} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ marginBottom: 'var(--space-1)' }}>Data Transparent</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Methodology and data categorizations (Demo vs Calculated) are fully disclosed.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Shield size={24} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ marginBottom: 'var(--space-1)' }}>Anti-Manipulation</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Strict rules limit ratings to 1 per period per user, with geo-restrictions on MLA voting.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        {!isAuthenticated && (
          <section style={{ marginBottom: 'var(--space-12)' }}>
            <div className="card" style={{ 
              padding: 'var(--space-12)', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              border: '1px solid var(--border-strong)'
            }}>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Participate?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', maxWidth: 500 }}>
                Join thousands of citizens in building a transparent civic data ecosystem for Andhra Pradesh.
              </p>
              <Link to={ROUTES.AUTH} className="btn btn-primary btn-lg">
                Create Free Account <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
