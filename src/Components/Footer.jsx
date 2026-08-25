import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950 py-12 mt-16 text-neutral-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <Link to="/" className="inline-block">
            <span className="text-xl font-black text-amber-500 hover:text-amber-400 transition-colors">
              AnimeVerse
            </span>
          </Link>
          <p className="text-neutral-500 text-xs">
            Your comprehensive platform for anime discovery, tracking, and analytics.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-neutral-400 font-medium">
          <Link to="/" className="hover:text-amber-500 transition">
            Home
          </Link>
          <Link to="/airing" className="hover:text-amber-500 transition">
            Airing
          </Link>
          <Link to="/search" className="hover:text-amber-500 transition">
            Search
          </Link>
          <Link to="/top" className="hover:text-amber-500 transition">
            Top Rated
          </Link>
          <Link to="/watchlist" className="hover:text-amber-500 transition">
            Watchlist
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center text-neutral-600 mt-8 pt-6 border-t border-neutral-900">
        © {new Date().getFullYear()} AnimeVerse. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;