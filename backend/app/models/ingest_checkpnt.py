
from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class IngestionCheckpoint(Base):
    __tablename__ = "ingestion_checkpoints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    pipeline_name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    last_completed_page: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
