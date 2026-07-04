import { useParams } from "react-router-dom";
import { useEventDetail } from "../stores/useEventDetail";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  const { event, loading, selectedTicket, setSelectedTicket } =
    useEventDetail(eventId);

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

  const ticketPrice = selectedTicket ? selectedTicket.price : event.price;
  const serviceFee = event.isPaid ? 25000 : 0;
  const totalPayment = ticketPrice + serviceFee;

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen selection:bg-[#ddb7ff] selection:text-[#490080]">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-[#171021]/80 backdrop-blur-md border-b border-[#4d4354] shadow-lg">
        <nav className="max-w-[1280px] mx-auto h-16 px-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black text-[#ddb7ff] tracking-tight">
              EventSync
            </span>
            <div className="hidden md:flex gap-6 items-center">
              <a
                className="text-[#ddb7ff] border-b-2 border-[#ddb7ff] font-bold pb-1 text-sm"
                href="#"
              >
                Discover
              </a>
              <a
                className="text-[#cfc2d6] font-medium text-sm hover:text-[#ddb7ff] transition-colors"
                href="#"
              >
                Categories
              </a>
              <a
                className="text-[#cfc2d6] font-medium text-sm hover:text-[#ddb7ff] transition-colors"
                href="#"
              >
                My Tickets
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ddb7ff]/20">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkUI9NYy6MZE52GX_gzap7nvf8hU-b1h2uqRPWEkbcLx5DK8C0QCN2tOVlmRBOtMoFEbsCjsyCGop_bPjTxqSGBWPqoKJmCSxksjEuh0v4akk6AqkOmZgESq1pByAM_8L-niRh6rJZcho3Rn2Z3RX2g5kiI5w0zorgPbTOmsA0EDSeKEh6fW61Ji6ms2ZkF4VwUiuRahUD6GlbAP70EYiZTWBKPXdzwPYT4sdNfgy-NMeF8CjncLsY6aG3rpsyuW5aBOVOJtmv15E"
              />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-6">
              <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-[0px_8px_32px_rgba(0,0,0,0.4)] relative group">
                <img
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={
                    event.mediaUrl ||
                    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200"
                  }
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-4 py-1.5 bg-[#ddb7ff] text-[#490080] rounded-full font-bold text-xs uppercase tracking-wider">
                    {event.category}
                  </span>
                  {event.isTrending && (
                    <span className="px-4 py-1.5 bg-[#5de6ff] text-[#00363e] rounded-full font-bold text-xs uppercase tracking-wider">
                      TRENDING
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-[#eadef6] leading-tight">
                  {event.title}
                </h1>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#eadef6]">
                        {event.startDate}
                      </p>
                      <p className="text-xs text-[#cfc2d6]">
                        {event.startTime} - {event.endTime || "End"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      location_on
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#eadef6]">
                        {event.location}
                      </p>
                      <p className="text-xs text-[#cfc2d6]">
                        {event.city || "Local Venue"}
                      </p>
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
                        {event.ticketsLeft ?? event.capacity} Tickets left
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="bg-[#2e2738] p-8 rounded-xl shadow-lg space-y-6">
              <h2 className="text-2xl font-bold text-[#eadef6]">
                About the Event
              </h2>
              <div className="space-y-4 text-[#cfc2d6] leading-relaxed">
                <p>{event.description}</p>
                {event.perks && event.perks.length > 0 && (
                  <ul className="list-disc pl-5 space-y-2 text-[#cfc2d6]">
                    {event.perks.map((perk, index) => (
                      <li key={index}>{perk}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Venue & Accessibility Section */}
            <section className="bg-[#2e2738] p-8 rounded-xl shadow-lg space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#eadef6]">
                  Venue &amp; Accessibility
                </h2>
                <button className="text-[#5de6ff] font-bold text-sm hover:underline">
                  Get Directions
                </button>
              </div>
              <div className="w-full h-80 rounded-xl overflow-hidden border border-[#4d4354] relative">
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-70"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrQuf0pJ3-QzfB0phZtx_lyqZGBl2Ke_IgA-_wP-z2l4eWelwYzFXIPm4wFCkqrQxpnAGRog4TAG1r80ZnefD8AmZQcNf5Q3bDJ2bJaU_Chfz4RCTtCqTwZ4A2SztKmRQwus4HAjYEfruZDz_HuUCLwoEIMcbRpU6SgaipcIzK9YPKlsWmOCUM0PBjQ0Qp84Xp5vqfv6y31mndU2aX2FpA8kRp7_txLO19HKOa6wDFG613Kv2dt7i1XVoR7t2cS8mt_W2elp9ZoGY')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-[#171021]/40"></div>
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="bg-[#2e2738]/70 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white/10">
                    <span
                      className="material-symbols-outlined text-[#ddb7ff]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                    <span className="font-bold text-[#eadef6]">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-[#eadef6] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#5de6ff]">
                      accessible
                    </span>
                    Accessibility
                  </h3>
                  <p className="text-sm text-[#cfc2d6] leading-relaxed">
                    {event.accessibilityDesc ||
                      "Wheelchair accessible entrances and designated seating areas are available."}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-[#eadef6] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#5de6ff]">
                      local_parking
                    </span>
                    Parking
                  </h3>
                  <p className="text-sm text-[#cfc2d6] leading-relaxed">
                    {event.parkingDesc ||
                      "Secured parking available nearby. Valet service available for VIP guests."}
                  </p>
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
                  {event.tickets && event.tickets.length > 0 ? (
                    event.tickets.map((t) => (
                      <label
                        key={t.id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedTicket?.id === t.id
                            ? "border-[#ddb7ff] bg-[#ddb7ff]/10"
                            : "border-[#4d4354] opacity-60"
                        } ${!t.isAvailable ? "pointer-events-none opacity-40" : ""}`}
                        onClick={() => t.isAvailable && setSelectedTicket(t)}
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
                          {t.description}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] tracking-widest uppercase ${
                            t.isAvailable
                              ? "bg-[#5de6ff]/20 text-[#5de6ff]"
                              : "bg-[#ffb4ab]/20 text-[#ffb4ab]"
                          }`}
                        >
                          {t.isAvailable ? "Available" : "Sold Out"}
                        </span>
                      </label>
                    ))
                  ) : (
                    // Fallback
                    <label className="block p-4 border-2 border-[#ddb7ff] bg-[#ddb7ff]/10 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-[#eadef6]">
                          Standard Admission
                        </span>
                        <span className="text-[#ddb7ff] font-black text-lg">
                          {event.price === 0
                            ? "Free"
                            : `Rp${event.price.toLocaleString("id-ID")}`}
                        </span>
                      </div>
                      <p className="text-xs text-[#cfc2d6] mb-3">
                        General entry ticket pass.
                      </p>
                      <span className="px-2 py-0.5 bg-[#5de6ff]/20 text-[#5de6ff] rounded font-bold text-[10px] tracking-widest uppercase">
                        Available
                      </span>
                    </label>
                  )}
                </div>

                {/* Pricing Calculation */}
                <div className="pt-4 border-t border-[#4d4354]/30 space-y-2">
                  <div className="flex justify-between text-sm text-[#cfc2d6]">
                    <span>
                      1x Ticket ({selectedTicket?.name || "Standard"})
                    </span>
                    <span>
                      {ticketPrice === 0
                        ? "Rp0"
                        : `Rp${ticketPrice.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#cfc2d6]">
                    <span>Service Fee</span>
                    <span>Rp{serviceFee.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-[#eadef6]">Total</span>
                    <span className="text-[#ddb7ff] text-2xl font-black">
                      Rp{totalPayment.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#ddb7ff] text-[#490080] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#f0dbff] transition-all active:scale-[0.98] shadow-lg shadow-[#ddb7ff]/20">
                  Buy Tickets Now
                </button>
              </div>
            </aside>

            {/* Organizer Section */}
            {event.organizer && (
              <section className="bg-[#2e2738] p-6 rounded-xl shadow-lg border border-[#4d4354]/30 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ddb7ff]/20">
                    <img
                      alt={event.organizer.name}
                      className="w-full h-full object-cover"
                      src={event.organizer.logo}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#eadef6]">
                      {event.organizer.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[#ddb7ff] text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="text-sm font-bold text-[#eadef6]">
                        {event.organizer.rating}
                      </span>
                      <span className="text-xs text-[#cfc2d6]">
                        ({event.organizer.reviewsCount} Reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#cfc2d6] leading-relaxed">
                  {event.organizer.bio}
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-transparent border border-[#ddb7ff] text-[#ddb7ff] rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#ddb7ff]/10 transition-colors">
                    Follow
                  </button>
                  <button className="px-3 py-2 bg-[#231d2e] rounded-lg text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors border border-[#4d4354]/30">
                    <span className="material-symbols-outlined">mail</span>
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
