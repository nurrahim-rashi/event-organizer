import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useEvents } from "../hooks/event/useEvents";
import { useDebounce } from "../hooks/event/useDebounce";
import type { Event, EventCategory } from "../types/type";
import Navbar from "../components/General/Navbar";
import Footer from "../components/General/Footer";
import SidebarFilter from "../components/BrowseEvents/SidebarFilter";
import FeaturedBanner from "../components/BrowseEvents/FeaturedBanner";
import { EventCard } from "../components/General/EventCard";
import Breadcrumb from "../components/General/Breadcrumb";

function EventCardSkeleton() {
  return (
    <div className="bg-[#231d2e]/50 border border-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-[#32293d]" />
      <div className="p-5 space-y-4">
        <div className="h-4 bg-[#32293d] rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-5 bg-[#32293d] rounded w-11/12" />
          <div className="h-5 bg-[#32293d] rounded w-2/3" />
        </div>
        <div className="h-4 bg-[#32293d] rounded w-1/2 pt-2" />
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="h-6 bg-[#32293d] rounded w-1/3" />
          <div className="h-8 bg-[#32293d] rounded w-20" />
        </div>
      </div>
    </div>
  );
}

function FeaturedBannerSkeleton() {
  return (
    <div className="w-full h-64 lg:h-80 bg-[#231d2e]/50 border border-white/5 rounded-2xl animate-pulse p-6 lg:p-8 flex flex-col justify-end gap-3">
      <div className="h-4 bg-[#32293d] rounded w-24" />
      <div className="h-8 bg-[#32293d] rounded w-2/3 md:w-1/2" />
      <div className="h-4 bg-[#32293d] rounded w-1/3" />
    </div>
  );
}

