# MovieMate 🎬

MovieMate is a full-stack AI-powered movie discovery and watchlist platform built using React, FastAPI, PostgreSQL, and TMDB APIs.

Users can discover trending movies, search films and TV shows, manage personal watchlists, track viewing progress, generate AI-powered reviews, and receive personalized recommendations based on watch history and ratings.

---

## Key Highlights

- AI-powered movie review generation
- Personalized recommendation engine
- JWT authentication system
- Full-stack React + FastAPI architecture
- PostgreSQL database integration
- Responsive cinematic UI

---

# Features

## Authentication
- User registration and login
- JWT-based authentication
- Protected routes

## Movie Discovery
- Trending movies section
- Dynamic search suggestions
- Search movies and TV shows using TMDB API
- Hero banner with cinematic UI

## Watchlist Management
- Add/remove movies from watchlist
- Update watch status:
  - Wishlist
  - Watching
  - Completed
- TV episode progress tracking
- Ratings and personal reviews

## AI Features
- AI-generated movie reviews using OpenRouter API
- Personalized movie recommendations based on:
  - Genres
  - Ratings
  - Completed watch history

## UI/UX
- Modern cinematic interface
- Responsive design
- TailwindCSS styling
- Interactive modals and hover effects

---

# Tech Stack

## Frontend
- React
- Vite
- TailwindCSS
- Axios
- React Router

## Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication

## APIs
- TMDB API
- OpenRouter API

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL=
OPENROUTER_API_KEY=
TMDB_API_KEY=
FRONTEND_URL=
JWT_SECRET_KEY=
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/aksasantha/moviemate.git
cd moviemate
```

---

# Backend Setup

## 1. Navigate to backend

```bash
cd backend
```

## 2. Create virtual environment

```bash
python3 -m venv venv
```

## 3. Activate virtual environment

### macOS/Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

## 4. Install dependencies

```bash
pip install -r requirements.txt
```

## 5. Configure PostgreSQL

Create a PostgreSQL database named:

```txt
moviemate_db
```

Update `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/moviemate_db
```

## 6. Run backend server

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

---

# Frontend Setup

## 1. Navigate to frontend

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start frontend

```bash
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

# Project Structure

```txt
.
├── backend
│   ├── app
│   │   ├── ai
│   │   ├── database
│   │   ├── main.py
│   │   ├── models
│   │   ├── routes
│   │   ├── schemas
│   │   └── services
│   └── requirements.txt
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── api
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── vite.config.js
└── README.md
```

---

# Future Improvements

- Streaming platform integration
- Watch time analytics
- Social movie sharing
- Collaborative watchlists
- Advanced recommendation engine
- Deployment with Docker

---

# Developer

Aksa Santha Ronio