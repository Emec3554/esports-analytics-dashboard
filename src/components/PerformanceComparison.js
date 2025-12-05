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
  if (!chartData) {
    console.warn('PerformanceComparison: chartData is null');
    return null;
  }

  const { kdaBarData, winRateData, kdaRatioData, farmData } = chartData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="performance-comparison">
      
      {/* Header */}
      <div className="comparison-header">
        <h2>Performance Visualization</h2>
        <p className="comparison-subtitle">
          {hasProjected
            ? 'See how your stats would improve with applied recommendations'
            : 'Apply recommendations to see projected improvements'}
        </p>
      </div>

      {/* Improvement Summary */}
      {hasProjected && improvements?.length > 0 && (
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
                    {parseFloat(item.change) > 0 ? '+' : ''}
                    {item.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">

        {/* KDA Comparison */}
        {kdaBarData?.length > 0 && (
          <div className="chart-container">
            <h3>KDA Comparison</h3>

            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={kdaBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="metric" tick={{ fontSize: 14, fill: '#374151' }} />
                <YAxis tick={{ fontSize: 14, fill: '#374151' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Bar dataKey="Current" fill="#475569" radius={[8, 8, 0, 0]} maxBarSize={80} />

                {hasProjected && (
                  <Bar dataKey="Projected" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={80} />
                )}
              </BarChart>
            </ResponsiveContainer>

            <p className="chart-description">
              Lower deaths and higher kills/assists indicate better performance
            </p>
          </div>
        )}

        {/* KDA Ratio Trend */}
        {kdaRatioData?.length > 0 && (
          <div className="chart-container">
            <h3>KDA Ratio Trend</h3>

            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={kdaRatioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="stage" tick={{ fontSize: 14, fill: '#374151' }} />
                <YAxis tick={{ fontSize: 14, fill: '#374151' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={hasProjected ? '#059669' : '#475569'}
                  strokeWidth={4}
                  dot={{
                    r: 8,
                    fill: hasProjected ? '#059669' : '#475569',
                    stroke: '#fff',
                    strokeWidth: 2
                  }}
                  activeDot={{ r: 10, strokeWidth: 3 }}
                  name="KDA Ratio"
                />
              </LineChart>
            </ResponsiveContainer>

            <p className="chart-description">
              KDA Ratio = (Kills + Assists) / Deaths. Higher is better!
            </p>
          </div>
        )}

        {/* Win Rate Impact */}
        {winRateData?.length > 0 && (
          <div className="chart-container">
            <h3>Win Rate Impact</h3>

            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={winRateData}
                layout="vertical"
                margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="metric" tick={{ fontSize: 14, fill: '#374151' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Bar dataKey="Current" radius={[0, 8, 8, 0]} maxBarSize={60}>
                  {winRateData.map((_, index) => (
                    <Cell key={index} fill="#475569" />
                  ))}
                </Bar>

                {hasProjected && (
                  <Bar dataKey="Projected" radius={[0, 8, 8, 0]} maxBarSize={60}>
                    {winRateData.map((_, index) => (
                      <Cell key={index} fill="#059669" />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>

            <p className="chart-description">
              Target: 50%+ win rate for consistent improvement
            </p>
          </div>
        )}

        {/* Farm Efficiency */}
        {farmData?.length > 0 && (
          <div className="chart-container">
            <h3>Farm Efficiency</h3>

            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={farmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>

            <p className="chart-description">
              More consistent farming leads to stronger mid-game power spikes
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PerformanceComparison;
