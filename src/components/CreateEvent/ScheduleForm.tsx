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
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">
            Start Date
          </label>
          <input
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="date"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">
            Start Time
          </label>
          <input
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="time"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">End Date</label>
          <input
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="date"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-[#cfc2d6] mb-2">End Time</label>
          <input
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] outline-none"
            type="time"
            required
          />
        </div>
      </div>
    </section>
  );
}
