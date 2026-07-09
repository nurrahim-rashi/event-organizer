import { useNavigate } from "react-router";
import { EventCard } from "../General/EventCard";

export const OrganizerSection = ({
  event,
  toTitleCase,
  isOwner,
  moreEvents = [],
}: any) => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#2e2738] p-6 rounded-xl shadow-lg border border-[#4d4354]/30 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ddb7ff]/20 bg-[#171021] flex items-center justify-center">
          <img
            alt={event.organizer?.name || "Organizer"}
            className="w-full h-full object-cover"
            src={
              event.organizer?.profilePic ??
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400"
            }
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#ddb7ff] uppercase font-bold tracking-wider">
            Hosted By
          </p>
          <h4 className="font-bold text-[#eadef6] text-lg truncate">
            {toTitleCase(event.organizer?.name || "Organizer")}
          </h4>{" "}
          <h3 className="text-[#eadef6] text-sm truncate">
            {event.organizer?.email}
          </h3>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate(`/organizers/${event.organizerId}`)}
              className="w-full py-2 bg-transparent border border-[#ddb7ff] text-[#ddb7ff] rounded-lg font-bold text-xs hover:bg-[#ddb7ff]/10"
            >
              View Profile
            </button>
            {isOwner && (
              <button
                onClick={() => navigate(`/events/${event.id}/edit`)}
                className="w-full py-2 bg-[#ddb7ff] text-[#490080] rounded-lg font-bold text-xs hover:bg-[#d6a5ff]"
              >
                Edit Event
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#4d4354]/30">
        <h2 className="text-xl font-bold mb-4">
          More events by {toTitleCase(event.organizer?.name || "Organizer")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moreEvents &&
          moreEvents.filter((e: any) => e.id !== event.id).length > 0 ? (
            moreEvents
              .filter((e: any) => e.id !== event.id)
              .slice(0, 2)
              .map((e: any) => <EventCard key={e.id} event={e} />)
          ) : (
            <p className="text-sm text-[#cfc2d6]">No other events found.</p>
          )}
        </div>
      </div>
    </section>
  );
};
