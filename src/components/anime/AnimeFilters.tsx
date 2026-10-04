import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../common/Button';
import type { AnimeSearchParams } from '../../types/anime';

interface AnimeFiltersProps {
  filters: AnimeSearchParams;
  genres: string[];
  onChange: (filters: Partial<AnimeSearchParams>) => void;
  onReset: () => void;
}

export function AnimeFilters({ filters, genres, onChange, onReset }: AnimeFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </div>
        <button onClick={onReset} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
          Reset
        </button>
      </div>

      {/* Genre */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5" htmlFor="genre-filter">Genre</label>
        <select
          id="genre-filter"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          value={filters.genre ?? ''}
          onChange={(e) => onChange({ genre: e.target.value })}
        >
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Score range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5" htmlFor="min-score">Min Score</label>
          <input
            id="min-score"
            type="number"
            min={1} max={10} step={0.5}
            placeholder="1.0"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.minScore ?? ''}
            onChange={(e) => onChange({ minScore: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5" htmlFor="max-score">Max Score</label>
          <input
            id="max-score"
            type="number"
            min={1} max={10} step={0.5}
            placeholder="10"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.maxScore ?? ''}
            onChange={(e) => onChange({ maxScore: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* Sort by */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5" htmlFor="sort-by">Sort By</label>
        <select
          id="sort-by"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          value={filters.sortBy ?? 'popularity'}
          onChange={(e) => onChange({ sortBy: e.target.value as AnimeSearchParams['sortBy'] })}
        >
          <option value="popularity">Popularity</option>
          <option value="score">Score</option>
          <option value="rank">Rank</option>
          <option value="members">Members</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  );
}
