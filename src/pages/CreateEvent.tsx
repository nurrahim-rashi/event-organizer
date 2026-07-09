import React, { useState } from "react";
import { useNavigate } from "react-router";
import { createEvent } from "../services/event.service";
import { userAuth } from "../stores/useAuth";

import { Sidebar } from "../components/CreateEvent/Sidebar";
import { BasicDetailsForm } from "../components/CreateEvent/BasicDetailsForm";
import { ScheduleForm } from "../components/CreateEvent/ScheduleForm";
import { TicketingForm } from "../components/CreateEvent/TicketingForm";
import { PromotionForm } from "../components/CreateEvent/PromotionForm";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";

export type EventCategory =
  | "MUSIC"
  | "SPORTS"
  | "BUSINESS"
  | "EDUCATION"
  | "TECHNOLOGY"
  | "FOOD"
  | "ART"
  | "HEALTH"
  | "OTHER";

export interface TicketTypeState {
  name: string;
  price: number;
  totalTicket: number;
}

export interface VoucherState {
  code: string;
  discount: number | string;
  quota: number | string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface EventFormState {
  name: string;
  category: EventCategory | "";
  location: string;
  description: string;
  bannerImage: File | null | string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  ticketTypes: TicketTypeState[];
  vouchers: VoucherState[];
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = userAuth(); // Ambil user dari store
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
    ticketTypes: [{ name: "GOLD", price: 0, totalTicket: 100 }],
    vouchers: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToSection = (id: string) => {
    setActiveStep(id);
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 100, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi session
    if (!user) {
      setError("Session expired. Please login again.");
      return;
    }

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

      const formattedVouchers =
        formData.vouchers?.map((v: VoucherState) => ({
          code: v.code.toUpperCase(),
          discount: Number(v.discount),
          quota: Number(v.quota),
          startDate: new Date(`${v.startDate}T${v.startTime}`).toISOString(),
          endDate: new Date(`${v.endDate}T${v.endTime}`).toISOString(),
        })) || [];

      const formattedTicketTypes = formData.ticketTypes.map((t) => ({
        name: t.name.toUpperCase().replace(" ", "_"),
        price: Number(t.price),
        totalTicket: Number(t.totalTicket),
      }));

      const payload = {
        name: formData.name,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        bannerImage: formData.bannerImage ? "URL_CONVERTED_OR_UPLOADED" : "",
        startDate: startDateTime,
        endDate: endDateTime,
        organizerId: user.id, // 👈 Menggunakan ID dari Zustand Store (Samantha = 4)
        ticketTypes: formattedTicketTypes,
        vouchers: formattedVouchers,
      };

      const res = await createEvent(payload);
      if (res) {
        alert("🎉 Event successfully published!");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !formData.name.trim() ||
    !formData.category ||
    !formData.location.trim() ||
    !formData.description.trim() ||
    !formData.startDate ||
    !formData.startTime ||
    !formData.endDate ||
    !formData.endTime ||
    formData.ticketTypes.length === 0;

  return (
    <main className="pt-24 pb-12 px-6 max-w-[1280px] mx-auto min-h-screen text-[#eadef6]">
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Create New Event" },
        ]}
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-10"
      >
        <Sidebar
          activeStep={activeStep}
          loading={loading}
          error={error}
          scrollToSection={scrollToSection}
        />

        <div className="flex-1 space-y-12">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-sm text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <BasicDetailsForm
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
          />
          <ScheduleForm
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <TicketingForm formData={formData} setFormData={setFormData} />
          <PromotionForm formData={formData} setFormData={setFormData} />

          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-xl border border-[#4d4354] font-bold text-[#cfc2d6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isFormInvalid}
              className="px-8 py-3 rounded-xl bg-[#ddb7ff] text-[#490080] font-bold"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
