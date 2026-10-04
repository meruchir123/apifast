import React, { useState } from 'react';
import { AnimeCard } from '../components/anime/AnimeCard';
import { RecommendationCard } from '../components/anime/RecommendationCard';
import { CardSkeleton } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { useAsync } from '../hooks/useAsync';
import { getTopRecommendations, getHiddenGems, getGenreRecommendations } from '../api/recommendations';
import { Sparkles, Gem, ListFilter } from 'lucide-react';
import { MOCK_GENRES } from '../data/mockData';

const FEATURED_GENRES = ['Action', 'Sci-Fi', 'Romance', 'Mystery', 'Sports'];

function SectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function Recommendations() {
  const [selectedGenre, setSelectedGenre] = useState('Action');

  const topState = useAsync(getTopRecommendations, []);
  const gemsState = useAsync(getHiddenGems, []);
  const genreState = useAsync(() => getGenreRecommendations(selectedGenre), [selectedGenre]);

  return (
    <div className="space-y-10">
      {/* Top recommendations */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800">Top Rated Picks</h2>
        </div>
        {topState.loading ? <SectionSkeleton count={8} /> :
          topState.data ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topState.data.map((a) => <AnimeCard key={a.id} anime={a} />)}
            </div>
          ) : <EmptyState title="No recommendations" description="Try again later." />}
      </section>

      {/* Hidden gems */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Gem className="w-5 h-5 text-violet-500" />
          <h2 className="text-lg font-bold text-slate-800">Hidden Gems</h2>
          <span className="text-xs text-slate-400 ml-1">High-rated, underexplored titles</span>
        </div>
        {gemsState.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({length:6}).map((_,i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : gemsState.data && gemsState.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gemsState.data.map((a) => <RecommendationCard key={a.id} anime={a} />)}
          </div>
        ) : <EmptyState title="No hidden gems found" description="" />}
      </section>

      {/* Genre-based */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <ListFilter className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-slate-800">Browse by Genre</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {FEATURED_GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedGenre === g
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        {genreState.loading ? <SectionSkeleton count={6} /> :
          genreState.data ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {genreState.data.map((a) => <AnimeCard key={a.id} anime={a} />)}
            </div>
          ) : <EmptyState title="No anime found for this genre" description="" />}
      </section>
    </div>
  );
}
