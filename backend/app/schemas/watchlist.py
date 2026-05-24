from pydantic import BaseModel
from typing import Optional

class WatchlistRequest(BaseModel):

    movie_id: int

    title: str

    poster_path: str

    media_type: str

    genre: Optional[str] = None

    platform: Optional[str] = None