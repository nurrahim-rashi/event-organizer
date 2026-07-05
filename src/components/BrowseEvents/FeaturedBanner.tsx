import type { Event } from "../../types/type";
import { Link } from "react-router";

export default function FeaturedBanner({ event }: { event: Event }) {
  const getLowestTicketPrice = () => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) return "Free";
    const prices = event.ticketTypes.map((t) => t.price);
    const minPrice = Math.min(...prices);
    return minPrice === 0 ? "Free" : `IDR ${minPrice.toLocaleString()}`;
  };

  return (
    <section className="relative w-full h-[480px] rounded-xl overflow-hidden group">
      <Link to={`/events/${event.id}`} className="absolute inset-0 z-0 block">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url(${event.bannerImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#171021] via-[#171021]/50 to-transparent"></div>
      </Link>

      <div className="absolute bottom-0 left-0 p-10 z-10 max-w-2xl pointer-events-none">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-[#ddb7ff] text-[#490080] text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm">
            Featured
          </span>
          <span className="bg-[#00cbe6]/30 backdrop-blur-md text-[#5de6ff] text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm border border-[#5de6ff]/20">
            {event.category}
          </span>
        </div>

        <h1
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white"
          style={{ textShadow: "0 0 15px rgba(221,183,255,0.4)" }}
        >
          {event.name}
        </h1>

        <p className="text-base text-[#cfc2d6] mb-8 line-clamp-2">
          {event.description}
        </p>

        <div className="inline-flex bg-[#ddb7ff] text-[#490080] px-8 py-4 rounded-lg font-bold transition-transform duration-300 group-hover:scale-105 items-center gap-2 shadow-[0_0_20px_rgba(221,183,255,0.3)]">
          <span className="material-symbols-outlined">confirmation_number</span>
          Get Tickets From {getLowestTicketPrice()}
        </div>
      </div>
    </section>
  );
}
