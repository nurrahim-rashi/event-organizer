import { useSearchParams } from "react-router";
import { useGetEvents } from "../hooks/event/useGetEvents";
import type { Event } from "../types/event";
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
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Ambil state dari URL
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.getAll("category").join(",");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const page = Number(searchParams.get("page")) || 1;

  // 2. Fetch data dari API
  const { data: response, isPending } = useGetEvents({
    page,
    search,
    location,
    category,
    sortBy,
    sortOrder: "desc",
  });

  const events = response?.data || [];
  const featuredEvent = events.length > 0 ? events[0] : null;

  const handleSortChange = (value: string) => {
    const n = new URLSearchParams(searchParams);
    n.set("sortBy", value);
    setSearchParams(n);
  };

  const handleClearFilters = () => setSearchParams(new URLSearchParams());

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
            {isPending ? (
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
                {events.length > 0 && featuredEvent && (
                  <FeaturedBanner event={featuredEvent} />
                )}
                <section>
                  {events.length > 0 && (
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
                          <option value="createdAt">Newest</option>
                          <option value="price">Price: Low to High</option>
                          <option value="popular">Most Popular</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {events.length === 0 ? (
                    /* EMPTY STATE SECTION */
                    <div className="bg-[#231d2e]/70 backdrop-blur-md border border-white/5 min-h-[500px] rounded-xl flex flex-col items-center justify-center text-center p-6 lg:p-12 relative overflow-hidden shadow-[0_0_20px_rgba(221,183,255,0.05)]">
                      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ddb7ff]/10 rounded-full blur-[100px]"></div>
                      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#5de6ff]/10 rounded-full blur-[100px]"></div>

                      <div className="mb-8 relative group">
                        <div className="absolute inset-0 bg-[#ddb7ff]/20 blur-3xl group-hover:bg-[#ddb7ff]/30 transition-all rounded-full"></div>
                        <div className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto rounded-full border-2 border-dashed border-[#4d4354] flex items-center justify-center">
                          <img
                            className="w-4/5 h-4/5 rounded-full object-cover shadow-2xl"
                            alt="No events"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW4LxSzg4z2lDaFE7V5NPDVFeH7yPe82Eax9WZN4zC03Q0YZitHcYr4xPWOB4Tc1XoY6KSKvDCkrFyLaPKi6R4Obyz1jsEaspfQ2DwECUoIYI9MdwxJ9_VkQ92r8TwY5oEpkqvjK_HOK0bgSU6_Fk_BUxe3rRyv5ZcTK9KioE3zYMAiFkI13dKc4E-KeXTCirzMWFQFkTPZ6rFTp4qfDOFMZutkzjzQXbRITOYGXCdPbYsvqb41Xpf_4-GY7vstJ5kNSuBDyfMpkY"
                          />
                        </div>
                      </div>

                      <div className="max-w-md mx-auto space-y-4">
                        <h2 className="text-3xl font-bold text-[#eadef6]">
                          No Events Found
                        </h2>
                        <p className="text-base text-[#cfc2d6]">
                          We couldn't find any matches for{" "}
                          <span className="text-[#ddb7ff] font-semibold">
                            "{search}"
                          </span>
                        </p>
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row gap-4 z-10">
                        <button
                          onClick={handleClearFilters}
                          className="px-6 py-3.5 bg-[#ddb7ff] text-[#400071] rounded-lg font-bold hover:scale-105 transition-all"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* EVENTS GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {events.map((event: Event) => (
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
