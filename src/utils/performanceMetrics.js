// Performance thresholds and benchmarks for different roles

export const ROLE_BENCHMARKS = {
  'Carry': {
    avgGPM: 550,
    avgXPM: 600,
    avgLastHits: 250,
    targetKDA: 3.0,
    targetDeaths: 5
  },
  'Midlane': {
    avgGPM: 500,
    avgXPM: 550,
    avgLastHits: 180,
    targetKDA: 2.8,
    targetDeaths: 6
  },
  'Offlane': {
    avgGPM: 450,
    avgXPM: 500,
    avgLastHits: 150,
    targetKDA: 2.5,
    targetDeaths: 7
  },
  'Support': {
    avgGPM: 350,
    avgXPM: 400,
    avgLastHits: 50,
    targetKDA: 2.0,
    targetDeaths: 8
  },
  'Hard Support': {
    avgGPM: 300,
    avgXPM: 350,
    avgLastHits: 30,
    targetKDA: 1.8,
    targetDeaths: 9
  }
};

export const PRIORITY_WEIGHTS = {
  'CRITICAL': 5,
  'HIGH': 4,
  'MEDIUM': 3,
  'LOW': 2,
  'INFO': 1
};

export const RECOMMENDATION_CATEGORIES = {
  POSITIONING: 'Positioning',
  FARM_EFFICIENCY: 'Farm Efficiency',
  MAP_AWARENESS: 'Map Awareness',
  ITEMIZATION: 'Itemization',
  HERO_MASTERY: 'Hero Mastery',
  TEAM_COORDINATION: 'Team Coordination',
  MECHANICS: 'Mechanics'
};

export const calculatePerformanceScore = (analytics, role) => {
  if (!analytics || !role) return 0;

  const benchmark = ROLE_BENCHMARKS[role] || ROLE_BENCHMARKS['Support'];
  let score = 100;

  // KDA comparison
  if (analytics.kda) {
    const kdaDiff = parseFloat(analytics.kda.kdaRatio) - benchmark.targetKDA;
    score += kdaDiff * 5; // +/- 5 points per 0.1 KDA difference
  }

  // Death penalty
  if (analytics.kda) {
    const deathDiff = parseFloat(analytics.kda.avgDeaths) - benchmark.targetDeaths;
    score -= deathDiff * 3; // -3 points per extra death
  }

  // Farm efficiency (for core roles)
  if (['Carry', 'Midlane', 'Offlane'].includes(role) && analytics.farm) {
    const gpmDiff = analytics.farm.avgGPM - benchmark.avgGPM;
    score += (gpmDiff / 50) * 5; // +/- 5 points per 50 GPM
  }

  // Win rate bonus
  if (analytics.winRate) {
    const winRateNum = parseFloat(analytics.winRate.winRate);
    if (winRateNum > 50) {
      score += (winRateNum - 50) * 2; // +2 points per % above 50%
    } else {
      score -= (50 - winRateNum) * 1.5; // -1.5 points per % below 50%
    }
  }

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
};

export const getPerformanceGrade = (score) => {
  if (score >= 90) return { grade: 'S', color: '#FFD700', label: 'Exceptional' };
  if (score >= 80) return { grade: 'A', color: '#4CAF50', label: 'Excellent' };
  if (score >= 70) return { grade: 'B', color: '#8BC34A', label: 'Good' };
  if (score >= 60) return { grade: 'C', color: '#FFC107', label: 'Average' };
  if (score >= 50) return { grade: 'D', color: '#FF9800', label: 'Below Average' };
  return { grade: 'F', color: '#F44336', label: 'Needs Improvement' };
};

export const compareToRole = (analytics, role) => {
  if (!analytics || !role) return {};

  const benchmark = ROLE_BENCHMARKS[role] || ROLE_BENCHMARKS['Support'];
  const comparison = {};

  if (analytics.kda) {
    comparison.kda = {
      current: parseFloat(analytics.kda.kdaRatio),
      benchmark: benchmark.targetKDA,
      difference: (parseFloat(analytics.kda.kdaRatio) - benchmark.targetKDA).toFixed(2),
      status: parseFloat(analytics.kda.kdaRatio) >= benchmark.targetKDA ? 'good' : 'needs_improvement'
    };

    comparison.deaths = {
      current: parseFloat(analytics.kda.avgDeaths),
      benchmark: benchmark.targetDeaths,
      difference: (parseFloat(analytics.kda.avgDeaths) - benchmark.targetDeaths).toFixed(1),
      status: parseFloat(analytics.kda.avgDeaths) <= benchmark.targetDeaths ? 'good' : 'needs_improvement'
    };
  }

  if (analytics.farm) {
    comparison.gpm = {
      current: analytics.farm.avgGPM,
      benchmark: benchmark.avgGPM,
      difference: analytics.farm.avgGPM - benchmark.avgGPM,
      status: analytics.farm.avgGPM >= benchmark.avgGPM ? 'good' : 'needs_improvement'
    };

    comparison.lastHits = {
      current: analytics.farm.avgLastHits,
      benchmark: benchmark.avgLastHits,
      difference: analytics.farm.avgLastHits - benchmark.avgLastHits,
      status: analytics.farm.avgLastHits >= benchmark.avgLastHits ? 'good' : 'needs_improvement'
    };
  }

  return comparison;
};
