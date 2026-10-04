import { simulateDelay } from './client';
import { MOCK_ANIME, MOCK_GENRES } from '../data/mockData';
import type { Anime, AnimeSearchParams, PaginatedAnime } from '../types/anime';

export async function getAnime(params?: AnimeSearchParams): Promise<PaginatedAnime> {
  await simulateDelay(null);

  let filtered = [...MOCK_ANIME];

  if (params?.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.japaneseTitle.toLowerCase().includes(q) ||
        a.synopsis.toLowerCase().includes(q)
    );
  }

  if (params?.genre && params.genre !== 'All Genres' && params.genre !== '') {
    filtered = filtered.filter((a) => a.genres.includes(params.genre!));
  }

  if (params?.minScore) {
    filtered = filtered.filter((a) => a.score >= params.minScore!);
  }

  if (params?.maxScore) {
    filtered = filtered.filter((a) => a.score <= params.maxScore!);
  }

  if (params?.year) {
    filtered = filtered.filter((a) => a.aired.from.includes(String(params.year)));
  }

  // Sorting
  const sortBy = params?.sortBy ?? 'popularity';
  const sortOrder = params?.sortOrder ?? 'asc';

  filtered.sort((a, b) => {
    let valA: number | string;
    let valB: number | string;

    switch (sortBy) {
      case 'score':
        valA = a.score;
        valB = b.score;
        break;
      case 'popularity':
        valA = a.popularity;
        valB = b.popularity;
        break;
      case 'rank':
        valA = a.rank;
        valB = b.rank;
        break;
      case 'members':
        valA = a.members;
        valB = b.members;
        break;
      case 'title':
        valA = a.title;
        valB = b.title;
        break;
      default:
        valA = a.popularity;
        valB = b.popularity;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc'
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}

export async function getAnimeById(id: string): Promise<Anime | null> {
  await simulateDelay(null);
  return MOCK_ANIME.find((a) => a.id === id) ?? null;
}

export async function searchAnime(query: string): Promise<Anime[]> {
  await simulateDelay(null, 200);
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return MOCK_ANIME.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.japaneseTitle.toLowerCase().includes(q)
  ).slice(0, 8);
}

export async function getGenres(): Promise<string[]> {
  await simulateDelay(null, 100);
  return MOCK_GENRES;
}

export async function getTopRatedAnime(limit = 5): Promise<Anime[]> {
  await simulateDelay(null, 200);
  return [...MOCK_ANIME].sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function getFeaturedAnime(limit = 4): Promise<Anime[]> {
  await simulateDelay(null, 200);
  return MOCK_ANIME.filter((a) => a.score >= 8.8).slice(0, limit);
}

