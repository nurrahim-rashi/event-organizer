import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/General/Navbar";
import EventDetails from "../components/Checkout/EventDetails";
import OrderSummary from "../components/Checkout/OrderDetails";
import PaymentProofModal from "../components/Checkout/PaymentProofModal";
import { useCheckoutStore } from "../stores/useCheckoutStore";
import { createTransaction } from "../services/transaction.service";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { selectedEvent, selectedTicket } = useCheckoutStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // 1. Validasi awal
    if (!selectedEvent || !selectedTicket) {
      navigate("/");
      return;
    }

    // 2. Auto-create transaksi saat halaman di-load
    const initTransaction = async () => {
      try {
        const res = await createTransaction({
          eventId: selectedEvent.id,
          voucherId: appliedVoucher?.id,
          items: [{ ticketTypeId: selectedTicket.id, qty: 1 }],
          usePoints: false,
        });
        // Data transaksi masuk, timer di OrderSummary otomatis jalan karena props transaction terisi
        setTransaction(res.data || res);
      } catch (e) {
        alert("Failed to create transaction. Redirecting...");
        navigate("/");
      }
    };

    initTransaction();
  }, [selectedEvent, selectedTicket, appliedVoucher, navigate]);

  if (!selectedEvent) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#171021] mt-12 text-[#eadef6]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <EventDetails event={selectedEvent} />
          </div>
          <aside className="lg:col-span-5 sticky top-24">
            <OrderSummary
              ticket={selectedTicket}
              transaction={transaction}
              onProceedToPayment={() => setIsModalOpen(true)}
            />
          </aside>
        </div>
      </main>

      {isModalOpen && (
        <PaymentProofModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={(file, bank) => console.log("Upload...", file, bank)}
        />
      )}
    </div>
  );
}
