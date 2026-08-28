import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkFill } from "react-icons/go";
import { useAuth } from "../context/AuthContext";
import {
  isAnimeInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";

export default function Card({ id, title, poster, score, episodes, type, year, onRemove }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const numericId = Number(id);

  
  useEffect(() => {
    let isMounted = true;
    if (user && numericId && !isNaN(numericId)) {
      isAnimeInWatchlist(numericId).then((status) => {
        if (isMounted) setIsBookmarked(status);
      });
    } else {
      setIsBookmarked(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user, numericId]);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    if (!numericId || isNaN(numericId) || loading) return;

    setLoading(true);
    try {
      if (isBookmarked) {
        await removeFromWatchlist(numericId);
        setIsBookmarked(false);
        if (onRemove) onRemove(numericId);
      } else {
        await addToWatchlist({
          anime_id: numericId,
          title: title || "Untitled",
          image_url: poster || null,
          score: score && !isNaN(Number(score)) ? Number(score) : null,
          episodes: typeof episodes === "number" ? episodes : null,
          type: type || null,
          status: "plan_to_watch",
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Card bookmark toggle failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[200px] bg-[#141414] rounded-2xl p-2.5 transition-all duration-200">
      <Link to={`/anime/${numericId}`} className="block">
        
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900">
          <img
            src={poster || "https://via.placeholder.com/300x400"}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

         
          {type && (
            <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-neutral-200 uppercase tracking-wider">
              {type}
            </span>
          )}

          
          <button
            onClick={handleBookmarkToggle}
            disabled={loading}
            aria-label="Bookmark"
            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/90 transition-colors"
          >
            {isBookmarked ? (
              <GoBookmarkFill className="w-4 h-4 text-amber-500" />
            ) : (
              <CiBookmark className="w-4 h-4 stroke-[1.5]" />
            )}
          </button>
        </div>

        
        <div className="pt-3 pb-1 px-1">
          <h3 className="text-[15px] font-bold text-white tracking-tight leading-snug line-clamp-1 hover:text-amber-500 transition-colors">
            {title}
          </h3>
          {(year || episodes) && (
            <p className="text-xs text-neutral-400 font-medium mt-1">
              {year || (episodes ? `${episodes} Episodes` : "")}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}