interface EventDetailsProps {
  event: any;
}

export default function EventDetails({ event }: EventDetailsProps) {
  if (!event) return null;

  return (
    <section className="bg-[rgba(35,29,46,0.6)] backdrop-blur-[12px] border border-white/10 rounded-xl p-1 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Gambar Event */}
        <div className="w-full md:w-48 h-48 md:h-auto">
          <img
            className="w-full h-full object-cover rounded-lg"
            alt={event.name}
            src={event.bannerImage || "https://via.placeholder.com/400"}
          />
        </div>

        {/* Detail Event */}
        <div className="p-6 flex-1 flex flex-col justify-center gap-2">
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00cbe6] text-[#00515d] w-fit">
            <span className="text-[11px] font-semibold uppercase">
              {event.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#eadef6]">{event.name}</h2>
          <div className="flex flex-col gap-1 text-[#cfc2d6] text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                calendar_today
              </span>
              <span>
                {new Date(event.startDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                location_on
              </span>
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
