import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Anime() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
       
        const [animeRes, charRes] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${id}`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/characters`)
        ]);

        const animeJson = await animeRes.json();
        const charJson = await charRes.json();

        setAnime(animeJson.data);
        setCharacters(charJson.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  
  if (loading) return <div className="h-screen flex items-center justify-center text-white text-2xl">Loading Anime Details...</div>;
  if (!anime) return <div className="h-screen flex items-center justify-center text-white text-2xl">Anime not found.</div>;

  return (
    <div id="anime" className="min-h-screen bg-black text-white pb-20">
      
      <h1 className="font-bold md:text-[50px] text-center pt-[3%] text-[40px] px-4">
        {anime.title}
      </h1>

  
      <div className="flex flex-col md:flex-row md:ml-[4%] mt-[4%] px-4 gap-6">
        <img 
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url} 
          alt={anime.title} 
          className="md:w-[280px] md:h-[400px] w-full max-w-[300px] mx-auto md:mx-0 rounded-lg shadow-lg object-cover" 
        />
        
        <div className="flex-1">
          <p className={`${expanded ? "" : "line-clamp-4"} md:line-clamp-none md:text-[18px] leading-relaxed`}>
            {anime.synopsis || "No synopsis available."}
          </p>
          
          {anime.synopsis?.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-400 mt-2 font-semibold md:hidden"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Info and Characters Section */}
      <div className="bg-[#1a1a1a] mx-[4%] mt-10 rounded-xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 mb-10">
          <p><span className="font-bold text-white">Japanese:</span> {anime.titles?.[1]?.title || anime.title_japanese || "N/A"}</p>
          <p><span className="font-bold text-white">Type:</span> {anime.type || "N/A"}</p>
          <p><span className="font-bold text-white">Status:</span> {anime.status || "N/A"}</p>
          <p><span className="font-bold text-white">Episodes:</span> {anime.episodes || "Unknown"}</p>
          <p><span className="font-bold text-white">Score:</span> ⭐ {anime.score || "N/A"}</p>
          <p><span className="font-bold text-white">Genre:</span> {anime.genres?.[0]?.name || "N/A"}</p>
          <p><span className="font-bold text-white">Producer:</span> {anime.producers?.[0]?.name || "N/A"}</p>
          <p><span className="font-bold text-white">Aired:</span> {anime.aired?.string || "N/A"}</p>
        </div>

        {/* Character List */}
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Main Characters</h2>
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {characters?.filter(c => c.role === "Main").length > 0 ? (
            characters
              .filter(char => char.role === "Main")
              .map(char => (
                <div key={char.character.mal_id} className="flex items-center bg-[#252525] w-[300px] rounded-lg p-3 hover:bg-gray-800 transition-colors">
                  <img 
                    src={char.character.images?.jpg?.image_url} 
                    alt={char.character.name} 
                    className="rounded-full h-[60px] w-[60px] object-cover border-2 border-blue-500"
                  />
                  <p className="ml-4 font-medium text-sm lg:text-base">{char.character.name}</p>
                </div>
              ))
          ) : (
            <p className="text-gray-500 italic">No main characters listed.</p>
          )}
        </div>

        {/* Trailer Section */}
        {anime.trailer?.embed_url && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Trailer</h2>
            <div className="relative pt-[56.25%] w-full max-w-4xl mx-auto">
              <iframe
                src={anime.trailer.embed_url}
                title={anime.title}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Anime;