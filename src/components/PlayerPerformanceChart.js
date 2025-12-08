import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PlayerPerformanceChart from './PlayerPerformanceChart';

const PerformanceComparison = ({ chartData, improvements, hasProjected, analytics }) => {
  // Extract match-by-match data from analytics if available
  const matchData = analytics?.recentMatches?.map((match, index) => ({
    match: `Match ${index + 1}`,
    kills: match.kills || 0,
    deaths: match.deaths || 0,
    assists: match.assists || 0
  })) || [];

  return (
    <div className="performance-comparison">
      {/* Baseline Performance Chart - Match by Match */}
      {matchData.length > 0 && (
        <div className="chart-section">
          <PlayerPerformanceChart 
            matchData={matchData}
            height={500}
            className="mb-6"
          />
        </div>
      )}

      {/* Current vs Projected Performance */}
      {chartData && (
        <div className="chart-section bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-center">Current vs Projected Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="metric" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar dataKey="current" fill="#3b82f6" name="Current" radius={[4, 4, 0, 0]} />
              {hasProjected && (
                <Bar dataKey="projected" fill="#10b981" name="Projected" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-600 italic mt-4">
            Expected performance after applying recommendations
          </p>
        </div>
      )}

      {/* Improvement Summary */}
      {improvements && improvements.length > 0 && (
        <div className="improvements-section bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold mb-4">Expected Improvements</h3>
          <div className="improvements-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {improvements.map((item, idx) => (
              <div key={idx} className="improvement-card bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="improvement-metric text-lg font-semibold text-gray-700">{item.metric}</div>
                <div className={`improvement-value text-2xl font-bold ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </div>
                <div className="improvement-from-to text-sm text-gray-600 mt-2">
                  {item.from} → {item.to}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceComparison;