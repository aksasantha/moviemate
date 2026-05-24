from fastapi import (
    APIRouter,
    Depends
)
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.db import SessionLocal

from app.models.user_movie import UserMovie

from app.services.auth import get_current_user

from app.schemas.watchlist import WatchlistRequest

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


@router.post("/watchlist/add")
def add_to_watchlist(
    movie: WatchlistRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    
    existing_movie = db.query(UserMovie).filter(
        UserMovie.user_id == current_user["user_id"],
        UserMovie.movie_id == movie.movie_id
    ).first()

    if existing_movie:

        return {
            "message": "Movie already in watchlist"
        }

    new_movie = UserMovie(
        user_id=current_user["user_id"],
        movie_id=movie.movie_id,
        title=movie.title,
        poster_path=movie.poster_path,
        media_type=movie.media_type,
        genre=movie.genre,
        platform=movie.platform,
        status="wishlist"
    )

    db.add(new_movie)

    db.commit()

    return {
        "message": "Movie added to watchlist"
    }


@router.get("/watchlist")
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    movies = db.query(UserMovie).filter(
        UserMovie.user_id == current_user["user_id"]
    ).all()

    return movies

@router.put("/watchlist/{movie_id}")
def update_watchlist_item(
    movie_id: int,
    updated_data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    movie = db.query(UserMovie).filter(
        UserMovie.id == movie_id,
        UserMovie.user_id == current_user["user_id"]
    ).first()

    if not movie:

        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    if "status" in updated_data:
        movie.status = updated_data["status"]

    if "rating" in updated_data:
        movie.rating = updated_data["rating"]

    if "review" in updated_data:
        movie.review = updated_data["review"]

    if "episodes_watched" in updated_data:
        movie.episodes_watched = updated_data["episodes_watched"]

    if "total_episodes" in updated_data:
        movie.total_episodes = updated_data["total_episodes"]

    db.commit()

    db.refresh(movie)

    return {
        "message": "Watchlist updated successfully"
    }

@router.delete("/watchlist/{movie_id}")
def delete_watchlist_item(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    movie = db.query(UserMovie).filter(
        UserMovie.id == movie_id,
        UserMovie.user_id == current_user["user_id"]
    ).first()

    if not movie:

        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    db.delete(movie)

    db.commit()

    return {
        "message": "Removed from watchlist"
    }