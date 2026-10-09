
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { ChartCard } from '../components/analytics/ChartCard';
import { GenreChart } from '../components/analytics/GenreChart';
import { ScoreDistribution } from '../components/analytics/ScoreDistribution';
import { PopularityChart } from '../components/analytics/PopularityChart';
import {
  ReleaseTrendChart,
  ReviewsOverTimeChart,
} from '../components/analytics/TrendChart';

import { ChartSkeleton } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { useAsync } from '../hooks/useAsync';

import {
  getGenreAnalytics,
  getGenreScores,
  getRatingAnalytics,
  getReleaseTrend,
  getReviewVolumeAnalytics,
  getScoreVsPopularity,
  getReviewsOverTime,
} from '../api/analytics';

const TABS = [
  'Overview',
  'Genre Analysis',
  'Rating Analysis',
  'Review Analysis',
  'Release Trends',
];

const ReviewVolumeTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-700">{label}</p>

      <p className="text-xs text-slate-600">
        Anime:{' '}
        <strong>
          {Number(payload[0]?.value ?? 0).toLocaleString()}
        </strong>
      </p>

      {payload[1] && (
        <p className="text-xs text-slate-600">
          Avg Rating:{' '}
          <strong>
            {Number(payload[1].value ?? 0).toFixed(1)}
          </strong>
        </p>
      )}
    </div>
  );
};

