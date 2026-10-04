export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export interface Review {
  id: string;
  animeId: string;
  animeTitle: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  sentiment: Sentiment;
  text: string;
  helpful: number;
}

export interface ReviewSearchParams {
  animeId?: string;
  sentiment?: Sentiment | 'All';
  minRating?: number;
  maxRating?: number;
  sortBy?: 'newest' | 'rating' | 'helpful';
  page?: number;
  limit?: number;
}

export interface PaginatedReviews {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

