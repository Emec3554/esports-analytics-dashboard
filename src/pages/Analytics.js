import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { playersData, heroRecommendations } from "../data/playersData";

const players = Object.keys(playersData);

export default function Analytics() {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [matchRange, setMatchRange] = useState(10);

  // Sync baseline with Recommendations.js
  const data = (playersData[selectedPlayer] || []).slice(0, matchRange);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Baseline Analytics</h1>
          <p className="text-sm text-gray-600">
            Baseline performance across matches (no recommendations applied).
          </p>
        </header>

        {/* Player Selector */}
        <div className="flex space-x-4 mb-4">
          <label className="font-medium">Select Player:</label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {players.map((player) => (
              <option key={player} value={player}>{player}</option>
            ))}
          </select>
        </div>

        {/* Match Range Selector */}
        <div className="flex space-x-2 mb-6">
          {[5, 10, 15, 20].map((range) => (
            <button
              key={range}
              onClick={() => setMatchRange(range)}
              className={`px-3 py-1 rounded ${
                matchRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Last {range} Matches
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {selectedPlayer} – Last {matchRange} Matches
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
  );
}
