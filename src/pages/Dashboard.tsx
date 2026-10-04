import React, { useCallback } from 'react';
import { Database, Star, BarChart3, Hash, Activity, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '../components/analytics/StatCard';
import { ChartCard } from '../components/analytics/ChartCard';
import { ReleaseTrendChart } from '../components/analytics/TrendChart';
import { ScoreDistribution } from '../components/analytics/ScoreDistribution';
import { GenreChart } from '../components/analytics/GenreChart';
import { StatCardSkeleton, ChartSkeleton } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { Badge } from '../components/common/Badge';
import { useAsync } from '../hooks/useAsync';
import { getAnalyticsOverview, getReleaseTrend, getRatingAnalytics, getGenreAnalytics } from '../api/analytics';
import { getTopRatedAnime } from '../api/anime';
import { MOCK_RECENT_ACTIVITY, FALLBACK_IMAGE } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

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
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : overviewState.error ? (
          <div className="col-span-4"><ErrorState description={overviewState.error} onRetry={overviewState.refetch} /></div>
        ) : overview ? (
          <>
            <StatCard
              title="Total Anime"
              value={overview.totalAnime.toLocaleString()}
              change="+1.2%"
              up
              icon={<Database className="w-4 h-4" />}
              iconColor="bg-indigo-50 text-indigo-600"
              description="Unique titles in catalog"
            />
            <StatCard
              title="Total Reviews"
              value={overview.totalReviews.toLocaleString()}
              change="+4.8%"
              up
              icon={<Star className="w-4 h-4" />}
              iconColor="bg-violet-50 text-violet-600"
              description="Community reviews"
            />
            <StatCard
              title="Avg. Anime Score"
              value={overview.avgScore.toFixed(2)}
              change="+0.03"
              up
              icon={<BarChart3 className="w-4 h-4" />}
              iconColor="bg-amber-50 text-amber-600"
              description="Out of 10.0"
            />
            <StatCard
              title="Genres"
              value={`${overview.totalGenres}+`}
              icon={<Hash className="w-4 h-4" />}
              iconColor="bg-emerald-50 text-emerald-600"
              description="Unique genre categories"
            />
          </>
        ) : null}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Anime Release Trend" subtitle="Annual anime release volume over time">
          {trendState.loading ? <ChartSkeleton height={220} /> :
            trendState.error ? <ErrorState description={trendState.error} onRetry={trendState.refetch} /> :
            trendState.data ? <ReleaseTrendChart data={trendState.data} /> : null}
        </ChartCard>

        <ChartCard title="Score Distribution" subtitle="Anime count by score range">
          {scoreState.loading ? <ChartSkeleton height={220} /> :
            scoreState.error ? <ErrorState description={scoreState.error} onRetry={scoreState.refetch} /> :
            scoreState.data ? <ScoreDistribution data={scoreState.data} /> : null}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top Genres */}
        <ChartCard title="Top Genres by Count" subtitle="Anime count per genre" className="lg:col-span-3">
          {genreState.loading ? <ChartSkeleton height={280} /> :
            genreState.error ? <ErrorState description={genreState.error} onRetry={genreState.refetch} /> :
            genreState.data ? <GenreChart data={genreState.data} dataKey="count" label="Anime Count" /> : null}
        </ChartCard>

        {/* Top Rated */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Top Rated Anime</h3>
            <p className="text-xs text-slate-400 mt-0.5">Highest scored titles</p>
          </div>
          <div className="divide-y divide-slate-100">
            {topRatedState.loading ?
              Array.from({length: 7}).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="skeleton w-8 h-10 rounded" />
                  <div className="flex-1 space-y-1">
                    <div className="skeleton h-3 w-3/4 rounded" />
                    <div className="skeleton h-2.5 w-1/2 rounded" />
                  </div>
                </div>
              ))
            : topRatedState.data?.map((anime, i) => (
              <button
                key={anime.id}
                onClick={() => navigate(`/anime/${anime.id}`)}
                className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-400 w-4 shrink-0">{i + 1}</span>
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className="w-8 h-10 rounded object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{anime.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{anime.genres.slice(0,2).join(', ')}</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 shrink-0">{anime.score.toFixed(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest platform activity</p>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  item.type === 'review' ? 'bg-indigo-500' :
                  item.type === 'pipeline' ? 'bg-emerald-500' :
                  item.type === 'discovery' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700">{item.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Sentiment Overview</h3>
          {overview && (
            <div className="space-y-3">
              {[
                { label: 'Positive Reviews', pct: overview.positiveReviewPct, color: 'bg-emerald-500' },
                { label: 'Neutral Reviews', pct: overview.neutralReviewPct, color: 'bg-slate-300' },
                { label: 'Negative Reviews', pct: overview.negativeReviewPct, color: 'bg-red-400' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600">{s.label}</span>
                    <span className="font-semibold text-slate-800">{s.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all duration-500`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
