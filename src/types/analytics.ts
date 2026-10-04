export interface GenreAnalytic {
  genre: string;
  count: number;
  avgScore: number;
  avgPopularity: number;
}

export interface ScoreDistributionBucket {
  range: string;
  count: number;
}

export interface ReleaseTrend {
  year: number;
  count: number;
}

export interface ReviewVolumeBucket {
  range: string;
  label: string;
  count: number;
  avgRating: number;
}

export interface ScoreVsPopularity {
  title: string;
  score: number;
  popularity: number;
  genre: string;
}

export interface ReviewsOverTime {
  date: string;
  count: number;
}

export interface AnalyticsOverview {
  totalAnime: number;
  totalReviews: number;
  avgScore: number;
  totalGenres: number;
  positiveReviewPct: number;
  negativeReviewPct: number;
  neutralReviewPct: number;
}

export interface PopularityStatCard {
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
}

