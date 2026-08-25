import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Airing", path: "/airing" },
    { name: "Search", path: "/search" },
    { name: "Top Rated", path: "/top" },
    { name: "Watchlist", path: "/watchlist" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-neutral-950/90 border-b border-neutral-800 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
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
        </div>
      )}
    </header>
  );
}

export default Header;