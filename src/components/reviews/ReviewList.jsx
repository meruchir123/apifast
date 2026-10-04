import React from 'react';
import { ReviewCard } from './ReviewCard';
import { EmptyState } from '../common/EmptyState';
import { TableRowSkeleton } from '../common/Loading';
export function ReviewList({ reviews, loading = false, showAnime = true }) {
    if (loading) {
        return <div className="space-y-4"><TableRowSkeleton rows={5}/></div>;
    }
    if (reviews.length === 0) {
        return <EmptyState title="No reviews found" description="Try adjusting your filters."/>;
    }
    return (<div className="space-y-3">
      {reviews.map((review) => (<ReviewCard key={review.id} review={review} showAnime={showAnime}/>))}
    </div>);
}
