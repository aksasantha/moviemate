import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/api";

function Watchlist() {
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);

  const [loading, setLoading] = useState(true);

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

          <h1 className="text-5xl font-bold mb-4">
            Your Watchlist
          </h1>

          <p className="text-zinc-400 text-lg">
            Track movies and shows you want to watch.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-zinc-500 text-lg">
            Loading watchlist...
          </div>
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

        {/* WATCHLIST GRID */}

        {!loading && watchlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                className="group"
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
                  <h3 className="text-lg font-medium">
                    {movie.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs uppercase tracking-wide bg-white/10 border border-white/5 px-3 py-1 rounded-full text-zinc-300">
                      {movie.media_type}
                    </span>

                    <span className="text-xs uppercase tracking-wide bg-white text-black px-3 py-1 rounded-full">
                      {movie.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;