import { simulateDelay } from './client';
import { MOCK_ANIME } from '../data/mockData';
import type { Anime } from '../types/anime';

// Returns recommendations for a given anime ID.
// In production, this would call GET /api/recommendations/{id}
// backed by a content-based or collaborative filtering ML model.
export async function getRecommendations(animeId: string): Promise<Anime[]> {
  await simulateDelay(null, 500);

  const source = MOCK_ANIME.find((a) => a.id === animeId);
  if (!source) return MOCK_ANIME.slice(0, 6);

  // Simple mock: find anime sharing at least one genre, excluding the source
  const similar = MOCK_ANIME.filter(
    (a) =>
      a.id !== animeId &&
      a.genres.some((g) => source.genres.includes(g))
  )
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return similar.length >= 3 ? similar : MOCK_ANIME.filter((a) => a.id !== animeId).slice(0, 6);
}

export async function getTopRecommendations(): Promise<Anime[]> {
  await simulateDelay(null, 400);
  return [...MOCK_ANIME].sort((a, b) => b.score - a.score).slice(0, 8);
}

export async function getHiddenGems(): Promise<Anime[]> {
  await simulateDelay(null, 400);
  // "Hidden gems": high score but lower popularity (popularity rank > 12)
  return MOCK_ANIME.filter((a) => a.score >= 8.5 && a.popularity > 12).slice(0, 6);
}

export async function getGenreRecommendations(genre: string): Promise<Anime[]> {
  await simulateDelay(null, 400);
  return MOCK_ANIME.filter((a) => a.genres.includes(genre))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

