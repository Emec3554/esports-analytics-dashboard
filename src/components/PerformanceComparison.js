import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './PerformanceComparison.css';

const PerformanceComparison = ({ chartData, improvements, hasProjected }) => {
  if (!chartData) {
    console.warn('PerformanceComparison: chartData is null');
    return null;
  }

  const { kdaBarData } = chartData;

  // Custom tooltip matching the simple style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          padding: '10px'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '2px 0' }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="performance-comparison-simple">
      <div className="comparison-header-simple">
        <h2>Performance Visualization</h2>
        {hasProjected ? (
          <p className="comparison-subtitle-simple">
            Compare your current stats with projected improvements
          </p>
        ) : (
          <p className="comparison-subtitle-simple">
            Apply recommendations to see projected improvements
          </p>
        )}
      </div>

      {/* Improvement Summary */}
      {hasProjected && improvements && improvements.length > 0 && (
        <div className="improvement-banner">
          <h3>📊 Expected Changes with Applied Recommendations:</h3>
          <div className="improvement-chips">
            {improvements.map((item, idx) => (
              <div
                key={idx}
                className={`improvement-chip ${item.positive ? 'positive' : 'negative'}`}
              >
                <span className="chip-icon">{item.icon}</span>
                <span className="chip-metric">{item.metric}</span>
                <span className="chip-change">
                  {parseFloat(item.change) > 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Charts */}
      <div className="charts-side-by-side">
        {/* Baseline Chart */}
        <div className="chart-box baseline">
          <h2 className="chart-title">Baseline Performance</h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={kdaBarData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={1} />
              <XAxis
                dataKey="metric"
                stroke="#374151"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <YAxis
                stroke="#374151"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
                iconSize={14}
              />
              <Bar
                dataKey="Current"
                fill="#ee0a0aff"
                radius={[4, 4, 0, 0]}
                name="Current Stats"
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-caption">
            Current performance across recent matches
          </p>
        </div>

        {/* Projected Chart */}
        <div className={`chart-box projected ${hasProjected ? 'active' : 'inactive'}`}>
          <h2 className="chart-title">
            {hasProjected ? 'With Recommendations Applied' : 'Apply Recommendations'}
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={kdaBarData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={1} />
              <XAxis
                dataKey="metric"
                stroke="#374151"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <YAxis
                stroke="#374151"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
                iconSize={14}
              />
              {hasProjected ? (
                <>
                  <Bar
                    dataKey="Current"
                    fill="#f10909ff"
                    radius={[4, 4, 0, 0]}
                    name="Before"
                    /*opacity={0.5}*/
                  />
                  <Bar 
                    dataKey="Projected" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    name="Projected"
                  />
                </>
              ) : (
                <Bar
                  dataKey="Current"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="No Changes Yet"
                  opacity={0.3}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-caption">
            {hasProjected 
              ? 'Projected performance with applied recommendations' 
              : 'Apply recommendations above to see potential improvements'}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="visual-legend-simple">
        <div className="legend-row">
          <div className="legend-box baseline-color"></div>
          <span>Current Performance</span>
        </div>
        {hasProjected && (
          <div className="legend-row">
            <div className="legend-box projected-color"></div>
            <span>Projected with Recommendations</span>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!hasProjected && (
        <div className="cta-message">
          <div className="cta-icon">💡</div>
          <div className="cta-content">
            <h3>See Your Potential</h3>
            <p>
              Apply recommendations above to visualize how your KDA, win rate, 
              and other performance metrics could improve!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceComparison;