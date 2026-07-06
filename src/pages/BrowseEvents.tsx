import React, { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useEvents } from "../stores/useEvents";
import { useDebounce } from "../stores/useDebounce";
import type { Event, EventCategory } from "../types/type";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SidebarFilter from "../components/BrowseEvents/SidebarFilter";
import FeaturedBanner from "../components/BrowseEvents/FeaturedBanner";
import EventCard from "../components/BrowseEvents/EventCard";

export default function BrowseEvents() {
  const { events, fetchEvents } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const locationQuery = searchParams.get("location") || "";
  const sortBy = searchParams.get("sortBy") || "Closest Date";

  const selectedCategories = searchParams
    .getAll("category")
    .map((c) => c.toUpperCase()) as EventCategory[];

  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);
  const debouncedLocationQuery = useDebounce<string>(locationQuery, 300);

  useEffect(() => {
    fetchEvents();
  }, []);

  const safeEvents = React.useMemo(() => {
    if (!events) return [];

    if (Array.isArray(events)) return events as Event[];

    if (
      typeof events === "object" &&
      "data" in events &&
      Array.isArray((events as any).data)
    ) {
      return (events as any).data as Event[];
    }

    return [];
  }, [events]);

  const filteredEvents = safeEvents.filter((event) => {
    if (!event) return false;

    const matchesSearch = event.name
      ? event.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      : false;

    const eventCategoryUpper = (
      event.category || ""
    ).toUpperCase() as EventCategory;
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(eventCategoryUpper);

    const eventLocation = event.location?.toLowerCase() || "";
    const eventCity = event.city?.toLowerCase() || "";
    const filterLoc = debouncedLocationQuery.toLowerCase();

    const matchesLocation =
      eventLocation.includes(filterLoc) || eventCity.includes(filterLoc);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const suggestedEvents = React.useMemo(() => {
    if (filteredEvents.length > 0) return [];

    const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

    if (searchWords.length === 0) {
      return safeEvents.slice(0, 9);
    }

    const scoredEvents = safeEvents.map((event) => {
      let score = 0;
      const eventName = (event.name || "").toLowerCase();
      const eventCategory = (event.category || "").toLowerCase();
      const eventCity = (event.city || "").toLowerCase();

      searchWords.forEach((word) => {
        if (eventName.includes(word)) score += 10;
        if (eventCategory.includes(word)) score += 5;
        if (eventCity.includes(word)) score += 3;
      });

      return { event, score };
    });

    const sortedBestMatches = scoredEvents
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.event);

    if (sortedBestMatches.length === 0) {
      return safeEvents.slice(0, 9);
    }

    return sortedBestMatches.slice(0, 9);
  }, [safeEvents, filteredEvents.length, searchQuery]);

  const featuredEvent = filteredEvents.length > 0 ? filteredEvents[0] : null;

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", value);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleQuickSearch = (keyword: string) => {
    const newParams = new URLSearchParams();
    newParams.set("search", keyword);
    setSearchParams(newParams);
  };

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen font-sans selection:bg-[#ddb7ff]/30">
      <Navbar />
      <main className="pt-24 pb-12 px-6 max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sub-Komponen Sidebar Filter */}
        <div className="w-full lg:w-1/4 shrink-0">
          <SidebarFilter
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col gap-12 min-w-0 w-full lg:w-3/4">
          {/* Sub-Komponen Featured Banner */}
          {filteredEvents.length > 0 && featuredEvent && (
            <FeaturedBanner event={featuredEvent} />
          )}

          {/* Event Grid / Empty State Section */}
          <section>
            {filteredEvents.length > 0 && (
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Recommended for You</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#988d9f]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-[#231d2e] border border-transparent text-[#eadef6] text-sm py-1.5 px-4 pr-10 rounded-lg focus:ring-[#ddb7ff] focus:border-[#ddb7ff] cursor-pointer outline-none"
                  >
                    <option>Closest Date</option>
                    <option>Price: Low to High</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>
            )}

            {filteredEvents.length === 0 ? (
              /* PREMIUM EMPTY STATE SECTION */
              <div className="space-y-12">
                <div className="bg-[#231d2e]/70 backdrop-blur-md border border-white/5 min-h-[500px] rounded-xl flex flex-col items-center justify-center text-center p-6 lg:p-12 relative overflow-hidden shadow-[0_0_20px_rgba(221,183,255,0.05)]">
                  {/* Atmospheric Background Detail */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ddb7ff]/10 rounded-full blur-[100px]"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#5de6ff]/10 rounded-full blur-[100px]"></div>

                  {/* Empty State Illustration */}
                  <div className="mb-8 relative group">
                    <div className="absolute inset-0 bg-[#ddb7ff]/20 blur-3xl group-hover:bg-[#ddb7ff]/30 transition-all rounded-full"></div>
                    <div className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto rounded-full border-2 border-dashed border-[#4d4354] flex items-center justify-center">
                      <div className="w-4/5 h-4/5 rounded-full overflow-hidden shadow-2xl shadow-[#ddb7ff]/10">
                        <img
                          className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                          alt="Empty stage illustration"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW4LxSzg4z2lDaFE7V5NPDVFeH7yPe82Eax9WZN4zC03Q0YZitHcYr4xPWOB4Tc1XoY6KSKvDCkrFyLaPKi6R4Obyz1jsEaspfQ2DwECUoIYI9MdwxJ9_VkQ92r8TwY5oEpkqvjK_HOK0bgSU6_Fk_BUxe3rRyv5ZcTK9KioE3zYMAiFkI13dKc4E-KeXTCirzMWFQFkTPZ6rFTp4qfDOFMZutkzjzQXbRITOYGXCdPbYsvqb41Xpf_4-GY7vstJ5kNSuBDyfMpkY"
                        />
                      </div>
                      <div className="absolute top-2 right-2 p-2 bg-[#231d2e]/90 border border-white/10 backdrop-blur-sm rounded-lg -rotate-12 animate-bounce">
                        <span className="material-symbols-outlined text-[#5de6ff] text-lg block">
                          search_off
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-0 p-2.5 bg-[#231d2e]/90 border border-white/10 backdrop-blur-sm rounded-xl rotate-6 animate-pulse">
                        <span className="material-symbols-outlined text-[#ffafd3] text-lg block">
                          event_busy
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="max-w-md mx-auto space-y-4">
                    <h2 className="text-3xl font-bold text-[#eadef6]">
                      No Events Found
                    </h2>
                    <p className="text-base text-[#cfc2d6] leading-relaxed">
                      We couldn't find any matches for{" "}
                      <span className="text-[#ddb7ff] font-semibold">
                        "{searchQuery || "your filter criteria"}"
                      </span>
                    </p>
                    <p className="text-sm text-[#988d9f]">
                      Don't worry! Check out some of our curated alternative
                      suggestions down below.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 z-10">
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-3.5 bg-[#ddb7ff] text-[#400071] rounded-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#ddb7ff]/20 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">
                        filter_alt_off
                      </span>
                      Clear All Filters
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-3.5 bg-[#393244] text-[#eadef6] border border-[#4d4354] rounded-lg font-bold hover:bg-[#3d3648] transition-all"
                    >
                      Browse All Events
                    </button>
                  </div>

                  {/* Suggested Quick Search Tags */}
                  <div className="mt-12 w-full z-10">
                    <p className="text-xs font-bold text-[#988d9f] uppercase tracking-widest mb-4">
                      Try these popular searches
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[
                        "Tech Meetups",
                        "Virtual Workshops",
                        "Live Concerts",
                        "Jazz Festival",
                      ].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleQuickSearch(tag)}
                          className="px-4 py-2 rounded-lg bg-[#1f1929] hover:bg-[#2e2738] border border-[#4d4354]/40 text-[#cfc2d6] text-sm transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DYNAMIC SMART SUGGESTION GRID */}
                {suggestedEvents.length > 0 && (
                  <div className="w-full text-left pt-4">
                    <div className="border-b border-white/5 pb-4 mb-6">
                      <h3 className="text-2xl font-bold text-[#eadef6] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5de6ff]">
                          explore
                        </span>
                        Try Other Events
                      </h3>
                      <p className="text-sm text-[#988d9f] mt-1">
                        Explore these highly recommended events available on
                        EventSync right now.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {suggestedEvents.map((event: Event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* STANDARD EVENTS GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event: Event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
