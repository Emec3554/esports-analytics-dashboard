import {
  ROLE_BENCHMARKS,
  PRIORITY_WEIGHTS,
  RECOMMENDATION_CATEGORIES,
  compareToRole
} from '../utils/performanceMetrics';

/**
 * Generate dynamic recommendations based on player analytics
 * @param {Object} analytics - Player analytics from analyzePlayerPerformance
 * @returns {Array} Array of recommendation objects
 */
export const generateDynamicRecommendations = (analytics) => {
  if (!analytics) return [];

  const recommendations = [];
  const { playerRole, kda, farm, deathAnalysis, winRate, heroPool, teamfightImpact } = analytics;

  // Get role-based comparisons
  const comparison = compareToRole(analytics, playerRole);

  // ==================== DEATH ANALYSIS ====================
  if (kda && parseFloat(kda.avgDeaths) > 7) {
    recommendations.push({
      id: 'high-deaths',
      category: RECOMMENDATION_CATEGORIES.POSITIONING,
      priority: 'CRITICAL',
      title: 'High Death Count',
      issue: `Average ${kda.avgDeaths} deaths per game`,
      recommendation: 'Focus on map awareness and positioning. Always check minimap before engaging.',
      actionableSteps: [
        'Look at minimap every 3-5 seconds',
        'Stay behind your team\'s frontline',
        'Buy Observer Wards to track enemy movements',
        'Avoid farming without vision of enemy cores'
      ],
      expectedImpact: {
        deaths: -2.0,
        winRate: 5,
        kdaRatio: 0.5
      },
      metrics: {
        current: parseFloat(kda.avgDeaths),
        target: ROLE_BENCHMARKS[playerRole]?.targetDeaths || 6,
        unit: 'deaths/game'
      }
    });
  } else if (kda && parseFloat(kda.avgDeaths) > 5) {
    recommendations.push({
      id: 'moderate-deaths',
      category: RECOMMENDATION_CATEGORIES.POSITIONING,
      priority: 'HIGH',
      title: 'Room for Death Reduction',
      issue: `Average ${kda.avgDeaths} deaths per game`,
      recommendation: 'Improve positioning in teamfights. Don\'t initiate unless you\'re the initiator role.',
      actionableSteps: [
        'Let your tanks engage first',
        'Position near escape routes (trees, high ground)',
        'Keep TP scroll ready for emergency escapes',
        'Track enemy ultimates and play safer when they\'re available'
      ],
      expectedImpact: {
        deaths: -1.0,
        winRate: 3,
        kdaRatio: 0.3
      },
      metrics: {
        current: parseFloat(kda.avgDeaths),
        target: ROLE_BENCHMARKS[playerRole]?.targetDeaths || 6,
        unit: 'deaths/game'
      }
    });
  }

  // ==================== EARLY GAME DEATHS ====================
  if (deathAnalysis && parseFloat(deathAnalysis.earlyGameDeaths) > 2) {
    recommendations.push({
      id: 'early-deaths',
      category: RECOMMENDATION_CATEGORIES.MAP_AWARENESS,
      priority: 'HIGH',
      title: 'Dying Too Much in Laning Phase',
      issue: `Average ${deathAnalysis.earlyGameDeaths} early game deaths`,
      recommendation: 'Play safer during the laning phase. Prioritize experience over risky last hits.',
      actionableSteps: [
        'Stay near your creeps for protection',
        'Buy extra Tangoes and Healing Salves',
        'Ask for support rotations if being pressured',
        'Pull creeps to tower if lane is dangerous',
        'Don\'t greed for last hits if enemy has kill potential'
      ],
      expectedImpact: {
        deaths: -1.5,
        winRate: 4,
        gpm: 20
      },
      metrics: {
        current: parseFloat(deathAnalysis.earlyGameDeaths),
        target: 1.5,
        unit: 'early deaths/game'
      }
    });
  }

  // ==================== LOW KDA RATIO ====================
  if (kda && parseFloat(kda.kdaRatio) < 2.0) {
    recommendations.push({
      id: 'low-kda',
      category: RECOMMENDATION_CATEGORIES.TEAM_COORDINATION,
      priority: 'HIGH',
      title: 'Low Kill Participation',
      issue: `KDA ratio of ${kda.kdaRatio}`,
      recommendation: 'Increase teamfight participation. Carry TP scroll to join fights globally.',
      actionableSteps: [
        'Always carry a TP scroll',
        'Join teamfights even if farming',
        'Communicate with team before engaging',
        'Focus on securing assists if you can\'t get kills',
        'Use Smoke of Deceit for coordinated ganks'
      ],
      expectedImpact: {
        kills: 1.5,
        assists: 3.0,
        kdaRatio: 0.8,
        winRate: 6
      },
      metrics: {
        current: parseFloat(kda.kdaRatio),
        target: ROLE_BENCHMARKS[playerRole]?.targetKDA || 2.5,
        unit: 'KDA ratio'
      }
    });
  }

  // ==================== FARM EFFICIENCY (FOR CORES) ====================
  if (['Carry', 'Midlane', 'Offlane'].includes(playerRole)) {
    if (farm && farm.avgGPM < ROLE_BENCHMARKS[playerRole].avgGPM - 50) {
      recommendations.push({
        id: 'low-farm',
        category: RECOMMENDATION_CATEGORIES.FARM_EFFICIENCY,
        priority: 'HIGH',
        title: 'Low Farm Efficiency',
        issue: `${farm.avgGPM} GPM (target: ${ROLE_BENCHMARKS[playerRole].avgGPM}+)`,
        recommendation: 'Improve last-hitting and jungle farming patterns. Don\'t stay in lane forever.',
        actionableSteps: [
          'Practice last-hitting in demo mode',
          'Stack jungle camps before farming them',
          'Farm jungle between lane waves',
          'Use abilities to farm faster (if mana allows)',
          'Take unsafe farm only with escape mechanism ready',
          'Push out waves then farm jungle'
        ],
        expectedImpact: {
          gpm: 80,
          netWorth: 2500,
          winRate: 7
        },
        metrics: {
          current: farm.avgGPM,
          target: ROLE_BENCHMARKS[playerRole].avgGPM,
          unit: 'GPM'
        }
      });
    }

    if (farm && farm.avgLastHits < ROLE_BENCHMARKS[playerRole].avgLastHits - 30) {
      recommendations.push({
        id: 'low-cs',
        category: RECOMMENDATION_CATEGORIES.MECHANICS,
        priority: 'MEDIUM',
        title: 'Low Last Hit Count',
        issue: `${farm.avgLastHits} average last hits`,
        recommendation: 'Focus on improving last-hit mechanics. Aim for 50 CS by 10 minutes.',
        actionableSteps: [
          'Practice last-hitting in demo mode for 10 mins daily',
          'Learn attack animation timing',
          'Use attack move for easier last-hitting',
          'Don\'t auto-attack - only hit for last hits',
          'Consider Quelling Blade for melee heroes'
        ],
        expectedImpact: {
          lastHits: 50,
          gpm: 60,
          netWorth: 2000
        },
        metrics: {
          current: farm.avgLastHits,
          target: ROLE_BENCHMARKS[playerRole].avgLastHits,
          unit: 'last hits'
        }
      });
    }
  }

  // ==================== LOW WIN RATE ====================
  if (winRate && parseFloat(winRate.winRate) < 45) {
    recommendations.push({
      id: 'low-winrate',
      category: RECOMMENDATION_CATEGORIES.TEAM_COORDINATION,
      priority: 'HIGH',
      title: 'Below Average Win Rate',
      issue: `${winRate.winRate}% win rate (${winRate.wins}W-${winRate.losses}L)`,
      recommendation: 'Focus on playing with your team and objective-based gameplay.',
      actionableSteps: [
        'Don\'t farm while team is fighting without you',
        'Push objectives after winning teamfights',
        'Communicate your intentions (Roshan, push, etc.)',
        'Avoid tilting - mute toxic players',
        'Play comfort heroes in ranked',
        'Take breaks after 2 losses in a row'
      ],
      expectedImpact: {
        winRate: 8
      },
      metrics: {
        current: parseFloat(winRate.winRate),
        target: 50,
        unit: '% win rate'
      }
    });
  }

  // ==================== HERO POOL ANALYSIS ====================
  if (heroPool && heroPool.mostPlayedHeroes.length > 0) {
    const topHero = heroPool.mostPlayedHeroes[0];

    if (parseFloat(topHero.winRate) < 45 && topHero.games >= 5) {
      recommendations.push({
        id: 'hero-winrate',
        category: RECOMMENDATION_CATEGORIES.HERO_MASTERY,
        priority: 'MEDIUM',
        title: `Low Win Rate on Most Played Hero`,
        issue: `${topHero.winRate}% win rate on Hero ID ${topHero.hero_id} (${topHero.games} games)`,
        recommendation: 'Watch professional replays and guides for this hero. Consider learning a new hero.',
        actionableSteps: [
          'Watch high MMR replays of this hero',
          'Study optimal item builds on Dotabuff/OpenDota',
          'Learn hero matchups (good vs bad)',
          'Practice hero mechanics in demo mode',
          'Consider taking a break from this hero'
        ],
        expectedImpact: {
          winRate: 10,
          heroMastery: 'improved'
        },
        metrics: {
          current: parseFloat(topHero.winRate),
          target: 50,
          unit: '% hero win rate'
        }
      });
    }

    if (heroPool.totalUniqueHeroes < 5 && analytics.matchCount >= 20) {
      recommendations.push({
        id: 'hero-pool-small',
        category: RECOMMENDATION_CATEGORIES.HERO_MASTERY,
        priority: 'LOW',
        title: 'Limited Hero Pool',
        issue: `Only ${heroPool.totalUniqueHeroes} unique heroes played`,
        recommendation: 'Expand your hero pool to adapt to different team compositions and counters.',
        actionableSteps: [
          'Try at least 2-3 heroes per role',
          'Learn counter-picks to common heroes',
          'Play unranked to practice new heroes',
          'Start with mechanically simple heroes',
          'Master 2-3 heroes per role before expanding'
        ],
        expectedImpact: {
          versatility: 'increased',
          adaptability: 'improved'
        },
        metrics: {
          current: heroPool.totalUniqueHeroes,
          target: 8,
          unit: 'unique heroes'
        }
      });
    }
  }

  // ==================== TEAMFIGHT IMPACT ====================
  if (teamfightImpact && teamfightImpact.avgHeroDamage < 10000 && ['Carry', 'Midlane'].includes(playerRole)) {
    recommendations.push({
      id: 'low-damage',
      category: RECOMMENDATION_CATEGORIES.TEAM_COORDINATION,
      priority: 'MEDIUM',
      title: 'Low Teamfight Damage Output',
      issue: `${teamfightImpact.avgHeroDamage.toLocaleString()} average hero damage`,
      recommendation: 'Focus on dealing damage in teamfights. Don\'t hesitate to use abilities.',
      actionableSteps: [
        'Use all your abilities in teamfights (don\'t save them)',
        'Target enemy supports first if you\'re a carry',
        'Build damage items before too much survivability',
        'Position to hit multiple enemies with AoE spells',
        'Practice ability combos in demo mode'
      ],
      expectedImpact: {
        heroDamage: 5000,
        kills: 1.0,
        winRate: 4
      },
      metrics: {
        current: teamfightImpact.avgHeroDamage,
        target: 15000,
        unit: 'hero damage'
      }
    });
  }

  // Sort by priority
  recommendations.sort((a, b) => {
    return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
  });

  return recommendations;
};

/**
 * Get a summary of the top recommendations
 * @param {Array} recommendations - Array of recommendations
 * @param {number} limit - Maximum recommendations to return
 * @returns {Array} Top recommendations
 */
export const getTopRecommendations = (recommendations, limit = 5) => {
  return recommendations.slice(0, limit);
};

/**
 * Filter recommendations by category
 * @param {Array} recommendations - Array of recommendations
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered recommendations
 */
export const filterByCategory = (recommendations, category) => {
  return recommendations.filter(rec => rec.category === category);
};

/**
 * Calculate potential improvement if all recommendations are followed
 * @param {Array} recommendations - Array of recommendations
 * @returns {Object} Total expected impact
 */
export const calculateTotalImpact = (recommendations) => {
  const totalImpact = {
    winRate: 0,
    kdaRatio: 0,
    deaths: 0,
    kills: 0,
    assists: 0,
    gpm: 0
  };

  recommendations.forEach(rec => {
    if (rec.expectedImpact) {
      Object.keys(rec.expectedImpact).forEach(key => {
        if (totalImpact.hasOwnProperty(key)) {
          totalImpact[key] += rec.expectedImpact[key];
        }
      });
    }
  });

  return totalImpact;
};
