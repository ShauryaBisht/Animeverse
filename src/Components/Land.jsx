import React from "react";
import MySlider from "./MySlide";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NavLink } from "react-router-dom";

function Land() {
  const featuredPosters = {
    img1: "https://m.media-amazon.com/images/M/MV5BMTNjNGU4NTUtYmVjMy00YjRiLTkxMWUtNzZkMDNiYjZhNmViXkEyXkFqcGc@._V1_.jpg",
    img2: "https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    img3: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    img4: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Bleachanime.png/250px-Bleachanime.png",
    img5: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Your_Name_poster.png/250px-Your_Name_poster.png",
  };

  return (
    <div id="land" className="min-h-[calc(100vh-64px)] bg-neutral-950 text-white relative overflow-hidden flex flex-col justify-center items-center py-8">
      
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[400px] h-[300px] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />

      
      <main className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center relative z-10 w-full">
        
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
          <span>⚡ Discover Your Next Favorite Anime</span>
        </div>

       
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-center tracking-tight leading-tight max-w-3xl">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
            AnimeVerse
          </span>
        </h1>

        
        <p className="text-neutral-400 text-xs sm:text-sm md:text-base text-center mt-3 max-w-xl leading-relaxed">
          Dive into comprehensive anime analytics, discover trending titles, explore characters, and curate your personalized watchlist with ease.
        </p>

        
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <NavLink
            to="/home"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Start Exploring
          </NavLink>
          <NavLink
            to="/search"
            className="px-6 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-200 font-semibold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-700 active:scale-[0.98] transition-all duration-200 backdrop-blur-md"
          >
            Search Titles
          </NavLink>
        </div>

        
        <section className="mt-8 flex flex-col items-center">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
            Featured Highlights
          </h2>

          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 to-purple-600/20 opacity-50 blur-lg group-hover:opacity-75 transition duration-500" />
            
            <div className="relative rounded-2xl border border-neutral-800/80 bg-neutral-900/70 p-3.5 backdrop-blur-xl shadow-2xl w-[260px] sm:w-[300px]">
              <MySlider
                img1={featuredPosters.img1}
                img2={featuredPosters.img2}
                img3={featuredPosters.img3}
                img4={featuredPosters.img4}
                img5={featuredPosters.img5}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Land;