import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Badge } from '../common/Badge';
import { FALLBACK_IMAGE } from '../../data/mockData';
export function RecommendationCard({ anime }) {
    const navigate = useNavigate();
    return (<article className="flex gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md cursor-pointer transition-all duration-150 group" onClick={() => navigate(`/anime/${anime.id}`)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate(`/anime/${anime.id}`)} aria-label={`View ${anime.title}`}>
      <img src={anime.imageUrl} alt={`${anime.title} poster`} className="w-14 h-20 rounded-lg object-cover shrink-0 group-hover:opacity-90 transition-opacity" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} loading="lazy"/>
      <div className="min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">{anime.title}</h4>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400"/>
            <span className="text-xs font-medium text-slate-700">{anime.score.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {anime.genres.slice(0, 2).map((g) => <Badge key={g} size="sm">{g}</Badge>)}
        </div>
      </div>
    </article>);
}
