import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { userAuth } from "../../stores/useAuth";
import type { EventCategory } from "../../types/type";

export default function Navbar() {
  const { user, logout } = userAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State untuk Interaktivitas UI
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const categories: EventCategory[] = [
    "MUSIC",
    "SPORTS",
    "BUSINESS",
    "EDUCATION",
    "TECHNOLOGY",
    "FOOD",
    "ART",
    "HEALTH",
    "OTHER",
  ];

  // Efek klik di luar untuk menutup dropdown & search bar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchQuery === ""
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  // Handler Submit Pencarian
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handler Navigasi Create Event
  const handleCreateEventClick = () => {
    if (user) {
      navigate("/create-event");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#171021]/80 backdrop-blur-xl border-b border-[#4d4354]/20 h-16 flex items-center">
      <div className="max-w-[1440px] mx-auto w-full px-6 flex items-center justify-between gap-4">
        {/* LEFT AREA: Logo & Main Navigation */}
        <div className="flex items-center gap-8 flex-1">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-[#ddb7ff] to-[#5de6ff] bg-clip-text text-transparent whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            EventSync
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/events"
              className="text-sm font-semibold text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors"
            >
              Discover
            </Link>

            {/* Dropdown Categories */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="text-sm font-semibold text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors flex items-center gap-1.5 focus:outline-none"
              >
                Categories
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
                >
                  keyboard_arrow_down
                </span>
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-[#231d2e] border border-white/10 rounded-xl shadow-2xl p-2 z-50 grid grid-cols-1 divide-y divide-white/5 animate-fade-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/events?category=${cat.toLowerCase()}`}
                      onClick={() => setIsCategoryOpen(false)}
                      className="text-xs font-medium text-[#cfc2d6] hover:text-[#ddb7ff] hover:bg-white/5 px-4 py-2.5 rounded-lg transition-all capitalize"
                    >
                      {cat.toLowerCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* General Link (Selalu ada di logged-in/logged-out) */}
            <button
              onClick={handleCreateEventClick}
              className="text-sm font-semibold text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors text-left"
            >
              Create an Event
            </button>

            {/* Logged-In Specific Navigation */}
            {user && (
              <>
                <Link
                  to="/my-tickets"
                  className="text-sm font-semibold text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors"
                >
                  My Tickets
                </Link>
                <Link
                  to="/my-events"
                  className="text-sm font-semibold text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors"
                >
                  My Events
                </Link>
                <Link
                  to="/wishlist"
                  className="text-sm font-semibold text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors"
                >
                  Wishlist
                </Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT AREA: Search & Auth Buttons */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Expandable Search Bar */}
          <div ref={searchContainerRef} className="flex items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <input
                type="text"
                placeholder="Search premium events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-[#1f1929] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ddb7ff] ${
                  isSearchOpen
                    ? "w-48 lg:w-64 pl-10 pr-4 py-2 opacity-100"
                    : "w-0 p-0 opacity-0 pointer-events-none"
                }`}
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`flex items-center justify-center rounded-xl text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors ${
                  isSearchOpen
                    ? "absolute left-3 top-1/2 -translate-y-1/2"
                    : "w-10 h-10 bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  search
                </span>
              </button>
            </form>
          </div>

          {/* User Auth Controls */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="hidden lg:flex items-center gap-2 text-sm font-semibold text-[#ddb7ff] hover:underline"
              >
                <span className="material-symbols-outlined text-[18px]">
                  account_circle
                </span>
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="bg-[#2e2738] border border-[#4d4354] hover:bg-[#3d344a] text-[#ffafd3] text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-gradient-to-r from-[#ddb7ff] to-[#bd7aff] text-[#400071] text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#ddb7ff]/10 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
