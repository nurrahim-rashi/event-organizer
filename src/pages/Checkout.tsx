import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/General/Navbar";
import EventDetails from "../components/Checkout/EventDetails";
import OrderSummary from "../components/Checkout/OrderDetails";
import CancelTransactionModal from "../components/Checkout/CancelTransactionModal";
import PaymentProofModal from "../components/Checkout/PaymentProofModal";
import { useCheckoutStore } from "../stores/useCheckoutStore";
import { createTransaction } from "../services/transaction.service";
import { transactionApi } from "../services/transaction.service";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    selectedEvent,
    cartItems,
    appliedVoucher,
    appliedCoupon,
    usePoints,
    _hasHydrated,
  } = useCheckoutStore();
  const [transaction, setTransaction] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const items = transaction?.items || [];
  const isInitialized = useRef(false);

  const subtotal = items.reduce(
    (acc: number, item: any) => acc + item.price * item.qty,
    0,
  );
  const serviceFee = subtotal * 0.05;
  const totalFinal =
    subtotal + serviceFee - (transaction?.voucherDiscount || 0);

  useEffect(() => {
    if (!_hasHydrated || isInitialized.current) return;

    const init = async () => {
      isInitialized.current = true; // Set flag langsung agar tidak terpanggil 2x
      try {
        const res = await transactionApi.getActive();

        if (res.data.data) {
          setTransaction(res.data.data);
        } else if (selectedEvent && cartItems.length > 0) {
          const payload = {
            eventId: selectedEvent.id,
            items: cartItems.map((item) => ({
              ticketTypeId: item.ticket.id,
              qty: item.qty,
            })),
            voucherId: appliedVoucher?.id || undefined,
            couponId: appliedCoupon?.id || undefined,
            usePoints: Number(usePoints) || 0,
          };
          const created = await createTransaction(payload);
          setTransaction(created.data || created);
        } else {
          navigate("/");
        }
      } catch (e) {
        console.error(e);
        navigate("/");
      }
    };

    init();
  }, [
    _hasHydrated,
    navigate,
    selectedEvent,
    cartItems,
    appliedVoucher,
    appliedCoupon,
    usePoints,
  ]);

  const handleConfirmCancel = async () => {
    if (!transaction?.id) return;
    try {
      toast.success("Transaction is cancelled successfully!");
      await transactionApi.cancel(transaction.id);
      useCheckoutStore.getState().clearCheckoutData();
      setIsCancelModalOpen(false);
      navigate("/events");
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel transaction. Please try again.");
    }
  };

  const handleSubmitPayment = async (file: File) => {
    const formData = new FormData();
    formData.append("paymentProof", file);
    try {
      await axiosInstance.patch(
        `/transactions/${transaction.id}/upload`,
        formData,
        { headers: {} },
      );

      toast.success("Payment proof successfully submitted!");
      setIsPaymentModalOpen(false);
      navigate("/transactions");
    } catch (error: any) {
      console.error("Gagal upload:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to upload payment proof.",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#171021] mt-12 text-[#eadef6]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 flex flex-col gap-10">
            <header>
              <div
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#ddb7ff] mb-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Return
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#eadef6] tracking-tight">
                Complete Your Order
              </h1>
            </header>
            <EventDetails event={transaction?.event} />
          </div>
          <aside className="lg:col-span-5 sticky top-24">
            <OrderSummary
              transaction={transaction}
              onProceedToPayment={() => setIsPaymentModalOpen(true)}
              onCancelTransaction={() => setIsCancelModalOpen(true)}
            />
          </aside>
        </div>
      </main>
      {isPaymentModalOpen && (
        <PaymentProofModal
          totalPrice={totalFinal}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handleSubmitPayment}
        />
      )}

      {/* Tambahkan bagian ini */}
      {isCancelModalOpen && (
        <CancelTransactionModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
