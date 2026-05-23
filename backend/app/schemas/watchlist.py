from pydantic import BaseModel


class WatchlistRequest(BaseModel):

    movie_id: int

    title: str

    poster_path: str

    media_type: str