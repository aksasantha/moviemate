from fastapi import (
    APIRouter,
    Depends
)

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