import { useState } from "react";

export const TicketSelection = ({
  tickets,
  voucherCode,
  setVoucherCode,
  appliedVoucher,
  setAppliedVoucher,
  voucherError,
  handleApplyVoucher,
  submitting,
  serviceFeePercent = 0.05,
}: any) => {
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});

  const calculateTotals = () => {
    let subtotal = 0;
    Object.keys(cart).forEach((id) => {
      const ticket = tickets.find((t: any) => t.id === Number(id));
      if (ticket) subtotal += ticket.price * cart[Number(id)];
    });
    const discount = appliedVoucher ? appliedVoucher.discount : 0;
    const serviceFee = subtotal * serviceFeePercent;
    const total = subtotal - discount + serviceFee;
    return { subtotal, discount, serviceFee, total };
  };

  const { subtotal, discount, serviceFee, total } = calculateTotals();

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

  const handleCheckout = () => {
    if (!isCheckoutMode) {
      setIsCheckoutMode(true);
    } else {
      // Arahkan ke halaman checkout
      window.location.href = "/transactions/checkout";
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
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map((t: any) => {
              const remaining = (t.totalTicket ?? 0) - (t.booked ?? 0);
              // Logika status: sold out = 0, unavailable = (misal logicmu < 0 atau khusus), available = sisa
              const isSoldOut = remaining <= 0;
              const isUnavailable = false;

              const qtyInCart = cart[t.id] || 0;

              return (
                <div
                  key={t.id}
                  className={`block p-4 border-2 rounded-xl transition-all ${isSoldOut ? "pointer-events-none opacity-40 bg-black/20 border-[#4d4354]" : "border-[#4d4354]"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#eadef6]">{t.name}</span>
                    <span className="text-[#ddb7ff] font-black text-lg">
                      {t.price === 0
                        ? "Free"
                        : `Rp${t.price.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#cfc2d6] mb-3">
                    Remaining: {remaining} tickets
                  </p>

                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] tracking-widest uppercase ${!isSoldOut ? "bg-[#5de6ff]/20 text-[#5de6ff]" : "bg-[#ffb4ab]/20 text-[#ffb4ab]"}`}
                  >
                    {isSoldOut
                      ? "Sold Out"
                      : isUnavailable
                        ? "Unavailable"
                        : "Available"}
                  </span>

                  {!isCheckoutMode ? (
                    <button
                      onClick={() => handleUpdateCart(t, 1)}
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
            })
          ) : (
            <div className="text-center p-4 border border-dashed border-[#4d4354] rounded-xl text-[#cfc2d6] text-sm">
              No tickets available.
            </div>
          )}
        </div>

        {/* Section Voucher & Price muncul jika sudah checkout mode */}
        {isCheckoutMode && (
          <>
            <div className="pt-4 border-t border-[#4d4354]/30 space-y-2">
              <label className="block text-xs font-bold text-[#cfc2d6] uppercase tracking-wider">
                Event Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  disabled={!!appliedVoucher}
                  className="flex-1 bg-[#171021] border border-[#4d4354] rounded-lg px-3 py-2 text-sm uppercase"
                />
                <button
                  type="button"
                  onClick={
                    appliedVoucher
                      ? () => {
                          setAppliedVoucher(null);
                          setVoucherCode("");
                        }
                      : handleApplyVoucher
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${appliedVoucher ? "bg-red-500/20 text-red-400" : "bg-[#32293d] text-[#ddb7ff]"}`}
                >
                  {appliedVoucher ? "Clear" : "Apply"}
                </button>
              </div>
              {voucherError && (
                <p className="text-xs text-red-400 font-medium">
                  {voucherError}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#4d4354]/30 space-y-2">
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
                    <span>
                      Rp{(ticket.price * qty).toLocaleString("id-ID")}
                    </span>
                  </div>
                ) : null;
              })}
              {appliedVoucher && (
                <div className="flex justify-between text-sm text-green-400 font-medium">
                  <span>Promo ({appliedVoucher.code})</span>
                  <span>-Rp{discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-[#cfc2d6]">
                <span>Service Fee (5%)</span>
                <span>Rp{serviceFee.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-[#eadef6]">Total</span>
                <span className="text-[#ddb7ff] text-2xl font-black">
                  Rp{total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleCheckout}
          disabled={
            submitting || (isCheckoutMode && Object.keys(cart).length === 0)
          }
          className="w-full py-4 bg-[#ddb7ff] text-[#490080] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#f0dbff] transition-all disabled:opacity-40"
        >
          {submitting
            ? "Processing..."
            : isCheckoutMode
              ? "Checkout Tickets"
              : "Buy Tickets Now"}
        </button>
      </div>
    </aside>
  );
};
