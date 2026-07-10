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
  ticketTypes: any[];
  vouchers: any[];
}

interface FormScheduleProps {
  formData: LocalEventFormState;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

export function ScheduleForm({
  formData,
  handleInputChange,
}: FormScheduleProps) {
  // Hitung tanggal hari ini
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Hitung tanggal 1 tahun dari sekarang sebagai batas maksimal start date
  const maxStartDate = new Date();
  maxStartDate.setFullYear(today.getFullYear() + 1);
  const maxStartDateStr = maxStartDate.toISOString().split("T")[0];

  // Hitung batas end date (90 hari dari startDate)
  const getEndDateLimit = () => {
    if (!formData.startDate) return maxStartDateStr;
    const start = new Date(formData.startDate);
    const endLimit = new Date(start);
    endLimit.setDate(start.getDate() + 90);
    return endLimit.toISOString().split("T")[0];
  };

  return (
    <section
      className="bg-[#231d2e] p-8 rounded-xl border border-[#4d4354]"
      id="schedule"
    >
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-[#ddb7ff]">
          calendar_month
        </span>
        <h2 className="text-xl font-bold">3. Schedule</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">
            Start Date
          </label>
          <input
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            min={minDate}
            max={maxStartDateStr}
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="date"
            required
          />{" "}
          <p className="text-[10px] text-[#8e8596] mt-1">
            Max 1 year from today
          </p>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">
            Start Time
          </label>
          <input
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            step="1800"
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="time"
            required
          />{" "}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">End Date</label>
          <input
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            min={formData.startDate || minDate}
            max={getEndDateLimit()}
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="date"
            required
          />
          <p className="text-[10px] text-[#8e8596] mt-1">
            Max 90 days from start date
          </p>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">End Time</label>
          <input
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            step="1800"
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="time"
            required
          />
        </div>
      </div>
    </section>
  );
}
