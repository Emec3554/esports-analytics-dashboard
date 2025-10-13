import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Sample KDA data (20 matches)
const initialKDA = Array.from({ length: 20 }, (_, i) => ({
  match: `Game ${i + 1}`,
  kills: Math.floor(Math.random() * 10),
  deaths: Math.floor(Math.random() * 8),
  assists: Math.floor(Math.random() * 12),
}));

// Recommendations with effects
const recommendations = [
  { id: 1, text: "Coordinate with Cores – join ganks", effect: { kills: 1, assists: 1 } },
  { id: 2, text: "Safer Positioning – stay behind cores", effect: { deaths: -1 } },
  { id: 3, text: "Defensive Itemization – buy survival items", effect: { deaths: -0.5 } },
  { id: 4, text: "Track Enemy HP & Resources – strike at weakness", effect: { kills: 1 } },
  { id: 5, text: "Stick With Teammates – roam and group", effect: { assists: 2 } },
  { id: 6, text: "Maximize Utility Skills – heals, stuns, shields", effect: { assists: 1, kills: 0.5 } },
];

export default function ActionableDashboard() {
  const [activeRecs, setActiveRecs] = useState([]);
  const [kdaData, setKdaData] = useState(initialKDA);
  const [winRate, setWinRate] = useState(45);

  // Toggle recommendation
  const toggleRec = (rec) => {
    let updatedActive;
    if (activeRecs.includes(rec.id)) {
      updatedActive = activeRecs.filter((id) => id !== rec.id);
    } else {
      updatedActive = [...activeRecs, rec.id];
    }
    setActiveRecs(updatedActive);

    // Adjust Win Rate
    const newWinRate = Math.min(100, 45 + updatedActive.length * 2);
    setWinRate(newWinRate);

    // Adjust KDA
    let adjusted = initialKDA.map((game) => {
      let { kills, deaths, assists } = game;

      updatedActive.forEach((id) => {
        const eff = recommendations.find((r) => r.id === id).effect;
        kills += eff.kills || 0;
        deaths += eff.deaths || 0;
        assists += eff.assists || 0;
      });

      return {
        ...game,
        kills: Math.max(0, kills),
        deaths: Math.max(0, deaths),
        assists: Math.max(0, assists),
      };
    });

    setKdaData(adjusted);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Esports Player Dashboard</h1>
          <span className="text-gray-500">Interactive Performance Insights</span>
        </header>

        {/* Win Rate Progress */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Win Rate Impact</h2>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="bg-green-500 h-6 rounded-full text-white text-sm text-center"
              style={{ width: `${winRate}%` }}
            >
              {winRate}%
            </div>
          </div>
        </div>

        {/* KDA Chart */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">KDA Performance (20 Matches)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={kdaData}>
              <XAxis dataKey="match" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="kills" fill="#34D399" />
              <Bar dataKey="deaths" fill="#F87171" />
              <Bar dataKey="assists" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actionable Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <button
                key={rec.id}
                onClick={() => toggleRec(rec)}
                 
              >
                {rec.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
