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
          <div>
            <h2 className="font-semibold mb-2">Baseline Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="kills" fill="#d81a43ff" />
                <Bar dataKey="deaths" fill="#000" />
                <Bar dataKey="assists" fill="#0bc020" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Adjusted */}
          <div>
            <h2 className="font-semibold mb-2">Recommendations Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adjustedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="kills" fill="#e11d48" />
                <Bar dataKey="deaths" fill="#000" />
                <Bar dataKey="assists" fill="#0bc020" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
