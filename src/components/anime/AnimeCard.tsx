import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { Anime } from '../../types/anime';
import { FALLBACK_IMAGE } from '../../data/mockData';

interface AnimeCardProps {
  anime: Anime;
  compact?: boolean;
}

export function AnimeCard({ anime, compact = false }: AnimeCardProps) {
  const navigate = useNavigate();

  return (
    <article
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col"
      onClick={() => navigate(`/anime/${anime.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/anime/${anime.id}`)}
      aria-label={`View details for ${anime.title}`}
    >
      <div className="relative overflow-hidden shrink-0">
        <img
          src={anime.imageUrl}
          alt={`${anime.title} poster`}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            compact ? 'h-44' : 'h-56'
          }`}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
          loading="lazy"
        />
        {/* Score badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          {anime.score.toFixed(1)}
        </div>
        {/* Rank badge */}
        {anime.rank <= 20 && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            #{anime.rank}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 min-h-0">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-1.5">
          {anime.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {anime.genres.slice(0, 2).map((g) => (
            <Badge key={g} size="sm" variant="default">{g}</Badge>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{(anime.members / 1000).toFixed(0)}K</span>
          </div>
          {anime.episodes && (
            <span>{anime.episodes} ep</span>
          )}
        </div>
      </div>
    </article>
  );
}
