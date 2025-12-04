import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { playersData, heroRecommendations } from "../data/playersData";

const players = Object.keys(playersData);

export default function Recommendations() {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [activeRecs, setActiveRecs] = useState({});

  // Use baseline data from playersData.js
  const data = playersData[selectedPlayer] || [];

  const toggleRec = (rec) => {
    setActiveRecs((prev) => {
      const playerRecs = prev[selectedPlayer] || [];
      return {
        ...prev,
        [selectedPlayer]: playerRecs.includes(rec)
          ? playerRecs.filter((r) => r !== rec)
          : [...playerRecs, rec],
      };
    });
  };

  // Apply simple effects per recommendation (example)
  const adjustedData = useMemo(() => {
    const recs = activeRecs[selectedPlayer] || [];
    return data.map((match) => {
      let adjusted = { ...match };
      recs.forEach((rec) => {
        // simple mock effect: +1 kills per recommendation
        adjusted.kills = Math.min(20, adjusted.kills + 1);
      });
      return adjusted;
    });
  }, [data, selectedPlayer, activeRecs]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Actionable Recommendations</h1>
        </header>

        {/* Player Selector */}
        <div className="mb-6">
          <label className="mr-3 font-semibold">Select Player:</label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="p-2 border rounded"
          >
            {players.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {(heroRecommendations[selectedPlayer] || []).map((rec) => (
            <button
              key={rec}
              onClick={() => toggleRec(rec)}
              className={`p-4 border rounded-xl text-left transition ${
                (activeRecs[selectedPlayer] || []).includes(rec)
                  ? "bg-green-200 border-green-500"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <h2 className="font-bold">{rec}</h2>
              <p className="text-sm text-gray-600">
                {(activeRecs[selectedPlayer] || []).includes(rec)
                  ? "✓ Applied"
                  : "Click to Apply"}
              </p>
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Baseline */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Baseline Performance</h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={1} />
                <XAxis
                  dataKey="match"
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                />
                <YAxis
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="square"
                  iconSize={14}
                />
                <Bar dataKey="kills" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deaths" fill="#1f2937" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assists" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 italic mt-4">
              Current performance across recent matches
            </p>
          </div>

          {/* Adjusted */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">With Recommendations Applied</h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={adjustedData} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={1} />
                <XAxis
                  dataKey="match"
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                />
                <YAxis
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="square"
                  iconSize={14}
                />
                <Bar dataKey="kills" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deaths" fill="#1f2937" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assists" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 italic mt-4">
              Projected performance with applied recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
