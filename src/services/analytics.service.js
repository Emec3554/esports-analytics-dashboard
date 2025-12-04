import { getPlayerMatches } from './opendota.api';
import {
  calculateKDA,
  calculateFarmEfficiency,
  analyzeDeaths,
  analyzeTeamfightImpact,
  analyzeHeroPool,
  calculateWinRate,
  analyzeItemBuilds,
  identifyPlayerRole
} from '../utils/statsCalculator';

/**
 * Analyzes comprehensive player performance based on recent matches
 * @param {string|number} accountId - Player's account ID
 * @param {number} matchCount - Number of recent matches to analyze (default: 30)
 * @returns {Promise<Object>} Comprehensive analytics object
 */
export const analyzePlayerPerformance = async (accountId, matchCount = 30) => {
  try {
    // Fetch recent matches
    const matches = await getPlayerMatches(accountId, matchCount);

    if (!matches || matches.length === 0) {
      throw new Error('No matches found for this player');
    }

    // Calculate all metrics
    const kda = calculateKDA(matches);
    const farm = calculateFarmEfficiency(matches);
    const deathAnalysis = analyzeDeaths(matches);
    const teamfightImpact = analyzeTeamfightImpact(matches);
    const heroPool = analyzeHeroPool(matches);
    const winRate = calculateWinRate(matches);
    const itemBuilds = analyzeItemBuilds(matches);
    const playerRole = identifyPlayerRole(matches);

    // Return comprehensive analytics
    return {
      accountId,
      matchCount: matches.length,
      analyzedAt: new Date().toISOString(),
      playerRole,
      kda,
      farm,
      deathAnalysis,
      teamfightImpact,
      heroPool,
      winRate,
      itemBuilds,
      rawMatches: matches // Keep for detailed analysis
    };
  } catch (error) {
    console.error('Error analyzing player performance:', error);
    throw error;
  }
};

/**
 * Get quick performance summary for dashboard display
 * @param {string|number} accountId - Player's account ID
 * @returns {Promise<Object>} Quick stats summary
 */
export const getQuickStats = async (accountId) => {
  try {
    const matches = await getPlayerMatches(accountId, 20);

    if (!matches || matches.length === 0) {
      return null;
    }

    const kda = calculateKDA(matches);
    const winRate = calculateWinRate(matches);
    const playerRole = identifyPlayerRole(matches);

    return {
      kdaRatio: kda.kdaRatio,
      winRate: winRate.winRate,
      totalMatches: matches.length,
      playerRole
    };
  } catch (error) {
    console.error('Error getting quick stats:', error);
    return null;
  }
};

/**
 * Compare player performance over different time periods
 * @param {string|number} accountId - Player's account ID
 * @returns {Promise<Object>} Trend analysis
 */
export const analyzeTrends = async (accountId) => {
  try {
    const recentMatches = await getPlayerMatches(accountId, 50);

    if (!recentMatches || recentMatches.length < 20) {
      throw new Error('Not enough match history for trend analysis');
    }

    // Split into two periods
    const recent = recentMatches.slice(0, 25);
    const older = recentMatches.slice(25, 50);

    const recentKDA = calculateKDA(recent);
    const olderKDA = calculateKDA(older);

    const recentWinRate = calculateWinRate(recent);
    const olderWinRate = calculateWinRate(older);

    return {
      recent: {
        matches: recent.length,
        kda: recentKDA,
        winRate: recentWinRate
      },
      older: {
        matches: older.length,
        kda: olderKDA,
        winRate: olderWinRate
      },
      trends: {
        kdaChange: (parseFloat(recentKDA.kdaRatio) - parseFloat(olderKDA.kdaRatio)).toFixed(2),
        winRateChange: (parseFloat(recentWinRate.winRate) - parseFloat(olderWinRate.winRate)).toFixed(1),
        improving: parseFloat(recentKDA.kdaRatio) > parseFloat(olderKDA.kdaRatio)
      }
    };
  } catch (error) {
    console.error('Error analyzing trends:', error);
    throw error;
  }
};

/**
 * Get player's best and worst heroes
 * @param {string|number} accountId - Player's account ID
 * @returns {Promise<Object>} Hero performance analysis
 */
export const getHeroPerformance = async (accountId) => {
  try {
    const matches = await getPlayerMatches(accountId, 50);
    const heroPool = analyzeHeroPool(matches);

    if (!heroPool) {
      return null;
    }

    // Sort heroes by win rate
    const sortedByWinRate = [...heroPool.mostPlayedHeroes]
      .filter(h => h.games >= 3) // At least 3 games
      .sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));

    return {
      bestHeroes: sortedByWinRate.slice(0, 3),
      worstHeroes: sortedByWinRate.slice(-3).reverse(),
      mostPlayed: heroPool.mostPlayedHeroes[0],
      totalUniqueHeroes: heroPool.totalUniqueHeroes,
      versatility: heroPool.heroVersatility
    };
  } catch (error) {
    console.error('Error analyzing hero performance:', error);
    return null;
  }
};
