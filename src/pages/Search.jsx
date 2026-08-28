import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../Components/Card";

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

    const limit = 24;

    
    const graphqlQuery = `
      query ($page: Int, $perPage: Int, $search: String, $genre: String) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
            currentPage
          }
          media(search: $search, genre: $genre, type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
            idMal
            id
            title {
              english
              romaji
            }
            status
            format
            averageScore
            episodes
            coverImage {
              large
              extraLarge
            }
          }
        }
      }
    `;

    const variables = {
      page: page,
      perPage: limit,
      ...(isGenre ? { genre: term.trim() } : { search: term.trim() }),
    };

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: graphqlQuery, variables }),
      });

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const { data } = await res.json();
      const mediaList = data?.Page?.media || [];

      const formatted = mediaList
        .filter((item) => item.idMal) 
        .map((item) => ({
          mal_id: item.idMal,
          title: item.title.english || item.title.romaji || "Unknown Title",
          status: item.status ? item.status.replace(/_/g, " ") : "N/A",
          type: item.format || "TV",
          score: item.averageScore ? (item.averageScore / 10).toFixed(1) : null,
          episodes: item.episodes,
          images: {
            jpg: {
              image_url: item.coverImage.extraLarge || item.coverImage.large,
            },
          },
        }));

      setResults(formatted);
      setHasNextPage(Boolean(data?.Page?.pageInfo?.hasNextPage));
    } catch (error) {
      console.error("AniList search error:", error);
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
    <div id="search" className="min-h-screen bg-neutral-950 text-white px-4 sm:px-8 md:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Search <span className="text-amber-500">Anime</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Find details, characters, and trailers across thousands of titles
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
                placeholder="Search by title (e.g. Naruto, Bleach, Code Geass)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-md active:scale-95 transition"
            >
              Search
            </button>
          </form>
        </div>

        {activeSearch.term && (
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-8">
            <p className="text-sm text-neutral-300">
              {activeSearch.isGenre ? "Browsing Category: " : "Search Results for: "}
              <span className="text-amber-500 font-semibold capitalize">"{activeSearch.term}"</span>
            </p>
            <span className="text-xs font-semibold px-3 py-1 bg-neutral-900 text-amber-500 border border-neutral-800 rounded-full">
              Page {currentPage}
            </span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-full aspect-[2/3] max-w-[190px] rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse"
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
                score={anime.score}
                episodes={anime.episodes}
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

            <span className="text-sm font-bold text-amber-500 px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
              {currentPage}
            </span>

            <button
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition"
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