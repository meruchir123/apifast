
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Users,
  TrendingUp,
  Hash,
  Calendar,
  Tv,
  BookOpen,
} from 'lucide-react';

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

function DetailStat({ label, value, icon }) {
  return (
    <div className="text-center p-3 bg-slate-50 rounded-xl min-w-0">
      <div className="flex justify-center text-indigo-500 mb-1">
        {icon}
      </div>

      <p className="text-xl font-bold text-slate-900 truncate">
        {value}
      </p>

      <p className="text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

function formatNumber(value) {
  const number = Number(value);

  if (value == null || !Number.isFinite(number)) {
    return 'N/A';
  }

  return number.toLocaleString();
}

export function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const animeState = useAsync(() => getAnimeById(id), [id]);
  const reviewsState = useAsync(() => getAnimeReviews(id), [id]);
  const recsState = useAsync(() => getRecommendations(id), [id]);

  if (animeState.loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-6 w-32" />

        <div className="flex flex-col sm:flex-row gap-6">
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
        description={
          animeState.error
            ? String(animeState.error.message ?? animeState.error)
            : 'This anime could not be found.'
        }
        onRetry={animeState.refetch}
        onBack={() => navigate('/explore')}
      />
    );
  }

  const anime = animeState.data;

  const reviews = Array.isArray(reviewsState.data)
    ? reviewsState.data
    : [];

  const recs = Array.isArray(recsState.data)
    ? recsState.data
    : [];

  const genres = Array.isArray(anime.genres)
    ? anime.genres
        .map((genre) =>
          typeof genre === 'string' ? genre : genre?.name
        )
        .filter(Boolean)
    : [];

  const title =
    anime.title ||
    anime.title_english ||
    anime.title_native ||
    'Untitled Anime';

  const score =
    anime.score != null && Number.isFinite(Number(anime.score))
      ? Number(anime.score).toFixed(1)
      : 'N/A';

  const year = anime.year ?? anime.season_year ?? 'Unknown';

  const format = anime.format ?? anime.anime_format ?? 'Unknown';

  const imageUrl =
    anime.imageUrl ||
    anime.image_url ||
    FALLBACK_IMAGE;

  const metadata = [
    {
      label: 'Year',
      value: year,
      icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
      label: 'Episodes',
      value: anime.episodes ?? 'Unknown',
      icon: <Tv className="w-3.5 h-3.5" />,
    },
    {
      label: 'Format',
      value: format,
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      label: 'Status',
      value: anime.status ?? 'Unknown',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    {
      label: 'Popularity',
      value: formatNumber(anime.popularity),
      icon: <Hash className="w-3.5 h-3.5" />,
    },
    {
      label: 'Favourites',
      value: formatNumber(anime.favourites),
      icon: <Star className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </button>

      {/* Anime header */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="shrink-0">
          <img
            src={imageUrl}
            alt={`${title} poster`}
            className="w-44 h-64 sm:w-52 sm:h-72 object-cover rounded-2xl shadow-lg"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {title}
          </h1>

          {anime.japaneseTitle || anime.title_native ? (
            <p className="text-base text-slate-500 mt-1 italic">
              {anime.japaneseTitle || anime.title_native}
            </p>
          ) : null}

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <DetailStat
              label="Score"
              value={score}
              icon={<Star className="w-4 h-4" />}
            />

            <DetailStat
              label="Rank"
              value={
                anime.rank != null
                  ? `#${anime.rank}`
                  : 'N/A'
              }
              icon={<TrendingUp className="w-4 h-4" />}
            />

            <DetailStat
              label="Popularity"
              value={formatNumber(anime.popularity)}
              icon={<Hash className="w-4 h-4" />}
            />

            <DetailStat
              label="Favourites"
              value={formatNumber(anime.favourites)}
              icon={<Users className="w-4 h-4" />}
            />
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {genres.map((genre) => (
                <Badge key={genre} variant="info">
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {metadata.map(({ label, value, icon }) => (
              <div
                key={label}
                className="flex items-start gap-2 min-w-0"
              >
                <span className="text-slate-400 mt-0.5 shrink-0">
                  {icon}
                </span>

                <span className="text-slate-500 shrink-0">
                  {label}:
                </span>

                <span className="font-medium text-slate-800 break-words">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-3">
          Synopsis
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {anime.synopsis?.trim() || 'No synopsis available yet.'}
        </p>
      </div>

      {/* Community reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">
            Community Reviews

            {reviews.length > 0 && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({reviews.length} reviews)
              </span>
            )}
          </h2>
        </div>

        {reviewsState.loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="skeleton h-28 rounded-xl"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description="Community reviews are not available for this anime yet."
          />
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showAnime={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            You Might Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recs.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                anime={recommendation}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
