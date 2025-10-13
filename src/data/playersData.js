// src/data/playersData.js

//  Example real Dota 2 heroes with consistent match data
export const playersData = {
  "pure": Array.from({ length: 20 }, (_, i) => ({
    match: `Match ${i + 1}`,
    kills: Math.floor(Math.random() * 12),
    deaths: Math.floor(Math.random() * 8),
    assists: Math.floor(Math.random() * 14),
  })),
  "-Wetto-": Array.from({ length: 20 }, (_, i) => ({
    match: `Match ${i + 1}`,
    kills: Math.floor(Math.random() * 15),
    deaths: Math.floor(Math.random() * 10),
    assists: Math.floor(Math.random() * 8),
  })),
  "Invoker": Array.from({ length: 20 }, (_, i) => ({
    match: `Match ${i + 1}`,
    kills: Math.floor(Math.random() * 6),
    deaths: Math.floor(Math.random() * 12),
    assists: Math.floor(Math.random() * 18),
  })),
  
};

//  Hero-specific recommendations
export const heroRecommendations = {
  "pure": [
    "Coordinate with cores for ganks instead of solo pickoffs.",
    "Position safely in the backline to cast spells effectively.",
    "Use Ghost Scepter or Black King Bar for survivability.",
    "Time combo after enemy key abilities are on cooldown.",
    "Improve map awareness.",
  ],
  "-Wetto-": [
    "Wait for supports to initiate fights before jumping in.",
    "Farm safely until core items are ready.",
    "Target squishy backline heroes to maximize impact.",
    "Stick with teammates during mid–late game to avoid isolation deaths.",
    "Retreat when 2+ heroes go missing.",
    "Always TP defensively.",
    "Always fight from behind your frontline and only jump when enemies have already committed.",
    "Do not farm or push past the river without vision.",
  ],
  "Invoker": [
    "Stay behind cores and use Frostbite/Ult from safe positions.",
    "Buy defensive items like Glimmer Cape or Force Staff.",
    "Spam utility spells to maximize disables and mana regen.",
    "Always group up; avoid farming alone as a support.",
  ],
};

//  Utility: Calculate win rate proxy
export const calculateWinRate = (matches) => {
  if (!matches.length) return 0;
  const totalKills = matches.reduce((sum, m) => sum + m.kills, 0);
  const totalDeaths = matches.reduce((sum, m) => sum + m.deaths, 0);
  const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0);

  return Math.min(
    100,
    Math.max(0, (((totalKills + totalAssists) - totalDeaths) / (matches.length * 10)) * 100)
  ).toFixed(1);
};
