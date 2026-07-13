import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useEventDetail } from "../hooks/useEventDetail";
import { userAuth } from "../stores/useAuth";
import { useCheckoutStore } from "../stores/useCheckoutStore";
import {
  createTransaction,
  getTransactionsByEvent,
} from "../services/transaction.service";
import { getOrganizerProfile } from "../services/organizer.service";
import { toTitleCase } from "../utils/toTitleCase";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";
import { OrganizerSection } from "../components/EventDetail/OrganizerSection";
import { TicketSelection } from "../components/EventDetail/TicketSelection";
import type { Transaction } from "../types/type";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = userAuth();

  // State
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [moreEvents, setMoreEvents] = useState<any[]>([]);

  const { event, loading, selectedTicket, setSelectedTicket } = useEventDetail(
    id ?? "",
  );

  const isOwner = user && event && user.id === event.organizerId;

  // Fetch data
  useEffect(() => {
    if (user && id) {
      getTransactionsByEvent(Number(id))
        .then(setUserTransactions)
        .catch(console.error);
    }
  }, [user, id]);

  useEffect(() => {
    if (event?.organizerId) {
      getOrganizerProfile(event.organizerId.toString())
        .then((data: any) => setMoreEvents(data.organizedEvents || []))
        .catch(console.error);
    }
  }, [event?.organizerId]);

  useEffect(() => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherError(null);
  }, [selectedTicket]);

  const formatDate = (isoString: string) => {
    if (!isoString) return "Date not available";
    return new Date(isoString).toLocaleDateString("en-EN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Kalkulasi Harga
  const ticketPrice = selectedTicket ? selectedTicket.price : 0;
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const discountedPrice = Math.max(0, ticketPrice - discountAmount);
  const serviceFee = discountedPrice * 0.05;
  const totalPayment = discountedPrice + serviceFee;

  const handleApplyVoucher = () => {
    const foundVoucher = event?.vouchers?.find(
      (v: any) => v.code.toUpperCase() === voucherCode.trim().toUpperCase(),
    );
    if (!foundVoucher) return setVoucherError("Invalid voucher code.");
    if (new Date() > new Date(foundVoucher.endDate))
      return setVoucherError("Voucher expired.");
    setAppliedVoucher(foundVoucher);
    setVoucherError(null);
  };

  const handleBuyTicket = async () => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    if (!selectedTicket) return;
    try {
      setSubmitting(true);
      useCheckoutStore.getState().setCheckoutData(event, selectedTicket);
      const res = await createTransaction({
        eventId: Number(id),
        voucherId: appliedVoucher?.id,
        items: [{ ticketTypeId: selectedTicket.id, qty: 1 }],
      });
      if (res.success) {
        navigate(`/transactions/checkout/`);
      }
    } catch (e: any) {
      console.error("ID tidak ditemukan dalam respon API!");
      alert(e.response?.data?.message || "Failed to process transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#171021] flex items-center justify-center">
        Loading...
      </div>
    );
  if (!event)
    return <div className="text-white text-center pt-20">Event Not Found</div>;

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen pb-16 selection:bg-[#ddb7ff] selection:text-[#490080]">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <Breadcrumb
          items={[
            { label: "Events", path: "/events" },
            {
              label: event.category || "Other",
              path: `/events?category=${event.category}`,
            },
            { label: event.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-6">
              <div className="w-full h-[400px] rounded-xl overflow-hidden relative group shadow-lg">
                <img
                  src={event.bannerImage}
                  className="w-full h-full object-cover"
                  alt={event.name}
                />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black">
                  {event.name}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#cfc2d6]">
                        Date & Time
                      </p>
                      <p>{formatDate(event.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#231d2e] rounded-xl border border-[#4d4354]/50">
                    <span className="material-symbols-outlined text-[#ddb7ff]">
                      location_on
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#cfc2d6]">
                        Venue
                      </p>
                      <p>{event.location}</p>
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

          <div className="lg:col-span-4">
            <TicketSelection
              tickets={event.ticketTypes}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
              voucherCode={voucherCode}
              setVoucherCode={setVoucherCode}
              appliedVoucher={appliedVoucher}
              setAppliedVoucher={setAppliedVoucher}
              voucherError={voucherError}
              setVoucherError={setVoucherError}
              handleApplyVoucher={handleApplyVoucher}
              handleBuyTicket={handleBuyTicket}
              submitting={submitting}
              ticketPrice={ticketPrice}
              discountAmount={discountAmount}
              serviceFee={serviceFee}
              totalPayment={totalPayment}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
