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
  setAppliedCoupon,
  usePoints,
  setUsePoints,
  handleApplyVoucher,
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
    const afterDiscounts = Math.max(0, subtotal - vDiscount - cDiscount);
    const finalPoints = Math.min(usePoints || 0, afterDiscounts);
    const total = Math.max(0, afterDiscounts - finalPoints);

    return { subtotal, vDiscount, cDiscount, finalPoints, total };
  };

  const { subtotal, vDiscount, cDiscount, finalPoints, total } =
    calculateTotals();

  const handleUpdateCart = (ticket: any, delta: number) => {
    setCart((prev) => {
      const newQty = Math.max(0, Math.min(3, (prev[ticket.id] || 0) + delta));
      if (newQty === 0) {
        const newState = { ...prev };
        delete newState[ticket.id];
        return newState;
      }
      return { ...prev, [ticket.id]: newQty };
    });
  };

  const handleCheckout = async () => {
    if (!isCheckoutMode) return setIsCheckoutMode(true);
    setIsProcessing(true);
    try {
      const payload = {
        eventId: tickets[0]?.eventId,
        items: Object.entries(cart).map(([id, qty]) => ({
          ticketTypeId: Number(id),
          qty,
        })),
        voucherId: appliedVoucher?.id,
        couponId: appliedCoupon?.id,
        usePoints: finalPoints > 0 ? finalPoints : undefined,
      };
      await transactionApi.create(payload);
      toast.success("Checkout success");
      navigate(`/transactions/checkout`);
    } catch (e) {
      toast.error("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <aside className="sticky top-24 bg-[#231d2e] rounded-xl p-6 border border-[#4d4354]/30">
      <h3 className="text-xl font-bold mb-4">
        {isCheckoutMode ? "Your Cart" : "Choose Tickets"}
      </h3>
      {tickets.map((t: any) => (
        <div
          key={t.id}
          className="p-3 border border-[#4d4354] rounded-lg mb-2 flex justify-between items-center"
        >
          <span>{t.name}</span>
          {!isCheckoutMode ? (
            <button
              onClick={() => handleUpdateCart(t, 1)}
              className="bg-[#ddb7ff] text-[#400071] px-3 py-1 rounded"
            >
              Add
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => handleUpdateCart(t, -1)}>-</button>
              <span>{cart[t.id] || 0}</span>
              <button onClick={() => handleUpdateCart(t, 1)}>+</button>
            </div>
          )}
        </div>
      ))}

      {isCheckoutMode && (
        <div className="mt-6 space-y-4 border-t border-[#4d4354] pt-4">
          {/* Voucher */}
          <div className="flex gap-2">
            <input
              className="bg-[#171021] border border-[#4d4354] p-2 flex-1 rounded"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="VOUCHER"
            />
            <button
              onClick={handleApplyVoucher}
              className="bg-[#32293d] p-2 rounded"
            >
              Apply
            </button>
          </div>

          {/* Coupons */}
          {coupons?.map((c: any) => (
            <div
              key={c.id}
              className="flex justify-between items-center bg-[#171021] p-3 rounded"
            >
              <span>Rp{c.discount.toLocaleString()}</span>
              {appliedCoupon?.id === c.id ? (
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">
                  Applied
                </span>
              ) : (
                <button
                  onClick={() => setAppliedCoupon(c)}
                  className="bg-[#ddb7ff] text-[#400071] px-2 py-1 rounded text-xs"
                >
                  Apply
                </button>
              )}
            </div>
          ))}

          {/* Points Slider */}
          {user?.points > 0 && (
            <div>
              <div className="flex justify-between text-xs">
                <span>Use Points (Bal: {user.points})</span>
                <span>Rp{finalPoints.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.min(user.points, subtotal - vDiscount - cDiscount)}
                value={usePoints}
                onChange={(e) => setUsePoints(Number(e.target.value))}
                className="w-full accent-[#ddb7ff]"
              />
            </div>
          )}

          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Total</span>
            <span className="text-[#ddb7ff]">Rp{total.toLocaleString()}</span>
          </div>
        </div>
      )}
      <button
        onClick={handleCheckout}
        className="w-full mt-6 py-3 bg-[#ddb7ff] text-[#490080] rounded-xl font-bold"
      >
        {isProcessing ? "Processing..." : "Checkout"}
      </button>
    </aside>
  );
};
