
from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, distinct, func, select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import Anime, Genre

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

# 1. Overall dashboard KPIs
@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    total_anime = db.scalar(
        select(func.count()).select_from(Anime)
    ) or 0

    average_score = db.scalar(
        select(func.avg(Anime.score))
        .where(Anime.score.is_not(None))
    )

    total_genres = db.scalar(
        select(func.count()).select_from(Genre)
    ) or 0

    adult_count = db.scalar(
        select(func.count())
        .select_from(Anime)
        .where(Anime.is_adult.is_(True))
    ) or 0

    return {
        "total_anime": total_anime,
        "average_score": (
            round(float(average_score), 2)
            if average_score is not None else None
        ),
        "total_genres": total_genres,
        "adult_anime_count": adult_count,
    }


# 2. Number of anime in each genre
@router.get("/genres")
def get_genre_distribution(db: Session = Depends(get_db)):
    results = db.execute(
        select(
            Genre.name,
            func.count(distinct(Anime.id)).label("anime_count"),
        )
        .select_from(Genre)
        .join(Genre.anime)
        .group_by(Genre.id, Genre.name)
        .order_by(func.count(distinct(Anime.id)).desc())
    ).all()

    return [
        {"genre": name, "anime_count": count}
        for name, count in results
    ]


# 3. Distribution of anime scores
@router.get("/ratings")
def get_rating_distribution(db: Session = Depends(get_db)):
    bucket = case(
        (Anime.score < 2, "0-2"),
        (Anime.score < 4, "2-4"),
        (Anime.score < 6, "4-6"),
        (Anime.score < 8, "6-8"),
        else_="8-10",
    ).label("score_range")

    results = db.execute(
        select(
            bucket,
            func.count(Anime.id).label("anime_count"),
        )
        .where(Anime.score.is_not(None))
        .group_by(bucket)
        .order_by(bucket)
    ).all()

    return [
        {"score_range": score_range, "anime_count": count}
        for score_range, count in results
    ]


# 4. Anime catalog trends by year
@router.get("/trends")
def get_yearly_trends(db: Session = Depends(get_db)):
    results = db.execute(
        select(
            Anime.season_year.label("year"),
            func.count(Anime.id).label("anime_count"),
            func.avg(Anime.score).label("average_score"),
        )
        .where(Anime.season_year.is_not(None))
        .group_by(Anime.season_year)
        .order_by(Anime.season_year)
    ).all()

    return [
        {
            "year": year,
            "anime_count": count,
            "average_score": (
                round(float(avg_score), 2)
                if avg_score is not None else None
            ),
        }
        for year, count, avg_score in results
    ]


# 5. Anime count by format (TV, MOVIE, OVA, etc.)
@router.get("/formats")
def get_format_distribution(db: Session = Depends(get_db)):
    results = db.execute(
        select(
            Anime.anime_format,
            func.count(Anime.id).label("anime_count"),
        )
        .where(Anime.anime_format.is_not(None))
        .group_by(Anime.anime_format)
        .order_by(func.count(Anime.id).desc())
    ).all()

    return [
        {"format": anime_format, "anime_count": count}
        for anime_format, count in results
    ]


# 6. Highest-rated anime
@router.get("/top-rated")
def get_top_rated(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    results = db.scalars(
        select(Anime)
        .where(Anime.score.is_not(None))
        .order_by(Anime.score.desc(), Anime.popularity.desc().nullslast())
        .limit(limit)
    ).all()

    return [
        {
            "id": anime.id,
            "source_id": anime.source_id,
            "title": anime.title,
            "title_english": anime.title_english,
            "score": anime.score,
            "popularity": anime.popularity,
            "image_url": anime.image_url,
            "year": anime.season_year,
            "format": anime.anime_format,
        }
        for anime in results
    ]


# 7. Most popular anime according to AniList
@router.get("/popularity")
def get_popular_anime(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    results = db.scalars(
        select(Anime)
        .where(Anime.popularity.is_not(None))
        .order_by(Anime.popularity.desc())
        .limit(limit)
    ).all()

    return [
        {
            "id": anime.id,
            "source_id": anime.source_id,
            "title": anime.title,
            "score": anime.score,
            "popularity": anime.popularity,
            "favourites": anime.favourites,
            "image_url": anime.image_url,
        }
        for anime in results
    ]


# 8. Average score for each genre
@router.get("/genre-scores")
def get_genre_scores(db: Session = Depends(get_db)):
    results = db.execute(
        select(
            Genre.name,
            func.count(distinct(Anime.id)).label("anime_count"),
            func.avg(Anime.score).label("average_score"),
        )
        .select_from(Genre)
        .join(Genre.anime)
        .where(Anime.score.is_not(None))
        .group_by(Genre.id, Genre.name)
        .order_by(func.avg(Anime.score).desc())
    ).all()

    return [
        {
            "genre": name,
            "anime_count": count,
            "average_score": round(float(avg_score), 2),
        }
        for name, count, avg_score in results
    ]
