import { useState } from "react";
import { transactionApi } from "../../services/transaction.service";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export const TicketSelection = ({
  tickets,
  user,
  coupons,
  voucherCode,
  setVoucherCode,
  appliedVoucher,
  appliedCoupon,
  usePoints,
  setAppliedCoupon,
  setUsePoints,
  handleApplyVoucher,
  submitting,
}: any) => {
  const navigate = useNavigate();
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});

  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotals = () => {
    let subtotal = 0;
    Object.keys(cart).forEach((id) => {
      const ticket = tickets.find((t: any) => t.id === Number(id));
      if (ticket) subtotal += ticket.price * cart[Number(id)];
    });

    const vDiscount = appliedVoucher ? appliedVoucher.discount : 0;
    const cDiscount = appliedCoupon ? appliedCoupon.discount : 0;

    // Hitung total sisa setelah voucher dan coupon
    const afterDiscounts = Math.max(0, subtotal - vDiscount - cDiscount);

    // Poin tidak boleh melebihi sisa pembayaran setelah diskon
    const finalPoints = Math.min(usePoints || 0, afterDiscounts);
    const total = Math.max(0, afterDiscounts - finalPoints);

    return { subtotal, vDiscount, cDiscount, finalPoints, total };
  };

  const { subtotal, vDiscount, cDiscount, finalPoints, total } =
    calculateTotals();

  const handleUpdateCart = (ticket: any, delta: number) => {
    setCart((prev) => {
      const currentQty = prev[ticket.id] || 0;
      const newQty = Math.max(0, Math.min(3, currentQty + delta));
      if (newQty === 0) {
        const newState = { ...prev };
        delete newState[ticket.id];
        return newState;
      }
      return { ...prev, [ticket.id]: newQty };
    });
  };

  const handleCheckout = async (e?: React.MouseEvent) => {
    // 1. Mencegah event bubbling jika dipanggil dari form
    e?.preventDefault();

    // 2. Mencegah klik ganda
    if (isProcessing || submitting) return;

    if (!isCheckoutMode) {
      setIsCheckoutMode(true);
      return;
    }

    // 3. Set loading status
    setIsProcessing(true);

    try {
      const items = Object.entries(cart).map(([ticketId, qty]) => ({
        ticketTypeId: Number(ticketId),
        qty: Number(qty),
      }));

      if (items.length === 0) {
        toast.error("Choose at least one ticket");
        setIsProcessing(false);
        return;
      }

      const payload = {
        eventId: tickets[0]?.eventId,
        items,
        voucherId: appliedVoucher?.id,
        couponId: appliedCoupon?.id,
        usePoints: finalPoints > 0 ? finalPoints : undefined,
      };

      // Melakukan API Call
      const response = await transactionApi.create(payload);

      const transactionId =
        response.data?.data?.id ?? response.data?.data ?? response.data?.id;

      if (!transactionId || isNaN(Number(transactionId))) {
        throw new Error("Invalid transaction ID received from server!");
      }

      toast.success("Checkout success");
      setCart({});
      navigate(`/transactions/checkout`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response?.data
          : null) ||
        "Failed to do checkout, please try again.";

      console.error("Checkout Error:", error);
      toast.error(errorMessage);
    } finally {
      // 4. Reset loading status di akhir
      setIsProcessing(false);
      setIsCheckoutMode(false);
    }
  };

  return (
    <aside className="sticky top-24 bg-[#231d2e] rounded-xl shadow-lg border border-[#4d4354]/30 overflow-hidden">
      <div className="p-6 bg-[#b76dff] text-[#400071]">
        <h3 className="text-xl font-bold">
          {isCheckoutMode ? "Your Cart" : "Choose your experience"}
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Ticket List */}
        <div className="space-y-4">
          {tickets.map((t: any) => {
            const remaining = (t.totalTicket ?? 0) - (t.booked ?? 0);
            const isSoldOut = remaining <= 0;
            const qtyInCart = cart[t.id] || 0;
            return (
              <div
                key={t.id}
                className={`block p-4 border-2 rounded-xl ${isSoldOut ? "opacity-40 border-[#4d4354]" : "border-[#4d4354]"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#eadef6]">{t.name}</span>
                  <span className="text-[#ddb7ff] font-black text-lg">
                    Rp{t.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-[#cfc2d6]">
                    Remaining: {remaining}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${!isSoldOut ? "bg-[#5de6ff]/20 text-[#5de6ff]" : "bg-[#ffb4ab]/20 text-[#ffb4ab]"}`}
                  >
                    {isSoldOut ? "Sold Out" : "Available"}
                  </span>
                </div>
                {!isCheckoutMode ? (
                  <button
                    onClick={() => handleUpdateCart(t, 1)}
                    disabled={isSoldOut}
                    className="mt-4 w-full py-2 bg-[#ddb7ff] text-[#400071] font-bold text-xs rounded-lg uppercase"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="mt-4 flex items-center justify-center gap-4 bg-[#171021] p-2 rounded-lg">
                    <button
                      onClick={() => handleUpdateCart(t, -1)}
                      className="text-[#ddb7ff] font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="text-white font-bold">{qtyInCart}</span>
                    <button
                      onClick={() => handleUpdateCart(t, 1)}
                      className="text-[#ddb7ff] font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isCheckoutMode && (
          <div className="pt-4 border-t border-[#4d4354]/30 space-y-6">
            {/* Voucher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#cfc2d6] uppercase">
                Event Voucher
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-[#171021] border border-[#4d4354] rounded-lg px-3 py-2 text-sm uppercase"
                  placeholder="PROMO CODE"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button
                  onClick={handleApplyVoucher}
                  className="px-4 py-2 bg-[#32293d] text-[#ddb7ff] rounded-lg text-xs font-bold uppercase"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Coupons */}
            {coupons?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#cfc2d6] uppercase">
                  Use Coupon
                </label>
                {coupons.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center bg-[#171021] p-3 rounded-lg border border-[#4d4354]"
                  >
                    <span className="text-sm text-[#eadef6]">
                      Rp{c.discount.toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setAppliedCoupon(appliedCoupon?.id === c.id ? null : c)
                      }
                      className={`text-xs px-2 py-1 rounded font-bold ${appliedCoupon?.id === c.id ? "bg-red-500/20 text-red-400" : "bg-[#ddb7ff] text-[#400071]"}`}
                    >
                      {appliedCoupon?.id === c.id ? "Cancel" : "Use"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Points Slider */}
            {user?.points > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#cfc2d6]">
                  <span>Use Points (Bal: {user.points.toLocaleString()})</span>
                  <span>Rp{finalPoints.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(
                    user.points,
                    Math.max(0, subtotal - vDiscount - cDiscount),
                  )}
                  value={usePoints}
                  onChange={(e) => setUsePoints(Number(e.target.value))}
                  className="w-full accent-[#ddb7ff]"
                />
              </div>
            )}

            {/* Breakdown */}
            <div className="space-y-2 border-t border-[#4d4354] pt-4">
              {Object.entries(cart).map(([id, qty]) => {
                const ticket = tickets.find((t: any) => t.id === Number(id));
                return ticket ? (
                  <div
                    key={id}
                    className="flex justify-between text-sm text-[#cfc2d6]"
                  >
                    <span>
                      {ticket.name} x {qty}
                    </span>
                    <span>Rp{(ticket.price * qty).toLocaleString()}</span>
                  </div>
                ) : null;
              })}
              {vDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Voucher</span>
                  <span>-Rp{vDiscount.toLocaleString()}</span>
                </div>
              )}
              {cDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Coupon</span>
                  <span>-Rp{cDiscount.toLocaleString()}</span>
                </div>
              )}
              {finalPoints > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Points</span>
                  <span>-Rp{finalPoints.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-[#ddb7ff]">
                  Rp{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleCheckout}
          disabled={
            submitting ||
            isProcessing ||
            (isCheckoutMode && Object.keys(cart).length === 0)
          }
          className="w-full py-4 bg-[#ddb7ff] text-[#490080] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#f0dbff] transition-all disabled:opacity-40"
        >
          {isProcessing
            ? "Processing..."
            : isCheckoutMode
              ? "Checkout Tickets"
              : "Buy Tickets Now"}
        </button>
      </div>
    </aside>
  );
};
