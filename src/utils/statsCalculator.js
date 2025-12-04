// Stats calculation utilities for player performance analysis

export const calculateKDA = (matches) => {
  if (!matches || matches.length === 0) return null;

  const totalKills = matches.reduce((sum, m) => sum + (m.kills || 0), 0);
  const totalDeaths = matches.reduce((sum, m) => sum + (m.deaths || 0), 0);
  const totalAssists = matches.reduce((sum, m) => sum + (m.assists || 0), 0);

  return {
    avgKills: (totalKills / matches.length).toFixed(1),
    avgDeaths: (totalDeaths / matches.length).toFixed(1),
    avgAssists: (totalAssists / matches.length).toFixed(1),
    kdaRatio: totalDeaths > 0
      ? ((totalKills + totalAssists) / totalDeaths).toFixed(2)
      : (totalKills + totalAssists).toFixed(2),
    totalKills,
    totalDeaths,
    totalAssists
  };
};

export const calculateFarmEfficiency = (matches) => {
  if (!matches || matches.length === 0) return null;

  const totalGPM = matches.reduce((sum, m) => sum + (m.gold_per_min || 0), 0);
  const totalXPM = matches.reduce((sum, m) => sum + (m.xp_per_min || 0), 0);
  const totalLastHits = matches.reduce((sum, m) => sum + (m.last_hits || 0), 0);
  const totalDenies = matches.reduce((sum, m) => sum + (m.denies || 0), 0);

  return {
    avgGPM: Math.round(totalGPM / matches.length),
    avgXPM: Math.round(totalXPM / matches.length),
    avgLastHits: Math.round(totalLastHits / matches.length),
    avgDenies: Math.round(totalDenies / matches.length)
  };
};

export const analyzeDeaths = (matches) => {
  if (!matches || matches.length === 0) return null;

  let earlyDeaths = 0;
  let midDeaths = 0;
  let lateDeaths = 0;

  matches.forEach(match => {
    const duration = match.duration || 0;
    const deaths = match.deaths || 0;

    // Estimate death distribution (simplified since we don't have timeline data)
    if (duration < 1200) { // Less than 20 minutes
      earlyDeaths += deaths * 0.5;
    } else if (duration < 2400) { // 20-40 minutes
      midDeaths += deaths * 0.5;
    } else { // 40+ minutes
      lateDeaths += deaths * 0.3;
    }
  });

  return {
    earlyGameDeaths: (earlyDeaths / matches.length).toFixed(1),
    midGameDeaths: (midDeaths / matches.length).toFixed(1),
    lateGameDeaths: (lateDeaths / matches.length).toFixed(1)
  };
};

export const analyzeTeamfightImpact = (matches) => {
  if (!matches || matches.length === 0) return null;

  const totalHeroDamage = matches.reduce((sum, m) => sum + (m.hero_damage || 0), 0);
  const totalTowerDamage = matches.reduce((sum, m) => sum + (m.tower_damage || 0), 0);
  const totalHeroHealing = matches.reduce((sum, m) => sum + (m.hero_healing || 0), 0);

  // Calculate participation rate (simplified)
  const avgParticipation = matches.reduce((sum, match) => {
    const playerKillParticipation = (match.kills || 0) + (match.assists || 0);
    return sum + playerKillParticipation;
  }, 0) / matches.length;

  return {
    avgHeroDamage: Math.round(totalHeroDamage / matches.length),
    avgTowerDamage: Math.round(totalTowerDamage / matches.length),
    avgHeroHealing: Math.round(totalHeroHealing / matches.length),
    avgTeamfightParticipation: avgParticipation.toFixed(1)
  };
};

export const analyzeHeroPool = (matches) => {
  if (!matches || matches.length === 0) return null;

  const heroStats = {};

  matches.forEach(match => {
    const heroId = match.hero_id;
    const isWin = (match.player_slot < 128 && match.radiant_win) ||
                  (match.player_slot >= 128 && !match.radiant_win);

    if (!heroStats[heroId]) {
      heroStats[heroId] = {
        hero_id: heroId,
        games: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        assists: 0
      };
    }

    heroStats[heroId].games += 1;
    heroStats[heroId].wins += isWin ? 1 : 0;
    heroStats[heroId].kills += match.kills || 0;
    heroStats[heroId].deaths += match.deaths || 0;
    heroStats[heroId].assists += match.assists || 0;
  });

  const heroArray = Object.values(heroStats).map(hero => ({
    ...hero,
    winRate: (hero.wins / hero.games * 100).toFixed(1),
    avgKDA: hero.deaths > 0
      ? ((hero.kills + hero.assists) / hero.deaths / hero.games).toFixed(2)
      : ((hero.kills + hero.assists) / hero.games).toFixed(2)
  }));

  // Sort by games played
  heroArray.sort((a, b) => b.games - a.games);

  return {
    mostPlayedHeroes: heroArray.slice(0, 5),
    totalUniqueHeroes: heroArray.length,
    heroVersatility: (heroArray.length / matches.length).toFixed(2)
  };
};

export const calculateWinRate = (matches) => {
  if (!matches || matches.length === 0) return null;

  const wins = matches.filter(match => {
    const isRadiant = match.player_slot < 128;
    return (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
  }).length;

  return {
    totalMatches: matches.length,
    wins,
    losses: matches.length - wins,
    winRate: ((wins / matches.length) * 100).toFixed(1)
  };
};

export const analyzeItemBuilds = (matches) => {
  if (!matches || matches.length === 0) return null;

  // Count item purchases across matches
  const itemCounts = {};

  matches.forEach(match => {
    // Check item slots (item_0 through item_5, plus backpack and neutral)
    for (let i = 0; i <= 5; i++) {
      const itemId = match[`item_${i}`];
      if (itemId && itemId > 0) {
        itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
      }
    }
  });

  // Convert to array and sort by frequency
  const frequentItems = Object.entries(itemCounts)
    .map(([itemId, count]) => ({
      itemId: parseInt(itemId),
      count,
      frequency: ((count / matches.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    frequentItems,
    avgItemsPerMatch: Object.values(itemCounts).reduce((a, b) => a + b, 0) / matches.length
  };
};

export const identifyPlayerRole = (matches) => {
  if (!matches || matches.length === 0) return 'Unknown';

  const avgGPM = matches.reduce((sum, m) => sum + (m.gold_per_min || 0), 0) / matches.length;
  const avgXPM = matches.reduce((sum, m) => sum + (m.xp_per_min || 0), 0) / matches.length;
  const avgLastHits = matches.reduce((sum, m) => sum + (m.last_hits || 0), 0) / matches.length;

  // Role classification based on farm priority
  if (avgGPM > 500 && avgLastHits > 200) {
    return 'Carry'; // Position 1
  } else if (avgGPM > 450 && avgXPM > 500) {
    return 'Midlane'; // Position 2
  } else if (avgGPM > 400 && avgLastHits > 150) {
    return 'Offlane'; // Position 3
  } else if (avgGPM > 300) {
    return 'Support'; // Position 4
  } else {
    return 'Hard Support'; // Position 5
  }
};
