import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import {
  HiOutlineUsers,
  HiOutlineVideoCamera,
  HiOutlineExclamationTriangle,
  HiCheck,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import {
  isAnimeInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";

export default function Anime() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Helper to fetch with retry for Jikan (429 Rate Limit / 504 Gateway Timeout)
    const fetchWithRetry = async (url, retries = 3, delay = 800) => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const res = await fetch(url);
          if (res.ok) return await res.json();
          
          if (res.status === 429 || res.status === 504) {
            await new Promise((r) => setTimeout(r, delay * (attempt + 1)));
            continue;
          }
          throw new Error(`HTTP Error: ${res.status}`);
        } catch (err) {
          if (attempt === retries) throw err;
          await new Promise((r) => setTimeout(r, delay * (attempt + 1)));
        }
      }
      return null;
    };

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch Anime Details from Jikan
        const animeData = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}`);
        if (!animeData?.data) {
          throw new Error("Anime not found on MyAnimeList.");
        }

        if (isMounted) {
          setAnime(animeData.data);
        }

        // 2. Fetch Characters (delayed slightly to respect rate limit)
        await new Promise((r) => setTimeout(r, 400));
        const charData = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/characters`);
        
        if (isMounted && charData?.data) {
          const mainChars = charData.data
            .filter((c) => c.role === "Main")
            .map((c) => ({
              id: c.character?.mal_id,
              name: c.character?.name,
              image: c.character?.images?.jpg?.image_url,
              role: c.role,
            }));
          setCharacters(mainChars);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError(
            err.message.includes("429")
              ? "Rate limit exceeded. Please wait a moment and try again."
              : "Unable to retrieve anime details."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Sync Watchlist Status with Supabase
  useEffect(() => {
    let isMounted = true;
    if (user && id) {
      isAnimeInWatchlist(Number(id)).then((status) => {
        if (isMounted) setIsBookmarked(status);
      });
    } else {
      setIsBookmarked(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user, id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!anime) return;

    setBookmarkLoading(true);
    const animeId = Number(id || anime.mal_id);

    try {
      if (isBookmarked) {
        await removeFromWatchlist(animeId);
        setIsBookmarked(false);
        showToast("Removed from Watchlist");
      } else {
        await addToWatchlist({
          anime_id: animeId,
          title: anime.title_english || anime.title,
          image_url: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
          score: anime.score ? parseFloat(anime.score) : null,
          episodes: typeof anime.episodes === "number" ? anime.episodes : null,
          type: anime.type,
          status: "plan_to_watch",
        });
        setIsBookmarked(true);
        showToast("Added to Watchlist");
      }
    } catch (err) {
      console.error("Watchlist toggle failed:", err.message);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-neutral-400 font-medium text-sm animate-pulse">
          Fetching Anime Details...
        </p>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-400 mb-4 text-2xl">
          <HiOutlineExclamationTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-200">{error || "Anime Not Found"}</h2>
        <p className="text-neutral-500 text-sm mt-1 max-w-sm">
          We couldn't fetch details for this anime ID.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-xs rounded-xl hover:bg-neutral-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const poster =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url;

  const trailerUrl =
    anime.trailer?.embed_url ||
    (anime.trailer?.youtube_id
      ? `https://www.youtube.com/embed/${anime.trailer.youtube_id}`
      : null);

  return (
    <div id="anime" className="min-h-screen bg-neutral-950 text-white pb-20">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-neutral-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl animate-fade-in text-xs flex items-center gap-2">
          <HiCheck className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-6">
          <Link to="/" className="hover:text-amber-500 transition">Home</Link>
          <span>/</span>
          <span className="text-neutral-200 truncate max-w-xs">
            {anime.title_english || anime.title}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="shrink-0 relative group">
            <div className="w-[220px] sm:w-[260px] md:w-[280px] aspect-[2/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
              <img
                src={poster}
                alt={anime.title}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`w-full mt-3.5 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition active:scale-95 shadow-md ${
                isBookmarked
                  ? "bg-neutral-900 border border-amber-500 text-amber-500 hover:bg-neutral-800"
                  : "bg-amber-500 hover:bg-amber-400 text-neutral-950"
              }`}
            >
              {bookmarkLoading ? (
                <span>Updating...</span>
              ) : isBookmarked ? (
                <>
                  <GoBookmarkFill size={16} />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <CiBookmark size={16} />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            {anime.title_japanese && (
              <p className="text-xs font-semibold text-neutral-500 tracking-wider mb-1">
                {anime.title_japanese}
              </p>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              {anime.title_english || anime.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-4">
              {anime.score && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-500 font-bold text-xs">
                  <FaStar className="text-amber-500 text-xs" />
                  <span>{anime.score}</span>
                </div>
              )}

              {anime.type && (
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-xs uppercase tracking-wider">
                  {anime.type}
                </span>
              )}

              {anime.status && (
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-xs capitalize">
                  {anime.status}
                </span>
              )}

              {anime.episodes && (
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-xs">
                  {anime.episodes} {anime.episodes === 1 ? "Ep" : "Eps"}
                </span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Overview
              </h3>
              <p
                className={`text-neutral-300 text-sm md:text-base leading-relaxed ${
                  expanded ? "" : "line-clamp-4 md:line-clamp-6"
                }`}
              >
                {anime.synopsis || "No synopsis available."}
              </p>

              {anime.synopsis && anime.synopsis.length > 280 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-amber-500 hover:text-amber-400 text-xs font-semibold mt-2 transition inline-block"
                >
                  {expanded ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>

            {anime.genres && anime.genres.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {anime.genres.map((g) => (
                    <span
                      key={g.mal_id || g.name}
                      className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-lg"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">
            Information
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-xs">
            <div>
              <p className="text-neutral-500 uppercase tracking-wider mb-1">Japanese Title</p>
              <p className="font-semibold text-neutral-200">{anime.title_japanese || "N/A"}</p>
            </div>
            <div>
              <p className="text-neutral-500 uppercase tracking-wider mb-1">Aired Date</p>
              <p className="font-semibold text-neutral-200">{anime.aired?.string || "N/A"}</p>
            </div>
            <div>
              <p className="text-neutral-500 uppercase tracking-wider mb-1">Studio / Producer</p>
              <p className="font-semibold text-neutral-200">{anime.producers?.[0]?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-neutral-500 uppercase tracking-wider mb-1">Status</p>
              <p className="font-semibold text-neutral-200 capitalize">{anime.status || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-6 flex items-center gap-2">
            <HiOutlineUsers className="text-amber-500 text-2xl" />
            <span>Main Characters</span>
          </h2>

          {characters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {characters.map((char) => (
                <div
                  key={char.id || char.name}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 hover:bg-neutral-800 transition duration-200 group"
                >
                  <img
                    src={char.image || "https://via.placeholder.com/80"}
                    alt={char.name}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-700 group-hover:border-amber-500 transition duration-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-neutral-200 truncate group-hover:text-amber-500 transition-colors">
                      {char.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 uppercase font-medium mt-0.5">
                      {char.role || "Main"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-neutral-900 border border-neutral-800 text-center text-neutral-500 text-xs">
              No character information available for this title.
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-6 flex items-center gap-2">
            <HiOutlineVideoCamera className="text-amber-500 text-2xl" />
            <span>Official Trailer</span>
          </h2>

          {trailerUrl ? (
            <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
              <iframe
                src={trailerUrl}
                title={`${anime.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-neutral-900 border border-neutral-800 text-center text-neutral-500 text-xs">
              No official promotional video available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}