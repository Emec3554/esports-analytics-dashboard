/**
 * Calculate projected stats based on applied recommendations
 * @param {Object} analytics - Current player analytics
 * @param {Array} appliedRecommendations - List of applied recommendation objects
 * @returns {Object} Projected stats after applying recommendations
 */
export const calculateProjectedStats = (analytics, appliedRecommendations) => {
  if (!analytics || !appliedRecommendations || appliedRecommendations.length === 0) {
    return null;
  }

  // Start with current stats
  const projected = {
    kda: { ...analytics.kda },
    winRate: { ...analytics.winRate },
    farm: analytics.farm ? { ...analytics.farm } : null,
    teamfightImpact: analytics.teamfightImpact ? { ...analytics.teamfightImpact } : null
  };

  // Apply each recommendation's impact
  appliedRecommendations.forEach(rec => {
    if (!rec.expectedImpact) return;

    const impact = rec.expectedImpact;

    // Apply KDA changes
    if (impact.kills) {
      projected.kda.avgKills = (parseFloat(projected.kda.avgKills) + impact.kills).toFixed(1);
    }
    if (impact.deaths) {
      projected.kda.avgDeaths = Math.max(0, parseFloat(projected.kda.avgDeaths) + impact.deaths).toFixed(1);
    }
    if (impact.assists) {
      projected.kda.avgAssists = (parseFloat(projected.kda.avgAssists) + impact.assists).toFixed(1);
    }
    if (impact.kdaRatio) {
      projected.kda.kdaRatio = (parseFloat(projected.kda.kdaRatio) + impact.kdaRatio).toFixed(2);
    }

    // Apply win rate changes
    if (impact.winRate) {
      projected.winRate.winRate = Math.min(100, parseFloat(projected.winRate.winRate) + impact.winRate).toFixed(1);
    }

    // Apply farm changes
    if (projected.farm) {
      if (impact.gpm) {
        projected.farm.avgGPM = Math.round(projected.farm.avgGPM + impact.gpm);
      }
      if (impact.lastHits) {
        projected.farm.avgLastHits = Math.round(projected.farm.avgLastHits + impact.lastHits);
      }
      if (impact.netWorth) {
        // Net worth is informational, not directly modified
      }
    }

    // Apply teamfight impact changes
    if (projected.teamfightImpact) {
      if (impact.heroDamage) {
        projected.teamfightImpact.avgHeroDamage = Math.round(
          projected.teamfightImpact.avgHeroDamage + impact.heroDamage
        );
      }
    }
  });

  // Recalculate KDA ratio if deaths or kills/assists changed
  const totalKillContribution = parseFloat(projected.kda.avgKills) + parseFloat(projected.kda.avgAssists);
  const deaths = parseFloat(projected.kda.avgDeaths);
  if (deaths > 0) {
    projected.kda.kdaRatio = (totalKillContribution / deaths).toFixed(2);
  } else {
    projected.kda.kdaRatio = totalKillContribution.toFixed(2);
  }

  return projected;
};

/**
 * Calculate improvement percentages
 * @param {Object} current - Current stats
 * @param {Object} projected - Projected stats
 * @returns {Object} Improvement percentages
 */
export const calculateImprovementPercentages = (current, projected) => {
  if (!current || !projected) return null;

  const improvements = {};

  // KDA improvements
  if (current.kda && projected.kda) {
    improvements.kdaRatio = calculatePercentageChange(
      parseFloat(current.kda.kdaRatio),
      parseFloat(projected.kda.kdaRatio)
    );
    improvements.avgKills = calculatePercentageChange(
      parseFloat(current.kda.avgKills),
      parseFloat(projected.kda.avgKills)
    );
    improvements.avgDeaths = calculatePercentageChange(
      parseFloat(current.kda.avgDeaths),
      parseFloat(projected.kda.avgDeaths)
    );
    improvements.avgAssists = calculatePercentageChange(
      parseFloat(current.kda.avgAssists),
      parseFloat(projected.kda.avgAssists)
    );
  }

  // Win rate improvement
  if (current.winRate && projected.winRate) {
    improvements.winRate = calculatePercentageChange(
      parseFloat(current.winRate.winRate),
      parseFloat(projected.winRate.winRate)
    );
  }

  // Farm improvements
  if (current.farm && projected.farm) {
    improvements.avgGPM = calculatePercentageChange(
      current.farm.avgGPM,
      projected.farm.avgGPM
    );
    improvements.avgLastHits = calculatePercentageChange(
      current.farm.avgLastHits,
      projected.farm.avgLastHits
    );
  }

  return improvements;
};

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - Original value
 * @param {number} newValue - New value
 * @returns {string} Percentage change with sign
 */
