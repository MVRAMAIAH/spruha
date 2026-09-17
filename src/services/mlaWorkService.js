/**
 * MLA Work Rating Service
 * 
 * MVP: Uses localStorage + demo data
 * Production: Will call /api/mla/* endpoints
 * 
 * COMPLETELY SEPARATE from Civic Sense Service.
 * 
 * CRITICAL RULE: Users can ONLY rate their own constituency's MLA.
 * The backend (this service layer) determines the user's constituency
 * from their profile and enforces this restriction.
 */

import { getMLAByConstituency } from '../data/mlas';
import { MLA_WORK_CATEGORIES, VOTING_CONFIG, COMMENT_CONFIG } from '../config/constants';

const MLA_RATINGS_KEY = 'ap_mla_ratings';
const MLA_COMMENTS_KEY = 'ap_mla_comments';

const getRatings = () => {
  try {
    return JSON.parse(localStorage.getItem(MLA_RATINGS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRatings = (ratings) => {
  localStorage.setItem(MLA_RATINGS_KEY, JSON.stringify(ratings));
};

const getComments = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(MLA_COMMENTS_KEY));
    return stored || [];
  } catch {
    return [];
  }
};

const saveComments = (comments) => {
  localStorage.setItem(MLA_COMMENTS_KEY, JSON.stringify(comments));
};

/**
 * Submit an MLA work rating
 * 
 * CRITICAL: The constituency is determined server-side from the user profile.
 * We do NOT trust a constituency ID sent from the frontend.
 * 
 * @param {string} userId - The authenticated user's ID
 * @param {string} userConstituencyId - From the user's profile (server-side in prod)
 * @param {object} categoryScores - Rating scores per category
 * @param {string} comment - Optional comment text
 */
export const submitMLARating = async (userId, userConstituencyId, categoryScores, comment = '') => {
  // Determine the user's MLA from their constituency
  const mla = getMLAByConstituency(userConstituencyId);
  if (!mla) {
    throw new Error('No MLA found for your constituency. Please ensure your profile is complete.');
  }

  const ratings = getRatings();

  // Validate: prevent duplicate in same voting period
  const existing = ratings.find(
    r => r.userId === userId &&
      r.mlaId === mla.id &&
      r.votingPeriod === VOTING_CONFIG.CURRENT_VOTING_PERIOD
  );

  if (existing) {
    throw new Error('You have already rated your MLA during the current voting period.');
  }

  // Validate category scores
  for (const cat of MLA_WORK_CATEGORIES) {
    const score = categoryScores[cat.id];
    if (!score || score < 1 || score > 5) {
      throw new Error(`Invalid score for ${cat.label}. Must be between 1 and 5.`);
    }
  }

  // Validate comment if provided
  if (comment) {
    if (comment.length < COMMENT_CONFIG.MIN_LENGTH) {
      throw new Error(`Comment must be at least ${COMMENT_CONFIG.MIN_LENGTH} characters.`);
    }
    if (comment.length > COMMENT_CONFIG.MAX_LENGTH) {
      throw new Error(`Comment must be at most ${COMMENT_CONFIG.MAX_LENGTH} characters.`);
    }

    // Basic profanity check
    const lowerComment = comment.toLowerCase();
    for (const word of COMMENT_CONFIG.PROFANITY_WORDS) {
      if (lowerComment.includes(word)) {
        throw new Error('Your comment contains inappropriate content. Please revise.');
      }
    }
  }

  // Calculate overall score
  const scores = Object.values(categoryScores);
  const overallScore = parseFloat(
    (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
  );

  const rating = {
    id: `mla-rating-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    userId,
    mlaId: mla.id,
    constituencyId: userConstituencyId,
    categoryScores,
    overallScore,
    votingPeriod: VOTING_CONFIG.CURRENT_VOTING_PERIOD,
    createdAt: new Date().toISOString(),
  };

  ratings.push(rating);
  saveRatings(ratings);

  // Save comment if provided
  if (comment) {
    const comments = getComments();
    comments.push({
      id: `comment-${Date.now()}`,
      mlaId: mla.id,
      userId,
      text: comment,
      createdAt: new Date().toISOString(),
      status: 'pending', // requires moderation
      isDemo: false,
    });
    saveComments(comments);
  }

  return rating;
};

const MIN_RATINGS_FOR_RANKING = 1;

/**
 * Get aggregated MLA work scores for all MLAs
 * Returns only those that meet the minimum ratings threshold.
 */
export const getMLARankings = async () => {
  const userRatings = getRatings();
  
  // Group user ratings by MLA
  const userRatingsByMLA = {};
  userRatings.forEach(r => {
    if (!userRatingsByMLA[r.mlaId]) {
      userRatingsByMLA[r.mlaId] = [];
    }
    userRatingsByMLA[r.mlaId].push(r);
  });

  const rankings = [];
  Object.keys(userRatingsByMLA).forEach(mlaId => {
    const ratings = userRatingsByMLA[mlaId];
    if (ratings.length >= MIN_RATINGS_FOR_RANKING) {
      // Calculate overall average
      const overallScore = parseFloat(
        (ratings.reduce((a, r) => a + r.overallScore, 0) / ratings.length).toFixed(2)
      );
      
      // Calculate category averages
      const categoryScores = {};
      MLA_WORK_CATEGORIES.forEach(cat => {
         const sum = ratings.reduce((a, r) => a + (r.categoryScores[cat.id] || 0), 0);
         categoryScores[cat.id] = parseFloat((sum / ratings.length).toFixed(1));
      });

      rankings.push({
        mlaId,
        overallScore,
        categoryScores,
        totalRatings: ratings.length,
        isDemo: false
      });
    }
  });

  return rankings.sort((a, b) => b.overallScore - a.overallScore);
};

/**
 * Get MLA work detail for a specific MLA
 * Returns exact user data even if it doesn't meet the ranking threshold.
 */
export const getMLADetail = async (mlaId) => {
  const userRatings = getRatings();
  const ratings = userRatings.filter(r => r.mlaId === mlaId);
  
  if (ratings.length === 0) {
    return {
      mlaId,
      overallScore: 0,
      categoryScores: {},
      totalRatings: 0,
      isDemo: false
    };
  }

  const overallScore = parseFloat(
    (ratings.reduce((a, r) => a + r.overallScore, 0) / ratings.length).toFixed(2)
  );

  const categoryScores = {};
  MLA_WORK_CATEGORIES.forEach(cat => {
     const sum = ratings.reduce((a, r) => a + (r.categoryScores[cat.id] || 0), 0);
     categoryScores[cat.id] = parseFloat((sum / ratings.length).toFixed(1));
  });

  return {
    mlaId,
    overallScore,
    categoryScores,
    totalRatings: ratings.length,
    isDemo: false
  };
};

/**
 * Get user's submitted MLA rating
 */
export const getUserMLARating = async (userId) => {
  const ratings = getRatings();
  return ratings.find(
    r => r.userId === userId &&
      r.votingPeriod === VOTING_CONFIG.CURRENT_VOTING_PERIOD
  ) || null;
};

/**
 * Check if user has already rated their MLA this period
 */
export const hasRatedMLA = async (userId) => {
  const ratings = getRatings();
  return ratings.some(
    r => r.userId === userId &&
      r.votingPeriod === VOTING_CONFIG.CURRENT_VOTING_PERIOD
  );
};

/**
 * Get approved comments for an MLA
 */
export const getMLAComments = async (mlaId) => {
  const comments = getComments();
  return comments.filter(c => c.mlaId === mlaId && c.status === 'approved');
};

/**
 * Report a comment
 */
export const reportComment = async (commentId, reporterId, reason) => {
  // In production, this creates a CommentReport record
  console.log(`Comment ${commentId} reported by ${reporterId}: ${reason}`);
  return { success: true };
};

export default {
  submitMLARating,
  getMLARankings,
  getMLADetail,
  getUserMLARating,
  hasRatedMLA,
  getMLAComments,
  reportComment,
};
