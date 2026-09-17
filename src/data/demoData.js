/**
 * Demo Data Generator
 * 
 * DATA CATEGORY: DEMO
 * Generates realistic mock data for development.
 * All demo data is clearly flagged with isDemo: true.
 * This data will be replaced by actual database data in production.
 */

import { CONSTITUENCIES } from './constituencies';
import { CIVIC_SENSE_CATEGORIES, MLA_WORK_CATEGORIES } from '../config/constants';

// Deterministic pseudo-random based on seed string
const seededRandom = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs((Math.sin(hash) * 10000) % 1);
};

const randomBetween = (min, max, seed) => {
  return min + seededRandom(seed) * (max - min);
};

const randomInt = (min, max, seed) => {
  return Math.floor(randomBetween(min, max + 1, seed));
};

/**
 * Generate demo civic sense scores for all constituencies
 */
export const generateDemoCivicScores = () => {
  return CONSTITUENCIES.map((constituency) => {
    const categoryScores = {};
    let totalScore = 0;

    CIVIC_SENSE_CATEGORIES.forEach((cat) => {
      const score = parseFloat(
        randomBetween(2.0, 4.8, `civic-${constituency.id}-${cat.id}`).toFixed(2)
      );
      categoryScores[cat.id] = score;
      totalScore += score;
    });

    const overallScore = parseFloat(
      (totalScore / CIVIC_SENSE_CATEGORIES.length).toFixed(2)
    );

    const totalRatings = randomInt(50, 5000, `civic-count-${constituency.id}`);
    const insideRatings = randomInt(10, Math.floor(totalRatings * 0.4), `civic-inside-${constituency.id}`);
    const outsideRatings = totalRatings - insideRatings;

    const insideScore = parseFloat(
      randomBetween(overallScore - 0.5, overallScore + 0.5, `civic-inside-score-${constituency.id}`).toFixed(2)
    );
    const outsideScore = parseFloat(
      randomBetween(overallScore - 0.5, overallScore + 0.5, `civic-outside-score-${constituency.id}`).toFixed(2)
    );

    return {
      constituencyId: constituency.id,
      overallScore: Math.min(5, Math.max(1, overallScore)),
      categoryScores,
      totalRatings,
      insideRatings,
      outsideRatings,
      insideScore: Math.min(5, Math.max(1, insideScore)),
      outsideScore: Math.min(5, Math.max(1, outsideScore)),
      lastUpdated: '2026-09-15T10:30:00Z',
      votingPeriod: '2026-Q3',
      isDemo: true,
    };
  });
};

/**
 * Generate demo MLA work scores
 */
export const generateDemoMLAScores = () => {
  return CONSTITUENCIES.map((constituency, index) => {
    const categoryScores = {};
    let totalScore = 0;

    MLA_WORK_CATEGORIES.forEach((cat) => {
      const score = parseFloat(
        randomBetween(1.5, 4.9, `mla-${constituency.id}-${cat.id}`).toFixed(2)
      );
      categoryScores[cat.id] = score;
      totalScore += score;
    });

    const overallScore = parseFloat(
      (totalScore / MLA_WORK_CATEGORIES.length).toFixed(2)
    );

    const totalRatings = randomInt(20, 4000, `mla-count-${constituency.id}`);

    return {
      mlaId: `mla-${String(index + 1).padStart(3, '0')}`,
      constituencyId: constituency.id,
      overallScore: Math.min(5, Math.max(1, overallScore)),
      categoryScores,
      totalRatings,
      lastUpdated: '2026-09-14T14:00:00Z',
      votingPeriod: '2026-Q3',
      isDemo: true,
    };
  });
};

/**
 * Generate demo comments for MLA ratings
 */
export const generateDemoComments = () => {
  const templates = [
    'The MLA has been actively working on road improvements in our area.',
    'Need more engagement with local communities and regular visits.',
    'Good progress on water supply projects but communication could improve.',
    'Responsive to citizen grievances and accessible during office hours.',
    'Infrastructure development has been promising this quarter.',
    'Would like to see more transparency in fund allocation.',
    'Community events organized regularly which helps local engagement.',
    'Drainage issues remain unresolved despite multiple requests.',
  ];

  return CONSTITUENCIES.slice(0, 30).map((constituency, index) => ({
    id: `comment-${String(index + 1).padStart(3, '0')}`,
    mlaId: `mla-${String(index + 1).padStart(3, '0')}`,
    userId: `demo-user-${randomInt(1, 100, `comment-user-${index}`)}`,
    text: templates[index % templates.length],
    createdAt: new Date(2026, 8, randomInt(1, 15, `comment-date-${index}`)).toISOString(),
    status: 'approved',
    isDemo: true,
  }));
};

// Pre-generate demo data
export const DEMO_CIVIC_SCORES = generateDemoCivicScores();
export const DEMO_MLA_SCORES = generateDemoMLAScores();
export const DEMO_COMMENTS = generateDemoComments();
