import React, { useState } from 'react';
import { ChartCard } from '../components/analytics/ChartCard';
import { GenreChart } from '../components/analytics/GenreChart';
import { ScoreDistribution } from '../components/analytics/ScoreDistribution';
import { PopularityChart } from '../components/analytics/PopularityChart';
import { ReleaseTrendChart, ReviewsOverTimeChart } from '../components/analytics/TrendChart';
import { ChartSkeleton } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { useAsync } from '../hooks/useAsync';
import {
  getGenreAnalytics,
  getRatingAnalytics,
  getReleaseTrend,
  getReviewVolumeAnalytics,
  getScoreVsPopularity,
  getReviewsOverTime,
} from '../api/analytics';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const TABS = ['Overview', 'Genre Analysis', 'Rating Analysis', 'Review Analysis', 'Release Trends'] as const;
type Tab = typeof TABS[number];

const ReviewVolumeTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <p className="text-xs text-slate-600">Anime: <strong>{payload[0]?.value?.toLocaleString()}</strong></p>
      {payload[1] && <p className="text-xs text-slate-600">Avg Rating: <strong>{payload[1]?.value?.toFixed(1)}</strong></p>}
    </div>
  );
};

export function Analytics() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const genreState = useAsync(getGenreAnalytics, []);
  const scoreState = useAsync(getRatingAnalytics, []);
  const trendState = useAsync(getReleaseTrend, []);
  const reviewVolState = useAsync(getReviewVolumeAnalytics, []);
  const scatterState = useAsync(getScoreVsPopularity, []);
  const reviewTimeState = useAsync(getReviewsOverTime, []);

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
            <ChartCard title="Average Score by Genre" subtitle="Mean score across genres">
              {genreState.loading ? <ChartSkeleton /> :
                genreState.error ? <ErrorState description={genreState.error} onRetry={genreState.refetch} /> :
                genreState.data ? <GenreChart data={genreState.data} dataKey="avgScore" label="Avg Score" /> : null}
            </ChartCard>
            <ChartCard title="Score vs Popularity" subtitle="Score and popularity rank correlation">
              {scatterState.loading ? <ChartSkeleton /> :
                scatterState.error ? <ErrorState description={scatterState.error} onRetry={scatterState.refetch} /> :
                scatterState.data ? <PopularityChart data={scatterState.data} /> : null}
            </ChartCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Score Distribution" subtitle="Anime count by score range">
              {scoreState.loading ? <ChartSkeleton /> :
                scoreState.error ? <ErrorState description={scoreState.error} onRetry={scoreState.refetch} /> :
                scoreState.data ? <ScoreDistribution data={scoreState.data} /> : null}
            </ChartCard>
            <ChartCard title="Reviews Over Time" subtitle="Cumulative review volume growth">
              {reviewTimeState.loading ? <ChartSkeleton /> :
                reviewTimeState.error ? <ErrorState description={reviewTimeState.error} onRetry={reviewTimeState.refetch} /> :
                reviewTimeState.data ? <ReviewsOverTimeChart data={reviewTimeState.data} /> : null}
            </ChartCard>
          </div>
        </div>
      )}

      {/* Genre Analysis */}
      {activeTab === 'Genre Analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Anime Count by Genre" subtitle="Number of anime per genre">
              {genreState.loading ? <ChartSkeleton height={360} /> :
                genreState.data ? <GenreChart data={genreState.data} dataKey="count" label="Anime Count" /> : null}
            </ChartCard>
            <ChartCard title="Average Score by Genre" subtitle="Mean score per genre">
              {genreState.loading ? <ChartSkeleton height={360} /> :
                genreState.data ? <GenreChart data={genreState.data} dataKey="avgScore" label="Avg Score" /> : null}
            </ChartCard>
          </div>
          <p className="text-xs text-slate-400 text-center">Genre statistics are aggregated from the anime catalog. Higher-count genres may exhibit score regression toward the mean.</p>
        </div>
      )}

      {/* Rating Analysis */}
      {activeTab === 'Rating Analysis' && (
        <div className="space-y-6">
          <ChartCard title="Score Distribution" subtitle="Distribution of anime scores across the catalog">
            {scoreState.loading ? <ChartSkeleton height={280} /> :
              scoreState.data ? <ScoreDistribution data={scoreState.data} /> : null}
          </ChartCard>
          <ChartCard title="Score vs Popularity Correlation" subtitle="How score and popularity ranking relate">
            {scatterState.loading ? <ChartSkeleton height={300} /> :
              scatterState.data ? <PopularityChart data={scatterState.data} /> : null}
          </ChartCard>
        </div>
      )}

      {/* Review Analysis */}
      {activeTab === 'Review Analysis' && (
        <div className="space-y-6">
          <ChartCard title="Review Volume by Anime" subtitle="Anime bucketed by number of reviews received">
            {reviewVolState.loading ? <ChartSkeleton height={280} /> :
              reviewVolState.error ? <ErrorState description={reviewVolState.error} onRetry={reviewVolState.refetch} /> :
              reviewVolState.data ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={reviewVolState.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ReviewVolumeTooltip />} />
                    <Bar yAxisId="left" dataKey="count" name="Anime Count" fill="#6366f1" radius={[4,4,0,0]} maxBarSize={48} />
                    <Bar yAxisId="right" dataKey="avgRating" name="Avg Rating" fill="#a78bfa" radius={[4,4,0,0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
          </ChartCard>
          <ChartCard title="Reviews Over Time" subtitle="Review volume growth over the platform lifetime">
            {reviewTimeState.loading ? <ChartSkeleton height={240} /> :
              reviewTimeState.data ? <ReviewsOverTimeChart data={reviewTimeState.data} /> : null}
          </ChartCard>
          <p className="text-xs text-slate-400 text-center">Review volume categories: 10–20, 21–50, 51–100, 101–500, 500+. Average rating shown per bucket.</p>
        </div>
      )}

      {/* Release Trends */}
      {activeTab === 'Release Trends' && (
        <div className="space-y-6">
          <ChartCard title="Anime Release Trend" subtitle="Annual number of anime released by year">
            {trendState.loading ? <ChartSkeleton height={280} /> :
              trendState.data ? <ReleaseTrendChart data={trendState.data} /> : null}
          </ChartCard>
          <p className="text-xs text-slate-400 text-center">Release counts are based on first-aired dates in the AniVerse catalog. Recent years may include ongoing series.</p>
        </div>
      )}
    </div>
  );
}
