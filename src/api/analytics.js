
import { apiClient } from './client';

// Real FastAPI endpoints
export function getAnalyticsOverview() {
  return apiClient.get('/api/analytics/overview');
}

export function getGenreAnalytics() {
  return apiClient.get('/api/analytics/genres');
}

export function getRatingAnalytics() {
  return apiClient.get('/api/analytics/ratings');
}

export function getReleaseTrend() {
  return apiClient.get('/api/analytics/trends');
}

export function getFormatAnalytics() {
  return apiClient.get('/api/analytics/formats');
}

export function getTopRatedAnime(limit = 10) {
  return apiClient.get('/api/analytics/top-rated', { limit });
}

export function getPopularAnime(limit = 10) {
  return apiClient.get('/api/analytics/popularity', { limit });
}

export function getGenreScores() {
  return apiClient.get('/api/analytics/genre-scores');
}

// These two analytics are not available from the current backend yet.
// Review data has not been ingested from AniList.
export async function getReviewVolumeAnalytics() {
  return [];
}

export async function getReviewsOverTime() {
  return [];
}

// Popularity rankings are available, but a true score-vs-popularity
// scatter plot should be built separately using both fields.
export function getScoreVsPopularity() {
  return apiClient.get('/api/analytics/popularity');
}
