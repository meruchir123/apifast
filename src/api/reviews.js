import { simulateDelay } from './client';
import { MOCK_REVIEWS } from '../data/mockData';
export async function getReviews(params) {
    await simulateDelay(null);
    let filtered = [...MOCK_REVIEWS];
    if (params?.animeId) {
        filtered = filtered.filter((r) => r.animeId === params.animeId);
    }
    if (params?.sentiment && params.sentiment !== 'All') {
        filtered = filtered.filter((r) => r.sentiment === params.sentiment);
    }
    if (params?.minRating !== undefined) {
        filtered = filtered.filter((r) => r.rating >= params.minRating);
    }
    if (params?.maxRating !== undefined) {
        filtered = filtered.filter((r) => r.rating <= params.maxRating);
    }
    const sortBy = params?.sortBy ?? 'newest';
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'helpful':
                return b.helpful - a.helpful;
            case 'newest':
            default:
                return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    return { data, total, page, limit, totalPages };
}
export async function getAnimeReviews(animeId) {
    await simulateDelay(null, 300);
    return MOCK_REVIEWS.filter((r) => r.animeId === animeId);
}
