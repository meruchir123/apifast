import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, TrendingUp, Hash, Calendar, Tv, BookOpen } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { RecommendationCard } from '../components/anime/RecommendationCard';
import { LoadingSkeleton } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { useAsync } from '../hooks/useAsync';
import { getAnimeById } from '../api/anime';
import { getAnimeReviews } from '../api/reviews';
import { getRecommendations } from '../api/recommendations';
import { FALLBACK_IMAGE } from '../data/mockData';

function DetailStat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="text-center p-3 bg-slate-50 rounded-xl">
      <div className="flex justify-center text-indigo-500 mb-1">{icon}</div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

export function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const animeState = useAsync(() => getAnimeById(id!), [id]);
  const reviewsState = useAsync(() => getAnimeReviews(id!), [id]);
  const recsState = useAsync(() => getRecommendations(id!), [id]);

  if (animeState.loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-6 w-32" />
        <div className="flex gap-6">
          <LoadingSkeleton className="w-48 h-72 shrink-0" />
          <div className="flex-1 space-y-3">
            <LoadingSkeleton className="h-8 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
            <LoadingSkeleton className="h-4 w-1/3" />
            <LoadingSkeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (animeState.error || !animeState.data) {
    return (
      <ErrorState
        title="Anime not found"
        description={animeState.error ?? 'This anime could not be found.'}
        onRetry={animeState.refetch}
        onBack={() => navigate('/explore')}
      />
    );
  }

  const anime = animeState.data;
  const reviews = reviewsState.data ?? [];
  const recs = recsState.data ?? [];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </button>

      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Poster */}
        <div className="shrink-0">
          <img
            src={anime.imageUrl}
            alt={`${anime.title} poster`}
            className="w-44 h-64 sm:w-52 sm:h-72 object-cover rounded-2xl shadow-lg"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">{anime.title}</h1>
          <p className="text-base text-slate-500 mt-1 italic">{anime.japaneseTitle}</p>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 my-5">
            <DetailStat label="Score" value={anime.score.toFixed(1)} icon={<Star className="w-4 h-4" />} />
            <DetailStat label="Rank" value={`#${anime.rank}`} icon={<TrendingUp className="w-4 h-4" />} />
            <DetailStat label="Popularity" value={`#${anime.popularity}`} icon={<Hash className="w-4 h-4" />} />
            <DetailStat label="Members" value={`${(anime.members/1000).toFixed(0)}K`} icon={<Users className="w-4 h-4" />} />
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {anime.genres.map((g) => <Badge key={g} variant="info">{g}</Badge>)}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {[
              { label: 'Aired', value: anime.aired.from + (anime.aired.to ? ` — ${anime.aired.to}` : ' — Ongoing'), icon: <Calendar className="w-3.5 h-3.5" /> },
              { label: 'Episodes', value: anime.episodes ? String(anime.episodes) : 'Ongoing', icon: <Tv className="w-3.5 h-3.5" /> },
              { label: 'Studio', value: anime.studio, icon: <BookOpen className="w-3.5 h-3.5" /> },
              { label: 'Source', value: anime.source, icon: <BookOpen className="w-3.5 h-3.5" /> },
              { label: 'Status', value: anime.status, icon: <TrendingUp className="w-3.5 h-3.5" /> },
              { label: 'Type', value: anime.type, icon: <Tv className="w-3.5 h-3.5" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-slate-400 mt-0.5">{icon}</span>
                <span className="text-slate-500">{label}:</span>
                <span className="font-medium text-slate-800 truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-3">Synopsis</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{anime.synopsis}</p>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">
            Community Reviews
            {reviews.length > 0 && (
              <span className="ml-2 text-xs font-normal text-slate-400">({reviews.length} reviews)</span>
            )}
          </h2>
        </div>
        {reviewsState.loading ? (
          <div className="space-y-3">
            {Array.from({length:3}).map((_,i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState title="No reviews yet" description="Be the first to review this anime." />
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map((r) => <ReviewCard key={r.id} review={r} showAnime={false} />)}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-800 mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recs.map((rec) => <RecommendationCard key={rec.id} anime={rec} />)}
          </div>
        </div>
      )}
    </div>
  );
}
