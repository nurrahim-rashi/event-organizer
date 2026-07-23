import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Event } from "../../types/event";

interface HeroProps {
  search: string;
  setSearch: (s: string) => void;
  location: string;
  setLocation: (s: string) => void;
  onSearch: () => void;
  setCategory: (c: string) => void;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  upcomingEvents: Event[];
}

export default function Hero({
  search,
  setSearch,
  location,
  setLocation,
  onSearch,
  setCategory,
  searchParams,
  setSearchParams,
  upcomingEvents,
}: HeroProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (upcomingEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex(
        (prevIndex) => (prevIndex + 1) % upcomingEvents.length,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [upcomingEvents]);

  const currentEvent = upcomingEvents[currentBannerIndex];

  const handleCategoryClick = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    const currentCats = newParams.getAll("category");

    if (currentCats.includes(category)) {
      const filteredCats = currentCats.filter((c) => c !== category);
      newParams.delete("category");
      filteredCats.forEach((c) => newParams.append("category", c));
    } else {
      newParams.append("category", category);
    }
    setSearchParams(newParams);
  };

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden px-6 py-24 bg-gradient-to-tr from-[#171021] via-[#231d2e] to-[#171021]">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#ddb7ff]/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#5de6ff]/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Kolom Kiri - Form & Pencarian */}
        <div className="z-10 space-y-8 lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e2738] text-[#ddb7ff] rounded-full text-xs font-semibold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[18px]">
              auto_awesome
            </span>
            <span>Discover Your Next Adventures</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-[#eadef6] max-w-xl leading-tight tracking-tight">
            Find Amazing Events{" "}
            <span className="text-[#ddb7ff] italic">Without Limits.</span>
          </h1>

          <p className="text-lg text-[#cfc2d6] max-w-md">
            The ultimate event management platform for unforgettable concerts,
            workshops, and sporting experiences.
          </p>

          <div className="flex flex-col md:flex-row items-center p-2 bg-[#231d2e] rounded-xl border border-[#4d4354]/30 max-w-2xl gap-2 md:gap-0 shadow-lg">
            <div className="flex flex-1 items-center px-4 gap-3 w-full">
              <span className="material-symbols-outlined text-[#cfc2d6]">
                search
              </span>
              <input
                className="w-full border-none focus:ring-0 bg-transparent text-[#eadef6] placeholder-[#cfc2d6]/50 outline-none py-3"
                placeholder="Search concerts, festivals, workshops..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>{" "}
            <div className="h-8 w-[1px] bg-[#4d4354]/50 hidden md:block mx-2"></div>
            <button
              onClick={onSearch}
              className="px-6 py-3 bg-[#ddb7ff] text-[#171021] font-bold rounded-lg hover:bg-white transition"
            >
              Search
            </button>{" "}
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { id: "MUSIC", label: "Music", icon: "music_note" },
              { id: "BUSINESS", label: "Workshop", icon: "school" },
              { id: "SPORTS", label: "Sports", icon: "sports_soccer" },
              { id: "ART", label: "Art", icon: "theaters" },
              { id: "FOOD", label: "Culinary", icon: "restaurant" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  onSearch();
                }}
                className="px-4 py-2 rounded-full border border-[#4d4354] bg-[#1f1929] text-[#cfc2d6] hover:border-[#ddb7ff] hover:text-[#ddb7ff] transition-all text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {cat.icon}
                </span>{" "}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kolom Kanan - Rotasi Banner Terdekat */}
        <div className="hidden lg:block lg:col-span-5 relative z-10 w-full">
          {currentEvent ? (
            <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border-4 border-[#231d2e] shadow-2xl group transition-all duration-500">
              <Link
                to={`/events/${currentEvent.id}`}
                className="absolute inset-0 z-0 block"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${currentEvent.bannerImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"})`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#171021] via-[#171021]/60 to-transparent"></div>
              </Link>

              <div className="absolute bottom-0 left-0 p-8 z-10 w-full pointer-events-none">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ddb7ff] text-[#490080] text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm">
                    Upcoming
                  </span>
                  <span className="bg-[#00cbe6]/30 backdrop-blur-md text-[#5de6ff] text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm border border-[#5de6ff]/20">
                    {currentEvent.category}
                  </span>
                </div>

                <h3
                  className="text-2xl md:text-3xl font-black mb-2 leading-tight text-white line-clamp-2"
                  style={{ textShadow: "0 0 15px rgba(221,183,255,0.4)" }}
                >
                  {currentEvent.name}
                </h3>

                <p className="text-sm text-[#cfc2d6] mb-6 line-clamp-2">
                  {currentEvent.description || "No description provided."}
                </p>
              </div>

              {/* Indikator Slider Dot */}
              {upcomingEvents.length > 1 && (
                <div className="absolute top-4 right-4 flex gap-1.5 z-20 pointer-events-auto bg-[#171021]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                  {upcomingEvents.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentBannerIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentBannerIndex
                          ? "w-4 bg-[#ddb7ff]"
                          : "w-2 bg-[#cfc2d6]/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Skeleton Fallback jika data belum termuat */
            <div className="w-full h-[480px] bg-[#231d2e] rounded-2xl animate-pulse border-4 border-[#231d2e]" />
          )}
        </div>
      </div>
    </section>
  );
}
