import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchUserWatchlist, removeFromWatchlist } from "../services/watchlistService";
import Card from "../Components/Card";

function Watchlist() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchUserWatchlist()
        .then((data) => setBookmarks(data))
        .catch((err) => console.error("Failed to load watchlist:", err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, navigate]);

  const handleRemove = async (animeId) => {
    try {
      await removeFromWatchlist(animeId);
      setBookmarks((prev) => prev.filter((item) => item.anime_id !== animeId));
    } catch (err) {
      console.error("Failed to remove item:", err.message);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to remove all saved anime from your watchlist?")) {
      try {
        await Promise.all(bookmarks.map((item) => removeFromWatchlist(item.anime_id)));
        setBookmarks([]);
      } catch (err) {
        console.error("Failed to clear watchlist:", err.message);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="watch" className="min-h-screen bg-neutral-950 text-white px-4 sm:px-8 md:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              My <span className="text-amber-500">Watchlist</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Your saved collection of anime titles to watch later
            </p>
          </div>

          {bookmarks.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 bg-neutral-900 text-amber-500 border border-neutral-800 rounded-full">
                {bookmarks.length} {bookmarks.length === 1 ? "Title" : "Titles"}
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-neutral-400 hover:text-red-400 px-3 py-1 rounded-lg border border-neutral-800 hover:border-red-500/40 bg-neutral-900 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-neutral-200">Your Watchlist is Empty</h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm">
              You haven't bookmarked any anime yet. Browse trending titles or search to add them to your collection.
            </p>
            <div className="flex gap-3 mt-6">
              <Link
                to="/airing"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition active:scale-95"
              >
                Explore Airing
              </Link>
              <Link
                to="/search"
                className="px-5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 font-semibold text-xs hover:bg-neutral-800 hover:text-white transition active:scale-95"
              >
                Search Anime
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {bookmarks.map((anime) => (
              <Card
                key={anime.anime_id}
                id={anime.anime_id}
                title={anime.title}
                poster={anime.image_url}
                score={anime.score}
                episodes={anime.episodes}
                type={anime.type}
                onRemove={() => handleRemove(anime.anime_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;