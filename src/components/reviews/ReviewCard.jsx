import React, { useState } from 'react';
import { ThumbsUp, Star } from 'lucide-react';
import { Badge } from '../common/Badge';
function sentimentVariant(s) {
    return s === 'Positive' ? 'positive' : s === 'Neutral' ? 'neutral' : 'negative';
}
function getInitials(username) {
    return username.slice(0, 2).toUpperCase();
}
const AVATAR_COLORS = [
    'bg-indigo-500', 'bg-violet-500', 'bg-blue-500',
    'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];
function avatarColor(username) {
    const idx = username.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
}
export function ReviewCard({ review, showAnime = true }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = review.text.length > 180;
    return (<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full ${avatarColor(review.username)} flex items-center justify-center text-white text-xs font-bold shrink-0`} aria-hidden="true">
          {getInitials(review.username)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-800">{review.username}</span>
            <Badge variant={sentimentVariant(review.sentiment)} size="sm">{review.sentiment}</Badge>
            {showAnime && (<span className="text-xs text-slate-400 truncate max-w-[120px]">on {review.animeTitle}</span>)}
          </div>

          {/* Rating stars */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 10 }).map((_, i) => (<Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}/>))}
            <span className="text-xs font-medium text-slate-600 ml-1">{review.rating}/10</span>
            <span className="text-xs text-slate-400 ml-auto">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Review text */}
          <p className={`text-sm text-slate-600 leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
            {review.text}
          </p>
          {isLong && (<button onClick={() => setExpanded(!expanded)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1 transition-colors">
              {expanded ? 'Show less' : 'Read more'}
            </button>)}

          {/* Helpful */}
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <ThumbsUp className="w-3 h-3"/>
            <span>{review.helpful} found helpful</span>
          </div>
        </div>
      </div>
    </div>);
}
