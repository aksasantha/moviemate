import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { genreMap } from "../utils/genres";

function Dashboard() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [movies, setMovies] = useState([]);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [suggestions, setSuggestions] = useState([]);

  const [activeMovie, setActiveMovie] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const logout = () => {
    setShowLogoutModal(false);

    localStorage.removeItem("token");

    navigate("/login");
  };

  const fetchTrendingMovies = async () => {
    try {
      const response = await api.get("/movies/trending");

      setTrendingMovies(response.data.results.slice(0, 8));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuggestions = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);

      return;
    }

    try {
      const response = await api.get(`/movies/search?query=${value}`);

      setSuggestions(response.data.results.slice(0, 6));
    } catch (error) {
      console.error(error);
    }
  };

  const searchMovies = async () => {
    if (!query) return;

    try {
      const response = await api.get(`/movies/search?query=${query}`);

      setMovies(response.data.results);

      setSuggestions([]);
    } catch (error) {
      console.error(error);
    }
  };

  const addToWatchlist = async (movie) => {
    console.log(movie);
    try {
      const response = await api.post("/watchlist/add", {
        movie_id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        media_type: movie.media_type,
        genre:
          movie.genre_ids && movie.genre_ids.length > 0
            ? genreMap[movie.genre_ids[0]]
            : null,

        platform: "Unknown",
      });

      alert(response.data.message);
    } catch (error) {
      console.error(error);

      alert("Failed to add movie");
    }
  };

  const heroMovie =
    activeMovie || (trendingMovies.length > 0 ? trendingMovies[0] : null);

  return (
    <div className="bg-[#0B0B0F] min-h-screen text-white overflow-x-hidden">
      {/* NAVBAR */}

      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-wide">MovieMate</div>

          <div className="flex items-center gap-8 text-sm text-zinc-300">
            <button className="hover:text-white transition">Discover</button>

            <button
              onClick={() => navigate("/watchlist")}
              className="hover:text-white transition"
            >
              Watchlist
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="border border-white/10 px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}

      <section className="relative h-[95vh] w-full flex items-end">
        {heroMovie && (
          <img
            src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
            alt={heroMovie.title || heroMovie.name}
            className="absolute inset-0 w-full h-full object-cover transition duration-700"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/50 to-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 pb-28 w-full">
          <div className="max-w-2xl">
            <p className="uppercase tracking-[0.3em] text-sm text-zinc-400 mb-6">
              Cinematic Discovery Platform
            </p>

            <h1 className="text-6xl md:text-7xl font-bold leading-none mb-8">
              Discover films worth remembering.
            </h1>

            <p className="text-zinc-300 text-lg leading-relaxed mb-10 max-w-xl">
              Explore trending cinema, timeless classics, and stories from
              around the world through a refined movie discovery experience.
            </p>

            {/* SEARCH */}

            <div className="relative max-w-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search movies, directors, genres..."
                  value={query}
                  onChange={(e) => fetchSuggestions(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl w-full outline-none text-white placeholder:text-zinc-400"
                />

                <button
                  onClick={searchMovies}
                  className="bg-white text-black px-8 py-4 rounded-2xl font-medium hover:bg-zinc-200 transition"
                >
                  Search
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="absolute top-full mt-4 w-full bg-[#14141B]/95 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-50">
                  {suggestions.map((movie) => (
                    <div
                      key={movie.id}
                      onMouseEnter={() => setActiveMovie(movie)}
                      onClick={() => {
                        setMovies([movie]);

                        setSuggestions([]);

                        setQuery(movie.title || movie.name);
                      }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition cursor-pointer"
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                            : "https://via.placeholder.com/154x231?text=No+Image"
                        }
                        alt={movie.title || movie.name}
                        className="w-14 h-20 object-cover rounded-xl"
                      />

                      <div>
                        <h3 className="font-medium text-white">
                          {movie.title || movie.name}
                        </h3>

                        <p className="text-sm text-zinc-400 mt-1">
                          {movie.release_date || movie.first_air_date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS */}

      {movies.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold mb-2">Search Results</h2>

            <p className="text-zinc-400">Results for "{query}"</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onMouseEnter={() => setActiveMovie(movie)}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-3xl bg-zinc-900">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                        : "https://via.placeholder.com/342x513?text=No+Image"
                    }
                    alt={movie.title || movie.name}
                    className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium line-clamp-1 min-h-[28px]">
                    {movie.title || movie.name}
                  </h3>

                  <p className="text-zinc-500 text-sm mt-1 min-h-[20px]">
                    {movie.release_date || movie.first_air_date}
                  </p>

                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="mt-4 w-full bg-white text-black py-3 rounded-2xl font-medium hover:bg-zinc-200 transition"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRENDING SECTION */}

      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Trending Now</h2>

            <p className="text-zinc-400">
              Films currently capturing global attention.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trendingMovies.map((movie) => (
            <div
              key={movie.id}
              onMouseEnter={() => setActiveMovie(movie)}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-3xl bg-zinc-900">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                      : "https://via.placeholder.com/342x513?text=No+Image"
                  }
                  alt={movie.title || movie.name}
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium line-clamp-1 min-h-[28px]">
                  {movie.title || movie.name}
                </h3>

                <p className="text-zinc-500 text-sm mt-1 min-h-[20px]">
                  {movie.release_date || movie.first_air_date}
                </p>

                <button
                  onClick={() => addToWatchlist(movie)}
                  className="mt-4 w-full bg-white text-black py-3 rounded-2xl font-medium hover:bg-zinc-200 transition"
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* LOGOUT MODAL */}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-[#14141B] border border-white/10 rounded-3xl p-8 w-[90%] max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Logout?</h2>

            <p className="text-zinc-400 leading-relaxed mb-8">
              Are you sure you want to end your current session?
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition"
              >
                Cancel
              </button>

              <button
                onClick={logout}
                className="bg-white text-black px-5 py-3 rounded-2xl font-medium hover:bg-zinc-200 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
