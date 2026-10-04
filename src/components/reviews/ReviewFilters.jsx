import React from 'react';
export function ReviewFilters({ params, animeOptions, onChange, onReset }) {
    return (<div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-end gap-3">
      {/* Anime */}
      <div className="min-w-[160px]">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1" htmlFor="rf-anime">Anime</label>
        <select id="rf-anime" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={params.animeId ?? ''} onChange={(e) => onChange({ animeId: e.target.value || undefined })}>
          <option value="">All Anime</option>
          {animeOptions.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </div>

      {/* Sentiment */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1" htmlFor="rf-sentiment">Sentiment</label>
        <select id="rf-sentiment" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={params.sentiment ?? 'All'} onChange={(e) => onChange({ sentiment: e.target.value })}>
          <option value="All">All</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>
      </div>

      {/* Min Rating */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1" htmlFor="rf-min">Min Rating</label>
        <select id="rf-min" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={params.minRating ?? ''} onChange={(e) => onChange({ minRating: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1" htmlFor="rf-sort">Sort By</label>
        <select id="rf-sort" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={params.sortBy ?? 'newest'} onChange={(e) => onChange({ sortBy: e.target.value })}>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      <button onClick={onReset} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-3 py-2 transition-colors">Reset</button>
    </div>);
}
