import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/api";

function Watchlist() {
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const [genreFilter, setGenreFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [typeFilter, setTypeFilter] = useState("all");

  const [sortOption, setSortOption] = useState("recent");

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await api.get("/watchlist");

      setWatchlist(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (movieId, status) => {
    try {
      await api.put(`/watchlist/${movieId}`, {
        status: status,
      });

      setWatchlist((prev) =>
        prev.map((movie) =>
          movie.id === movieId ? { ...movie, status: status } : movie,
        ),
      );

      if (selectedMovie && selectedMovie.id === movieId) {
        setSelectedMovie({
          ...selectedMovie,
          status: status,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await api.delete(`/watchlist/${movieId}`);

      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));

      if (selectedMovie && selectedMovie.id === movieId) {
        setSelectedMovie(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateEpisodes = async (movieId, episodesWatched, totalEpisodes) => {
    try {
      await api.put(`/watchlist/${movieId}`, {
        episodes_watched: episodesWatched,
        total_episodes: totalEpisodes,
      });

      setWatchlist((prev) =>
        prev.map((movie) =>
          movie.id === movieId
            ? {
                ...movie,
                episodes_watched: episodesWatched,
                total_episodes: totalEpisodes,
              }
            : movie,
        ),
      );

      if (selectedMovie && selectedMovie.id === movieId) {
        setSelectedMovie({
          ...selectedMovie,
          episodes_watched: episodesWatched,
          total_episodes: totalEpisodes,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateReview = async (movieId, rating, review) => {
    try {
      await api.put(`/watchlist/${movieId}`, {
        rating: rating,
        review: review,
      });

      setWatchlist((prev) =>
        prev.map((movie) =>
          movie.id === movieId
            ? {
                ...movie,
                rating: rating,
                review: review,
              }
            : movie,
        ),
      );

      if (selectedMovie && selectedMovie.id === movieId) {
        setSelectedMovie({
          ...selectedMovie,
          rating: rating,
          review: review,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredWatchlist = watchlist
    .filter((movie) => {
      const matchesStatus =
        statusFilter === "all" || movie.status === statusFilter;

      const matchesGenre = genreFilter === "all" || movie.genre === genreFilter;

      const matchesType =
        typeFilter === "all" || movie.media_type === typeFilter;

      return matchesStatus && matchesGenre && matchesType;
    })
    .sort((a, b) => {
      if (sortOption === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      if (sortOption === "rating-high") {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sortOption === "rating-low") {
        return (a.rating || 0) - (b.rating || 0);
      }

      return b.id - a.id;
    });
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* NAVBAR */}

      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-semibold tracking-wide cursor-pointer"
          >
            MovieMate
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-zinc-300 hover:text-white transition"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}

      <div className="max-w-7xl mx-auto px-8 pt-36 pb-24">
        <div className="mb-14">
          <p className="uppercase tracking-[0.3em] text-sm text-zinc-500 mb-4">
            Personal Library
          </p>

          <h1 className="text-5xl font-bold mb-4">Your Watchlist</h1>

          <p className="text-zinc-400 text-lg">
            Track movies and shows you want to watch.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-zinc-500 text-lg">Loading watchlist...</div>
        )}

        {/* EMPTY STATE */}

        {!loading && watchlist.length === 0 && (
          <div className="border border-white/5 bg-white/[0.03] rounded-3xl p-14 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Your watchlist is empty
            </h2>

            <p className="text-zinc-400 mb-8">
              Start discovering movies and shows to build your collection.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-black px-8 py-4 rounded-2xl font-medium hover:bg-zinc-200 transition"
            >
              Explore Movies
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="all">All Status</option>
            <option value="wishlist">Wishlist</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="all">All Genres</option>

            {[...new Set(watchlist.map((movie) => movie.genre))]
              .filter(Boolean)
              .map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          >
            <option value="recent">Recently Added</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
          </select>
        </div>

        {/* WATCHLIST GRID */}

        {!loading && filteredWatchlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filteredWatchlist.map((movie) => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="overflow-hidden rounded-3xl bg-zinc-900">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                        : "https://via.placeholder.com/342x513?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium">{movie.title}</h3>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs uppercase tracking-wide bg-white/10 border border-white/5 px-3 py-1 rounded-full text-zinc-300">
                      {movie.media_type}
                    </span>

                    <select
                      value={movie.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();

                        updateStatus(movie.id, e.target.value);
                      }}
                      className="bg-white text-black text-xs px-3 py-2 rounded-full outline-none cursor-pointer"
                    >
                      <option value="wishlist">Wishlist</option>

                      <option value="watching">Watching</option>

                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      removeFromWatchlist(movie.id);
                    }}
                    className="mt-4 w-full border border-red-500/20 text-red-400 py-3 rounded-2xl hover:bg-red-500/10 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}

      {selectedMovie && (
        <div
          onClick={() => setSelectedMovie(null)}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#14141B] border border-white/10 rounded-[2rem] max-w-5xl w-full overflow-hidden relative"
          >
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-5 right-5 z-10 bg-black/50 hover:bg-black/70 w-10 h-10 rounded-full transition"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2">
              {/* POSTER */}

              <div className="h-full">
                <img
                  src={
                    selectedMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DETAILS */}

              <div className="p-10 overflow-y-auto max-h-[90vh]">
                <p className="uppercase tracking-[0.3em] text-xs text-zinc-500 mb-4">
                  {selectedMovie.media_type}
                </p>

                <h2 className="text-4xl font-bold mb-6">
                  {selectedMovie.title}
                </h2>

                <p className="text-zinc-400 leading-relaxed mb-8">
                  Your personal space to track progress, ratings, and thoughts.
                </p>

                <div className="flex items-center gap-3 mb-8">
                  <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
                    {selectedMovie.status}
                  </span>
                </div>

                {/* WATCHING MESSAGE */}

                {selectedMovie.status === "watching" && (
                  <p className="text-zinc-500 text-sm mb-6">
                    Finish watching to add your rating and review.
                  </p>
                )}

                {/* TV PROGRESS */}

                {selectedMovie.media_type === "tv" &&
                  selectedMovie.status !== "wishlist" && (
                    <div className="mb-8">
                      <div className="flex justify-between text-sm text-zinc-400 mb-2">
                        <span>Progress</span>

                        <span>
                          {selectedMovie.episodes_watched || 0} /{" "}
                          {selectedMovie.total_episodes || 0}
                        </span>
                      </div>

                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-500"
                          style={{
                            width: `${
                              selectedMovie.total_episodes > 0
                                ? Math.min(
                                    (selectedMovie.episodes_watched /
                                      selectedMovie.total_episodes) *
                                      100,
                                    100,
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <div className="flex gap-4 mt-6">
                        <input
                          type="number"
                          min="0"
                          placeholder="Watched"
                          value={selectedMovie.episodes_watched || ""}
                          onChange={(e) => {
                            const watched = Number(e.target.value);

                            updateEpisodes(
                              selectedMovie.id,
                              watched,
                              selectedMovie.total_episodes || 0,
                            );
                          }}
                          className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none"
                        />

                        <input
                          type="number"
                          min="0"
                          placeholder="Total"
                          value={selectedMovie.total_episodes || ""}
                          onChange={(e) => {
                            const total = Number(e.target.value);

                            updateEpisodes(
                              selectedMovie.id,
                              selectedMovie.episodes_watched || 0,
                              total,
                            );
                          }}
                          className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none"
                        />
                      </div>
                    </div>
                  )}

                {/* RATING + REVIEW */}

                {selectedMovie.status === "completed" && (
                  <>
                    {/* STARS */}

                    <div className="flex items-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            updateReview(
                              selectedMovie.id,
                              star * 2,
                              selectedMovie.review || "",
                            );
                          }}
                          className={`text-3xl transition hover:scale-110 ${
                            (selectedMovie.rating || 0) >= star * 2
                              ? "text-yellow-400"
                              : "text-zinc-600"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    {/* REVIEW */}

                    <textarea
                      placeholder="Write your review..."
                      value={selectedMovie.review || ""}
                      onChange={(e) => {
                        setSelectedMovie({
                          ...selectedMovie,
                          review: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        updateReview(
                          selectedMovie.id,
                          selectedMovie.rating || null,
                          selectedMovie.review || "",
                        );
                      }}
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-5 outline-none resize-none"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
