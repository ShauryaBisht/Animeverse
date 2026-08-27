import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Airing", path: "/airing" },
    { name: "Search", path: "/search" },
    { name: "Top Rated", path: "/top" },
    { name: "Watchlist", path: "/watchlist" },
  ];

  const displayName = profile?.full_name || user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-neutral-950/90 border-b border-neutral-800 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-500 group-hover:text-amber-400 transition-colors">
            AnimeVerse
          </span>
        </Link>

        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition-colors duration-200 relative py-1 ${
                  isActive
                    ? "text-amber-500 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-500 after:rounded-full"
                    : "text-neutral-400 hover:text-neutral-100"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-300">
                {displayName}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition shadow-md shadow-amber-500/10"
            >
              Sign In
            </Link>
          )}
        </div>

       
        <div className="flex md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="text-neutral-400 hover:text-white p-2 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? "bg-neutral-900 text-amber-500 border border-neutral-800"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          
          <div className="pt-3 border-t border-neutral-900">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-sm font-semibold text-neutral-400">
                  Signed in as <span className="text-amber-500">{displayName}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full px-4 py-2.5 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;