/**
 * Projection Calculator Utilities
 * Handles all calculations for projected stats and chart data
 */

/**
 * Calculate projected stats based on applied recommendations
 */
export const calculateProjectedStats = (analytics, appliedRecommendations) => {
  if (!analytics || !appliedRecommendations || appliedRecommendations.length === 0) {
    return null;
  }

  // Start with current stats - with safe defaults
  const projected = {
    kda: {
      avgKills: parseFloat(analytics.kda?.avgKills || 0),
      avgDeaths: parseFloat(analytics.kda?.avgDeaths || 0),
      avgAssists: parseFloat(analytics.kda?.avgAssists || 0),
      kdaRatio: parseFloat(analytics.kda?.kdaRatio || 0)
    },
    winRate: {
      winRate: parseFloat(analytics.winRate?.winRate || 0),
      wins: analytics.winRate?.wins || 0,
      losses: analytics.winRate?.losses || 0
    },
    farm: analytics.farm ? {
      avgGPM: parseFloat(analytics.farm.avgGPM || 0),
      avgLastHits: parseFloat(analytics.farm.avgLastHits || 0)
    } : null
  };

  // Track total death reduction for proportional kill increase
  let totalDeathReduction = 0;

  // Apply each recommendation's expected impact
  appliedRecommendations.forEach(rec => {
    if (!rec.expectedImpact) return;

    const impact = rec.expectedImpact;

    // Track death reductions (negative values)
    if (impact.deaths && impact.deaths < 0) {
      totalDeathReduction += Math.abs(impact.deaths);
    }

    // Apply direct impacts
    if (impact.kills) projected.kda.avgKills += impact.kills;
    if (impact.deaths) projected.kda.avgDeaths += impact.deaths; // Usually negative
    if (impact.assists) projected.kda.avgAssists += impact.assists;

    // Apply win rate impact
    if (impact.winRate) {
      projected.winRate.winRate += impact.winRate;
      projected.winRate.winRate = Math.min(Math.max(projected.winRate.winRate, 0), 100);
    }

    // Apply farm impacts
    if (projected.farm) {
      if (impact.gpm) projected.farm.avgGPM += impact.gpm;
      if (impact.lastHits) projected.farm.avgLastHits += impact.lastHits;
    }
  });

  // PROPORTIONAL INCREASE: Add kills based on death reduction
  // Logic: For every 2 deaths reduced, add 1 kill (50% conversion rate)
  // This represents better positioning = more survival = more kill opportunities
  const proportionalKillIncrease = totalDeathReduction * 0.5;
  projected.kda.avgKills += proportionalKillIncrease;

  // Also add proportional assists (20% conversion)
  // Better survival = more fight participation = more assists
  const proportionalAssistIncrease = totalDeathReduction * 0.2;
  projected.kda.avgAssists += proportionalAssistIncrease;

  // Ensure deaths don't go below reasonable minimum (0.5)
  projected.kda.avgDeaths = Math.max(0.5, projected.kda.avgDeaths);

  // Recalculate KDA ratio with new values
  if (projected.kda.avgDeaths > 0) {
    projected.kda.kdaRatio = (projected.kda.avgKills + projected.kda.avgAssists) / projected.kda.avgDeaths;
  }

  // Round values for display
  projected.kda.avgKills = parseFloat(projected.kda.avgKills.toFixed(1));
  projected.kda.avgDeaths = parseFloat(projected.kda.avgDeaths.toFixed(1));
  projected.kda.avgAssists = parseFloat(projected.kda.avgAssists.toFixed(1));
  projected.kda.kdaRatio = parseFloat(projected.kda.kdaRatio.toFixed(2));
  projected.winRate.winRate = parseFloat(projected.winRate.winRate.toFixed(1));

  if (projected.farm) {
    projected.farm.avgGPM = Math.round(projected.farm.avgGPM);
    projected.farm.avgLastHits = Math.round(projected.farm.avgLastHits);
  }

  console.log('📊 Projection Calculation:', {
    deathReduction: totalDeathReduction,
    proportionalKillIncrease: proportionalKillIncrease.toFixed(1),
    proportionalAssistIncrease: proportionalAssistIncrease.toFixed(1),
    finalKills: projected.kda.avgKills,
    finalDeaths: projected.kda.avgDeaths,
    finalAssists: projected.kda.avgAssists,
    finalKDA: projected.kda.kdaRatio
  });

  return projected;
};

/**
 * Calculate improvement percentages
 */
export const calculateImprovementPercentages = (analytics, projectedStats) => {
  if (!analytics || !projectedStats) return null;

  const calculatePercent = (current, projected) => {
    if (current === 0) return projected > 0 ? 100 : 0;
    return ((projected - current) / Math.abs(current)) * 100;
  };

  return {
    kills: calculatePercent(analytics.kda.avgKills, projectedStats.kda.avgKills),
    deaths: calculatePercent(analytics.kda.avgDeaths, projectedStats.kda.avgDeaths),
    assists: calculatePercent(analytics.kda.avgAssists, projectedStats.kda.avgAssists),
    kdaRatio: calculatePercent(analytics.kda.kdaRatio, projectedStats.kda.kdaRatio),
    winRate: calculatePercent(analytics.winRate.winRate, projectedStats.winRate.winRate),
    gpm: analytics.farm && projectedStats.farm 
      ? calculatePercent(analytics.farm.avgGPM, projectedStats.farm.avgGPM) 
      : 0,
    lastHits: analytics.farm && projectedStats.farm 
      ? calculatePercent(analytics.farm.avgLastHits, projectedStats.farm.avgLastHits) 
      : 0
  };
};

