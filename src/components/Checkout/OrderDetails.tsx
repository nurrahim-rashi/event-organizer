import React, { useState } from "react";

export default function OrderSummary() {
  const [submitting, setSubmitting] = useState(false);

  const handleProceed = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  return (
    <div className="lg:col-span-5 sticky top-28">
      <div className="bg-[rgba(35,29,46,0.6)] backdrop-blur-[12px] border border-white/10 rounded-xl p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ddb7ff] rounded-full blur-[80px] opacity-20"></div>
        <h3 className="text-xl font-bold text-[#eadef6]">Order Summary</h3>

        <div className="flex flex-col gap-4 border-b border-[#4d4354] pb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#cfc2d6]">Subtotal</span>
            <span className="text-[#eadef6]">$149.00</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#cfc2d6]">Fees & Taxes</span>
            <span className="text-[#eadef6]">$17.50</span>
          </div>
          <div className="flex justify-between items-center text-[#ddb7ff] text-sm font-medium">
            <span>Discounts</span>
            <span>-$0.00</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#eadef6]">Total</span>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-[#ddb7ff]">
              $166.50
            </span>
            <span className="text-xs text-[#cfc2d6]">USD</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleProceed}
            className="w-full py-4 bg-[#ddb7ff] text-[#490080] font-bold text-lg rounded-lg hover:shadow-[0_0_20px_rgba(183,109,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">
                  sync
                </span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Proceed to Payment</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-[#cfc2d6] px-4">
            By proceeding, you agree to MomentumEvents' Terms of Service and
            Privacy Policy.
          </p>
        </div>

        <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="material-symbols-outlined text-3xl">
            credit_card
          </span>
          <span className="material-symbols-outlined text-3xl">
            account_balance_wallet
          </span>
          <span className="material-symbols-outlined text-3xl">
            contactless
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 p-4 rounded-xl border border-[#4d4354] bg-[#110b1b]">
        <div className="w-10 h-10 rounded-full bg-[#00cbe6]/20 flex items-center justify-center text-[#00cbe6]">
          <span className="material-symbols-outlined">support_agent</span>
        </div>
        <div>
          <h4 className="font-semibold text-[#eadef6] text-sm">Need help?</h4>
          <p className="text-xs text-[#cfc2d6]">
            Our concierge is available 24/7
          </p>
        </div>
      </div>
    </div>
  );
}
