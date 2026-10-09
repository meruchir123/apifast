
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.models import Anime, Genre

router = APIRouter(prefix="/api", tags=["Anime"])


def serialize_anime(anime: Anime) -> dict:
    return {
        "id": anime.id,
        "source_id": anime.source_id,
        "title": anime.title,
        "title_english": anime.title_english,
        "title_native": anime.title_native,
        "synopsis": anime.synopsis,
        "anime_type": anime.anime_type,
        "anime_format": anime.anime_format,
        "status": anime.status,
        "episodes": anime.episodes,
        "score": anime.score,
        "popularity": anime.popularity,
        "favourites": anime.favourites,
        "season_year": anime.season_year,
        "image_url": anime.image_url,
        "banner_url": anime.banner_url,
        "external_url": anime.external_url,
        "genres": [
            {"id": genre.id, "name": genre.name}
            for genre in anime.genres
        ],
    }


@router.get("/anime")
def get_anime(
    query: str | None = None,
    genre: str | None = None,
    min_score: float | None = Query(default=None, ge=0, le=10),
    max_score: float | None = Query(default=None, ge=0, le=10),
    year: int | None = Query(default=None, ge=1900, le=2100),
    sort_by: str = Query(default="popularity"),
    sort_order: str = Query(default="desc"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if min_score is not None and max_score is not None:
        if min_score > max_score:
            raise HTTPException(
                status_code=400,
                detail="min_score cannot exceed max_score",
            )

    sort_columns = {
        "popularity": Anime.popularity,
        "score": Anime.score,
        "title": Anime.title,
        "year": Anime.season_year,
        "favourites": Anime.favourites,
    }

    if sort_by not in sort_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid sort_by. Choose from: {', '.join(sort_columns)}",
        )

    if sort_order not in {"asc", "desc"}:
        raise HTTPException(
            status_code=400,
            detail="sort_order must be 'asc' or 'desc'",
        )

    anime_query = db.query(Anime).options(joinedload(Anime.genres))

    if query and query.strip():
        search_term = f"%{query.strip()}%"
        anime_query = anime_query.filter(
            or_(
                Anime.title.ilike(search_term),
                Anime.title_english.ilike(search_term),
                Anime.title_native.ilike(search_term),
            )
        )

    if genre and genre.strip():
        anime_query = anime_query.filter(
            Anime.genres.any(Anime.genres.property.mapper.class_.name == genre.strip())
        )

    if min_score is not None:
        anime_query = anime_query.filter(Anime.score >= min_score)

    if max_score is not None:
        anime_query = anime_query.filter(Anime.score <= max_score)

    if year is not None:
        anime_query = anime_query.filter(Anime.season_year == year)

    total = anime_query.count()
    sort_column = sort_columns[sort_by]
    sort_expression = (
        sort_column.asc() if sort_order == "asc" else sort_column.desc()
    )

    results = (
        anime_query
        .order_by(sort_expression.nullslast(), Anime.id.asc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "data": [serialize_anime(anime) for anime in results],
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit,
    }


@router.get("/anime/{anime_id}")
def get_anime_by_id(
    anime_id: int,
    db: Session = Depends(get_db),
):
    anime = (
        db.query(Anime)
        .options(joinedload(Anime.genres))
        .filter(Anime.id == anime_id)
        .first()
    )

    if anime is None:
        raise HTTPException(
            status_code=404,
            detail="Anime not found",
        )

    return serialize_anime(anime)


from app.models import Genre


@router.get("/genres")
def get_genres(
    db: Session = Depends(get_db),
):
    genres = db.query(Genre).order_by(Genre.name.asc()).all()

    return [
        {
            "id": genre.id,
            "name": genre.name,
        }
        for genre in genres
    ]
