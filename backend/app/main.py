import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database.db import Base, engine
from app.models.user import User
from app.models.user_movie import UserMovie
from app.routes.auth import router as auth_router
from app.routes.movies import router as movie_router
from app.routes.watchlist import router as watchlist_router
from app.routes.ai import router as ai_router
from app.routes.recommendations import router as recommendations_router



load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(movie_router)
app.include_router(watchlist_router)
app.include_router(ai_router)
app.include_router(recommendations_router)



@app.get("/")
def root():
    return {"message": "MovieMate API running"}


@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {"message": "Database connection successful"}

    except Exception as e:
        return {"error": str(e)}