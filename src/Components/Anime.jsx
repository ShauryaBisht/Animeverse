import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Anime() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

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

            
            await new Promise((resolve) => setTimeout(resolve, 800));

            const charRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
            if (charRes.ok) {
              const charJson = await charRes.json();
              charList = (charJson.data || [])
                .filter((c) => c.role === "Main")
                .map((c) => ({
                  id: c.character?.mal_id,
                  name: c.character?.name,
                  image: c.character?.images?.jpg?.image_url,
                }));
            }
          }
        } catch (jikanErr) {
          console.warn("Jikan failed or timed out, attempting Kitsu fallback...", jikanErr);
        }

        
        if (!data) {
          const kitsuRes = await fetch(`https://kitsu.io/api/edge/anime/${id}`);
          if (!kitsuRes.ok) {
            throw new Error("Unable to retrieve anime details from both Jikan and Kitsu.");
          }

          const kitsuJson = await kitsuRes.json();
          const attr = kitsuJson.data.attributes;
          const youtubeId = attr.youtubeVideoId;

          data = {
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
            genres: [],
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
              }));
            }
          } catch (charErr) {
            console.warn("Could not fetch Kitsu characters:", charErr);
          }
        }

        if (isMounted) {
          setAnime(data);
          setCharacters(charList);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError(err.message || "Failed to load anime details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Anime Details...</span>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white gap-4 px-4 text-center">
        <p className="text-xl md:text-2xl text-red-400 max-w-md">{error || "Anime not found."}</p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  
  const trailerUrl =
    anime.trailer?.embed_url ||
    (anime.trailer?.youtube_id
      ? `https://www.youtube.com/embed/${anime.trailer.youtube_id}`
      : null);

  return (
    <div id="anime" className="min-h-screen bg-black text-white pb-20">
      <h1 className="font-bold md:text-[50px] text-center pt-[3%] text-[32px] md:text-[40px] px-4">
        {anime.title}
      </h1>

      <div className="flex flex-col md:flex-row md:ml-[4%] mt-[4%] px-4 gap-6 items-center md:items-start">
        <img
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
          alt={anime.title}
          className="md:w-[280px] md:h-[400px] w-full max-w-[300px] rounded-lg shadow-lg object-cover"
        />

        <div className="flex-1">
          <p className={`${expanded ? "" : "line-clamp-4"} md:line-clamp-none md:text-[18px] leading-relaxed text-gray-300`}>
            {anime.synopsis}
          </p>

          {anime.synopsis && anime.synopsis.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-400 mt-2 font-semibold md:hidden"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#1a1a1a] mx-[4%] mt-10 rounded-xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 mb-10">
          <p><span className="font-bold text-white">Japanese:</span> {anime.title_japanese || "N/A"}</p>
          <p><span className="font-bold text-white">Type:</span> {anime.type || "N/A"}</p>
          <p><span className="font-bold text-white">Status:</span> {anime.status || "N/A"}</p>
          <p><span className="font-bold text-white">Episodes:</span> {anime.episodes ?? "Unknown"}</p>
          <p><span className="font-bold text-white">Score:</span> ⭐ {anime.score ?? "N/A"}</p>
          <p><span className="font-bold text-white">Genre:</span> {anime.genres?.length ? anime.genres.map((g) => g.name).join(", ") : "N/A"}</p>
          <p><span className="font-bold text-white">Producer:</span> {anime.producers?.[0]?.name || "N/A"}</p>
          <p><span className="font-bold text-white">Aired:</span> {anime.aired?.string || "N/A"}</p>
        </div>

        {/* Character List */}
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Main Characters</h2>
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {characters.length > 0 ? (
            characters.map((char) => (
              <div
                key={char.id || char.name}
                className="flex items-center bg-[#252525] w-[300px] rounded-lg p-3 hover:bg-gray-800 transition-colors"
              >
                <img
                  src={char.image || "https://via.placeholder.com/60"}
                  alt={char.name}
                  className="rounded-full h-[60px] w-[60px] object-cover border-2 border-blue-500"
                />
                <p className="ml-4 font-medium text-sm lg:text-base">{char.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No main characters listed or available.</p>
          )}
        </div>

        {/* Trailer Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Trailer</h2>
          {trailerUrl ? (
            <div className="relative pt-[56.25%] w-full max-w-4xl mx-auto">
              <iframe
                src={trailerUrl}
                title={anime.title}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              ></iframe>
            </div>
          ) : (
            <p className="text-gray-500 italic">No official trailer available for this anime.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Anime;