import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchAnime } from '../../api/anime';
import type { Anime } from '../../types/anime';
import { useDebounce } from '../../hooks/useDebounce';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    searchAnime(debouncedQuery)
      .then((res) => { setResults(res); setOpen(true); })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const selectAnime = (id: string) => {
    setQuery('');
    setOpen(false);
    navigate(`/anime/${id}`);
  };

  const clear = () => { setQuery(''); setOpen(false); setResults([]); };

  return { query, setQuery, results, loading, open, setOpen, selectAnime, clear };
}

export function Header({ title, subtitle }: HeaderProps) {
  const { query, setQuery, results, loading, open, setOpen, selectAnime, clear } = useSearch();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {title && <h1 className="text-xl font-bold text-slate-900 truncate">{title}</h1>}
          {subtitle && <p className="text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>}
        </div>

        {/* Search */}
        <div className="relative w-72 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search anime…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              aria-label="Search anime"
              aria-expanded={open}
              aria-haspopup="listbox"
            />
            {query && (
              <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Clear search">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
              role="listbox"
              aria-label="Search results"
            >
              {loading ? (
                <div className="p-4 text-sm text-slate-500 text-center">Searching…</div>
              ) : results.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 text-center">No results found</div>
              ) : (
                results.map((anime) => (
                  <button
                    key={anime.id}
                    role="option"
                    aria-selected={false}
                    onClick={() => selectAnime(anime.id)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-8 h-10 rounded object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=112&fit=crop'; }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{anime.title}</p>
                      <p className="text-xs text-slate-500 truncate">{anime.genres.slice(0, 2).join(', ')} • ★ {anime.score}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Backdrop */}
          {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />}
        </div>
      </div>
    </header>
  );
}
