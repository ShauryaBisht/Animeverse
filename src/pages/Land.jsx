import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Card from "../Components/Card";

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

export default function Land() {
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchTrending = async (retries = 2) => {
      for (let i = 0; i <= retries; i++) {
        try {
          const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10");
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setTrending(data?.data || []);
              setLoadingTrending(false);
            }
            return;
          }
          if (res.status === 429 || res.status === 504) {
            await new Promise((r) => setTimeout(r, 800 * (i + 1)));
          }
        } catch (err) {
          if (i === retries) {
            console.error("Failed to load trending anime:", err);
            if (isMounted) setLoadingTrending(false);
          }
          await new Promise((r) => setTimeout(r, 800 * (i + 1)));
        }
      }
    };

    fetchTrending();

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
      
      <div className="absolute top-0 inset-x-0 h-[640px] sm:h-[740px] pointer-events-none -z-0 overflow-hidden select-none">
        <img
          src="/bg.png"
          alt="Hero Wallpaper"
          className="w-full h-full object-cover object-top opacity-30 sm:opacity-35 scale-105"
        />

        
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/45 to-neutral-950" />

        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-neutral-950/90" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>

      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-14 flex flex-col items-center justify-center relative z-10 w-full text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800/80 text-amber-500 text-xs font-semibold mb-6 shadow-inner backdrop-blur-sm animate-fade-in">
          <span>✨</span>
          <span>Explore 10,000+ Anime Series & Movies</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          Welcome to <span className="text-amber-500">AnimeVerse</span>
        </h1>

        <p className="text-neutral-300 text-sm sm:text-base md:text-lg mt-4 max-w-2xl leading-relaxed drop-shadow-md">
          Dive into comprehensive anime analytics, discover trending titles,
          explore characters, and curate your personalized watchlist with ease.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <NavLink
            to="/airing"
            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-[0_0_24px_rgba(245,158,11,0.28)] hover:shadow-[0_0_36px_rgba(245,158,11,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Start Exploring
          </NavLink>
          <NavLink
            to="/search"
            className="px-8 py-3.5 rounded-xl border border-neutral-700/80 bg-neutral-900/80 backdrop-blur-md text-neutral-200 font-semibold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 active:scale-[0.98] transition-all duration-200"
          >
            Search Titles
          </NavLink>
        </div>
      </main>

      
      <section className="max-w-7xl mx-auto px-6 py-8 w-full relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HiOutlineFire className="text-amber-500 text-2xl" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Trending Now
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="p-2.5 rounded-xl bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 active:scale-90 transition"
              aria-label="Scroll left"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-2.5 rounded-xl bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 active:scale-90 transition"
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
                  className="w-[160px] sm:w-[190px] aspect-[2/3] shrink-0 rounded-2xl bg-neutral-900/80 border border-neutral-800 animate-pulse"
                />
              ))
            : trending.map((anime, index) => (
                <div key={`${anime.mal_id}-${index}`} className="shrink-0">
                  <Card
                    id={anime.mal_id}
                    title={anime.title_english || anime.title}
                    poster={
                      anime.images?.webp?.large_image_url ||
                      anime.images?.jpg?.large_image_url ||
                      anime.images?.jpg?.image_url
                    }
                    year={anime.year ? `${anime.year}` : anime.status}
                    type={anime.type}
                    score={anime.score}
                    episodes={anime.episodes}
                  />
                </div>
              ))}
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-6 py-10 w-full relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Browse by Genre
          </h2>
          <NavLink
            to="/search"
            className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition flex items-center gap-1"
          >
            <span>View All</span>
            <span>&rarr;</span>
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
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/90 hover:border-amber-500/80 hover:bg-neutral-800/90 hover:-translate-y-1 transition duration-200 group active:scale-95 shadow-sm"
              >
                <IconComponent className="text-2xl mb-2 text-neutral-400 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-200" />
                <span className="text-xs font-semibold text-neutral-300 group-hover:text-amber-500 transition-colors">
                  {g.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}