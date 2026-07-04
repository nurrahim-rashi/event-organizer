import React from "react";
import type { EventFormState } from "../../types/type";

interface FormPricingAndPromotionsProps {
  formData: EventFormState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTogglePrice: (isPaid: boolean) => void;
}

export function FormPricingAndPromotions({
  formData,
  handleInputChange,
  handleTogglePrice,
}: FormPricingAndPromotionsProps) {
  const cleanPrice = formData.price.replace(/[^\d.]/g, "");
  const priceAmount = parseFloat(cleanPrice) || 0;
  const capacity = formData.capacity || 100;
  const totalRevenue = priceAmount * capacity;
  const serviceFee = totalRevenue * 0.05;
  const netEarnings = totalRevenue - serviceFee;

  const formatCurrency = (amount: number) => {
    return (
      "$" +
      amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
  };

  return (
    <>
      {/* Section 4: Ticketing & Pricing */}
      <section
        className="bg-[#231d2e] p-8 rounded-xl border border-[#4d4354]"
        id="pricing"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ddb7ff]">
              payments
            </span>
            <h2 className="text-xl font-bold">4. Ticketing &amp; Pricing</h2>
          </div>
          <div className="flex bg-[#2e2738] rounded-full p-1 border border-[#4d4354]">
            <button
              type="button"
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${!formData.isPaid ? "bg-[#231d2e] text-[#ddb7ff] shadow-sm" : "text-[#cfc2d6] hover:text-[#ddb7ff]"}`}
              onClick={() => handleTogglePrice(false)}
            >
              Free
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${formData.isPaid ? "bg-[#231d2e] text-[#ddb7ff] shadow-sm" : "text-[#cfc2d6] hover:text-[#ddb7ff]"}`}
              onClick={() => handleTogglePrice(true)}
            >
              Paid
            </button>
          </div>
        </div>

        {formData.isPaid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#cfc2d6] mb-2">
                  Ticket Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#cfc2d6] opacity-60">
                    $
                  </span>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-4 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] text-xl font-bold outline-none"
                    placeholder="100.00"
                    type="text"
                    required={formData.isPaid}
                  />
                </div>
              </div>
              <div className="bg-[#1f1929] p-4 rounded-lg border border-[#4d4354] flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#cfc2d6]">Service Fee (5%)</p>
                  <p className="font-bold text-[#ffb4ab]">
                    {formatCurrency(serviceFee)}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#988d9f] cursor-help">
                  help_outline
                </span>
              </div>
            </div>
            <div className="bg-[#b76dff] p-6 rounded-xl border-l-4 border-[#ddb7ff] text-[#400071]">
              <p className="text-xs uppercase tracking-widest font-bold mb-2">
                Estimated Net Earnings
              </p>
              <p className="text-4xl font-extrabold mb-2">
                {formatCurrency(netEarnings)}
              </p>
              <p className="text-xs opacity-80">
                Calculated based on full capacity ({capacity} sold out).
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#1f1929] p-6 rounded-xl border border-dashed border-[#4d4354] text-center">
            <p className="text-[#cfc2d6]">
              Free events will appear in the "Free Pass" category and have zero
              administration fees.
            </p>
          </div>
        )}
      </section>

      {/* Section 5: Vouchers & Promotion */}
      <section
        className="bg-[#231d2e] p-8 rounded-xl border border-[#4d4354]"
        id="promotions"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ddb7ff]">
              loyalty
            </span>
            <h2 className="text-xl font-bold">5. Vouchers &amp; Promotion</h2>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-[#ddb7ff] font-bold hover:underline transition-all"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add Promo Code
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#4d4354] rounded-xl opacity-60">
            <span className="material-symbols-outlined text-5xl mb-3">
              confirmation_number
            </span>
            <p className="font-medium">No active vouchers yet.</p>
            <p className="text-sm">
              Add promo codes to increase sales conversions.
            </p>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[#4d4354] bg-[#2e2738] shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-[#b76dff] flex items-center justify-center text-[#400071]">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <div className="flex-1">
              <p className="font-bold">Boost Event Visibility</p>
              <p className="text-sm text-[#cfc2d6]">
                Feature your event on the homepage for 3 days.
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-[#ddb7ff] text-[#ddb7ff] font-bold text-sm hover:bg-[#ddb7ff] hover:text-[#490080] transition-all"
            >
              Enable Boost
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
