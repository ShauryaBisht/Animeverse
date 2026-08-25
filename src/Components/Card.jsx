import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkFill } from "react-icons/go";

function Card({ title, year, poster, type, id, handleClick,onRemove }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const isBookmarkedAlready = bookmarks.some((b) => b.id === id || b.title === title);
    setIsBookmarked(isBookmarkedAlready);
  }, [id, title]);

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (!isBookmarked) {
      if (!bookmarks.find((b) => b.id === id || b.title === title)) {
        bookmarks.push({ id, title, year, poster, type });
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1800);
      }
    } else {
      bookmarks = bookmarks.filter((b) => (b.id ? b.id !== id : b.title !== title));
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      
      if (onRemove) {
        onRemove(id || title)
      }
    }
  
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Link
      to={`/anime/${id}`}
      onClick={handleClick}
      className="group relative flex flex-col w-full max-w-[190px] overflow-hidden rounded-xl bg-neutral-900/90 border border-neutral-800/80 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1.5 transition-all duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={poster || "https://via.placeholder.com/300x450"}
          alt={`Poster of ${title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-80" />
        {type && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-neutral-300 border border-neutral-700/50 uppercase tracking-wider">
            {type}
          </span>
        )}

        
        <button
          type="button"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-neutral-950/70 backdrop-blur-md border border-neutral-800/80 text-white hover:text-amber-400 hover:scale-110 active:scale-95 transition-all"
        >
          {isBookmarked ? (
            <GoBookmarkFill className="text-amber-400" size={16} />
          ) : (
            <CiBookmark className="text-neutral-300" size={16} />
          )}
        </button>

        
        {showPopup && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-lg whitespace-nowrap animate-bounce">
            Saved to Watchlist!
          </div>
        )}
      </div>

      
      <div className="p-3 flex flex-col justify-between flex-grow">
        <h3
          title={title}
          className="font-semibold text-xs sm:text-sm text-neutral-100 line-clamp-2 group-hover:text-amber-400 transition-colors leading-snug text-left"
        >
          {title}
        </h3>
        <p className="text-[11px] text-neutral-400 mt-1.5 capitalize text-left">
          {year || "Airing"}
        </p>
      </div>
    </Link>
  );
}

export default Card;