import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimeSearch } from '../components/anime/AnimeSearch';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { AnimeFilters } from '../components/anime/AnimeFilters';
import { Button } from '../components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAnime, getGenres } from '../api/anime';
import { useDebounce } from '../hooks/useDebounce';
const DEFAULT_FILTERS = {
    sortBy: 'popularity',
    sortOrder: 'asc',
    page: 1,
    limit: 12,
};
export function Explore() {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        ...DEFAULT_FILTERS,
        query: searchParams.get('q') ?? undefined,
        genre: searchParams.get('genre') ?? undefined,
    });
    const [anime, setAnime] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [genres, setGenres] = useState([]);
    const debouncedQuery = useDebounce(filters.query ?? '', 400);
    useEffect(() => {
        getGenres().then(setGenres);
    }, []);
    useEffect(() => {
        setLoading(true);
        getAnime({ ...filters, query: debouncedQuery || undefined })
            .then((result) => {
            setAnime(result.data);
            setTotal(result.total);
            setTotalPages(result.totalPages);
        })
            .finally(() => setLoading(false));
    }, [debouncedQuery, filters.genre, filters.minScore, filters.maxScore, filters.sortBy, filters.page]);
    const updateFilters = useCallback((updates) => {
        setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
    }, []);
    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);
    const page = filters.page ?? 1;
    return (<div className="space-y-5">
      {/* Search */}
      <AnimeSearch value={filters.query ?? ''} onChange={(q) => setFilters((prev) => ({ ...prev, query: q, page: 1 }))}/>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar filters */}
        <aside className="lg:w-52 shrink-0">
          <AnimeFilters filters={filters} genres={genres} onChange={updateFilters} onReset={resetFilters}/>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Result count */}
          {!loading && (<p className="text-sm text-slate-500">
              Showing {anime.length} of <span className="font-medium text-slate-700">{total}</span> anime
            </p>)}

          <AnimeGrid anime={anime} loading={loading}/>

          {/* Pagination */}
          {!loading && totalPages > 1 && (<div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, (p.page ?? 1) - 1) }))} disabled={page <= 1} icon={<ChevronLeft className="w-4 h-4"/>} aria-label="Previous page">
                Prev
              </Button>
              <span className="text-sm text-slate-600 px-2">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setFilters((p) => ({ ...p, page: Math.min(totalPages, (p.page ?? 1) + 1) }))} disabled={page >= totalPages} icon={<ChevronRight className="w-4 h-4"/>} iconPosition="right" aria-label="Next page">
                Next
              </Button>
            </div>)}
        </div>
      </div>
    </div>);
}
