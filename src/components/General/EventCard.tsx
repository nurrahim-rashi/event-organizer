import { Link } from "react-router";
import { getEventDateParts, formatPrice } from "../../utils/format";

export const EventCard = ({ event }: { event: any }) => {
  const { day, month } = getEventDateParts(event.startDate);
  console.log("Event Data:", event);
  const tickets = event.ticketTypes || event.ticket_types || [];
  const priceDisplay = formatPrice(tickets);

  return (
    <Link
      to={`/events/${event.id}`}
      className="group bg-[#231d2e] rounded-xl overflow-hidden border border-[#4d4354]/30 hover:border-[#ddb7ff]/50 transition-all block"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            event.bannerImage ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400"
          }
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-[#231d2e]/90 backdrop-blur rounded-lg flex flex-col items-center border border-[#4d4354]/20">
          <span className="text-base font-bold text-[#ddb7ff]">{day}</span>
          <span className="text-[10px] uppercase font-bold text-[#cfc2d6]">
            {month}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-[#eadef6] mb-1 truncate">{event.name}</h3>
        <p className="text-xs text-[#988d9f] mb-4">{event.location}</p>

        <div className="pt-4">
          <p className="text-[10px] text-[#cfc2d6] uppercase tracking-widest">
            Starts From
          </p>
          <p
            className={`text-lg font-semibold ${priceDisplay === "Free" ? "text-[#5de6ff]" : "text-[#ddb7ff]"}`}
          >
            {priceDisplay}
          </p>{" "}
        </div>
      </div>
    </Link>
  );
};
