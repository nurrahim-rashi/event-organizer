import { useState, useEffect } from "react";

interface OrderSummaryProps {
  ticket: { id: number; name: string; price: number };
  transaction: any | null; // Data transaksi dari backend
  onProceedToPayment: () => void;
  onCancelTransaction: () => void; // Tambahkan fungsi cancel
  onApplyVoucher: (code: string) => void;
}

export default function OrderSummary({
  ticket,
  transaction,
  onProceedToPayment,
  onCancelTransaction,
  onApplyVoucher,
}: OrderSummaryProps) {
  const [qty, setQty] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");
  const [timeLeft, setTimeLeft] = useState("00m 00s");

  const subtotal = ticket ? ticket.price * qty : 0;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  useEffect(() => {
    if (!transaction?.expiredAt) {
      setTimeLeft("00m 00s");
      return;
    }

    const expiryDate = new Date(transaction.expiredAt).getTime();
    const timer = setInterval(() => {
      const diff = expiryDate - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
      } else {
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`,
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [transaction?.expiredAt]);

  return (
    <section className="bg-[rgba(35,29,46,0.6)] backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-6 w-full max-w-sm">
      {/* Timer Hanya Muncul Jika Ada Transaksi */}
      {transaction && (
        <div className="flex justify-between items-center bg-[#171021] px-4 py-3 rounded-xl border border-red-500/30">
          <span className="text-xs text-[#cfc2d6]">Expires in:</span>
          <span className="text-red-400 font-bold">{timeLeft}</span>
        </div>
      )}

      {/* Ticket Qty - Disable Jika Sudah Ada Transaksi */}
      <div className="flex justify-between items-center">
        <span className="text-[#eadef6] font-medium">{ticket.name}</span>
        <div className="flex items-center gap-3 border border-[#4d4354] rounded-lg p-1">
          <button
            disabled={!!transaction}
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-2 text-[#ddb7ff]"
          >
            -
          </button>
          <span className="text-[#eadef6] w-6 text-center">{qty}</span>
          <button
            disabled={!!transaction}
            onClick={() => setQty(qty + 1)}
            className="px-2 text-[#ddb7ff]"
          >
            +
          </button>
        </div>
      </div>

      {/* Input Voucher - Hidden/Disabled jika sudah transaksi */}
      {!transaction && (
        <div className="flex gap-2">
          <input
            className="flex-1 bg-[#171021] border border-[#4d4354] rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Voucher Code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <button
            onClick={() => onApplyVoucher(voucherCode)}
            className="text-xs bg-[#4d4354] px-3 rounded-lg text-white"
          >
            Apply
          </button>
        </div>
      )}

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

      {/* Tombol Aksi */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onProceedToPayment}
          disabled={timeLeft === "Expired"}
          className="w-full py-4 bg-[#ddb7ff] text-[#490080] font-bold rounded-xl hover:opacity-90 transition-all"
        >
          {!transaction ? "Proceed to Checkout" : "Upload Payment Proof"}
        </button>

        {transaction && (
          <button
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
