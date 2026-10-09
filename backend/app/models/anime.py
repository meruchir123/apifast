from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Anime(Base):
    __tablename__ = "anime"

    # Internal database ID
    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Stable ID supplied by AniList
    source_id: Mapped[int] = mapped_column(
        Integer, unique=True, index=True, nullable=False
    )

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    title_english: Mapped[str | None] = mapped_column(String(500))
    title_native: Mapped[str | None] = mapped_column(String(500))
    synopsis: Mapped[str | None] = mapped_column(Text)

    anime_type: Mapped[str | None] = mapped_column(String(50))
    anime_format: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str | None] = mapped_column(String(50))
    episodes: Mapped[int | None] = mapped_column(Integer)
    duration: Mapped[int | None] = mapped_column(Integer)

    # Stored on a 0–10 scale; source scores are on a 0–100 scale.
    score: Mapped[float | None] = mapped_column(Float)
    mean_score: Mapped[float | None] = mapped_column(Float)

    popularity: Mapped[int | None] = mapped_column(Integer)
    favourites: Mapped[int | None] = mapped_column(Integer)

    season: Mapped[str | None] = mapped_column(String(20))
    season_year: Mapped[int | None] = mapped_column(Integer)
    country_of_origin: Mapped[str | None] = mapped_column(String(10))
    is_adult: Mapped[bool] = mapped_column(Boolean, default=False)

    image_url: Mapped[str | None] = mapped_column(String(1000))
    banner_url: Mapped[str | None] = mapped_column(String(1000))
    external_url: Mapped[str | None] = mapped_column(String(1000))

    source_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    last_synced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    genres: Mapped[list["Genre"]] = relationship(
        secondary="anime_genres",
        back_populates="anime",
    )

    reviews: Mapped[list["Review"]] = relationship(
        back_populates="anime",
        cascade="all, delete-orphan",
    )