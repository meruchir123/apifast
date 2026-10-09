from contextlib import asynccontextmanager

from fastapi import FastAPI

from .db.database import create_tables, test_connection

from app.api.analytics import router as analytics_router

from app.api.anime import router as anime_router

from fastapi.middleware.cors import CORSMiddleware
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(title="AniVerse API", version="0.1.0", lifespan=lifespan)

app.include_router(analytics_router)
app.include_router(anime_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    try:
        database = test_connection()
        return {
            "status": "healthy",
            "database": database,
        }
    except Exception:
        return {
            "status": "unhealthy",
            "database": "unavailable",
        }