const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? '+∞' : '0';
  const change = ((newValue - oldValue) / oldValue) * 100;
  return change.toFixed(1);
};

/**
 * Prepare data for comparison charts
 * @param {Object} analytics - Current analytics
 * @param {Object} projected - Projected analytics
 * @returns {Object} Chart-ready data
 */
export const prepareChartData = (analytics, projected) => {
  if (!analytics) return null;

  const currentKDA = {
    kills: parseFloat(analytics.kda.avgKills),
    deaths: parseFloat(analytics.kda.avgDeaths),
    assists: parseFloat(analytics.kda.avgAssists),
    kdaRatio: parseFloat(analytics.kda.kdaRatio)
  };

  const projectedKDA = projected ? {
    kills: parseFloat(projected.kda.avgKills),
    deaths: parseFloat(projected.kda.avgDeaths),
    assists: parseFloat(projected.kda.avgAssists),
    kdaRatio: parseFloat(projected.kda.kdaRatio)
  } : currentKDA;

  // KDA Bar Chart Data
  const kdaBarData = [
    {
      metric: 'Kills',
      Current: currentKDA.kills,
      Projected: projectedKDA.kills
    },
    {
      metric: 'Deaths',
      Current: currentKDA.deaths,
      Projected: projectedKDA.deaths
    },
    {
      metric: 'Assists',
      Current: currentKDA.assists,
      Projected: projectedKDA.assists
    }
  ];

  // Win Rate Data
  const winRateData = [
    {
      metric: 'Win Rate',
      Current: parseFloat(analytics.winRate.winRate),
      Projected: projected ? parseFloat(projected.winRate.winRate) : parseFloat(analytics.winRate.winRate)
    }
  ];

  // KDA Ratio Line Data (for trend visualization)
  const kdaRatioData = [
    { stage: 'Current', value: currentKDA.kdaRatio },
    { stage: 'Projected', value: projectedKDA.kdaRatio }
  ];

  // Farm Data (if available)
  const farmData = analytics.farm && projected?.farm ? [
    {
      metric: 'GPM',
      Current: analytics.farm.avgGPM,
      Projected: projected.farm.avgGPM
    },
    {
      metric: 'Last Hits',
      Current: analytics.farm.avgLastHits,
      Projected: projected.farm.avgLastHits
    }
  ] : null;

  return {
    kdaBarData,
    winRateData,
    kdaRatioData,
    farmData
  };
};

/**
 * Generate summary text for improvements
 * @param {Object} improvements - Improvement percentages
 * @returns {Array} Array of improvement summary objects
 */
export const generateImprovementSummary = (improvements) => {
  if (!improvements) return [];

  const summary = [];

  if (improvements.kdaRatio) {
    const change = parseFloat(improvements.kdaRatio);
    summary.push({
      metric: 'KDA Ratio',
      change: improvements.kdaRatio,
      positive: change > 0,
      icon: change > 0 ? '📈' : '📉'
    });
  }

  if (improvements.avgDeaths) {
    const change = parseFloat(improvements.avgDeaths);
    // For deaths, negative is good
    summary.push({
      metric: 'Avg Deaths',
      change: improvements.avgDeaths,
      positive: change < 0,
      icon: change < 0 ? '✅' : '⚠️'
    });
  }

  if (improvements.winRate) {
    const change = parseFloat(improvements.winRate);
    summary.push({
      metric: 'Win Rate',
      change: improvements.winRate,
      positive: change > 0,
      icon: change > 0 ? '🎯' : '📊'
    });
  }

  if (improvements.avgGPM) {
    const change = parseFloat(improvements.avgGPM);
    summary.push({
      metric: 'GPM',
      change: improvements.avgGPM,
      positive: change > 0,
      icon: change > 0 ? '💰' : '📊'
    });
  }

  return summary;
};
