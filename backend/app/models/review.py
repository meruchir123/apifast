from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Review(Base):
    __tablename__ = "reviews"

    __table_args__ = (
        UniqueConstraint(
            "source_name",
            "source_id",
            name="uq_review_source",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    source_name: Mapped[str] = mapped_column(
        String(50), nullable=False, default="external"
    )
    source_id: Mapped[int] = mapped_column(Integer, nullable=False)

    anime_id: Mapped[int] = mapped_column(
        ForeignKey("anime.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    username: Mapped[str | None] = mapped_column(String(200))
    review_text: Mapped[str | None] = mapped_column(Text)
    score: Mapped[int | None] = mapped_column(Integer)
    review_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    tags: Mapped[list | None] = mapped_column(JSON)
    is_spoiler: Mapped[bool] = mapped_column(Boolean, default=False)
    is_preliminary: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    anime: Mapped["Anime"] = relationship(back_populates="reviews")