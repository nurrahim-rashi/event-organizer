import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getEvents } from "../../services/event.service"; // Pastikan fungsi ini menerima params page
import { EventCard } from "../General/EventCard";
import type { Event } from "../../types/event";
import type { PageableResponse } from "../../types/pagination"; // Sesuaikan path
import GlobalPagination from "../General/GlobalPagination";

export default function UpcomingEvents() {
  // Simpan seluruh objek response (data + meta)
  const [eventsData, setEventsData] = useState<PageableResponse<Event>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Kirim page ke API service
        const response = await getEvents(page);
        setEventsData(response);
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]); // useEffect akan jalan lagi setiap kali page berubah

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-24">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold text-[#eadef6]">Upcoming Events</h2>
          <p className="text-[#cfc2d6] mt-2">
            Don't miss out on these exciting moments.
          </p>
        </div>
        <Link
          to={`/events/`}
          className="flex items-center gap-2 text-[#ddb7ff] font-bold group transition-colors"
        >
          View All{" "}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="min-h-[300px] flex items-center justify-center text-[#ddb7ff]">
          <span className="animate-pulse font-medium">Loading events...</span>
        </div>
      )}

      {/* Grid Events */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventsData?.data?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {eventsData && (
            <div className="mt-12">
              <GlobalPagination
                currentPage={eventsData.meta.page}
                totalPage={Math.ceil(
                  eventsData.meta.total / eventsData.meta.take,
                )}
                onChangePage={(p) => setPage(p)}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