/**
 * Prepare chart data for Recharts
 */
export const prepareChartData = (analytics, projectedStats = null) => {
  if (!analytics) {
    console.warn('prepareChartData: analytics is null or undefined');
    return null;
  }

  // Safe extraction with logging
  const currentKills = parseFloat(analytics.kda?.avgKills || 0);
  const currentDeaths = parseFloat(analytics.kda?.avgDeaths || 0);
  const currentAssists = parseFloat(analytics.kda?.avgAssists || 0);
  const currentKdaRatio = parseFloat(analytics.kda?.kdaRatio || 0);
  const currentWinRate = parseFloat(analytics.winRate?.winRate || 0);
  const currentGPM = analytics.farm ? parseFloat(analytics.farm.avgGPM || 0) : 0;
  const currentLastHits = analytics.farm ? parseFloat(analytics.farm.avgLastHits || 0) : 0;

  console.log('Chart Data Preparation:', {
    currentKills,
    currentDeaths,
    currentAssists,
    currentKdaRatio,
    currentWinRate,
    hasProjected: !!projectedStats
  });

  // KDA Bar Chart Data
  const kdaBarData = [
    {
      metric: 'Kills',
      Current: currentKills,
      Projected: projectedStats ? parseFloat(projectedStats.kda.avgKills) : currentKills
    },
    {
      metric: 'Deaths',
      Current: currentDeaths,
      Projected: projectedStats ? parseFloat(projectedStats.kda.avgDeaths) : currentDeaths
    },
    {
      metric: 'Assists',
      Current: currentAssists,
      Projected: projectedStats ? parseFloat(projectedStats.kda.avgAssists) : currentAssists
    }
  ];

  // KDA Ratio Trend
  const kdaRatioData = [
    { stage: 'Current', value: currentKdaRatio },
    { stage: 'Projected', value: projectedStats ? parseFloat(projectedStats.kda.kdaRatio) : currentKdaRatio }
  ];

  // Win Rate Data
  const winRateData = [
    {
      metric: 'Win Rate',
      Current: currentWinRate,
      Projected: projectedStats ? parseFloat(projectedStats.winRate.winRate) : currentWinRate
    }
  ];

  // Farm Data
  let farmData = null;
  if (analytics.farm) {
    farmData = [
      {
        metric: 'GPM',
        Current: currentGPM,
        Projected: projectedStats?.farm ? parseFloat(projectedStats.farm.avgGPM) : currentGPM
      },
      {
        metric: 'Last Hits',
        Current: currentLastHits,
        Projected: projectedStats?.farm ? parseFloat(projectedStats.farm.avgLastHits) : currentLastHits
      }
    ];
  }

  const result = { kdaBarData, kdaRatioData, winRateData, farmData };
  console.log('Prepared chart data:', result);
  return result;
};

/**
 * Generate improvement summary
 */
export const generateImprovementSummary = (improvementPercentages) => {
  if (!improvementPercentages) return [];

  const summary = [];

  // KDA Ratio
  if (Math.abs(improvementPercentages.kdaRatio) > 0.5) {
    summary.push({
      metric: 'KDA Ratio',
      change: improvementPercentages.kdaRatio.toFixed(1),
      positive: improvementPercentages.kdaRatio > 0,
      icon: improvementPercentages.kdaRatio > 0 ? '📈' : '📉'
    });
  }

  // Kills (positive increase)
  if (Math.abs(improvementPercentages.kills) > 0.5) {
    summary.push({
      metric: 'Kills',
      change: improvementPercentages.kills.toFixed(1),
      positive: improvementPercentages.kills > 0,
      icon: improvementPercentages.kills > 0 ? '⚔️' : '📉'
    });
  }

  // Deaths (negative is good)
  if (Math.abs(improvementPercentages.deaths) > 0.5) {
    summary.push({
      metric: 'Deaths',
      change: improvementPercentages.deaths.toFixed(1),
      positive: improvementPercentages.deaths < 0, // Lower deaths is positive
      icon: improvementPercentages.deaths < 0 ? '🛡️' : '⚠️'
    });
  }

  // Win Rate
  if (Math.abs(improvementPercentages.winRate) > 0.5) {
    summary.push({
      metric: 'Win Rate',
      change: improvementPercentages.winRate.toFixed(1),
      positive: improvementPercentages.winRate > 0,
      icon: improvementPercentages.winRate > 0 ? '🎯' : '📉'
    });
  }

  // GPM
  if (Math.abs(improvementPercentages.gpm) > 0.5) {
    summary.push({
      metric: 'GPM',
      change: improvementPercentages.gpm.toFixed(1),
      positive: improvementPercentages.gpm > 0,
      icon: improvementPercentages.gpm > 0 ? '💰' : '📉'
    });
  }

  return summary;
};