export default function BrowseEvents() {
  const { events, fetchEvents } = useEvents(); // Hapus isLoading dari sini karena tidak ada di return hookmu
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialMount, setIsInitialMount] = useState(true);

  const searchQuery = searchParams.get("search") || "";
  const locationQuery = searchParams.get("location") || "";
  const sortBy = searchParams.get("sortBy") || "Closest Date";
  const maxPriceParam = Number(searchParams.get("price")) || 20000000;
  const dateFilter = searchParams.get("date") || "";

  const selectedCategories = searchParams
    .getAll("category")
    .map((c) => c.toUpperCase()) as EventCategory[];

  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);
  const debouncedLocationQuery = useDebounce<string>(locationQuery, 300);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchEvents();
      } finally {
        setIsInitialMount(false);
      }
    };
    loadData();
  }, []);

  const safeEvents = useMemo(() => {
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

  const filteredEvents = useMemo(() => {
    const filtered = safeEvents.filter((event) => {
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

      // Mengambil harga dari ticketTypes karena Event tidak punya properti price langsung
      const ticketPrices =
        (event as any).ticketTypes?.map((t: any) => Number(t.price) || 0) || [];
      const eventPrice =
        ticketPrices.length > 0 ? Math.min(...ticketPrices) : 0;

      const matchesPrice = eventPrice <= maxPriceParam;

      let matchesDate = true;
      if (dateFilter && event.startDate) {
        const eventDate = new Date(event.startDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (dateFilter === "this-week") {
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = eventDate >= now && eventDate <= nextWeek;
        } else if (dateFilter === "this-month") {
          const nextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
          );
          matchesDate = eventDate >= now && eventDate <= nextMonth;
        } else if (dateFilter === "next-3-months") {
          const next3Months = new Date(
            now.getFullYear(),
            now.getMonth() + 3,
            now.getDate(),
          );
          matchesDate = eventDate >= now && eventDate <= next3Months;
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesPrice &&
        matchesDate
      );
    });

    return [...filtered].sort((a, b) => {
      const getMinPrice = (e: Event) => {
        const prices =
          (e as any).ticketTypes?.map((t: any) => Number(t.price) || 0) || [];
        return prices.length > 0 ? Math.min(...prices) : 0;
      };

      if (sortBy === "Price: Low to High") {
        return getMinPrice(a) - getMinPrice(b);
      }
      if (sortBy === "Most Popular") {
        return ((b as any).views || 0) - ((a as any).views || 0);
      }
      return (
        (a.startDate ? new Date(a.startDate).getTime() : 0) -
        (b.startDate ? new Date(b.startDate).getTime() : 0)
      );
    });
  }, [
    safeEvents,
    debouncedSearchQuery,
    selectedCategories,
    debouncedLocationQuery,
    maxPriceParam,
    dateFilter,
    sortBy,
  ]);

  const suggestedEvents = useMemo(() => {
    if (filteredEvents.length > 0) return [];
    const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    if (searchWords.length === 0) return safeEvents.slice(0, 9);

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
    return sortedBestMatches.length === 0
      ? safeEvents.slice(0, 9)
      : sortedBestMatches.slice(0, 9);
  }, [safeEvents, filteredEvents.length, searchQuery]);

  const featuredEvent = filteredEvents.length > 0 ? filteredEvents[0] : null;
  const handleSortChange = (value: string) => {
    const n = new URLSearchParams(searchParams);
    n.set("sortBy", value);
    setSearchParams(n);
  };
  const handleClearFilters = () => setSearchParams(new URLSearchParams());
  const handleQuickSearch = (keyword: string) => {
    const n = new URLSearchParams();
    n.set("search", keyword);
    setSearchParams(n);
  };

  const isReallyLoading = isInitialMount; // Mengandalkan state lokal karena hook hook hook mu ga ada isLoading

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen font-sans selection:bg-[#ddb7ff]/30">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <Breadcrumb items={[{ label: "Events", path: "/events" }]} />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4 shrink-0">
            <SidebarFilter
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
          <div className="flex-grow flex flex-col gap-12 min-w-0 w-full lg:w-3/4">
            {isReallyLoading ? (
              <>
                <FeaturedBannerSkeleton />
                <section>
                  <div className="h-8 bg-[#32293d] rounded w-48 mb-8 animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <EventCardSkeleton key={idx} />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                {filteredEvents.length > 0 && featuredEvent && (
                  <FeaturedBanner event={featuredEvent} />
                )}
                <section>
                  {filteredEvents.length > 0 && (
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold">
                        Recommended for You
                      </h2>
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
                    <div className="space-y-12">
                      <div className="bg-[#231d2e]/70 backdrop-blur-md border border-white/5 min-h-[500px] rounded-xl flex flex-col items-center justify-center text-center p-6 lg:p-12 relative overflow-hidden shadow-[0_0_20px_rgba(221,183,255,0.05)]">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ddb7ff]/10 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#5de6ff]/10 rounded-full blur-[100px]"></div>
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
                            Don't worry! Check out some of our curated
                            alternative suggestions down below.
                          </p>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 z-10">
                          <button
                            onClick={handleClearFilters}
                            className="px-6 py-3.5 bg-[#ddb7ff] text-[#400071] rounded-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#ddb7ff]/20 flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-xl">
                              filter_alt_off
                            </span>{" "}
                            Clear All Filters
                          </button>
                          <button
                            onClick={handleClearFilters}
                            className="px-6 py-3.5 bg-[#393244] text-[#eadef6] border border-[#4d4354] rounded-lg font-bold hover:bg-[#3d3648] transition-all"
                          >
                            Browse All Events
                          </button>
                        </div>
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
                      {suggestedEvents.length > 0 && (
                        <div className="w-full text-left pt-4">
                          <div className="border-b border-white/5 pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-[#eadef6] flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#5de6ff]">
                                explore
                              </span>{" "}
                              Try Other Events
                            </h3>
                            <p className="text-sm text-[#988d9f] mt-1">
                              Explore these highly recommended events available
                              on MyEvent right now.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredEvents.map((event: Event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
