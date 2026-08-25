import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkFill } from "react-icons/go";

function Anime() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        let data = null;
        let charList = [];

        try {
          const jikanRes = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
          if (jikanRes.ok) {
            const jikanJson = await jikanRes.json();
            data = jikanJson.data;

            await new Promise((resolve) => setTimeout(resolve, 500));

            const charRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
            if (charRes.ok) {
              const charJson = await charRes.json();
              charList = (charJson.data || [])
                .filter((c) => c.role === "Main")
                .map((c) => ({
                  id: c.character?.mal_id,
                  name: c.character?.name,
                  image: c.character?.images?.jpg?.image_url,
                  role: c.role,
                }));
            }
          }
        } catch (jikanErr) {
          console.warn("Jikan fallback to Kitsu...", jikanErr);
        }

        if (!data) {
          const kitsuRes = await fetch(
            `https://kitsu.io/api/edge/anime/${id}?include=categories,producers`
          );
          if (!kitsuRes.ok) throw new Error("Unable to retrieve anime details.");

          const kitsuJson = await kitsuRes.json();
          const attr = kitsuJson.data.attributes;
          const youtubeId = attr.youtubeVideoId;

          const includedCats = (kitsuJson.included || [])
            .filter((item) => item.type === "categories")
            .map((item) => ({ name: item.attributes.title }));

          data = {
            mal_id: id,
            title: attr.canonicalTitle || attr.titles?.en || "Unknown Title",
            synopsis: attr.synopsis || "No synopsis available.",
            images: {
              jpg: {
                large_image_url: attr.posterImage?.large || attr.posterImage?.original || "",
                image_url: attr.posterImage?.medium || attr.posterImage?.small || "",
              },
            },
            status: attr.status || "N/A",
            type: attr.subtype || "N/A",
            episodes: attr.episodeCount || "Unknown",
            score: attr.averageRating ? (attr.averageRating / 10).toFixed(2) : "N/A",
            aired: { string: attr.startDate || "N/A" },
            genres: includedCats,
            producers: [],
            title_japanese: attr.titles?.ja_jp || "N/A",
            trailer: {
              embed_url: youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null,
            },
          };

          try {
            const kitsuCharRes = await fetch(
              `https://kitsu.io/api/edge/anime/${id}/characters?include=character&page[limit]=10`
            );
            if (kitsuCharRes.ok) {
              const kitsuCharJson = await kitsuCharRes.json();
              const includedCharacters = kitsuCharJson.included || [];

              charList = includedCharacters.map((c) => ({
                id: c.id,
                name: c.attributes?.canonicalName || c.attributes?.names?.en || "Unknown",
                image: c.attributes?.image?.original || c.attributes?.image?.medium || "",
                role: "Main",
              }));
            }
          } catch (charErr) {
            console.warn("Could not fetch Kitsu characters:", charErr);
          }
        }

        if (isMounted) {
          setAnime(data);
          setCharacters(charList);

          const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
          const exists = savedBookmarks.some((b) => (b.id ? b.id == id : b.title === data.title));
          setIsBookmarked(exists);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setError(err.message || "Failed to load anime details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleBookmark = () => {
    if (!anime) return;
    let savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (!isBookmarked) {
      savedBookmarks.push({
        id: id || anime.mal_id,
        title: anime.title,
        year: anime.status,
        poster: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        type: anime.type,
      });
      localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
      setIsBookmarked(true);
      showToast("Added to Watchlist");
    } else {
      savedBookmarks = savedBookmarks.filter((b) => (b.id ? b.id != id : b.title !== anime.title));
      localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
      setIsBookmarked(false);
      showToast("Removed from Watchlist");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
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
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-neutral-200">{error || "Anime Not Found"}</h2>
        <p className="text-neutral-500 text-sm mt-1 max-w-sm">
          We couldn't fetch details for this anime ID. It may have been removed or is temporarily unavailable.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:opacity-95 transition"
          >
            Try Again
          </button>
          <Link
            to="/home"
            className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-xs rounded-xl hover:bg-neutral-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const trailerUrl =
    anime.trailer?.embed_url ||
    (anime.trailer?.youtube_id
      ? `https://www.youtube.com/embed/${anime.trailer.youtube_id}`
      : null);

  const poster = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <div id="anime" className="min-h-screen bg-neutral-950 text-white relative overflow-hidden pb-20">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-neutral-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl animate-fade-in text-xs flex items-center gap-2">
          <span>✓</span> {toastMessage}
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 h-[480px] overflow-hidden opacity-25 pointer-events-none">
        <img
          src={poster}
          alt={anime.title}
          className="w-full h-full object-cover blur-3xl scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 relative z-10">
        
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-6">
          <Link to="/home" className="hover:text-amber-400 transition">Home</Link>
          <span>/</span>
          <span className="text-neutral-200 truncate max-w-xs">{anime.title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="shrink-0 relative group">
            <div className="w-[220px] sm:w-[260px] md:w-[280px] aspect-[2/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              <img
                src={poster}
                alt={anime.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <button
              onClick={toggleBookmark}
              className={`w-full mt-3.5 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition active:scale-95 shadow-lg ${
                isBookmarked
                  ? "bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25"
                  : "bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 hover:opacity-95 shadow-amber-500/10"
              }`}
            >
              {isBookmarked ? (
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

            
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              {anime.title}
            </h1>

            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-4">
              {anime.score && anime.score !== "N/A" && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
                  <span>⭐</span>
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
              <p className={`text-neutral-300 text-sm md:text-base leading-relaxed ${expanded ? "" : "line-clamp-4 md:line-clamp-6"}`}>
                {anime.synopsis}
              </p>

              {anime.synopsis && anime.synopsis.length > 280 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-amber-400 hover:text-amber-300 text-xs font-semibold mt-2 transition inline-block"
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
                  {anime.genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-neutral-900/80 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-lg"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-xl">
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
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-100 mb-6 flex items-center gap-2">
            <span>👥</span> Main Characters
          </h2>

          {characters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {characters.map((char) => (
                <div
                  key={char.id || char.name}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/50 transition duration-200 group"
                >
                  <img
                    src={char.image || "https://via.placeholder.com/80"}
                    alt={char.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-500/30 group-hover:scale-105 transition duration-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-neutral-200 truncate group-hover:text-amber-400 transition-colors">
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
            <div className="p-8 rounded-xl bg-neutral-900/30 border border-neutral-800/60 text-center text-neutral-500 text-xs">
              No character information available for this title.
            </div>
          )}
        </div>

       
        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-100 mb-6 flex items-center gap-2">
            <span>🎬</span> Official Trailer
          </h2>

          {trailerUrl ? (
            <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              <iframe
                src={trailerUrl}
                title={`${anime.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-neutral-900/30 border border-neutral-800/60 text-center text-neutral-500 text-xs">
              No official promotional video available.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Anime;