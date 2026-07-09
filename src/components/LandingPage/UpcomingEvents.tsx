import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getEvents } from "../../services/event.service";
import { EventCard } from "../General/EventCard";
import type { Event } from "../../types/type";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        // Menangani struktur data dari response API
        const data =
          response.data && Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-[#ddb7ff]">
        <span className="animate-pulse font-medium">
          Loading upcoming events...
        </span>
      </div>
    );
  }

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

      {/* Grid Events */}
      {events.length === 0 ? (
        <div className="text-center py-12 text-[#cfc2d6]">
          No upcoming events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
