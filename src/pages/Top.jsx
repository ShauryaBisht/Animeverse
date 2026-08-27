import React, { useState, useEffect } from "react";
import Card from "../Components/Card";

function Top() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${currentPage}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setAnimes(data?.data || []);
          setHasNextPage(data?.pagination?.has_next_page ?? false);
        }
      })
      .catch((err) => {
        console.error("Error fetching top anime:", err);
        if (isMounted) setAnimes([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {animes.map((anime) => (
              <Card
                key={anime.mal_id}
                id={anime.mal_id}
                poster={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                title={anime.title}
                year={anime.status}
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