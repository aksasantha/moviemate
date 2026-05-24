from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import Counter
import requests
import os

from app.database.db import SessionLocal
from app.models.user_movie import UserMovie
from app.services.auth import get_current_user

router = APIRouter()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# Genre name → TMDB genre ID mapping
GENRE_MAP = {
    "Action": 28,
    "Adventure": 12,
    "Animation": 16,
    "Comedy": 35,
    "Crime": 80,
    "Documentary": 99,
    "Drama": 18,
    "Family": 10751,
    "Fantasy": 14,
    "History": 36,
    "Horror": 27,
    "Music": 10402,
    "Mystery": 9648,
    "Romance": 10749,
    "Sci-Fi": 878,
    "TV Movie": 10770,
    "Thriller": 53,
    "War": 10752,
    "Western": 37,
}


@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Fetch user's watchlist
    watchlist = (
        db.query(UserMovie)
        .filter(UserMovie.user_id == current_user["user_id"])
        .all()
    )

    if len(watchlist) == 0:
        return []

    # Use completed or highly rated titles
    favorite_movies = [
        movie
        for movie in watchlist
        if (
            movie.status == "completed"
            or (movie.rating and movie.rating >= 8)
        )
    ]

    # Fallback if no favorites
    if len(favorite_movies) == 0:
        favorite_movies = watchlist

    # Extract genres
    genres = [
        movie.genre
        for movie in favorite_movies
        if movie.genre in GENRE_MAP
    ]


    if len(genres) == 0:
        return []

    # Top genres
    top_genres = [
        genre
        for genre, count in Counter(genres).most_common(2)
    ]

    

    recommendations = []

    # Existing watchlist movie IDs
    existing_ids = {
        movie.movie_id for movie in watchlist
    }

    # TMDB headers using Bearer token
    headers = {
        "Authorization": f"Bearer {TMDB_API_KEY}",
        "accept": "application/json"
    }

    # Fetch recommendations from TMDB
    for genre in top_genres:
        genre_id = GENRE_MAP[genre]

        url = (
            f"https://api.themoviedb.org/3/discover/movie"
            f"?with_genres={genre_id}"
            f"&sort_by=popularity.desc"
        )

        response = requests.get(url, headers=headers)

        data = response.json()


        results = data.get("results", [])

        for movie in results:

            # Skip movies already in watchlist
            if movie["id"] in existing_ids:
                continue

            recommendations.append({
                "id": movie["id"],
                "title": movie.get("title"),
                "poster_path": movie.get("poster_path"),
                "overview": movie.get("overview"),
                "vote_average": movie.get("vote_average"),
                "release_date": movie.get("release_date"),
                "genre_ids": movie.get("genre_ids", []),
            })

    # Remove duplicates
    unique = {}

    for movie in recommendations:
        unique[movie["id"]] = movie

    return list(unique.values())