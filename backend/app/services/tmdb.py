import os

import requests
from dotenv import load_dotenv


load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")

BASE_URL = "https://api.themoviedb.org/3"


headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {TMDB_API_KEY}"
}


def search_movies(query: str):
    url = f"{BASE_URL}/search/movie"

    params = {
        "query": query
    }

    response = requests.get(
        url,
        headers=headers,
        params=params
    )

    return response.json()


def get_trending_movies():
    url = f"{BASE_URL}/trending/movie/day"

    response = requests.get(
        url,
        headers=headers
    )

    return response.json()