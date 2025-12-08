import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayerAnalytics } from '../hooks/usePlayerAnalytics';
import { useRecommendations, useRecommendationProgress } from '../hooks/useRecommendations';
import PerformanceComparison from '../components/PerformanceComparison';
import {
  calculateProjectedStats,
  calculateImprovementPercentages,
  prepareChartData,
  generateImprovementSummary
} from '../utils/projectionCalculator';
import './DynamicRecommendations.css';

const DynamicRecommendations = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [matchCount, setMatchCount] = useState(30);

  // Get player analytics
  const { analytics, loading, error, performanceScore, performanceGrade, refetch } = usePlayerAnalytics(accountId, matchCount);

  // Get recommendations
  const {
    allRecommendations,
    filteredRecommendations,
    totalImpact,
    selectedCategory,
    setSelectedCategory,
    toggleRecommendation,
    isApplied,
    clearApplied,
    hasRecommendations
  } = useRecommendations(analytics);

  // Progress tracking
  const { progressData, saveBaseline, calculateImprovement, hasBaseline } = useRecommendationProgress(accountId);

  // Calculate projected stats based on applied recommendations
  const appliedRecommendationObjects = useMemo(() => {
    return allRecommendations.filter(rec => isApplied(rec.id));
  }, [allRecommendations, isApplied]);

  const projectedStats = useMemo(() => {
    if (!analytics || appliedRecommendationObjects.length === 0) return null;
    return calculateProjectedStats(analytics, appliedRecommendationObjects);
  }, [analytics, appliedRecommendationObjects]);

  const improvementPercentages = useMemo(() => {
    if (!analytics || !projectedStats) return null;
    return calculateImprovementPercentages(analytics, projectedStats);
  }, [analytics, projectedStats]);


  const chartData = useMemo(() => {
    if (!analytics) return null;
    const data = prepareChartData(analytics, projectedStats);
    console.log('=== CHART DATA DEBUG ===');
    console.log('Analytics:', analytics);
    console.log('Projected Stats:', projectedStats);
    console.log('Chart Data:', data);
    console.log('Has Projected:', appliedRecommendationObjects.length > 0);
    return data;
  }, [analytics, projectedStats]);

  const improvementSummary = useMemo(() => {
    if (!improvementPercentages) return [];
    return generateImprovementSummary(improvementPercentages);
  }, [improvementPercentages]);

  if (loading) {
    return (
      <div className="recommendations-page">

        <div className="loading-state">
          <div className="spinner"></div>
          <h2>Analyzing Player Performance...</h2>
          <p>Processing {matchCount} recent matches</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <div className="error-state">
          <h2>Failed to Load Recommendations</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/players')} className="btn-primary">
            Back to Players
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="recommendations-page">
        <div className="error-state">
          <h2>No Data Available</h2>
          <p>Unable to generate recommendations without player data.</p>
        </div>
      </div>
    );
  }

  const improvement = hasBaseline ? calculateImprovement(analytics) : null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const categories = ['all', 'Positioning', 'Farm Efficiency', 'Map Awareness', 'Team Coordination', 'Hero Mastery', 'Mechanics', 'Itemization'];

  return (
    <div className="recommendations-page">
      {/* Header */}
      <div className="recommendations-header">
        <div className="header-content">
          <button onClick={() => navigate(`/player/${accountId}`)} className="back-btn">
            ← Back to Profile
          </button>
          <div className="header-info">
            <h1>Performance Recommendations</h1>
            <p>Account ID: {accountId}</p>
          </div>
        </div>

        {/* Match Count Selector */}
        <div className="match-selector">
          <label>Analyze:</label>
          {[20, 30, 40, 50].map(count => (
            <button
              key={count}
              onClick={() => setMatchCount(count)}
              className={`match-btn ${matchCount === count ? 'active' : ''}`}
            >
              {count} matches
            </button>
          ))}
        </div>
      </div>

      {/* Performance Score */}
      {performanceGrade && (
        <div className="performance-score-card">
          <div className="score-display">
            <div className="score-grade" style={{ color: performanceGrade.color }}>
              {performanceGrade.grade}
            </div>
            <div className="score-details">
              <div className="score-number">{performanceScore}/100</div>
              <div className="score-label">{performanceGrade.label}</div>
            </div>
          </div>

          <div className="score-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Role</span>
              <span className="breakdown-value">{analytics.playerRole}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">KDA Ratio</span>
              <span className="breakdown-value">{analytics.kda.kdaRatio}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Win Rate</span>
              <span className="breakdown-value">{analytics.winRate.winRate}%</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Avg Deaths</span>
              <span className="breakdown-value">{analytics.kda.avgDeaths}</span>
            </div>
            {analytics.farm && (
              <div className="breakdown-item">
                <span className="breakdown-label">GPM</span>
                <span className="breakdown-value">{analytics.farm.avgGPM}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Tracking */}
      {hasBaseline && improvement && (
        <div className="progress-card">
          <h3>Progress Since Baseline</h3>
          <div className="progress-stats">
            <div className={`progress-item ${parseFloat(improvement.kdaChange) > 0 ? 'positive' : 'negative'}`}>
              <span className="progress-label">KDA Change</span>
              <span className="progress-value">
                {parseFloat(improvement.kdaChange) > 0 ? '+' : ''}{improvement.kdaChange}
              </span>
            </div>
            <div className={`progress-item ${parseFloat(improvement.deathsChange) < 0 ? 'positive' : 'negative'}`}>
              <span className="progress-label">Deaths Change</span>
              <span className="progress-value">
                {parseFloat(improvement.deathsChange) > 0 ? '+' : ''}{improvement.deathsChange}
              </span>
            </div>
            <div className={`progress-item ${parseFloat(improvement.winRateChange) > 0 ? 'positive' : 'negative'}`}>
              <span className="progress-label">Win Rate Change</span>
              <span className="progress-value">
                {parseFloat(improvement.winRateChange) > 0 ? '+' : ''}{improvement.winRateChange}%
              </span>
            </div>
          </div>
        </div>
      )}

      {!hasBaseline && hasRecommendations && (
        <div className="baseline-prompt">
          <p>Track your improvement over time</p>
          <button onClick={() => saveBaseline(analytics)} className="btn-primary">
            Save Current Stats as Baseline
          </button>
        </div>
      )}

      {/* Performance Visualization */}
      {analytics && (
        <PerformanceComparison
          chartData={chartData}
          improvements={improvementSummary}
          hasProjected={appliedRecommendationObjects.length > 0}
        />
      )}

      {/* Category Filter */}
      {hasRecommendations && (
        <div className="category-filter">
          <label>Filter by Category:</label>
          <div className="category-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat} {cat !== 'all' && `(${allRecommendations.filter(r => r.category === cat).length})`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {hasRecommendations ? (
        <div className="recommendations-list">
          <div className="list-header">
            <h2>{filteredRecommendations.length} Recommendations</h2>
            <button onClick={clearApplied} className="btn-secondary">
              Clear All Applied
            </button>
          </div>

          {filteredRecommendations.map(rec => (
            <div
              key={rec.id}
              className={`recommendation-card priority-${rec.priority.toLowerCase()} ${isApplied(rec.id) ? 'applied' : ''}`}
            >
              <div className="rec-header">
                <div className="rec-title-section">
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(rec.priority) }}
                  >
                    {rec.priority}
                  </span>
                  <h3>{rec.title}</h3>
                </div>
                <button
                  onClick={() => toggleRecommendation(rec.id)}
                  className={`apply-btn ${isApplied(rec.id) ? 'applied' : ''}`}
                >
                  {isApplied(rec.id) ? '✓ Applied' : 'Apply'}
                </button>
              </div>

              <div className="rec-category">{rec.category}</div>

              <div className="rec-issue">
                <strong>Issue:</strong> {rec.issue}
              </div>

              <div className="rec-recommendation">
                <strong>Recommendation:</strong> {rec.recommendation}
              </div>

              {rec.actionableSteps && rec.actionableSteps.length > 0 && (
                <div className="rec-steps">
                  <strong>Action Steps:</strong>
                  <ul>
                    {rec.actionableSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rec-metrics">
                <div className="metric-item">
                  <span className="metric-label">Current:</span>
                  <span className="metric-value">{rec.metrics.current} {rec.metrics.unit}</span>
                </div>
                <div className="metric-arrow">→</div>
                <div className="metric-item">
                  <span className="metric-label">Target:</span>
                  <span className="metric-value target">{rec.metrics.target} {rec.metrics.unit}</span>
                </div>
              </div>

              {rec.expectedImpact && (
                <div className="rec-impact">
                  <strong>Expected Impact:</strong>
                  <div className="impact-tags">
                    {Object.entries(rec.expectedImpact).map(([key, value]) => (
                      <span key={key} className="impact-tag">
                        {key}: {value > 0 ? '+' : ''}{value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <h2>🎉 Excellent Performance!</h2>
          <p>No major issues detected. Keep up the great work!</p>
          <div className="celebration-stats">
            <div>KDA: {analytics.kda.kdaRatio}</div>
            <div>Win Rate: {analytics.winRate.winRate}%</div>
            <div>Role: {analytics.playerRole}</div>
          </div>
        </div>
      )}

      {/* Total Impact Summary */}
      {hasRecommendations && Object.keys(totalImpact).some(key => totalImpact[key] !== 0) && (
        <div className="total-impact-card">
          <h3>Potential Improvement (All Applied)</h3>
          <div className="impact-summary">
            {Object.entries(totalImpact).map(([key, value]) => {
              if (value === 0) return null;
              return (
                <div key={key} className="impact-item">
                  <span className="impact-label">{key}:</span>
                  <span className={`impact-value ${value > 0 ? 'positive' : 'negative'}`}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
<<<<<<< Updated upstream
      {/* <ChartDebugger
        analytics={analytics}
        projectedStats={projectedStats}
        chartData={chartData}
        appliedRecommendations={appliedRecommendationObjects}
        hasProjected={appliedRecommendationObjects.length > 0}
      /> */}
=======
>>>>>>> Stashed changes
    </div>
  );
};

export default DynamicRecommendations;
