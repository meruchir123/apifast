export interface Anime {
  id: string;
  title: string;
  japaneseTitle: string;
  synopsis: string;
  genres: string[];
  aired: {
    from: string;
    to: string | null;
  };
  episodes: number | null;
  members: number;
  popularity: number;
  rank: number;
  score: number;
  imageUrl: string;
  source: string;
  studio: string;
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired';
  type: 'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA';
  rating: string;
}

export interface AnimeSearchParams {
  query?: string;
  genre?: string;
  minScore?: number;
  maxScore?: number;
  year?: number;
  episodes?: string;
  sortBy?: 'score' | 'popularity' | 'rank' | 'members' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedAnime {
  data: Anime[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

