import time
from datetime import datetime, timezone

import httpx
from sqlalchemy import select

from app.db.database import SessionLocal
from app.models import Anime, Genre
from app.models.ingest_checkpnt import IngestionCheckpoint

ANILIST_URL = "https://graphql.anilist.co"

QUERY = """
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    media(type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
        native
      }
      description(asHtml: false)
      format
      status
      episodes
      duration
      averageScore
      meanScore
      popularity
      favourites
      season
      seasonYear
      countryOfOrigin
      isAdult
      coverImage {
        large
      }
      bannerImage
      siteUrl
      updatedAt
      genres
    }
  }
}
"""



def fetch_page(client: httpx.Client, page: int) -> dict:
    max_attempts = 5

    for attempt in range(1, max_attempts + 1):
        try:
            response = client.post(
                ANILIST_URL,
                json={
                    "query": QUERY,
                    "variables": {
                        "page": page,
                        "perPage": PER_PAGE
                    }
                }
            )

            if response.status_code == 429:
                retry_after = response.headers.get("Retry-After")
                wait_seconds = (
                    float(retry_after)
                    if retry_after
                    else 10 * attempt
                )

                if attempt == max_attempts:
                    response.raise_for_status()

                print(
                    f"Rate limited on page {page}. "
                    f"Waiting {wait_seconds:.1f} seconds..."
                )
                time.sleep(wait_seconds)
                continue

            response.raise_for_status()
            payload = response.json()

            if payload.get("errors"):
                raise RuntimeError(
                    f"AniList GraphQL error: {payload['errors']}"
                )

            return payload["data"]["Page"]

        except httpx.TimeoutException:
            if attempt == max_attempts:
                raise

            wait_seconds = 2 * attempt
            print(
                f"Request timed out on page {page}. "
                f"Retrying in {wait_seconds} seconds..."
            )
            time.sleep(wait_seconds)

    raise RuntimeError(
        f"Could not fetch page {page} after {max_attempts} attempts."
    )



def get_or_create_genre(session, name: str) -> Genre:
    genre = session.scalar(select(Genre).where(Genre.name == name))

    if genre is None:
        genre = Genre(name=name)
        session.add(genre)
        session.flush()

    return genre

MAX_PAGES=20
PER_PAGE=25


def ingest():
    pipeline_name = "anilist_anime"

    session = SessionLocal()

    try:
        checkpoint = session.scalar(
            select(IngestionCheckpoint).where(
                IngestionCheckpoint.pipeline_name == pipeline_name
            )
        )

        if checkpoint is None:
            checkpoint = IngestionCheckpoint(
                pipeline_name=pipeline_name,
                last_completed_page=0,
                status="pending",
            )
            session.add(checkpoint)
            session.commit()
            session.refresh(checkpoint)

        # A completed run starts fresh on the next execution.
        if checkpoint.status == "completed":
            checkpoint.last_completed_page = 0

        start_page = checkpoint.last_completed_page + 1
        checkpoint.status = "running"
        session.commit()

        inserted = 0
        updated = 0

        with httpx.Client(timeout=30) as client:
            for page in range(start_page, MAX_PAGES + 1):
                print(f"Fetching page {page}...")

                page_data = fetch_page(client, page)

                try:
                    for item in page_data["media"]:
                        anime = session.scalar(
                            select(Anime).where(
                                Anime.source_id == item["id"]
                            )
                        )

                        if anime is None:
                            anime = Anime(
                                source_id=item["id"],
                                title="Untitled",
                            )
                            session.add(anime)
                            inserted += 1
                        else:
                            updated += 1

                        title = item.get("title") or {}
                        cover = item.get("coverImage") or {}

                        anime.title = (
                            title.get("romaji")
                            or title.get("english")
                            or "Untitled"
                        )
                        anime.title_english = title.get("english")
                        anime.title_native = title.get("native")
                        anime.synopsis = item.get("description")
                        anime.anime_format = item.get("format")
                        anime.status = item.get("status")
                        anime.episodes = item.get("episodes")
                        anime.duration = item.get("duration")

                        anime.score = (
                            item["averageScore"] / 10
                            if item.get("averageScore") is not None
                            else None
                        )
                        anime.mean_score = (
                            item["meanScore"] / 10
                            if item.get("meanScore") is not None
                            else None
                        )

                        anime.popularity = item.get("popularity")
                        anime.favourites = item.get("favourites")
                        anime.season = item.get("season")
                        anime.season_year = item.get("seasonYear")
                        anime.country_of_origin = item.get(
                            "countryOfOrigin"
                        )
                        anime.is_adult = bool(item.get("isAdult"))
                        anime.image_url = cover.get("large")
                        anime.banner_url = item.get("bannerImage")
                        anime.external_url = item.get("siteUrl")

                        anime.source_updated_at = (
                            datetime.fromtimestamp(
                                item["updatedAt"],
                                tz=timezone.utc,
                            )
                            if item.get("updatedAt")
                            else None
                        )
                        anime.last_synced_at = datetime.now(timezone.utc)

                        anime.genres = [
                            get_or_create_genre(session, name)
                            for name in (item.get("genres") or [])
                        ]

                    # Save this page's data and progress together.
                    checkpoint.last_completed_page = page
                    session.commit()

                    print(f"Page {page} saved successfully.")

                except Exception:
                    session.rollback()
                    raise

                if not page_data["pageInfo"]["hasNextPage"]:
                    print("Reached the last page.")
                    break

                if page < MAX_PAGES:
                    time.sleep(2.1)

        checkpoint.status = "completed"
        session.commit()

        print(f"New anime inserted: {inserted}")
        print(f"Existing anime updated: {updated}")
        print(f"Last completed page: {checkpoint.last_completed_page}")
        print(f"Pipeline status: {checkpoint.status}")

    except Exception:
        session.rollback()

        # Best-effort recording of a failed run.
        try:
            checkpoint = session.scalar(
                select(IngestionCheckpoint).where(
                    IngestionCheckpoint.pipeline_name == pipeline_name
                )
            )
            
            if checkpoint is None:
                checkpoint = IngestionCheckpoint(
                pipeline_name=pipeline_name,
                last_completed_page=0,
                status="pending",
            )
            session.add(checkpoint)
            session.commit()
            session.refresh(checkpoint)

            if checkpoint.status == "completed":
            # A completed run starts fresh.
                checkpoint.last_completed_page = 0

        # Failed or interrupted runs retain their saved page.
            start_page = checkpoint.last_completed_page + 1

            checkpoint.status = "running"
            session.commit()

        except Exception:
            session.rollback()

        raise

    finally:
        session.close()



if __name__ == "__main__":
    ingest()