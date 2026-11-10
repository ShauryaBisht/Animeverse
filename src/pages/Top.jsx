import React, { useState, useEffect } from "react";
import Card from "../Components/Card";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

const ANILIST_URL = "https://graphql.anilist.co";

const TOP_ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: ANIME, isAdult: false, sort: [SCORE_DESC]) {
        idMal
        id
        title {
          english
          romaji
        }
        format
        status
        averageScore
        episodes
        seasonYear
        coverImage {
          extraLarge
          large
        }
      }
    }
  }
`;

function Top() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const res = await fetch(ANILIST_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: TOP_ANIME_QUERY,
            variables: { page: currentPage, perPage: 24 },
          }),
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const json = await res.json();
        const mediaList = json.data?.Page?.media || [];
        const pageInfo = json.data?.Page?.pageInfo;

        const formatted = mediaList.map((anime) => ({
          mal_id: anime.idMal || anime.id,
          title: anime.title?.english || anime.title?.romaji || "Untitled",
          poster: anime.coverImage?.extraLarge || anime.coverImage?.large,
          year: anime.seasonYear ? `${anime.seasonYear}` : anime.status,
          type: anime.format,
          score: anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null,
          episodes: anime.episodes,
        }));

        if (isMounted) {
          setAnimes(formatted);
          setHasNextPage(Boolean(pageInfo?.hasNextPage));
        }
      } catch (err) {
        console.error("Error fetching top anime:", err);
        if (isMounted) {
          setError("Unable to load top anime. Please try again.");
          setAnimes([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentPage, reloadIndex]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-8 md:px-12 py-8">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Top Rated <span className="text-amber-500">Anime</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            All-time highest rated and community favorite masterpieces
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-neutral-900 text-amber-500 border border-neutral-800 rounded-full">
          Page {currentPage}
        </span>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-full aspect-[2/3] max-w-[190px] rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 mb-4 text-2xl">
              <HiOutlineExclamationTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-200">{error}</h3>
            <button
              onClick={() => setReloadIndex((v) => v + 1)}
              className="mt-5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {animes.map((anime) => (
              <Card
                key={anime.mal_id}
                id={anime.mal_id}
                poster={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.poster}
                title={anime.title}
                year={anime.year ? `${anime.year}` : anime.status}
                type={anime.type}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto flex justify-center items-center gap-4 mt-12 mb-6">
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
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-sm font-bold text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md"
          disabled={!hasNextPage || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Top;