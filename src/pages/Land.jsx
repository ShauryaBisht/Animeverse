import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
      
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col items-center justify-center relative z-10 w-full text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl text-white">
          Welcome to <span className="text-amber-500">AnimeVerse</span>
        </h1>

        <p className="text-neutral-400 text-sm sm:text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
          Dive into comprehensive anime analytics, discover trending titles,
          explore characters, and curate your personalized watchlist with ease.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <NavLink
            to="/home"
            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Start Exploring
          </NavLink>
          <NavLink
            to="/search"
            className="px-8 py-3.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-200 font-semibold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-700 active:scale-[0.98] transition-all duration-200"
          >
            Search Titles
          </NavLink>
        </div>
      </main>

      
      <section className="max-w-7xl mx-auto px-6 py-10 w-full relative z-10">
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
                  className="w-[160px] sm:w-[190px] aspect-[2/3] shrink-0 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse"
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
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Browse by Genre
          </h2>
          <NavLink
            to="/search"
            className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition"
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
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 hover:bg-neutral-800 hover:-translate-y-1 transition duration-200 group"
              >
                <IconComponent className="text-2xl mb-2 text-neutral-400 group-hover:text-amber-500 group-hover:scale-110 transition-all" />
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

export default Land;