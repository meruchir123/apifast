
import { apiClient } from './client';
import { getAnime, getTopRatedAnime } from './anime';

// Top-rated anime from the real analytics API.
export async function getTopRecommendations() {
  return getTopRatedAnime(8);
}

// Highly rated anime with lower popularity are treated as hidden gems.
// This is a simple rule-based selection, not an ML recommendation model.
export async function getHiddenGems() {
  const response = await getAnime({
    minScore: 8.5,
    sortBy: 'popularity',
    sortOrder: 'asc',
    page: 1,
    limit: 6,
  });

  return response.data ?? [];
}

// Find anime belonging to the selected genre.
export async function getGenreRecommendations(genre) {
  if (!genre?.trim()) {
    return [];
  }

  const response = await getAnime({
    genre: genre.trim(),
    sortBy: 'score',
    sortOrder: 'desc',
    page: 1,
    limit: 6,
  });

  return response.data ?? [];
}

// Recommendations for an individual anime detail page.
// Uses shared genres as a simple similarity rule for now.
export async function getRecommendations(animeId) {
  const source = await apiClient.get(`/api/anime/${animeId}`);
  const genres = (source.genres ?? []).map((genre) =>
    typeof genre === 'string' ? genre : genre.name
  );

  if (genres.length === 0) {
    return [];
  }

  const results = await Promise.all(
    genres.slice(0, 2).map((genre) =>
      getAnime({
        genre,
        sortBy: 'score',
        sortOrder: 'desc',
        page: 1,
        limit: 6,
      })
    )
  );

  const sourceId = source.id;

  const uniqueAnime = new Map();

  results.forEach((result) => {
    (result.data ?? []).forEach((anime) => {
      if (anime.id !== sourceId) {
        uniqueAnime.set(anime.id, anime);
      }
    });
  });

  return [...uniqueAnime.values()]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 6);
}
