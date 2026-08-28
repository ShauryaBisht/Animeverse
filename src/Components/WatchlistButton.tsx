import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  isAnimeInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  AddWatchListInput,
} from "../services/watchlistService";

interface WatchlistButtonProps {
  anime: AddWatchListInput;
  className?: string;
}

export default function WatchlistButton({
  anime,
  className = "",
}: WatchlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (user && anime.anime_id) {
      isAnimeInWatchlist(anime.anime_id).then((saved) => {
        if (isMounted) setInList(saved);
      });
    } else {
      setInList(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user, anime.anime_id]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      if (inList) {
        await removeFromWatchlist(anime.anime_id);
        setInList(false);
      } else {
        await addToWatchlist(anime);
        setInList(true);
      }
    } catch (err: any) {
      console.error("Watchlist action failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
        inList
          ? "bg-amber-500 text-neutral-950 hover:bg-amber-400"
          : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700"
      } ${className}`}
    >
      <svg
        className={`w-4 h-4 ${inList ? "fill-current" : "none"}`}
        fill={inList ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {loading ? "..." : inList ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}