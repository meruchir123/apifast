
import { apiClient } from './client';

// Convert backend field names into the format used by frontend components.
function normalizeAnime(anime) {
  return {
    ...anime,
    id: anime.id,
    sourceId: anime.source_id,
    title:
      anime.title_english ||
      anime.title ||
      anime.title_native ||
      'Untitled',
    japaneseTitle: anime.title_native || '',
    synopsis: anime.synopsis || '',
    imageUrl: anime.image_url || null,
    bannerUrl: anime.banner_url || null,
    score: anime.score ?? null,
    popularity: anime.popularity ?? null,
    members: anime.popularity ?? 0,
    favourites: anime.favourites ?? 0,
    episodes: anime.episodes ?? null,
    year: anime.season_year ?? null,
    format: anime.anime_format ?? null,
    status: anime.status ?? null,
    genres: Array.isArray(anime.genres)
      ? anime.genres.map((genre) =>
          typeof genre === 'string' ? genre : genre.name
        )
      : [],
  };
}

// Fetch anime with optional search, filters, sorting, and pagination.
export async function getAnime(params = {}) {
  const response = await apiClient.get('/api/anime', {
    query: params.query || undefined,
    genre: params.genre || undefined,
    min_score: params.minScore ?? undefined,
    max_score: params.maxScore ?? undefined,
    year: params.year ?? undefined,
    sort_by: params.sortBy ?? 'popularity',
    sort_order: params.sortOrder ?? 'desc',
    page: params.page ?? 1,
    limit: params.limit ?? 12,
  });

  return {
    ...response,
    data: (response.data ?? []).map(normalizeAnime),
  };
}

// Fetch one anime using its internal database ID.
export async function getAnimeById(id) {
  try {
    const anime = await apiClient.get(`/api/anime/${id}`);
    return normalizeAnime(anime);
  } catch (error) {
    if (String(error.message).includes('404')) {
      return null;
    }
    throw error;
  }
}

// Search anime by title.
export async function searchAnime(query) {
  if (!query?.trim()) return [];

  const response = await apiClient.get('/api/anime', {
    query: query.trim(),
    page: 1,
    limit: 8,
    sort_by: 'popularity',
    sort_order: 'desc',
  });

  return (response.data ?? []).map(normalizeAnime);
}

// Fetch available genres for filters.
export async function getGenres() {
  const genres = await apiClient.get('/api/genres');

  return genres.map((genre) =>
    typeof genre === 'string' ? genre : genre.name
  );
}

// Keep these exports for pages that already import them.
export async function getTopRatedAnime(limit = 5) {
  const response = await apiClient.get('/api/analytics/top-rated', {
    limit,
  });

  return response.map(normalizeAnime);
}

export async function getFeaturedAnime(limit = 4) {
  return getTopRatedAnime(limit);
}
