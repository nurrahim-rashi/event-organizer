import React, { useState } from "react";

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
  ticketTypes: any[];
  vouchers: any[];
}

interface PromotionFormProps {
  formData: LocalEventFormState;
  setFormData: React.Dispatch<React.SetStateAction<LocalEventFormState>>;
}

export function PromotionForm({ formData, setFormData }: PromotionFormProps) {
  const [localVoucher, setLocalVoucher] = useState({
    code: "",
    discount: "",
    quota: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVoucher({ ...localVoucher, [e.target.name]: e.target.value });
  };

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isVoucherInvalid) {
      setError("Please fill in all required voucher fields correctly.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      vouchers: [...prev.vouchers, { ...localVoucher }],
    }));

    setSuccess("Voucher added to this event successfully!");
    setLocalVoucher({
      code: "",
      discount: "",
      quota: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
  };

  // Logika Validasi Input Voucher
  const isVoucherInvalid =
    !localVoucher.code.trim() ||
    !localVoucher.discount ||
    Number(localVoucher.discount) <= 0 ||
    !localVoucher.quota ||
    Number(localVoucher.quota) <= 0 ||
    !localVoucher.startDate ||
    !localVoucher.startTime ||
    !localVoucher.endDate ||
    !localVoucher.endTime;

  return (
    <div className="bg-[#231d2e] p-8 rounded-xl border border-[#4d4354]">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-[#ddb7ff]">
          card_membership
        </span>
        <div>
          <h2 className="text-xl font-bold text-[#eadef6]">
            5. Vouchers &amp; Promotion
          </h2>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-sm text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-sm text-green-400 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Voucher Code */}
        <div>
          <label className="block text-xs text-[#cfc2d6] mb-1">
            Voucher Code
          </label>
          <input
            type="text"
            name="code"
            placeholder="e.g., EARLYBIRD50, SUMMERMUSIC"
            value={localVoucher.code}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none uppercase font-semibold placeholder-gray-600"
          />
        </div>

        {/* Discount & Quota */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#cfc2d6] mb-1">
              Discount Amount (IDR)
            </label>
            <input
              type="number"
              name="discount"
              placeholder="50000"
              min="1"
              value={localVoucher.discount}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none font-bold placeholder-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-[#cfc2d6] mb-1">
              Total Quota
            </label>
            <input
              type="number"
              name="quota"
              placeholder="100"
              min="1"
              value={localVoucher.quota}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none placeholder-gray-600"
            />
          </div>
        </div>

        {/* Start & End Dates */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-[#cfc2d6] mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={localVoucher.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#cfc2d6] mb-1">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={localVoucher.startTime}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#cfc2d6] mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={localVoucher.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#cfc2d6] mb-1">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={localVoucher.endTime}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isVoucherInvalid}
            onClick={handleAddVoucher}
            className="w-full bg-gradient-to-r from-[#ddb7ff] to-[#bd7aff] text-[#400071] font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-[#ddb7ff]/5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Add Promotion Voucher
          </button>
        </div>

        {formData.vouchers?.length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-[#1f1929] border border-[#4d4354]">
            <p className="text-xs font-bold text-[#ddb7ff] mb-2">
              Staged Vouchers ({formData.vouchers.length}):
            </p>
            <ul className="space-y-1 text-xs">
              {formData.vouchers.map((v: any, idx: number) => (
                <li key={idx} className="text-[#cfc2d6] list-disc list-inside">
                  Code:{" "}
                  <span className="text-[#eadef6] font-mono font-bold">
                    {v.code.toUpperCase()}
                  </span>{" "}
                  | Disc: IDR {Number(v.discount).toLocaleString("id-ID")} |
                  Quota: {v.quota}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
