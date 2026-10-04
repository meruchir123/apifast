import { simulateDelay } from './client';
import {
  MOCK_ANALYTICS_OVERVIEW,
  MOCK_GENRE_ANALYTICS,
  MOCK_SCORE_DISTRIBUTION,
  MOCK_RELEASE_TREND,
  MOCK_REVIEW_VOLUME,
  MOCK_SCORE_VS_POPULARITY,
  MOCK_REVIEWS_OVER_TIME,
} from '../data/mockData';
import type {
  AnalyticsOverview,
  GenreAnalytic,
  ScoreDistributionBucket,
  ReleaseTrend,
  ReviewVolumeBucket,
  ScoreVsPopularity,
  ReviewsOverTime,
} from '../types/analytics';

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  await simulateDelay(null, 300);
  return MOCK_ANALYTICS_OVERVIEW;
}

export async function getGenreAnalytics(): Promise<GenreAnalytic[]> {
  await simulateDelay(null);
  return MOCK_GENRE_ANALYTICS;
}

export async function getRatingAnalytics(): Promise<ScoreDistributionBucket[]> {
  await simulateDelay(null);
  return MOCK_SCORE_DISTRIBUTION;
}

export async function getReleaseTrend(): Promise<ReleaseTrend[]> {
  await simulateDelay(null);
  return MOCK_RELEASE_TREND;
}

export async function getReviewVolumeAnalytics(): Promise<ReviewVolumeBucket[]> {
  await simulateDelay(null);
  return MOCK_REVIEW_VOLUME;
}

export async function getScoreVsPopularity(): Promise<ScoreVsPopularity[]> {
  await simulateDelay(null);
  return MOCK_SCORE_VS_POPULARITY;
}

export async function getReviewsOverTime(): Promise<ReviewsOverTime[]> {
  await simulateDelay(null);
  return MOCK_REVIEWS_OVER_TIME;
}

