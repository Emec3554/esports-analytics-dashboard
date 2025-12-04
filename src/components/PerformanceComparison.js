import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './PerformanceComparison.css';

const PerformanceComparison = ({ chartData, improvements, hasProjected }) => {
  if (!chartData) return null;

  const { kdaBarData, winRateData, kdaRatioData, farmData } = chartData;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="performance-comparison">
      <div className="comparison-header">
        <h2>Performance Visualization</h2>
        {hasProjected ? (
          <p className="comparison-subtitle">
            See how your stats would improve with applied recommendations
          </p>
        ) : (
          <p className="comparison-subtitle">
            Apply recommendations to see projected improvements
          </p>
        )}
      </div>

      {/* Improvement Summary */}
      {hasProjected && improvements && improvements.length > 0 && (
        <div className="improvement-summary">
          <h3>Expected Changes</h3>
          <div className="summary-cards">
            {improvements.map((item, idx) => (
              <div
                key={idx}
                className={`summary-card ${item.positive ? 'positive' : 'negative'}`}
              >
                <span className="summary-icon">{item.icon}</span>
                <div className="summary-details">
                  <span className="summary-metric">{item.metric}</span>
                  <span className="summary-change">
                    {parseFloat(item.change) > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* KDA Comparison Chart */}
        <div className="chart-container">
          <h3>KDA Comparison</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={kdaBarData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeWidth={1.5} />
              <XAxis
                dataKey="metric"
                stroke="#374151"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <YAxis
                stroke="#374151"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
                iconSize={12}
              />
              <Bar
                dataKey="Current"
                fill="#475569"
                radius={[8, 8, 0, 0]}
                label={{ position: 'top', fill: '#1f2937', fontWeight: 'bold' }}
              />
              {hasProjected && (
                <Bar
                  dataKey="Projected"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  label={{ position: 'top', fill: '#1e40af', fontWeight: 'bold' }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-description">
            Lower deaths and higher kills/assists indicate better performance
          </p>
        </div>

        {/* KDA Ratio Trend */}
        <div className="chart-container">
          <h3>KDA Ratio Trend</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={kdaRatioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeWidth={1.5} />
              <XAxis
                dataKey="stage"
                stroke="#374151"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <YAxis
                stroke="#374151"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={hasProjected ? "#059669" : "#475569"}
                strokeWidth={4}
                dot={{ r: 8, fill: hasProjected ? "#059669" : "#475569", strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 10, strokeWidth: 3 }}
                name="KDA Ratio"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="chart-description">
            KDA Ratio = (Kills + Assists) / Deaths. Higher is better!
          </p>
        </div>

        {/* Win Rate Comparison */}
        <div className="chart-container">
          <h3>Win Rate Impact</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={winRateData} layout="horizontal" barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeWidth={1.5} />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#374151"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <YAxis
                type="category"
                dataKey="metric"
                stroke="#374151"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
                iconSize={12}
              />
              <Bar
                dataKey="Current"
                radius={[0, 8, 8, 0]}
                label={{ position: 'right', fill: '#1f2937', fontWeight: 'bold', formatter: (value) => `${value}%` }}
              >
                {winRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#475569" />
                ))}
              </Bar>
              {hasProjected && (
                <Bar
                  dataKey="Projected"
                  radius={[0, 8, 8, 0]}
                  label={{ position: 'right', fill: '#047857', fontWeight: 'bold', formatter: (value) => `${value}%` }}
                >
                  {winRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#059669" />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-description">
            Target: 50%+ win rate for consistent improvement
          </p>
        </div>

        {/* Farm Efficiency (if available) */}
        {farmData && (
          <div className="chart-container">
            <h3>Farm Efficiency</h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={farmData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeWidth={1.5} />
                <XAxis
                  dataKey="metric"
                  stroke="#374151"
                  style={{ fontSize: '14px', fontWeight: '600' }}
                />
                <YAxis
                  stroke="#374151"
                  style={{ fontSize: '14px', fontWeight: '600' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="square"
                  iconSize={12}
                />
                <Bar
                  dataKey="Current"
                  fill="#475569"
                  radius={[8, 8, 0, 0]}
                  label={{ position: 'top', fill: '#1f2937', fontWeight: 'bold' }}
                />
                {hasProjected && (
                  <Bar
                    dataKey="Projected"
                    fill="#d97706"
                    radius={[8, 8, 0, 0]}
                    label={{ position: 'top', fill: '#92400e', fontWeight: 'bold' }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
            <p className="chart-description">
              Higher GPM and Last Hits mean better farming efficiency
            </p>
          </div>
        )}
      </div>

      {/* Visual Legend */}
      <div className="visual-legend">
        <div className="legend-item">
          <span className="legend-color current"></span>
          <span className="legend-text">Current Performance</span>
        </div>
        {hasProjected && (
          <div className="legend-item">
            <span className="legend-color projected"></span>
            <span className="legend-text">Projected Performance (with recommendations)</span>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!hasProjected && (
        <div className="cta-box">
          <h4>💡 See Your Potential</h4>
          <p>
            Apply recommendations above to see how your performance metrics could improve.
            Each recommendation shows its expected impact on your stats!
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceComparison;
