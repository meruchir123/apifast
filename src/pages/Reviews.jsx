import React, { useState, useEffect, useCallback } from 'react';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewFilters } from '../components/reviews/ReviewFilters';
import { Button } from '../components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getReviews } from '../api/reviews';
import { MOCK_ANIME } from '../data/mockData';
const DEFAULT_PARAMS = { sortBy: 'newest', page: 1, limit: 8 };
export function Reviews() {
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getReviews(params)
            .then((res) => { setReviews(res.data); setTotal(res.total); setTotalPages(res.totalPages); })
            .finally(() => setLoading(false));
    }, [params]);
    const updateParams = useCallback((updates) => {
        setParams((prev) => ({ ...prev, ...updates, page: 1 }));
    }, []);
    const animeOptions = MOCK_ANIME.map((a) => ({ id: a.id, title: a.title }));
    const page = params.page ?? 1;
    return (<div className="space-y-5">
      <ReviewFilters params={params} animeOptions={animeOptions} onChange={updateParams} onReset={() => setParams(DEFAULT_PARAMS)}/>

      {!loading && (<p className="text-sm text-slate-500">
          {total} review{total !== 1 ? 's' : ''} found
        </p>)}

      <ReviewList reviews={reviews} loading={loading} showAnime/>

      {!loading && totalPages > 1 && (<div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page ?? 1) - 1) }))} disabled={page <= 1} icon={<ChevronLeft className="w-4 h-4"/>}>Prev</Button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setParams((p) => ({ ...p, page: Math.min(totalPages, (p.page ?? 1) + 1) }))} disabled={page >= totalPages} icon={<ChevronRight className="w-4 h-4"/>} iconPosition="right">Next</Button>
        </div>)}
    </div>);
}
