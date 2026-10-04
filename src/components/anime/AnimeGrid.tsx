import React from 'react';
import { AnimeCard } from './AnimeCard';
import { CardSkeleton } from '../common/Loading';
import { EmptyState } from '../common/EmptyState';
import type { Anime } from '../../types/anime';

interface AnimeGridProps {
  anime: Anime[];
  loading?: boolean;
  skeletonCount?: number;
}

export function AnimeGrid({ anime, loading = false, skeletonCount = 12 }: AnimeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (anime.length === 0) {
    return (
      <EmptyState
        title="No anime found"
        description="Try adjusting your search or filters to find anime."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {anime.map((a) => (
        <AnimeCard key={a.id} anime={a} />
      ))}
    </div>
  );
}
