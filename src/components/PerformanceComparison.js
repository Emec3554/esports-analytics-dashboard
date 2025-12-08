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
                fill="#475569" 
                radius={[4, 4, 0, 0]}
                name="Current Stats"
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-caption">
            Current performance across recent matches
          </p>
        </div>

<<<<<<< Updated upstream
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
                    fill="#94a3b8" 
                    radius={[4, 4, 0, 0]}
                    name="Before"
                    opacity={0.5}
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
                  fill="#cbd5e1" 
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
=======
        {/* KDA Comparison */}
        {kdaBarData?.length > 0 && (
          <div className="chart-container">
            <h3>KDA Comparison</h3>

            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={kdaBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="metric" tick={{ fontSize: 14, fill: '#374151' }} />
                <YAxis
                  domain={[0, 16]}
                  ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16]}
                  tick={{ fontSize: 14, fill: '#374151' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Bar dataKey="Current" fill="#475569" radius={[8, 8, 0, 0]} maxBarSize={80} />

                {hasProjected && (
                  <Bar dataKey="Projected" fill="#d1d5db" radius={[8, 8, 0, 0]} maxBarSize={80} />
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

            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={kdaRatioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="stage" tick={{ fontSize: 14, fill: '#374151' }} />
                <YAxis
                  domain={[3, 'auto']}
                  tick={{ fontSize: 14, fill: '#374151' }}
                />
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

            <ResponsiveContainer width="100%" height={500}>
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

            <ResponsiveContainer width="100%" height={500}>
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

>>>>>>> Stashed changes
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