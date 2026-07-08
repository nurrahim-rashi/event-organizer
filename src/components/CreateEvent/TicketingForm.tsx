import React from "react";

interface LocalEventFormState {
  name: string;
  category: any;
  location: string;
  description: string;
  bannerImage: File | null | string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  ticketTypes: {
    name: string;
    price: number;
    totalTicket: number;
  }[];
  vouchers: any[];
}

interface TicketingFormProps {
  formData: LocalEventFormState;
  setFormData: React.Dispatch<React.SetStateAction<LocalEventFormState>>;
}

export function TicketingForm({ formData, setFormData }: TicketingFormProps) {
  const handleTicketChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updatedTickets = [...prev.ticketTypes];
      updatedTickets[index] = {
        ...updatedTickets[index],
        [field]: value,
      };
      return { ...prev, ticketTypes: updatedTickets };
    });
  };

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        { name: "GOLD", price: 0, totalTicket: 0 },
      ],
    }));
  };

  const removeTicketType = (index: number) => {
    if (formData.ticketTypes.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  const totalCapacity = formData.ticketTypes.reduce(
    (acc, t) => acc + (t.totalTicket || 0),
    0,
  );
  const totalRevenue = formData.ticketTypes.reduce(
    (acc, t) => acc + (t.price || 0) * (t.totalTicket || 0),
    0,
  );
  const serviceFee = totalRevenue * 0.05;
  const netEarnings = totalRevenue - serviceFee;

  const formatCurrency = (amount: number) => {
    return "Rp " + amount.toLocaleString("id-ID");
  };

  return (
    <>
      <section
        className="bg-[#231d2e] p-8 rounded-xl border border-[#4d4354]"
        id="pricing"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ddb7ff]">
              confirmation_number
            </span>
            <h2 className="text-xl font-bold text-[#eadef6]">
              4. Ticket Tiers &amp; Pricing
            </h2>
          </div>
          <button
            type="button"
            onClick={addTicketType}
            className="flex items-center gap-2 text-sm bg-[#ddb7ff]/10 text-[#ddb7ff] px-4 py-2 rounded-xl font-bold border border-[#ddb7ff]/20 hover:bg-[#ddb7ff]/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span> Add
            Ticket Tier
          </button>
        </div>

        <div className="space-y-6 mb-8">
          {formData.ticketTypes.map((ticket, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-[#4d4354] bg-[#2e2738]/50 relative grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-xs text-[#cfc2d6] mb-1">
                  Ticket Tier Class (Enum)
                </label>
                <select
                  value={ticket.name}
                  onChange={(e) =>
                    handleTicketChange(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 text-sm outline-none font-bold"
                  required
                >
                  <option value="GOLD">GOLD</option>
                  <option value="SILVER">SILVER</option>
                  <option value="BRONZE">BRONZE</option>
                  <option value="EARLY_BIRD">EARLY BIRD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#cfc2d6] mb-1">
                  Total Quantity / Quota
                </label>
                <input
                  type="number"
                  placeholder="e.g., 100"
                  min="1"
                  value={ticket.totalTicket || ""}
                  onChange={(e) =>
                    handleTicketChange(
                      index,
                      "totalTicket",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 text-sm outline-none"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-xs text-[#cfc2d6] mb-1">
                  Price (IDR){" "}
                  <span className="text-gray-400">(0 for Free)</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="e.g., 150000"
                    min="0"
                    value={ticket.price || ""}
                    onChange={(e) =>
                      handleTicketChange(
                        index,
                        "price",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 text-sm font-bold outline-none"
                    required
                  />
                  {formData.ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalRevenue > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-4 border-t border-[#4d4354]/40">
            <div className="space-y-4">
              <div className="bg-[#1f1929] p-4 rounded-lg border border-[#4d4354] flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#cfc2d6]">Service Fee (5%)</p>
                  <p className="font-bold text-[#ffb4ab]">
                    {formatCurrency(serviceFee)}
                  </p>
                </div>
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
                Calculated based on full capacity ({totalCapacity} total tickets
                sold out).
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#1f1929] p-6 rounded-xl border border-dashed border-[#4d4354] text-center">
            <p className="text-[#cfc2d6]">
              All created ticket classes are free. Free events will have zero
              platform administration fees.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
