import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { updateEvent } from "../services/event.service";
import { userAuth } from "../stores/useAuth";
import { useEditEvent } from "../hooks/useEditEvent";

import { Sidebar } from "../components/CreateEvent/Sidebar";
import { BasicDetailsForm } from "../components/CreateEvent/BasicDetailsForm";
import { ScheduleForm } from "../components/CreateEvent/ScheduleForm";
import { TicketingForm } from "../components/CreateEvent/TicketingForm";
import { PromotionForm } from "../components/CreateEvent/PromotionForm";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";
import DeleteEventModal from "../components/DeleteEvent/DeleteEventModal";

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();

  const { formData: fetchedData, loading: fetchLoading } =
    useEditEvent(eventId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<string>("basic-details");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (fetchedData) {
      setFormData(fetchedData);
    }
  }, [fetchedData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Format tanggal ke ISO 8601 agar Prisma tidak error
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}:00`,
      ).toISOString();
      const endDateTime = new Date(
        `${formData.endDate}T${formData.endTime}:00`,
      ).toISOString();

      // 2. Bersihkan payload dari field yang tidak boleh null
      const payload = {
        name: formData.name,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        // Hanya kirim bannerImage jika ada nilainya
        ...(formData.bannerImage && { bannerImage: formData.bannerImage }),
        // Pastikan relasi lain (ticketTypes, vouchers) dikirim sesuai kebutuhan backend
        ticketTypes: formData.ticketTypes,
        vouchers: formData.vouchers,
      };

      await updateEvent(eventId, payload);
      alert("🎉 Event updated successfully!");
      navigate(`/events/${eventId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || !formData)
    return <div className="text-center p-20">Loading data...</div>;

  return (
    <main className="pt-24 pb-12 px-6 max-w-[1280px] mx-auto min-h-screen text-[#eadef6]">
      <Navbar />
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Edit Event" },
          ]}
        />
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-bold hover:bg-red-500/30 transition-all"
        >
          Delete Event
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-10"
      >
        <Sidebar
          activeStep={activeStep}
          loading={loading}
          error={error}
          scrollToSection={setActiveStep}
        />

        <div className="flex-1 space-y-12">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
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
              className="px-8 py-3 rounded-xl border border-[#4d4354]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#ddb7ff] text-[#490080] font-bold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        eventId={eventId}
        eventName={formData.name}
        onSuccess={() => navigate("/dashboard")}
      />
    </main>
  );
}
