import { useParams } from "react-router";
import { useEventDetail } from "../stores/useEventDetail";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();

  const { event, loading, selectedTicket, setSelectedTicket } = useEventDetail(
    id ?? "",
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171021] flex items-center justify-center text-[#eadef6]">
        <div className="animate-pulse font-medium">
          Loading event details...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#171021] flex items-center justify-center text-[#eadef6]">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">Event Not Found</p>
          <a href="/" className="text-[#5de6ff] underline text-sm">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // --- PEMETAAN DATA MURNI CAMELCASE ---
  const eventName = event.name ?? "";
  const eventCategory = event.category ?? "OTHER";
  const eventDescription = event.description ?? "";
  const eventLocation = event.location ?? "";
  const eventCity = event.city ?? "Local Venue";
  const bannerImg =
    event.bannerImage ??
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200";
  const rawStartDate = event.startDate;
  const tickets = event.ticketTypes ?? [];
  const organizerData = event.organizer;

  // --- PERHITUNGAN TIKET ---
  const totalTicketsLeft = Array.isArray(tickets)
    ? tickets.reduce(
        (acc, ticket) =>
          acc + ((ticket.totalTicket ?? 0) - (ticket.booked ?? 0)),
        0,
      )
    : 0;

  const ticketPrice = selectedTicket ? selectedTicket.price : 0;
  const serviceFee = ticketPrice > 0 ? ticketPrice * 0.05 : 0;
  const totalPayment = ticketPrice + serviceFee;

  const formatDate = (isoString: string) => {
    if (!isoString) return "Date not available";
    try {
      return new Date(isoString).toLocaleDateString("en-EN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen selection:bg-[#ddb7ff] selection:text-[#490080]">
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-6">
              <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-[0px_8px_32px_rgba(0,0,0,0.4)] relative group">
                <img
                  alt={eventName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={bannerImg}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-4 py-1.5 bg-[#ddb7ff] text-[#490080] rounded-full font-bold text-xs uppercase tracking-wider">
                    {eventCategory}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-[#eadef6] leading-tight">
                  {eventName}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-xs text-[#cfc2d6] uppercase tracking-wider font-bold">
                        Date &amp; Time
                      </p>
                      <p className="text-xs text-[#eadef6] mt-0.5">
                        {formatDate(rawStartDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      location_on
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#eadef6] truncate max-w-[180px]">
                        {eventLocation}
                      </p>
                      <p className="text-xs text-[#cfc2d6]">{eventCity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      confirmation_number
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#eadef6]">
                        Remaining
                      </p>
                      <p className="text-xs text-[#cfc2d6]">
                        {totalTicketsLeft} Tickets left
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#2e2738] p-8 rounded-xl shadow-lg space-y-6">
              <h2 className="text-2xl font-bold text-[#eadef6]">
                About the Event
              </h2>
              <div className="space-y-4 text-[#cfc2d6] leading-relaxed">
                <p>{eventDescription || "No description provided."}</p>
              </div>
            </section>

            <section className="bg-[#2e2738] p-8 rounded-xl shadow-lg space-y-6">
              <h2 className="text-2xl font-bold text-[#eadef6]">
                Venue Location
              </h2>
              <div className="w-full h-80 rounded-xl overflow-hidden border border-[#4d4354] relative">
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-70"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524661135339-9140b0078d49?q=80&w=1000')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-[#171021]/40"></div>
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="bg-[#2e2738]/70 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white/10 max-w-xs md:max-w-md">
                    <span
                      className="material-symbols-outlined text-[#ddb7ff]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                    <span className="font-bold text-[#eadef6] truncate">
                      {eventLocation}, {eventCity}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <aside className="sticky top-24 bg-[#231d2e] rounded-xl shadow-lg border border-[#4d4354]/30 overflow-hidden">
              <div className="p-6 bg-[#b76dff] text-[#400071]">
                <h3 className="text-xl font-bold">Select Tickets</h3>
                <p className="text-xs opacity-90 uppercase tracking-widest mt-1">
                  Choose your experience
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {tickets.length > 0 ? (
                    tickets.map((t: any) => {
                      const total = t.totalTicket ?? 0;
                      const booked = t.booked ?? 0;
                      const isSoldOut = booked >= total;
                      return (
                        <label
                          key={t.id}
                          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedTicket?.id === t.id ? "border-[#ddb7ff] bg-[#ddb7ff]/10" : "border-[#4d4354] opacity-80"} ${isSoldOut ? "pointer-events-none opacity-40 bg-black/20" : ""}`}
                          onClick={() => !isSoldOut && setSelectedTicket(t)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-[#eadef6]">
                              {t.name}
                            </span>
                            <span className="text-[#ddb7ff] font-black text-lg">
                              {t.price === 0
                                ? "Free"
                                : `Rp${t.price.toLocaleString("id-ID")}`}
                            </span>
                          </div>
                          <p className="text-xs text-[#cfc2d6] mb-3">
                            Sisa kuota: {total - booked} / {total} Tiket
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] tracking-widest uppercase ${!isSoldOut ? "bg-[#5de6ff]/20 text-[#5de6ff]" : "bg-[#ffb4ab]/20 text-[#ffb4ab]"}`}
                          >
                            {!isSoldOut ? "Available" : "Sold Out"}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="text-center p-4 border border-dashed border-[#4d4354] rounded-xl text-[#cfc2d6] text-sm">
                      No tickets available for this event.
                    </div>
                  )}
                </div>

                {selectedTicket && (
                  <div className="pt-4 border-t border-[#4d4354]/30 space-y-2">
                    <div className="flex justify-between text-sm text-[#cfc2d6]">
                      <span>1x Ticket ({selectedTicket.name})</span>
                      <span>
                        {ticketPrice === 0
                          ? "Rp0"
                          : `Rp${ticketPrice.toLocaleString("id-ID")}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-[#cfc2d6]">
                      <span>Service Fee (5%)</span>
                      <span>Rp{serviceFee.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-[#eadef6]">Total</span>
                      <span className="text-[#ddb7ff] text-2xl font-black">
                        Rp{totalPayment.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  disabled={
                    !selectedTicket ||
                    (selectedTicket &&
                      (selectedTicket.booked ?? 0) >=
                        (selectedTicket.totalTicket ?? 0))
                  }
                  className="w-full py-4 bg-[#ddb7ff] text-[#490080] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#f0dbff] transition-all active:scale-[0.98] shadow-lg shadow-[#ddb7ff]/20 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Buy Tickets Now
                </button>
              </div>
            </aside>

            {organizerData && (
              <section className="bg-[#2e2738] p-6 rounded-xl shadow-lg border border-[#4d4354]/30 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ddb7ff]/20 bg-[#171021] flex items-center justify-center">
                    <img
                      alt={organizerData.name}
                      className="w-full h-full object-cover"
                      src={
                        organizerData.profilePic ??
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#ddb7ff] uppercase font-bold tracking-wider">
                      Hosted By
                    </p>
                    <h4 className="font-bold text-[#eadef6] text-lg">
                      {organizerData.name}
                    </h4>
                    <p className="text-xs text-[#cfc2d6]">
                      {organizerData.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 py-2 bg-transparent border border-[#ddb7ff] text-[#ddb7ff] rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#ddb7ff]/10 transition-colors">
                    View Profile
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
