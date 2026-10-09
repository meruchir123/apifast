
import React from 'react';
import { Database, Star, BarChart3, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { StatCard } from '../components/analytics/StatCard';
import { ChartCard } from '../components/analytics/ChartCard';
import { ReleaseTrendChart } from '../components/analytics/TrendChart';
import { ScoreDistribution } from '../components/analytics/ScoreDistribution';
import { GenreChart } from '../components/analytics/GenreChart';
import {
  StatCardSkeleton,
  ChartSkeleton,
} from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { useAsync } from '../hooks/useAsync';

import {
  getAnalyticsOverview,
  getReleaseTrend,
  getRatingAnalytics,
  getGenreAnalytics,
} from '../api/analytics';

import { getTopRatedAnime } from '../api/anime';
import { FALLBACK_IMAGE } from '../data/mockData';

export function Dashboard() {
  const navigate = useNavigate();

  const overviewState = useAsync(getAnalyticsOverview, []);
  const trendState = useAsync(getReleaseTrend, []);
  const scoreState = useAsync(getRatingAnalytics, []);
  const genreState = useAsync(getGenreAnalytics, []);
  const topRatedState = useAsync(() => getTopRatedAnime(7), []);

  const overview = overviewState.data;

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewState.loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
        ) : overviewState.error ? (
          <div className="col-span-4">
            <ErrorState
              description={overviewState.error}
              onRetry={overviewState.refetch}
            />
          </div>
        ) : overview ? (
          <>
            <StatCard
              title="Total Anime"
              value={(overview.total_anime ?? 0).toLocaleString()}
              icon={<Database className="w-4 h-4" />}
              iconColor="bg-indigo-50 text-indigo-600"
              description="Unique titles in catalog"
            />

            <StatCard
              title="Total Reviews"
              value="—"
              icon={<Star className="w-4 h-4" />}
              iconColor="bg-violet-50 text-violet-600"
              description="Review data not connected yet"
            />

            <StatCard
              title="Avg. Anime Score"
              value={
                overview.average_score != null
                  ? Number(overview.average_score).toFixed(2)
                  : '—'
              }
              icon={<BarChart3 className="w-4 h-4" />}
              iconColor="bg-amber-50 text-amber-600"
              description="Out of 10.0"
            />

            <StatCard
              title="Genres"
              value={(overview.total_genres ?? 0).toLocaleString()}
              icon={<Hash className="w-4 h-4" />}
              iconColor="bg-emerald-50 text-emerald-600"
              description="Unique genre categories"
            />
          </>
        ) : null}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Anime Release Trend"
          subtitle="Annual anime release volume over time"
        >
          {trendState.loading ? (
            <ChartSkeleton height={220} />
          ) : trendState.error ? (
            <ErrorState
              description={trendState.error}
              onRetry={trendState.refetch}
            />
          ) : trendState.data ? (
            <ReleaseTrendChart data={trendState.data} />
          ) : null}
        </ChartCard>

        <ChartCard
          title="Score Distribution"
          subtitle="Anime count by score range"
        >
          {scoreState.loading ? (
            <ChartSkeleton height={220} />
          ) : scoreState.error ? (
            <ErrorState
              description={scoreState.error}
              onRetry={scoreState.refetch}
            />
          ) : scoreState.data ? (
            <ScoreDistribution data={scoreState.data} />
          ) : null}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ChartCard
          title="Top Genres by Count"
          subtitle="Anime count per genre"
          className="lg:col-span-3"
        >
          {genreState.loading ? (
            <ChartSkeleton height={280} />
          ) : genreState.error ? (
            <ErrorState
              description={genreState.error}
              onRetry={genreState.refetch}
            />
          ) : genreState.data ? (
            <GenreChart
              data={genreState.data}
              dataKey="anime_count"
              label="Anime Count"
            />
          ) : null}
        </ChartCard>

        {/* Top Rated */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">
              Top Rated Anime
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Highest scored titles
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {topRatedState.loading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="skeleton w-8 h-10 rounded" />
                  <div className="flex-1 space-y-1">
                    <div className="skeleton h-3 w-3/4 rounded" />
                    <div className="skeleton h-2.5 w-1/2 rounded" />
                  </div>
                </div>
              ))
            ) : topRatedState.error ? (
              <div className="p-4">
                <ErrorState
                  description={topRatedState.error}
                  onRetry={topRatedState.refetch}
                />
              </div>
            ) : topRatedState.data?.length ? (
              topRatedState.data.map((anime, i) => (
                <button
                  key={anime.id}
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-400 w-4 shrink-0">
                    {i + 1}
                  </span>

                  <img
                    src={anime.imageUrl ?? anime.image_url ?? FALLBACK_IMAGE}
                    alt={anime.title}
                    className="w-8 h-10 rounded object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {anime.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {(anime.genres ?? []).slice(0, 2).join(', ')}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-indigo-600 shrink-0">
                    {anime.score != null
                      ? Number(anime.score).toFixed(1)
                      : '—'}
                  </span>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-slate-500">
                No anime data available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">
              Recent Activity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest platform activity
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="px-4 py-4 text-sm text-slate-500">
              Live activity tracking is not connected yet.
            </div>
          </div>
        </div>

        {/* Sentiment Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Sentiment Overview
          </h3>

          <p className="text-sm text-slate-500">
            Sentiment analytics will be available when review data is
            integrated into AniVerse.
          </p>
        </div>
      </div>
    </div>
  );
}

