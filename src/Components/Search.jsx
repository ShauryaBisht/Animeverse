import React, { useState,useEffect } from "react";
import Card from "./Card";

function Search() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("")
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchSearchData = async (searchTerm, page = 1) => {
    if (!searchTerm || !searchTerm.trim()) return;
    setLoading(true);

    const limit = 20;
    const offset = (page - 1) * limit;

    try {
      const res = await fetch(
        `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
          searchTerm.trim()
        )}&page[limit]=${limit}&page[offset]=${offset}`
      );

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const json = await res.json();

      const formatted = (json.data || []).map((item) => ({
        mal_id: item.id,
        title: item.attributes.canonicalTitle || item.attributes.titles?.en || "Unknown Title",
        status: item.attributes.status,
        type: item.attributes.subtype,
        images: {
          jpg: {
            image_url:
              item.attributes.posterImage?.small ||
              item.attributes.posterImage?.original ||
              "",
          },
        },
      }));

      setResults(formatted);
      setHasNextPage(Boolean(json.links?.next));
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    if (activeQuery) {
      fetchSearchData(activeQuery, currentPage);
    }
  }, [currentPage])


const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setActiveQuery(query.trim())
    setCurrentPage(1);
    fetchSearchData(query.trim(), 1)
  }

  return (
    <div id="search" className="text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-center mt-[10px]">Search Anime</h1>
      
      {/* Form wrapper enables Enter key submission */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4 justify-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 text-white rounded md:w-[300px] w-[200px] bg-black border border-neutral-700"
        />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </form>

      {loading && <p className="text-center text-slate-400">Loading...</p>}

      <div className="md:flex md:flex-wrap md:ml-[6%] flex flex-wrap ml-[5px] md:gap-[10%] md:mt-[1.5%] gap-[2%] justify-center">
        {results?.map((anime) => (
          <Card
            key={anime.mal_id}
            id={anime.mal_id}
            poster={anime.images?.jpg?.image_url}
            title={anime.title}
            year={anime.status}
            type={anime.type}
          />
        ))}

        {activeQuery && results?.length > 0 && (
          <div className="flex justify-center w-full mt-[4%] gap-[2%] items-center my-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
            >
              Prev
            </button>

            <span className="font-semibold text-white drop-shadow-[0_0_8px_#5bc0be]">
              Page {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!hasNextPage || loading}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;