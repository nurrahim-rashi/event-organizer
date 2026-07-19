import { useEffect, useState } from "react";

interface OrderSummaryProps {
  transaction: any | null;
  onProceedToPayment: () => void;
  onCancelTransaction: () => void;
  ticket?: any;
  onApplyVoucher?: (code: string) => void;
}

export default function OrderSummary({
  transaction,
  onProceedToPayment,
  onCancelTransaction,
}: OrderSummaryProps) {
  const items = transaction?.items || [];
  const [timeLeft, setTimeLeft] = useState("00m 00s");

  // Logika kalkulasi disamakan dengan TicketSelection
  const subtotal = items.reduce(
    (acc: number, item: any) => acc + item.price * item.qty,
    0,
  );
  const serviceFeePercent = 0.05;
  const serviceFee = subtotal * serviceFeePercent;

  // Jika ada voucher di transaksi, kurangi. Jika tidak, gunakan subtotal
  const discount = transaction?.voucherDiscount || 0;
  const total = subtotal - discount + serviceFee;

  useEffect(() => {
    if (!transaction?.expiredAt) return;

    const expiryDate = new Date(transaction.expiredAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = expiryDate - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(
          h > 0
            ? `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`
            : `${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`,
        );
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [transaction?.expiredAt]);

  return (
    <section className="bg-[rgba(35,29,46,0.6)] backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-6 w-full max-w-sm">
      {/* Timer Hanya Muncul Jika Ada Transaksi */}
      {transaction && (
        <div className="flex justify-between items-center bg-[#171021] px-4 py-3 rounded-xl border border-red-500/30">
          <span className="text-xs text-[#cfc2d6]">
            This transaction will expire in:
          </span>
          <span className="text-red-400 font-bold">{timeLeft}</span>
        </div>
      )}

      {/* Ticket Info */}
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-[#eadef6]">
            <span>
              {item.ticketType.name} x {item.qty}
            </span>
            <span>Rp{(item.price * item.qty).toLocaleString("id-ID")}</span>
          </div>
        ))}
      </div>

      <div className="text-sm border-t border-[#4d4354]/30 pt-4 space-y-2">
        {transaction?.voucherDiscount > 0 && (
          <div className="flex justify-between text-green-400 font-medium">
            <span>Discount</span>
            <span>
              -Rp{transaction.voucherDiscount.toLocaleString("id-ID")}
            </span>
          </div>
        )}
        <div className="flex justify-between text-[#cfc2d6]">
          <span>Service Fee (5%)</span>
          <span>Rp{serviceFee.toLocaleString("id-ID")}</span>
        </div>{" "}
        <div className="grid text-[#cfc2d6] border-t border-[#4d4354]/30 pt-4">
          <span className="font-bold">TOTAL PRICE</span>
          <span className="text-2xl font-black text-[#ddb7ff] mt-2">
            Rp{total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onProceedToPayment}
          disabled={timeLeft === "Expired"}
          className="w-full py-4 bg-[#ddb7ff] text-[#490080] font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
        >
          {transaction ? "Upload Payment Proof" : "Proceed to Checkout"}
        </button>

        {transaction && (
          <button
            type="button"
            onClick={onCancelTransaction}
            className="w-full py-2 text-red-400 text-sm hover:underline"
          >
            Cancel Transaction
          </button>
        )}
      </div>
    </section>
  );
}
