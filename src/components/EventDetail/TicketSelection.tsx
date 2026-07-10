export const TicketSelection = ({
  tickets,
  selectedTicket,
  setSelectedTicket,
  voucherCode,
  setVoucherCode,
  appliedVoucher,
  setAppliedVoucher,
  voucherError,
  setVoucherError,
  handleApplyVoucher,
  handleBuyTicket,
  submitting,
  ticketPrice,
  discountAmount,
  serviceFee,
  totalPayment,
}: any) => {
  return (
    <aside className="sticky top-24 bg-[#231d2e] rounded-xl shadow-lg border border-[#4d4354]/30 overflow-hidden">
      <div className="p-6 bg-[#b76dff] text-[#400071]">
        <h3 className="text-xl font-bold">Choose your experience</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map((t: any) => {
              const isSoldOut = (t.booked ?? 0) >= (t.totalTicket ?? 0);
              return (
                <label
                  key={t.id}
                  className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedTicket?.id === t.id ? "border-[#ddb7ff] bg-[#ddb7ff]/10" : "border-[#4d4354] opacity-80"} ${isSoldOut ? "pointer-events-none opacity-40 bg-black/20" : ""}`}
                  onClick={() => !isSoldOut && setSelectedTicket(t)}
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
                    Remaining: {t.totalTicket - t.booked} tickets
                  </p>
                  {/* Tambahan baris status agar sama persis dengan yang kamu minta */}
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] tracking-widest uppercase ${!isSoldOut ? "bg-[#5de6ff]/20 text-[#5de6ff]" : "bg-[#ffb4ab]/20 text-[#ffb4ab]"}`}
                  >
                    {!isSoldOut ? "Available" : "Sold Out"}
                  </span>
                </label>
              );
            })
          ) : (
            <div className="text-center p-4 border border-dashed border-[#4d4354] rounded-xl text-[#cfc2d6] text-sm">
              No tickets available.
            </div>
          )}
        </div>

        {selectedTicket && ticketPrice > 0 && (
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
              <p className="text-xs text-red-400 font-medium">{voucherError}</p>
            )}
          </div>
        )}

        {selectedTicket && (
          <div className="pt-4 border-t border-[#4d4354]/30 space-y-2">
            <div className="flex justify-between text-sm text-[#cfc2d6]">
              <span>Ticket ({selectedTicket.name})</span>
              <span>Rp{ticketPrice.toLocaleString("id-ID")}</span>
            </div>
            {appliedVoucher && (
              <div className="flex justify-between text-sm text-green-400 font-medium">
                <span>Promo ({appliedVoucher.code})</span>
                <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#cfc2d6]">
              <span>Service Fee (5%)</span>
              <span>Rp{serviceFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-[#eadef6]">Total</span>
              <span className="text-[#ddb7ff] text-2xl font-black">
                Rp{totalPayment.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleBuyTicket}
          disabled={submitting || tickets.length === 0 || !selectedTicket}
          className="w-full py-4 bg-[#ddb7ff] text-[#490080] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#f0dbff] transition-all disabled:opacity-40"
        >
          {submitting ? "Processing..." : "Buy Tickets Now"}
        </button>
      </div>
    </aside>
  );
};
