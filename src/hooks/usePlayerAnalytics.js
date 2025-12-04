import { useState, useEffect, useCallback } from 'react';
import { analyzePlayerPerformance, analyzeTrends, getHeroPerformance } from '../services/analytics.service';
import { calculatePerformanceScore, getPerformanceGrade } from '../utils/performanceMetrics';

/**
 * Custom hook for fetching and analyzing player performance
 * @param {string|number} accountId - Player's account ID
 * @param {number} matchCount - Number of matches to analyze
 * @returns {Object} Analytics data and state
 */
export const usePlayerAnalytics = (accountId, matchCount = 30) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [performanceScore, setPerformanceScore] = useState(null);
  const [performanceGrade, setPerformanceGrade] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!accountId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyzePlayerPerformance(accountId, matchCount);
      setAnalytics(data);

      // Calculate performance score
      const score = calculatePerformanceScore(data, data.playerRole);
      setPerformanceScore(score);
      setPerformanceGrade(getPerformanceGrade(score));
    } catch (err) {
      setError(err.message || 'Failed to analyze player performance');
      console.error('Error in usePlayerAnalytics:', err);
    } finally {
      setLoading(false);
    }
  }, [accountId, matchCount]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refetch = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    performanceScore,
    performanceGrade,
    refetch
  };
};

/**
 * Custom hook for analyzing player trends over time
 * @param {string|number} accountId - Player's account ID
 * @returns {Object} Trend data and state
 */
export const usePlayerTrends = (accountId) => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accountId) return;

    const fetchTrends = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await analyzeTrends(accountId);
        setTrends(data);
      } catch (err) {
        setError(err.message || 'Failed to analyze trends');
        console.error('Error in usePlayerTrends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [accountId]);

  return { trends, loading, error };
};

/**
 * Custom hook for hero performance analysis
 * @param {string|number} accountId - Player's account ID
 * @returns {Object} Hero performance data and state
 */
export const useHeroPerformance = (accountId) => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accountId) return;

    const fetchHeroPerformance = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getHeroPerformance(accountId);
        setHeroData(data);
      } catch (err) {
        setError(err.message || 'Failed to analyze hero performance');
        console.error('Error in useHeroPerformance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroPerformance();
  }, [accountId]);

  return { heroData, loading, error };
};
