import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import { createEvent } from "../services/event.service";
import type { EventFormState } from "../types/type";

import { FormSidebar } from "../components/CreateEvent/FormSidebar";
import { FormBasicAndMedia } from "../components/CreateEvent/FormBasicDetails";
import { FormSchedule } from "../components/CreateEvent/FormSchedule";
import { FormPricingAndPromotions } from "../components/CreateEvent/FormPricing";

export function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<string>("basic-details");

  const [formData, setFormData] = useState<EventFormState>({
    name: "",
    category: "",
    capacity: 0,
    location: "",
    description: "",
    bannerImage: null,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isPaid: false,
    price: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleTogglePrice = (isPaid: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPaid,
      price: isPaid ? prev.price : "",
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
    setLoading(true);
    setError(null);

    try {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`,
      ).toISOString();
      const endDateTime = new Date(
        `${formData.endDate}T${formData.endTime}`,
      ).toISOString();
      const cleanPrice = formData.price.replace(/[^\d.]/g, "");

      const payload = {
        name: formData.name,
        category: formData.category,
        capacity: formData.capacity,
        location: formData.location,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        price: formData.isPaid ? parseFloat(cleanPrice) || 0 : 0,
        organizerId: 1,
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
    <div className="bg-[#171021] min-h-screen text-[#eadef6] font-['Hanken_Grotesk'] selection:bg-[#ddb7ff] selection:text-[#490080]">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#231d2e] border-b border-[#4d4354]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-extrabold text-[#ddb7ff]">
            EventSync
          </span>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-[1280px] mx-auto min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-10"
        >
          {/* 1. Sidebar Stepper */}
          <FormSidebar
            activeStep={activeStep}
            loading={loading}
            error={error}
            scrollToSection={scrollToSection}
          />

          {/* Form Content */}
          <div className="flex-1 space-y-12">
            {/* 2. Basic Details & Media */}
            <FormBasicAndMedia
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />

            {/* 3. Schedule */}
            <FormSchedule
              formData={formData}
              handleInputChange={handleInputChange}
            />

            {/* 4. Pricing & Promotions */}
            <FormPricingAndPromotions
              formData={formData}
              handleInputChange={handleInputChange}
              handleTogglePrice={handleTogglePrice}
            />

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <button
                type="button"
                className="px-8 py-3 rounded-xl border border-[#4d4354] font-bold text-[#cfc2d6] hover:bg-[#2e2738] transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-8 py-3 rounded-xl bg-[#2e2738] border border-[#4d4354] font-bold text-[#eadef6] hover:bg-[#393244] active:scale-95 transition-all"
              >
                Save Draft
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <CreateEvent />
    </ProtectedRoute>
  );
}
