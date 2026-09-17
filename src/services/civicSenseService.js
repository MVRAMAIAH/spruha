/**
 * Civic Sense Rating Service
 * 
 * MVP: Uses localStorage + demo data
 * Production: Will call /api/civic/* endpoints
 * 
 * COMPLETELY SEPARATE from MLA Work Service.
 */

import { DEMO_CIVIC_SCORES } from '../data/demoData';
import { CIVIC_SENSE_CATEGORIES, VOTING_CONFIG } from '../config/constants';

const CIVIC_RATINGS_KEY = 'ap_civic_ratings';

const getRatings = () => {
  try {
    return JSON.parse(localStorage.getItem(CIVIC_RATINGS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRatings = (ratings) => {
  localStorage.setItem(CIVIC_RATINGS_KEY, JSON.stringify(ratings));
};

/**
 * Submit a civic sense rating for a constituency
 * 
 * Rules enforced:
 * - User must be verified
 * - One rating per constituency per voting period
 * - Category scores must be 1-5
 */
export const submitCivicRating = async (userId, userConstituencyId, constituencyId, categoryScores) => {
  const ratings = getRatings();

  // Validate: prevent duplicate in same voting period
  const existing = ratings.find(
    r => r.userId === userId &&
      r.constituencyId === constituencyId &&
      r.votingPeriod === VOTING_CONFIG.CURRENT_VOTING_PERIOD
  );

  if (existing) {
    throw new Error('You have already rated this constituency during the current voting period.');
  }

  // Validate category scores
  for (const cat of CIVIC_SENSE_CATEGORIES) {
    const score = categoryScores[cat.id];
    if (!score || score < 1 || score > 5) {
      throw new Error(`Invalid score for ${cat.label}. Must be between 1 and 5.`);
    }
  }

  // Calculate overall score
  const scores = Object.values(categoryScores);
  const overallScore = parseFloat(
    (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
  );

  const rating = {
    id: `civic-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    userId,
    constituencyId,
    isOwnConstituency: constituencyId === userConstituencyId,
    categoryScores,
    overallScore,
    votingPeriod: VOTING_CONFIG.CURRENT_VOTING_PERIOD,
    createdAt: new Date().toISOString(),
  };

  ratings.push(rating);
  saveRatings(ratings);

  return rating;
};

/**
 * Get aggregated civic sense scores for all constituencies
 * Merges demo data with user-submitted data
 */
export const getCivicRankings = async () => {
  const userRatings = getRatings();
  const demoScores = [...DEMO_CIVIC_SCORES];

  // Merge user ratings into demo scores
  const scoreMap = {};
  demoScores.forEach(score => {
    scoreMap[score.constituencyId] = { ...score };
  });

  // Group user ratings by constituency
  const userRatingsByConstituency = {};
  userRatings.forEach(r => {
    if (!userRatingsByConstituency[r.constituencyId]) {
      userRatingsByConstituency[r.constituencyId] = [];
    }
    userRatingsByConstituency[r.constituencyId].push(r);
  });

  // Update scores with user ratings
  Object.keys(userRatingsByConstituency).forEach(cId => {
    const ratings = userRatingsByConstituency[cId];
    if (scoreMap[cId]) {
      scoreMap[cId].totalRatings += ratings.length;
      // Recalculate as weighted average
      const demoWeight = scoreMap[cId].totalRatings - ratings.length;
      const userAvg = ratings.reduce((a, r) => a + r.overallScore, 0) / ratings.length;
      scoreMap[cId].overallScore = parseFloat(
        ((scoreMap[cId].overallScore * demoWeight + userAvg * ratings.length) / scoreMap[cId].totalRatings).toFixed(2)
      );
    }
  });

  return Object.values(scoreMap).sort((a, b) => b.overallScore - a.overallScore);
};

/**
 * Get civic sense detail for a single constituency
 */
export const getConstituencyCivicDetail = async (constituencyId) => {
  const rankings = await getCivicRankings();
  return rankings.find(r => r.constituencyId === constituencyId) || null;
};

/**
 * Get user's submitted civic ratings
 */
export const getUserCivicRatings = async (userId) => {
  const ratings = getRatings();
  return ratings.filter(r => r.userId === userId);
};

/**
 * Check if user has already rated a constituency this period
 */
export const hasRatedConstituency = async (userId, constituencyId) => {
  const ratings = getRatings();
  return ratings.some(
    r => r.userId === userId &&
      r.constituencyId === constituencyId &&
      r.votingPeriod === VOTING_CONFIG.CURRENT_VOTING_PERIOD
  );
};

export default {
  submitCivicRating,
  getCivicRankings,
  getConstituencyCivicDetail,
  getUserCivicRatings,
  hasRatedConstituency,
};
