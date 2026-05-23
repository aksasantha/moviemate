from sqlalchemy import (
    Column,
    Integer,
    String,
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

    movie_id = Column(Integer)

    title = Column(String)

    poster_path = Column(String)

    status = Column(String)

    rating = Column(Integer, nullable=True)

    review = Column(String, nullable=True)

    progress = Column(Integer, default=0)