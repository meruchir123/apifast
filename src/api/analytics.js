import { simulateDelay } from './client';
import { MOCK_ANALYTICS_OVERVIEW, MOCK_GENRE_ANALYTICS, MOCK_SCORE_DISTRIBUTION, MOCK_RELEASE_TREND, MOCK_REVIEW_VOLUME, MOCK_SCORE_VS_POPULARITY, MOCK_REVIEWS_OVER_TIME, } from '../data/mockData';
export async function getAnalyticsOverview() {
    await simulateDelay(null, 300);
    return MOCK_ANALYTICS_OVERVIEW;
}
export async function getGenreAnalytics() {
    await simulateDelay(null);
    return MOCK_GENRE_ANALYTICS;
}
export async function getRatingAnalytics() {
    await simulateDelay(null);
    return MOCK_SCORE_DISTRIBUTION;
}
export async function getReleaseTrend() {
    await simulateDelay(null);
    return MOCK_RELEASE_TREND;
}
export async function getReviewVolumeAnalytics() {
    await simulateDelay(null);
    return MOCK_REVIEW_VOLUME;
}
export async function getScoreVsPopularity() {
    await simulateDelay(null);
    return MOCK_SCORE_VS_POPULARITY;
}
export async function getReviewsOverTime() {
    await simulateDelay(null);
    return MOCK_REVIEWS_OVER_TIME;
}
