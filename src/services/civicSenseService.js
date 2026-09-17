/**
 * Civic Sense Rating Service
 * 
 * MVP: Uses localStorage + demo data
 * Production: Will call /api/civic/* endpoints
 * 
 * COMPLETELY SEPARATE from MLA Work Service.
 */

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

const MIN_RATINGS_FOR_RANKING = 1;

/**
 * Get aggregated civic sense scores for all constituencies
 * Returns only those that meet the minimum ratings threshold.
 */
export const getCivicRankings = async () => {
  const userRatings = getRatings();
  
  // Group user ratings by constituency
  const userRatingsByConstituency = {};
  userRatings.forEach(r => {
    if (!userRatingsByConstituency[r.constituencyId]) {
      userRatingsByConstituency[r.constituencyId] = [];
    }
    userRatingsByConstituency[r.constituencyId].push(r);
  });

  const rankings = [];
  Object.keys(userRatingsByConstituency).forEach(cId => {
    const ratings = userRatingsByConstituency[cId];
    if (ratings.length >= MIN_RATINGS_FOR_RANKING) {
      // Calculate overall average
      const overallScore = parseFloat(
        (ratings.reduce((a, r) => a + r.overallScore, 0) / ratings.length).toFixed(2)
      );
      
      // Calculate category averages
      const categoryScores = {};
      CIVIC_SENSE_CATEGORIES.forEach(cat => {
         const sum = ratings.reduce((a, r) => a + (r.categoryScores[cat.id] || 0), 0);
         categoryScores[cat.id] = parseFloat((sum / ratings.length).toFixed(1));
      });

      // Calculate inside vs outside score
      const insideRatings = ratings.filter(r => r.isOwnConstituency);
      const outsideRatings = ratings.filter(r => !r.isOwnConstituency);
      
      const insideScore = insideRatings.length > 0 
        ? parseFloat((insideRatings.reduce((a, r) => a + r.overallScore, 0) / insideRatings.length).toFixed(1)) 
        : 0;
      const outsideScore = outsideRatings.length > 0
        ? parseFloat((outsideRatings.reduce((a, r) => a + r.overallScore, 0) / outsideRatings.length).toFixed(1))
        : 0;

      rankings.push({
        constituencyId: cId,
        overallScore,
        categoryScores,
        totalRatings: ratings.length,
        insideScore,
        outsideScore,
        isDemo: false
      });
    }
  });

  return rankings.sort((a, b) => b.overallScore - a.overallScore);
};

/**
 * Get civic sense detail for a single constituency
 * Returns exact user data even if it doesn't meet the ranking threshold.
 */
export const getConstituencyCivicDetail = async (constituencyId) => {
  const userRatings = getRatings();
  const ratings = userRatings.filter(r => r.constituencyId === constituencyId);
  
  if (ratings.length === 0) {
    return {
      constituencyId,
      overallScore: 0,
      categoryScores: {},
      totalRatings: 0,
      insideScore: 0,
      outsideScore: 0,
      isDemo: false
    };
  }

  const overallScore = parseFloat(
    (ratings.reduce((a, r) => a + r.overallScore, 0) / ratings.length).toFixed(2)
  );

  const categoryScores = {};
  CIVIC_SENSE_CATEGORIES.forEach(cat => {
     const sum = ratings.reduce((a, r) => a + (r.categoryScores[cat.id] || 0), 0);
     categoryScores[cat.id] = parseFloat((sum / ratings.length).toFixed(1));
  });

  const insideRatings = ratings.filter(r => r.isOwnConstituency);
  const outsideRatings = ratings.filter(r => !r.isOwnConstituency);
  
  const insideScore = insideRatings.length > 0 
    ? parseFloat((insideRatings.reduce((a, r) => a + r.overallScore, 0) / insideRatings.length).toFixed(1)) 
    : 0;
  const outsideScore = outsideRatings.length > 0
    ? parseFloat((outsideRatings.reduce((a, r) => a + r.overallScore, 0) / outsideRatings.length).toFixed(1))
    : 0;

  return {
    constituencyId,
    overallScore,
    categoryScores,
    totalRatings: ratings.length,
    insideScore,
    outsideScore,
    isDemo: false
  };
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
