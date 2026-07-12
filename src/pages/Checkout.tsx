import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/General/Navbar";
import EventDetails from "../components/Checkout/EventDetails";
import OrderSummary from "../components/Checkout/OrderDetails";
import PaymentProofModal from "../components/Checkout/PaymentProofModal";
import { useCheckoutStore } from "../stores/useCheckoutStore";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { selectedEvent, selectedTicket, transaction } = useCheckoutStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedEvent || !selectedTicket) {
      navigate("/");
    }
  }, [selectedEvent, selectedTicket, navigate]);

  if (!selectedEvent) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#171021] mt-12 text-[#eadef6] font-['Hanken_Grotesk',sans-serif]">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 flex flex-col gap-10">
            <header>
              <div
                className="flex items-center gap-2 text-[#ddb7ff] mb-2 cursor-pointer hover:opacity-80"
                onClick={() => navigate(-1)}
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Return to Event
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#eadef6] tracking-tight">
                Complete Your Order
              </h1>
            </header>
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
          totalPrice={selectedTicket.price * 1.05}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(file, bank) => {
            console.log("Uploading...", file, bank);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
