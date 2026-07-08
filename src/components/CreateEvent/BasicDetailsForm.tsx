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

interface FormBasicAndMediaProps {
  formData: LocalEventFormState;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<LocalEventFormState>>;
}

export function BasicDetailsForm({
  formData,
  handleInputChange,
  setFormData,
}: FormBasicAndMediaProps) {
  return (
    <>
      <section
        className="bg-[#231d2e] p-8 rounded-xl border border-[#4d4354]"
        id="basic-details"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-[#ddb7ff]">info</span>
          <h2 className="text-xl font-bold">1. Basic Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm text-[#cfc2d6] mb-2">
              Event Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none"
              placeholder="e.g., Jakarta Music Festival 2026"
              type="text"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-[#cfc2d6] mb-2">
              Event Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none"
              required
            >
              <option value="">Select Category</option>
              <option value="MUSIC">Music</option>
              <option value="SPORTS">Sports</option>
              <option value="BUSINESS">Business</option>
              <option value="EDUCATION">Education</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="FOOD">Food</option>
              <option value="ART">Art</option>
              <option value="HEALTH">Health</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-[#cfc2d6] mb-2">
              Location / Venue
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#cfc2d6]">
                location_on
              </span>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none"
                placeholder="Building name or full address"
                type="text"
                required
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-[#cfc2d6] mb-2">
              Event Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-[#4d4354] bg-[#2e2738] text-[#eadef6] focus:border-[#ddb7ff] focus:ring-[4px] focus:ring-[#ddb7ff]/10 outline-none resize-none"
              placeholder="Tell your audience more about the event..."
              rows={5}
              required
            ></textarea>
          </div>
        </div>
      </section>

      {/* Section 2: Event Media */}
      <section
        className="bg-[#231d2e] p-8 rounded-xl border border-[#4d4354]"
        id="media"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-[#ddb7ff]">
            image
          </span>
          <h2 className="text-xl font-bold">2. Event Media</h2>
        </div>
        <label className="w-full h-64 border-2 border-dashed border-[#4d4354] rounded-xl flex flex-col items-center justify-center bg-[#1f1929] group hover:border-[#ddb7ff] transition-colors cursor-pointer relative overflow-hidden">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                bannerImage: e.target.files?.[0] || null,
              }))
            }
          />
          <div className="text-center z-10 px-4">
            <span className="material-symbols-outlined text-4xl text-[#cfc2d6] group-hover:text-[#ddb7ff] mb-2">
              cloud_upload
            </span>
            <p className="text-[#cfc2d6]">
              {formData.bannerImage &&
              typeof formData.bannerImage !== "string" ? (
                <span className="text-[#5de6ff] font-bold">
                  {(formData.bannerImage as File).name}
                </span>
              ) : (
                <>
                  Drag and drop file here or{" "}
                  <span className="text-[#ddb7ff] font-bold">Choose Image</span>
                </>
              )}
            </p>
            <p className="text-xs text-[#988d9f] mt-1">
              Recommended ratio 16:9 (Min. 1280x720px)
            </p>
          </div>
        </label>
      </section>
    </>
  );
}
