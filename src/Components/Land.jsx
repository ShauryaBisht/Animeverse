import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Card from "./Card";


import { LuSparkles } from "react-icons/lu";
import { HiOutlineFire } from "react-icons/hi2";
import { GiBroadsword, GiFloatingGhost } from "react-icons/gi";
import { IoCompassOutline, IoRocketOutline, IoHeartOutline } from "react-icons/io5";
import { FaRegSmile, FaTheaterMasks, FaMagic } from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const GENRES = [
  { name: "Action", icon: GiBroadsword, id: 1 },
  { name: "Adventure", icon: IoCompassOutline, id: 2 },
  { name: "Comedy", icon: FaRegSmile, id: 4 },
  { name: "Drama", icon: FaTheaterMasks, id: 8 },
  { name: "Fantasy", icon: FaMagic, id: 10 },
  { name: "Sci-Fi", icon: IoRocketOutline, id: 24 },
  { name: "Romance", icon: IoHeartOutline, id: 22 },
  { name: "Horror", icon: GiFloatingGhost, id: 14 },
];

function Land() {
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (isMounted) {
          setTrending(data?.data || []);
          setLoadingTrending(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load trending anime:", err);
        if (isMounted) setLoadingTrending(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      id="land"
      className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[25%] left-[10%] w-[500px] h-[300px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />

      
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col items-center justify-center relative z-10 w-full text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-md">
          <LuSparkles className="text-amber-400 text-sm" />
          <span>Discover Your Next Favorite Anime</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
            AnimeVerse
          </span>
        </h1>

        <p className="text-neutral-400 text-sm sm:text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
          Dive into comprehensive anime analytics, discover trending titles,
          explore characters, and curate your personalized watchlist with ease.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <NavLink
            to="/home"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Start Exploring
          </NavLink>
          <NavLink
            to="/search"
            className="px-8 py-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-200 font-semibold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-700 active:scale-[0.98] transition-all duration-200 backdrop-blur-md"
          >
            Search Titles
          </NavLink>
        </div>
      </main>

      
      <section className="max-w-7xl mx-auto px-6 py-10 w-full relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HiOutlineFire className="text-amber-500 text-2xl" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-100">
              Trending Now
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition"
              aria-label="Scroll left"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition"
              aria-label="Scroll right"
            >
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loadingTrending
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-[160px] sm:w-[190px] aspect-[2/3] shrink-0 rounded-xl bg-neutral-900 border border-neutral-800/80 animate-pulse"
                />
              ))
            : trending.map((anime) => (
                <div key={anime.mal_id} className="shrink-0">
                  <Card
                    id={anime.mal_id}
                    title={anime.title}
                    poster={
                      anime.images?.jpg?.large_image_url ||
                      anime.images?.jpg?.image_url
                    }
                    year={anime.year ? `${anime.year}` : anime.status}
                    type={anime.type}
                  />
                </div>
              ))}
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-6 py-10 w-full relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-100">
            Browse by Genre
          </h2>
          <NavLink
            to="/search"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            View All &rarr;
          </NavLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {GENRES.map((g) => {
            const IconComponent = g.icon;
            return (
              <button
                key={g.id}
                onClick={() =>
                  navigate(
                    `/search?genre=${encodeURIComponent(g.name.toLowerCase())}`
                  )
                }
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 hover:bg-neutral-800/60 hover:-translate-y-1 transition duration-200 group backdrop-blur-sm"
              >
                <IconComponent className="text-2xl mb-2 text-neutral-400 group-hover:text-amber-400 group-hover:scale-110 transition-all" />
                <span className="text-xs font-semibold text-neutral-300 group-hover:text-amber-400 transition-colors">
                  {g.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      
      <footer className="w-full border-t border-neutral-800/80 bg-neutral-950 py-12 mt-16 text-neutral-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              AnimeVerse
            </span>
            <p className="text-neutral-500 text-xs">
              Your comprehensive platform for anime discovery, tracking, and analytics.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-neutral-400 font-medium">
            <Link to="/home" className="hover:text-amber-400 transition">
              Airing
            </Link>
            <Link to="/search" className="hover:text-amber-400 transition">
              Search
            </Link>
            <Link to="/top" className="hover:text-amber-400 transition">
              Top Rated
            </Link>
            <Link to="/watchlist" className="hover:text-amber-400 transition">
              Watchlist
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center text-neutral-600 mt-8 pt-6 border-t border-neutral-900">
          © {new Date().getFullYear()} AnimeVerse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Land;