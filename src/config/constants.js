/**
 * Application Constants & Configuration
 * 
 * Central configuration for the AP Civic Tracking Platform.
 * Values marked as CONFIGURABLE should be managed from the admin panel in production.
 */

// ── Civic Sense Categories ──────────────────────────────────────────
export const CIVIC_SENSE_CATEGORIES = [
  { id: 'cleanliness', label: 'Cleanliness', description: 'General cleanliness of public areas' },
  { id: 'waste_disposal', label: 'Waste Disposal', description: 'Proper waste management and disposal practices' },
  { id: 'traffic_discipline', label: 'Traffic Discipline', description: 'Adherence to traffic rules and road discipline' },
  { id: 'public_property', label: 'Respect for Public Property', description: 'Care and preservation of public infrastructure' },
  { id: 'environment', label: 'Environmental Responsibility', description: 'Environmental awareness and green practices' },
  { id: 'public_space', label: 'Public-Space Behaviour', description: 'Conduct in public places and shared spaces' },
  { id: 'community', label: 'Community Participation', description: 'Active involvement in community activities' },
];

// ── MLA Work Categories ─────────────────────────────────────────────
export const MLA_WORK_CATEGORIES = [
  { id: 'development', label: 'Constituency Development', description: 'Infrastructure and development projects initiated' },
  { id: 'accessibility', label: 'Accessibility', description: 'How easy is it to reach and meet the MLA' },
  { id: 'responsiveness', label: 'Responsiveness', description: 'Speed and quality of response to citizen issues' },
  { id: 'issue_resolution', label: 'Issue Resolution', description: 'Effectiveness in resolving constituency problems' },
  { id: 'visits', label: 'Constituency Visits/Engagement', description: 'Frequency and quality of constituency visits' },
  { id: 'communication', label: 'Public Communication', description: 'Transparency and clarity in public communication' },
  { id: 'followup', label: 'Follow-up on Development Works', description: 'Monitoring and completion of initiated projects' },
  { id: 'representation', label: 'Representation of Issues', description: 'Advocating constituency issues at the state level' },
];

// ── Rating Configuration ────────────────────────────────────────────
export const RATING_CONFIG = {
  MIN_STARS: 1,
  MAX_STARS: 5,
  STAR_LABELS: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'],
};

// ── Voting Configuration (CONFIGURABLE from admin panel) ────────────
export const VOTING_CONFIG = {
  MIN_RATINGS_FOR_RANKING: 100,        // Minimum ratings before appearing in ranking
  MIN_RATINGS_FOR_DISPLAY: 10,         // Minimum ratings to show score publicly
  CURRENT_VOTING_PERIOD: '2026-Q3',    // Active voting period
  VOTING_PERIOD_TYPE: 'quarterly',     // quarterly | monthly | custom
};

// ── Comment Configuration ───────────────────────────────────────────
export const COMMENT_CONFIG = {
  MAX_LENGTH: 500,
  MIN_LENGTH: 10,
  PROFANITY_WORDS: [
    // Basic profanity filter - production should use a comprehensive library
    'spam', 'abuse', 'fake',
  ],
};

// ── Data Categories ─────────────────────────────────────────────────
export const DATA_CATEGORIES = {
  DEMO: { label: 'Demo Data', color: '#F59E0B', description: 'Temporary development data' },
  VERIFIED: { label: 'Verified', color: '#10B981', description: 'From authoritative sources' },
  CITIZEN: { label: 'Citizen Ratings', color: '#3B82F6', description: 'User-submitted ratings' },
  CALCULATED: { label: 'Calculated', color: '#6B7280', description: 'Derived from citizen data' },
};

// ── App Metadata ────────────────────────────────────────────────────
export const APP_META = {
  NAME: 'Spruha',
  VERSION: '1.0.0',
  DESCRIPTION: 'A neutral, data-driven platform where citizens evaluate civic responsibility and MLA work across all 175 Andhra Pradesh constituencies.',
};

// ── Routes ──────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE_SETUP: '/profile-setup',
  CIVIC_SENSE: '/civic-sense',
  CIVIC_RANKINGS: '/civic-sense/rankings',
  MLA_RATING: '/mla-rating',
  MLA_RANKINGS: '/mla-rating/rankings',
  DASHBOARD: '/dashboard',
  CONSTITUENCY: '/constituency',
  METHODOLOGY: '/methodology',
  ABOUT: '/about',
  ADMIN: '/admin',
};

// ── User Roles ──────────────────────────────────────────────────────
export const ROLES = {
  CITIZEN: 'citizen',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};
