import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/General/Navbar";
import EventDetails from "../components/Checkout/EventDetails";
import OrderSummary from "../components/Checkout/OrderDetails";
import PaymentProofModal from "../components/Checkout/PaymentProofModal";
import { useCheckoutStore } from "../stores/useCheckoutStore";
import { createTransaction } from "../services/transaction.service";
import { transactionApi } from "../services/transaction.service";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { selectedEvent, cartItems, _hasHydrated } = useCheckoutStore();
  const [transaction, setTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);

  const fetchActiveTransaction = async () => {
    try {
      const res = await transactionApi.getActive();
      setTransaction(res.data.data);
    } catch (e) {
      console.error("Gagal mengambil transaksi aktif", e);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!selectedEvent || cartItems.length === 0) {
      navigate("/");
      return;
    }

    const initTransaction = async () => {
      try {
        const res = await createTransaction({
          eventId: selectedEvent.id,
          items: cartItems.map((item) => ({
            ticketTypeId: item.ticket.id,
            qty: item.qty,
          })),
        });
        setTransaction(res.data || res);
      } catch (e: any) {
        if (e.response?.status === 400) {
          fetchActiveTransaction();
        } else {
          console.error(e);
          alert("Failed to create transaction.");
          navigate("/");
        }
      }
    };

    if (!transaction) initTransaction();
  }, [_hasHydrated, selectedEvent, cartItems, navigate]);

  const handleCancel = async () => {
    if (!transaction) return;
    await transactionApi.cancel(transaction.id);
    useCheckoutStore.getState().clearCheckoutData();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#171021] mt-12 text-[#eadef6]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 flex flex-col gap-10">
            <header>
              <div
                onClick={() => navigate(-1)} // Navigasi mundur ke halaman sebelumnya
                className="flex items-center gap-2 text-[#ddb7ff] mb-2 cursor-pointer"
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
              transaction={transaction}
              onProceedToPayment={() => setIsModalOpen(true)}
              onCancelTransaction={handleCancel}
            />{" "}
          </aside>
        </div>
      </main>

      {isModalOpen && (
        <PaymentProofModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={(file: File, bank: string) =>
            console.log("Upload...", file, bank)
          }
        />
      )}
    </div>
  );
}
