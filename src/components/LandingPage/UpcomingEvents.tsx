import { useEffect, useState } from "react";
import { getEvents } from "../../services/event.service";
import type { TicketType, EventData } from "../../types/type";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventDateParts = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  const formatPrice = (ticketTypes?: TicketType[]) => {
    if (!ticketTypes || ticketTypes.length === 0) return "Free";
    const prices = ticketTypes.map((t) => t.price);
    const minPrice = Math.min(...prices);
    if (minPrice === 0) return "Free";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(minPrice);
  };

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
        <a
          className="flex items-center gap-2 text-[#ddb7ff] font-bold group transition-colors"
          href="#"
        >
          View All{" "}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </a>
      </div>

      {/* Event Card */}
      {events.length === 0 ? (
        <div className="text-center py-12 text-[#cfc2d6]">
          No upcoming events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event) => {
            const { day, month } = getEventDateParts(event.startDate);
            const priceDisplay = formatPrice(event.ticketTypes);

            return (
              <div
                key={event.id}
                className="group bg-[#231d2e] rounded-xl overflow-hidden shadow-lg border border-[#4d4354]/10 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Banner */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={
                      event.bannerImage ||
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=500&q=80"
                    }
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#231d2e]/90 backdrop-blur rounded-lg flex flex-col items-center border border-[#4d4354]/20">
                    <span className="text-base font-bold text-[#ddb7ff]">
                      {day}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#cfc2d6]">
                      {month}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-[#2e2738] text-[#cfc2d6] rounded text-[10px] font-bold uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#eadef6] truncate mb-2"
                    title={event.name}
                  >
                    {event.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#cfc2d6] text-sm mb-4">
                    <span className="material-symbols-outlined text-[18px]">
                      location_on
                    </span>
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Price & Like */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#4d4354]/10">
                    <div>
                      <p className="text-[10px] text-[#cfc2d6] font-bold uppercase tracking-widest">
                        Starts From
                      </p>
                      <p
                        className={`text-xl font-bold ${priceDisplay === "Free" ? "text-[#5de6ff]" : "text-[#ddb7ff]"}`}
                      >
                        {priceDisplay}
                      </p>
                    </div>
                    <button className="w-10 h-10 rounded-lg bg-[#393244] flex items-center justify-center hover:bg-[#ddb7ff] hover:text-[#490080] transition-colors text-[#cfc2d6]">
                      <span className="material-symbols-outlined">
                        favorite
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
