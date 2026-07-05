import type { Event, EventCategory } from "../../types/type";
import { Link } from "react-router";

export default function EventCard({ event }: { event: Event }) {
  const getLowestTicketPrice = () => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) return "Free";
    const prices = event.ticketTypes.map((t) => t.price);
    const minPrice = Math.min(...prices);
    return minPrice === 0 ? "Free" : `IDR ${minPrice.toLocaleString()}`;
  };

  const getCategoryBadgeClass = (category: EventCategory) => {
    switch (category) {
      case "MUSIC":
        return "bg-primary/90 text-on-primary";
      case "TECHNOLOGY":
        return "bg-secondary/90 text-on-secondary";
      case "ART":
        return "bg-tertiary/90 text-on-tertiary";
      default:
        return "bg-on-background/20 text-on-background backdrop-blur-md";
    }
  };

  return (
    <Link
      to={`/events/${event.id}`}
      className="bg-[rgba(35,29,46,0.7)] backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600"})`,
          }}
        ></div>
        <div className="absolute top-4 right-4 z-10">
          {/* Menambahkan e.stopPropagation() agar klik wishlist tidak ikut membuka halaman detail */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:text-[#ffafd3] transition-colors"
          >
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
        <span
          className={`absolute bottom-4 left-4 text-[10px] font-bold px-2 py-1 rounded shadow-lg tracking-wider uppercase ${getCategoryBadgeClass(event.category)}`}
        >
          {event.category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-bold group-hover:text-[#ddb7ff] transition-colors line-clamp-1">
            {event.name}
          </h3>
          <span className="text-[#ddb7ff] font-bold shrink-0 text-sm">
            {getLowestTicketPrice()}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-[#cfc2d6] text-sm">
            <span className="material-symbols-outlined text-[18px]">
              calendar_today
            </span>
            <span>
              {new Date(event.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#cfc2d6] text-sm">
            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>
            <span className="line-clamp-1">
              {event.location} {event.city ? `, ${event.city}` : ""}
            </span>
          </div>
        </div>

        <div className="mt-auto w-full py-3 text-center rounded-lg border border-[#ddb7ff] text-[#ddb7ff] font-bold group-hover:bg-[#ddb7ff] group-hover:text-[#490080] transition-all active:scale-95">
          Get Ticket
        </div>
      </div>
    </Link>
  );
}