export function Analytics() {
  const [activeTab, setActiveTab] = useState('Overview');

  const genreState = useAsync(getGenreAnalytics, []);
  const genreScoreState = useAsync(getGenreScores, []);
  const scoreState = useAsync(getRatingAnalytics, []);
  const trendState = useAsync(getReleaseTrend, []);
  const reviewVolState = useAsync(getReviewVolumeAnalytics, []);
  const scatterState = useAsync(getScoreVsPopularity, []);
  const reviewTimeState = useAsync(getReviewsOverTime, []);

  const genreCountData = (genreState.data ?? []).map((item) => ({
    ...item,
    genre: item.genre,
    anime_count: Number(item.anime_count ?? item.count ?? 0),
  }));

  const genreScoreData = (genreScoreState.data ?? []).map((item) => ({
    ...item,
    genre: item.genre,
    average_score: Number(
      item.average_score ?? item.avgScore ?? item.avg_score ?? 0
    ),
    anime_count: Number(item.anime_count ?? item.count ?? 0),
  }));

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Average Score by Genre"
              subtitle="Mean score across genres"
            >
              {genreScoreState.loading ? (
                <ChartSkeleton />
              ) : genreScoreState.error ? (
                <ErrorState
                  description={genreScoreState.error.message ?? String(genreScoreState.error)}
                  onRetry={genreScoreState.refetch}
                />
              ) : (
                <GenreChart
                  data={genreScoreData}
                  dataKey="average_score"
                  label="Average Score"
                />
              )}
            </ChartCard>

            <ChartCard
              title="Score vs Popularity"
              subtitle="Score and popularity correlation"
            >
              {scatterState.loading ? (
                <ChartSkeleton />
              ) : scatterState.error ? (
                <ErrorState
                  description={scatterState.error.message ?? String(scatterState.error)}
                  onRetry={scatterState.refetch}
                />
              ) : (
                <PopularityChart data={scatterState.data ?? []} />
              )}
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Score Distribution"
              subtitle="Anime count by score range"
            >
              {scoreState.loading ? (
                <ChartSkeleton />
              ) : scoreState.error ? (
                <ErrorState
                  description={scoreState.error.message ?? String(scoreState.error)}
                  onRetry={scoreState.refetch}
                />
              ) : (
                <ScoreDistribution data={scoreState.data ?? []} />
              )}
            </ChartCard>

            <ChartCard
              title="Reviews Over Time"
              subtitle="Cumulative review volume growth"
            >
              {reviewTimeState.loading ? (
                <ChartSkeleton />
              ) : reviewTimeState.error ? (
                <ErrorState
                  description={reviewTimeState.error.message ?? String(reviewTimeState.error)}
                  onRetry={reviewTimeState.refetch}
                />
              ) : (
                <ReviewsOverTimeChart data={reviewTimeState.data ?? []} />
              )}
            </ChartCard>
          </div>
        </div>
      )}

      {/* Genre Analysis */}
      {activeTab === 'Genre Analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Anime Count by Genre"
              subtitle="Number of anime per genre"
            >
              {genreState.loading ? (
                <ChartSkeleton height={360} />
              ) : genreState.error ? (
                <ErrorState
                  description={genreState.error.message ?? String(genreState.error)}
                  onRetry={genreState.refetch}
                />
              ) : (
                <GenreChart
                  data={genreCountData}
                  dataKey="anime_count"
                  label="Anime Count"
                />
              )}
            </ChartCard>

            <ChartCard
              title="Average Score by Genre"
              subtitle="Mean score per genre"
            >
              {genreScoreState.loading ? (
                <ChartSkeleton height={360} />
              ) : genreScoreState.error ? (
                <ErrorState
                  description={genreScoreState.error.message ?? String(genreScoreState.error)}
                  onRetry={genreScoreState.refetch}
                />
              ) : (
                <GenreChart
                  data={genreScoreData}
                  dataKey="average_score"
                  label="Average Score"
                />
              )}
            </ChartCard>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Genre statistics are aggregated from the anime catalog. Average
            scores are calculated from available ratings.
          </p>
        </div>
      )}

      {/* Rating Analysis */}
      {activeTab === 'Rating Analysis' && (
        <div className="space-y-6">
          <ChartCard
            title="Score Distribution"
            subtitle="Distribution of anime scores across the catalog"
          >
            {scoreState.loading ? (
              <ChartSkeleton height={280} />
            ) : scoreState.error ? (
              <ErrorState
                description={scoreState.error.message ?? String(scoreState.error)}
                onRetry={scoreState.refetch}
              />
            ) : (
              <ScoreDistribution data={scoreState.data ?? []} />
            )}
          </ChartCard>

          <ChartCard
            title="Score vs Popularity Correlation"
            subtitle="How score and popularity relate"
          >
            {scatterState.loading ? (
              <ChartSkeleton height={300} />
            ) : scatterState.error ? (
              <ErrorState
                description={scatterState.error.message ?? String(scatterState.error)}
                onRetry={scatterState.refetch}
              />
            ) : (
              <PopularityChart data={scatterState.data ?? []} />
            )}
          </ChartCard>
        </div>
      )}

      {/* Review Analysis */}
      {activeTab === 'Review Analysis' && (
        <div className="space-y-6">
          <ChartCard
            title="Review Volume by Anime"
            subtitle="Anime grouped by review volume"
          >
            {reviewVolState.loading ? (
              <ChartSkeleton height={280} />
            ) : reviewVolState.error ? (
              <ErrorState
                description={reviewVolState.error.message ?? String(reviewVolState.error)}
                onRetry={reviewVolState.refetch}
              />
            ) : (reviewVolState.data ?? []).length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-slate-500">
                Review analytics will appear when real review data is available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={reviewVolState.data}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ReviewVolumeTooltip />} />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    name="Anime Count"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="avgRating"
                    name="Avg Rating"
                    fill="#a78bfa"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="Reviews Over Time"
            subtitle="Review volume growth over the platform lifetime"
          >
            {reviewTimeState.loading ? (
              <ChartSkeleton height={240} />
            ) : reviewTimeState.error ? (
              <ErrorState
                description={reviewTimeState.error.message ?? String(reviewTimeState.error)}
                onRetry={reviewTimeState.refetch}
              />
            ) : (
              <ReviewsOverTimeChart data={reviewTimeState.data ?? []} />
            )}
          </ChartCard>

          <p className="text-xs text-slate-400 text-center">
            Review analytics require a connected review data source.
          </p>
        </div>
      )}

      {/* Release Trends */}
      {activeTab === 'Release Trends' && (
        <div className="space-y-6">
          <ChartCard
            title="Anime Release Trend"
            subtitle="Annual number of anime released by year"
          >
            {trendState.loading ? (
              <ChartSkeleton height={280} />
            ) : trendState.error ? (
              <ErrorState
                description={trendState.error.message ?? String(trendState.error)}
                onRetry={trendState.refetch}
              />
            ) : (
              <ReleaseTrendChart data={trendState.data ?? []} />
            )}
          </ChartCard>

          <p className="text-xs text-slate-400 text-center">
            Release counts are based on years available in the AniVerse catalog.
          </p>
        </div>
      )}
    </div>
  );
}
