import { useState, useEffect, useMemo } from 'react';
import {
  generateDynamicRecommendations,
  getTopRecommendations,
  filterByCategory,
  calculateTotalImpact
} from '../services/recommendations.engine';

/**
 * Custom hook for generating and managing recommendations
 * @param {Object} analytics - Player analytics data
 * @returns {Object} Recommendations data and functions
 */
export const useRecommendations = (analytics) => {
  const [appliedRecommendations, setAppliedRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Generate recommendations based on analytics
  const allRecommendations = useMemo(() => {
    if (!analytics) return [];
    return generateDynamicRecommendations(analytics);
  }, [analytics]);

  // Get top recommendations
  const topRecommendations = useMemo(() => {
    return getTopRecommendations(allRecommendations, 5);
  }, [allRecommendations]);

  // Filter recommendations by category
  const filteredRecommendations = useMemo(() => {
    if (selectedCategory === 'all') {
      return allRecommendations;
    }
    return filterByCategory(allRecommendations, selectedCategory);
  }, [allRecommendations, selectedCategory]);

  // Calculate total impact of applied recommendations
  const totalImpact = useMemo(() => {
    const applied = allRecommendations.filter(rec =>
      appliedRecommendations.includes(rec.id)
    );
    return calculateTotalImpact(applied);
  }, [allRecommendations, appliedRecommendations]);

  // Toggle recommendation as applied/unapplied
  const toggleRecommendation = (recommendationId) => {
    setAppliedRecommendations(prev => {
      if (prev.includes(recommendationId)) {
        return prev.filter(id => id !== recommendationId);
      } else {
        return [...prev, recommendationId];
      }
    });
  };

  // Check if recommendation is applied
  const isApplied = (recommendationId) => {
    return appliedRecommendations.includes(recommendationId);
  };

  // Clear all applied recommendations
  const clearApplied = () => {
    setAppliedRecommendations([]);
  };

  // Apply all recommendations
  const applyAll = () => {
    setAppliedRecommendations(allRecommendations.map(rec => rec.id));
  };

  // Get recommendations by priority
  const getByPriority = (priority) => {
    return allRecommendations.filter(rec => rec.priority === priority);
  };

  // Save to localStorage
  useEffect(() => {
    if (analytics?.accountId && appliedRecommendations.length > 0) {
      const key = `applied_recommendations_${analytics.accountId}`;
      localStorage.setItem(key, JSON.stringify(appliedRecommendations));
    }
  }, [appliedRecommendations, analytics?.accountId]);

  // Load from localStorage
  useEffect(() => {
    if (analytics?.accountId) {
      const key = `applied_recommendations_${analytics.accountId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setAppliedRecommendations(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load saved recommendations:', e);
        }
      }
    }
  }, [analytics?.accountId]);

  return {
    allRecommendations,
    topRecommendations,
    filteredRecommendations,
    appliedRecommendations,
    totalImpact,
    selectedCategory,
    setSelectedCategory,
    toggleRecommendation,
    isApplied,
    clearApplied,
    applyAll,
    getByPriority,
    hasRecommendations: allRecommendations.length > 0
  };
};

/**
 * Custom hook for tracking recommendation progress
 * @param {string|number} accountId - Player's account ID
 * @returns {Object} Progress tracking data
 */
export const useRecommendationProgress = (accountId) => {
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    if (!accountId) return;

    // Load progress data from localStorage
    const key = `recommendation_progress_${accountId}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        setProgressData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load progress data:', e);
      }
    }
  }, [accountId]);

  // Save baseline stats when recommendations are first applied
  const saveBaseline = (analytics) => {
    if (!accountId || !analytics) return;

    const baseline = {
      timestamp: new Date().toISOString(),
      kda: analytics.kda,
      winRate: analytics.winRate,
      farm: analytics.farm,
      matchCount: analytics.matchCount
    };

    const key = `recommendation_progress_${accountId}`;
    localStorage.setItem(key, JSON.stringify({
      baseline,
      checkpoints: []
    }));

    setProgressData({ baseline, checkpoints: [] });
  };

  // Add a progress checkpoint
  const addCheckpoint = (analytics, note = '') => {
    if (!accountId || !analytics || !progressData) return;

    const checkpoint = {
      timestamp: new Date().toISOString(),
      kda: analytics.kda,
      winRate: analytics.winRate,
      farm: analytics.farm,
      matchCount: analytics.matchCount,
      note
    };

    const updated = {
      ...progressData,
      checkpoints: [...(progressData.checkpoints || []), checkpoint]
    };

    const key = `recommendation_progress_${accountId}`;
    localStorage.setItem(key, JSON.stringify(updated));
    setProgressData(updated);
  };

  // Calculate improvement from baseline
  const calculateImprovement = (analytics) => {
    if (!progressData?.baseline || !analytics) return null;

    const baseline = progressData.baseline;
    const current = analytics;

    return {
      kdaChange: (parseFloat(current.kda.kdaRatio) - parseFloat(baseline.kda.kdaRatio)).toFixed(2),
      deathsChange: (parseFloat(current.kda.avgDeaths) - parseFloat(baseline.kda.avgDeaths)).toFixed(1),
      winRateChange: (parseFloat(current.winRate.winRate) - parseFloat(baseline.winRate.winRate)).toFixed(1),
      gpmChange: current.farm && baseline.farm
        ? (current.farm.avgGPM - baseline.farm.avgGPM).toFixed(0)
        : 0,
      matchesAnalyzed: current.matchCount - baseline.matchCount
    };
  };

  return {
    progressData,
    saveBaseline,
    addCheckpoint,
    calculateImprovement,
    hasBaseline: !!progressData?.baseline
  };
};
