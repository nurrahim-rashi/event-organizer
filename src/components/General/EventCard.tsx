import { useState } from "react";
import { Link } from "react-router";
import { getEventDateParts, formatPrice } from "../../utils/format";
import { ReviewModal } from "../OrganizerProfile/ReviewModal";

export const EventCard = ({
  event,
  userTransactions,
}: {
  event: any;
  userTransactions?: any[];
}) => {
  const { day, month } = getEventDateParts(event.startDate);
  const tickets = event.ticketTypes || event.ticket_types || [];
  const priceDisplay = formatPrice(tickets);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // LOGIKA: Menghitung total sisa kursi
  const totalRemaining = tickets.reduce((acc: number, t: any) => {
    const booked = t.booked ?? 0;
    const total = t.totalTicket ?? 0;
    return acc + (total - booked);
  }, 0);

  const isSoldOut = totalRemaining <= 0;

  // LOGIKA: Cek apakah event sudah lewat dan user punya transaksi yang sukses
  const isPastEvent = new Date(event.endDate) < new Date();
  const completedTransaction = userTransactions?.find(
    (t) => t.eventId === event.id && t.status === "DONE" && !t.review,
  );

  const handleCardClick = (e: React.MouseEvent) => {
    if (isPastEvent && completedTransaction) {
      e.preventDefault();
      setIsReviewOpen(true);
    }
  };

  return (
    <>
      <Link
        to={`/events/${event.id}`}
        onClick={handleCardClick}
        className="group bg-[#231d2e] rounded-xl overflow-hidden border border-[#4d4354]/30 hover:border-[#ddb7ff]/50 transition-all block"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.bannerImage}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 px-3 py-1 bg-[#231d2e]/90 backdrop-blur rounded-lg flex flex-col items-center border border-[#4d4354]/20">
            <span className="text-base font-bold text-[#ddb7ff]">{day}</span>
            <span className="text-[10px] uppercase font-bold text-[#cfc2d6]">
              {month}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase backdrop-blur-md border ${
                isSoldOut
                  ? "bg-red-500/20 border-red-500/30 text-red-400"
                  : "bg-[#ddb7ff]/20 border-[#ddb7ff]/30 text-[#ddb7ff]"
              }`}
            >
              {isSoldOut ? "Sold Out" : `${totalRemaining} seats left`}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-[#eadef6] mb-1 truncate">
            {event.name}
          </h3>
          <p className="text-xs text-[#988d9f] mb-4">{event.location}</p>

          <div className="pt-4 border-t border-[#4d4354]/20">
            <p className="text-[10px] text-[#cfc2d6] uppercase tracking-widest">
              Starts From
            </p>
            <p
              className={`text-lg font-semibold ${priceDisplay === "Free" ? "text-[#5de6ff]" : "text-[#ddb7ff]"}`}
            >
              {priceDisplay}
            </p>
          </div>
        </div>
      </Link>

      {/* Modal hanya muncul jika kondisi terpenuhi */}
      {completedTransaction && (
        <ReviewModal
          transactionId={completedTransaction.id}
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </>
  );
};
