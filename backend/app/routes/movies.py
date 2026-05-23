from fastapi import APIRouter

from app.services.tmdb import (
    search_movies,
    get_trending_movies
)

router = APIRouter()


@router.get("/movies/search")
def search(query: str):
    return search_movies(query)


@router.get("/movies/trending")
def trending():
    return get_trending_movies()