from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


anime_genres = Table(
    "anime_genres",
    Base.metadata,
    Column(
        "anime_id",
        ForeignKey("anime.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "genre_id",
        ForeignKey("genres.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False
    )

    anime: Mapped[list["Anime"]] = relationship(
        secondary=anime_genres,
        back_populates="genres",
    )