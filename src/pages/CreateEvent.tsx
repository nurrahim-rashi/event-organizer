import React, { useState } from "react";
import { useNavigate } from "react-router";
import { createEvent } from "../services/event.service";
import type { EventFormState } from "../types/type";

import { FormSidebar } from "../components/CreateEvent/FormSidebar";
import { FormBasicAndMedia } from "../components/CreateEvent/FormBasicDetails";
import { FormSchedule } from "../components/CreateEvent/FormSchedule";
import { FormPricingAndPromotions } from "../components/CreateEvent/FormPricing";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<string>("basic-details");

  const [formData, setFormData] = useState<EventFormState>({
    name: "",
    category: "",
    location: "",
    description: "",
    bannerImage: null,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    ticketTypes: [{ name: "Regular", price: 0, totalTicket: 100 }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const scrollToSection = (id: string) => {
    setActiveStep(id);
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      setError("Please select an event category.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`,
      ).toISOString();
      const endDateTime = new Date(
        `${formData.endDate}T${formData.endTime}`,
      ).toISOString();

      const payload = {
        name: formData.name,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        bannerImage: formData.bannerImage ? "URL_CONVERTED_OR_UPLOADED" : "",
        startDate: startDateTime,
        endDate: endDateTime,
        organizerId: 1,
        ticketTypes: formData.ticketTypes,
      };

      const res = await createEvent(payload);
      if (res) {
        alert("🎉 Event successfully published!");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to create event",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-12 px-6 max-w-[1280px] mx-auto min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-10"
      >
        <FormSidebar
          activeStep={activeStep}
          loading={loading}
          error={error}
          scrollToSection={scrollToSection}
        />

        <div className="flex-1 space-y-12">
          <FormBasicAndMedia
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
          />

          <FormSchedule
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <FormPricingAndPromotions
            formData={formData}
            setFormData={setFormData}
          />

          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-xl border border-[#4d4354] font-bold text-[#cfc2d6] hover:bg-[#2e2738] transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#ddb7ff] text-[#490080] border border-[#4d4354] font-bold hover:bg-[#c296f0] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
