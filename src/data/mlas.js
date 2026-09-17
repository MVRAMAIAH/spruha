/**
 * MLA Placeholder Data
 * 
 * DATA CATEGORY: DEMO
 * NOTE: This data is placeholder. Real MLA data will be provided by the user.
 * Each constituency is assigned a placeholder MLA name.
 * The system supports changing MLAs after elections.
 */

import { CONSTITUENCIES } from './constituencies';

/**
 * Generate placeholder MLA data for all constituencies
 * In production, this will come from the database
 */
const generatePlaceholderMLAs = () => {
  return CONSTITUENCIES.map((constituency, index) => ({
    id: `mla-${String(index + 1).padStart(3, '0')}`,
    name: `MLA - ${constituency.name}`,
    constituencyId: constituency.id,
    party: 'Not Specified',
    termStart: '2024-06-01',
    termEnd: null,
    isCurrent: true,
    isDemo: true, // Flag to identify demo data
  }));
};

export const MLAS = generatePlaceholderMLAs();

/**
 * Get MLA by constituency ID
 */
export const getMLAByConstituency = (constituencyId) =>
  MLAS.find(m => m.constituencyId === constituencyId && m.isCurrent);

/**
 * Get MLA by ID
 */
export const getMLAById = (id) =>
  MLAS.find(m => m.id === id);

/**
 * Get all current MLAs
 */
export const getCurrentMLAs = () =>
  MLAS.filter(m => m.isCurrent);
