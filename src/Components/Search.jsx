import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "./Card";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get("genre") || "";
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [activeSearch, setActiveSearch] = useState({
    term: queryParam || genreParam,
    isGenre: Boolean(genreParam),
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchSearchData = async (term, isGenre, page = 1) => {
    if (!term || !term.trim()) return;
    setLoading(true);

    const limit = 20;
    const filterParam = isGenre
      ? `filter[categories]=${encodeURIComponent(term.toLowerCase().trim())}`
      : `filter[text]=${encodeURIComponent(term.trim())}`;

    try {
      const res = await fetch(
        `https://kitsu.io/api/edge/anime?${filterParam}&page[size]=${limit}&page[number]=${page}`
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
              item.attributes.posterImage?.large ||
              item.attributes.posterImage?.original ||
              item.attributes.posterImage?.small ||
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
    if (genreParam) {
      setQuery(""); 
      setActiveSearch({ term: genreParam, isGenre: true });
      setCurrentPage(1);
      fetchSearchData(genreParam, true, 1);
    } else if (queryParam) {
      setQuery(queryParam);
      setActiveSearch({ term: queryParam, isGenre: false });
      setCurrentPage(1);
      fetchSearchData(queryParam, false, 1);
    }
  }, [genreParam, queryParam]);

  useEffect(() => {
    if (activeSearch.term) {
      fetchSearchData(activeSearch.term, activeSearch.isGenre, currentPage);
    }
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query.trim() });
    setActiveSearch({ term: query.trim(), isGenre: false });
    setCurrentPage(1);
    fetchSearchData(query.trim(), false, 1);
  };

  return (
    <div id="search" className="min-h-screen bg-neutral-950 text-white px-4 sm:px-8 md:px-12 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
            Search Anime
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Find details, characters, and trailers for thousands of titles
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search by title (e.g. Naruto, Bleach)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition backdrop-blur-md"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/10 hover:opacity-95 active:scale-95 transition"
            >
              Search
            </button>
          </form>
        </div>

        {activeSearch.term && (
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-8">
            <p className="text-sm text-neutral-300">
              {activeSearch.isGenre ? "Browsing Category: " : "Search Results for: "}
              <span className="text-amber-400 font-semibold capitalize">"{activeSearch.term}"</span>
            </p>
            <span className="text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
              Page {currentPage}
            </span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-full aspect-[2/3] max-w-[190px] rounded-xl bg-neutral-900 border border-neutral-800/80 animate-pulse"
              />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {results.map((anime) => (
              <Card
                key={anime.mal_id}
                id={anime.mal_id}
                poster={anime.images?.jpg?.image_url}
                title={anime.title}
                year={anime.status}
                type={anime.type}
              />
            ))}
          </div>
        ) : activeSearch.term ? (
          <div className="py-20 text-center text-neutral-400">
            <p className="text-lg font-medium">No results found for "{activeSearch.term}"</p>
            <p className="text-xs text-neutral-500 mt-1">Try another search term or check back later.</p>
          </div>
        ) : (
          <div className="py-24 text-center text-neutral-600">
            <svg
              className="mx-auto w-10 h-10 mb-3 text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-sm font-medium">Type a title above or browse by category</p>
          </div>
        )}

        {activeSearch.term && results.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12 mb-6">
            <button
              className="px-5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </button>

            <span className="text-sm font-bold text-amber-400 px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
              {currentPage}
            </span>

            <button
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-bold text-sm shadow-md shadow-amber-500/10 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
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