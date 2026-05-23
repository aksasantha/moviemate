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

    url = f"{BASE_URL}/search/multi"

    params = {
        "query": query
    }

    response = requests.get(
        url,
        headers=headers,
        params=params
    )

    data = response.json()

    filtered_results = [

        item for item in data["results"]

        if item["media_type"] != "person"

    ]

    data["results"] = filtered_results

    return data


def get_trending_movies():

    url = f"{BASE_URL}/trending/all/day"

    response = requests.get(
        url,
        headers=headers
    )

    data = response.json()

    filtered_results = [

        item for item in data["results"]

        if item["media_type"] != "person"

    ]

    data["results"] = filtered_results

    return data