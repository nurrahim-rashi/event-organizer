import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useEventDetail } from "../hooks/useEventDetail";
import { userAuth } from "../stores/useAuth";
import {
  createTransaction,
  getTransactionsByEvent,
} from "../services/transaction.service";
import type { Transaction } from "../types/type";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";
import { OrganizerSection } from "../components/EventDetail/OrganizerSection";
import { getOrganizerProfile } from "../services/organizer.service";

function EventDetailSkeleton() {
  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen animate-pulse">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto space-y-6">
        <div className="h-4 bg-[#2e2738] rounded w-1/3 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-6">
              <div className="w-full h-[400px] bg-[#231d2e] rounded-xl" />
              <div className="space-y-4">
                <div className="h-10 bg-[#231d2e] rounded w-3/4 md:w-1/2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-20 bg-[#231d2e] rounded-xl" />
                  <div className="h-20 bg-[#231d2e] rounded-xl" />
                  <div className="h-20 bg-[#231d2e] rounded-xl" />
                </div>
              </div>
            </div>
            <div className="bg-[#2e2738]/50 p-8 rounded-xl space-y-4">
              <div className="h-6 bg-[#32293d] rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-[#32293d] rounded w-full" />
                <div className="h-4 bg-[#32293d] rounded w-11/12" />
                <div className="h-4 bg-[#32293d] rounded w-4/5" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#2e2738]/50 p-6 rounded-xl flex items-center gap-4">
              <div className="w-14 h-14 bg-[#32293d] rounded-full shrink-0" />
              <div className="flex-grow space-y-2">
                <div className="h-3 bg-[#32293d] rounded w-1/4" />
                <div className="h-5 bg-[#32293d] rounded w-2/3" />
                <div className="h-3 bg-[#32293d] rounded w-1/2" />
              </div>
            </div>
            <div className="bg-[#231d2e]/50 rounded-xl overflow-hidden border border-white/5">
              <div className="p-6 bg-[#32293d] h-20" />
              <div className="p-6 space-y-4">
                <div className="h-24 bg-[#32293d]/50 rounded-xl" />
                <div className="h-24 bg-[#32293d]/50 rounded-xl" />
                <div className="h-12 bg-[#32293d] rounded-xl mt-6" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = userAuth();

  // Hooks dipindahkan ke atas semua
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [moreEvents, setMoreEvents] = useState<any[]>([]);

  const { event, loading, selectedTicket, setSelectedTicket } = useEventDetail(
    id ?? "",
  );

  const isOwner = user && event && user.id === event.organizerId;

  // Efek-efek
  useEffect(() => {
    if (user && id) {
      getTransactionsByEvent(Number(id))
        .then((data) => setUserTransactions(data))
        .catch((err) => console.error("Error fetching transactions:", err));
    }
  }, [user, id]);

  useEffect(() => {
    if (!loading) {
      setIsInitialMount(false);
    }
  }, [loading]);

  useEffect(() => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherError(null);
  }, [selectedTicket]);

  useEffect(() => {
    if (event?.organizerId) {
      getOrganizerProfile(event.organizerId.toString())
        .then((data: any) => {
          setMoreEvents(data.organizedEvents || []);
        })
        .catch((err) => console.error("Gagal ambil event organizer:", err));
    }
  }, [event?.organizerId]);

  // Logika Render
  if (loading || isInitialMount) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#171021]">
        <Navbar />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center text-[#eadef6]">
          <div className="text-center">
            <p className="text-xl font-bold mb-2">Event Not Found</p>
            <a href="/" className="text-[#5de6ff] underline text-sm">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tickets = event.ticketTypes ?? [];
  const ticketPrice = selectedTicket ? selectedTicket.price : 0;
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const discountedTicketPrice = Math.max(0, ticketPrice - discountAmount);
  const serviceFee =
    discountedTicketPrice > 0 ? discountedTicketPrice * 0.05 : 0;
  const totalPayment = discountedTicketPrice + serviceFee;

  const handleApplyVoucher = () => {
    setVoucherError(null);
    if (!voucherCode.trim()) return;

    const codeUpper = voucherCode.trim().toUpperCase();
    const foundVoucher = event.vouchers?.find(
      (v: any) => v.code.toUpperCase() === codeUpper,
    );

    if (!foundVoucher) {
      setVoucherError("Invalid voucher code for this event.");
      setAppliedVoucher(null);
      return;
    }

    const now = new Date();
    const start = new Date(foundVoucher.startDate);
    const end = new Date(foundVoucher.endDate);

    if (now < start) {
      setVoucherError("This voucher promotion has not started yet.");
      setAppliedVoucher(null);
      return;
    }

    if (now > end) {
      setVoucherError("This promotional voucher has already expired.");
      setAppliedVoucher(null);
      return;
    }

    if (foundVoucher.quota <= 0) {
      setVoucherError("Voucher quota has been completely used up.");
      setAppliedVoucher(null);
      return;
    }

    setAppliedVoucher(foundVoucher);
  };

  const handleBuyTicket = async () => {
    if (!user) {
      alert("Please login first to buy tickets!");
      navigate("/login");
      return;
    }
    if (!selectedTicket) return;

    try {
      setSubmitting(true);
      const payload = {
        eventId: Number(id),
        voucherId: appliedVoucher ? appliedVoucher.id : undefined,
        items: [{ ticketTypeId: selectedTicket.id, qty: 1 }],
      };

      const res = await createTransaction(payload);
      if (res.success) {
        alert("Transaction created successfully!");
        navigate(`/dashboard/transactions/${res.data.id}`);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(
        error.response?.data?.message || "Failed to process ticket purchase.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = [
    { label: "Events", path: "/events" },
    {
      label: event.category || "Other",
      path: `/events?category=${event.category}`,
    },
    { label: event.name },
  ];

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen selection:bg-[#ddb7ff] selection:text-[#490080]">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-6">
              <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-[0px_8px_32px_rgba(0,0,0,0.4)] relative group">
                <img
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={
                    event.bannerImage ||
                    "https://images.unsplash.com/photo-1501281667745-f7f57925c3b4?q=80&w=1200"
                  }
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-4 py-1.5 bg-[#ddb7ff] text-[#490080] rounded-full font-bold text-xs uppercase tracking-wider">
                    {event.category || "OTHER"}
                  </span>
                </div>
              </div>

              {user && userTransactions.length > 0 && (
                <div className="p-4 bg-[#2e2738] border-l-4 border-[#5de6ff] rounded-r-xl">
                  <h4 className="font-bold text-sm text-[#5de6ff] mb-1">
                    Your Transaction Status for this Event:
                  </h4>
                  <div className="space-y-1">
                    {userTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="text-xs flex justify-between items-center bg-[#171021]/50 p-2 rounded"
                      >
                        <span>
                          Inv #{tx.id} (
                          {tx.items?.[0]?.ticketType?.name || "Ticket"})
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-black uppercase text-[10px] ${tx.status === "PAID" || tx.status === "DONE" ? "bg-green-500/20 text-green-400" : tx.status === "WAITING_PAYMENT" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {tx.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl md:text-5xl font-black text-[#eadef6] leading-tight">
                    {event.name}
                  </h1>{" "}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-xs text-[#cfc2d6] uppercase tracking-wider font-bold">
                        Date &amp; Time
                      </p>
                      <p className="text-md text-[#eadef6] mt-0.5">
                        {formatDate(event.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      location_on
                    </span>
                    <div>
                      <p className="text-xs text-[#cfc2d6] uppercase tracking-wider font-bold">
                        Venue
                      </p>
                      <p className="text-md text-[#eadef6] mt-0.5">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-[#2e2738] p-8 rounded-xl shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#eadef6]">
                  About the Event
                </h2>{" "}
                {isOwner && (
                  <button
                    onClick={() => navigate(`/events/${event.id}/edit`)}
                    type="button"
                    className="grid items-center gap-2 text-sm bg-[#ddb7ff] text-[#490080] px-4 py-2 rounded-xl font-bold border border-[#ddb7ff]/20 hover:bg-[#ddb7ff]/20 hover:bg-[#f0dbff] transition-all rounded-lg font-bold text-sm"
                  >
                    Edit Event
                  </button>
                )}
              </div>
              <div className="space-y-4 text-[#cfc2d6] leading-relaxed">
                <p>{event.description || "No description provided."}</p>
              </div>
            </section>
            <OrganizerSection
              event={event}
              toTitleCase={toTitleCase}
              isOwner={!!isOwner}
              moreEvents={moreEvents}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <aside className="sticky top-24 bg-[#231d2e] rounded-xl shadow-lg border border-[#4d4354]/30 overflow-hidden">
              <div className="p-6 bg-[#b76dff] text-[#400071]">
                <h3 className="text-xl font-bold">Choose your experience</h3>
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
                            Remaining tickets: {total - booked} / {total}{" "}
                            tickets
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
                      No tickets available.
                    </div>
                  )}
                </div>

                {selectedTicket && ticketPrice > 0 && (
                  <div className="pt-4 border-t border-[#4d4354]/30 space-y-2">
                    <label className="block text-xs font-bold text-[#cfc2d6] uppercase tracking-wider">
                      Event Voucher Promotion
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Promo Code"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        disabled={!!appliedVoucher}
                        className="flex-1 bg-[#171021] border border-[#4d4354] text-[#eadef6] rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:border-[#ddb7ff] disabled:opacity-50"
                      />
                      {appliedVoucher ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedVoucher(null);
                            setVoucherCode("");
                          }}
                          className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold uppercase transition-all"
                        >
                          Clear
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyVoucher}
                          className="px-4 py-2 bg-[#32293d] border border-[#4d4354] text-[#ddb7ff] rounded-lg text-xs font-bold uppercase hover:bg-[#3d334e] transition-all"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {voucherError && (
                      <p className="text-xs text-red-400 font-medium">
                        {voucherError}
                      </p>
                    )}
                    {appliedVoucher && (
                      <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        Code {appliedVoucher.code} applied! (Rp
                        {appliedVoucher.discount.toLocaleString("id-ID")} off)
                      </p>
                    )}
                  </div>
                )}

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
                    {appliedVoucher && (
                      <div className="flex justify-between text-sm text-green-400 font-medium">
                        <span>Promo Code ({appliedVoucher.code})</span>
                        <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
                      </div>
                    )}
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
                  onClick={handleBuyTicket}
                  disabled={
                    submitting || tickets.length === 0 || !selectedTicket
                  }
                  className="w-full py-4 bg-[#ddb7ff] text-[#490080] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#f0dbff] transition-all active:scale-[0.98] shadow-lg shadow-[#ddb7ff]/20 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {submitting ? "Processing..." : "Buy Tickets Now"}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
