from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey
)

from app.database.db import Base


class UserMovie(Base):

    __tablename__ = "user_movies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    movie_id = Column(
        Integer,
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    poster_path = Column(String)

    media_type = Column(String)

    status = Column(
        String,
        default="wishlist"
    )

    platform = Column(String)

    genre = Column(String)

    rating = Column(
        Integer,
        nullable=True
    )

    review = Column(
        Text,
        nullable=True
    )

    episodes_watched = Column(
        Integer,
        default=0
    )

    total_episodes = Column(
        Integer,
        default=0
    )