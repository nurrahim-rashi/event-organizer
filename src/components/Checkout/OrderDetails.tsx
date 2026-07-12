import { useState, useEffect } from "react";

interface OrderSummaryProps {
  ticket: { name: string; price: number };
  transaction: { expiredAt: string | Date };
  onProceedToPayment: () => void;
}

export default function OrderSummary({
  ticket,
  transaction,
  onProceedToPayment,
}: OrderSummaryProps) {
  const [qty, setQty] = useState(1);
  const [timeLeft, setTimeLeft] = useState("00m 00s");

  const subtotal = ticket ? ticket.price * qty : 0;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  useEffect(() => {
    if (!transaction?.expiredAt) return;
    const expiryDate = new Date(transaction.expiredAt).getTime();
    const timer = setInterval(() => {
      const diff = expiryDate - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m}m ${s.toString().padStart(2, "0")}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [transaction?.expiredAt]);

  if (!ticket) return null;

  return (
    <section className="bg-[rgba(35,29,46,0.6)] backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-6 w-full max-w-sm">
      <div className="flex justify-between items-center bg-[#171021] px-4 py-3 rounded-xl border border-[#4d4354]/30">
        <span className="text-[#5de6ff] font-bold">{timeLeft}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[#eadef6] font-medium">{ticket.name}</span>
        <div className="flex items-center gap-3 border border-[#4d4354] rounded-lg p-1">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-2 text-[#ddb7ff]"
          >
            -
          </button>
          <span className="text-[#eadef6] w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="px-2 text-[#ddb7ff]"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-sm space-y-2 border-t border-[#4d4354]/30 pt-4">
        <div className="flex justify-between text-[#cfc2d6]">
          <span>Subtotal</span>
          <span>Rp{subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-[#cfc2d6]">
          <span>Service Fee (5%)</span>
          <span>Rp{serviceFee.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="bg-[#171021] p-4 rounded-xl border border-[#ddb7ff]/20">
        <div className="text-2xl font-black text-[#ddb7ff]">
          Rp{total.toLocaleString("id-ID")}
        </div>
      </div>

      <button
        onClick={onProceedToPayment}
        disabled={timeLeft === "Expired"}
        className="w-full py-4 bg-[#ddb7ff] text-[#490080] font-bold rounded-xl disabled:opacity-50"
      >
        Proceed to Payment
      </button>
    </section>
  );
}
