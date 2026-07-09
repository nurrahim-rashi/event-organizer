import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { updateEvent } from "../services/event.service";
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
      // 1. Validasi Tanggal
      const startDateTime = new Date(formData.startDate).toISOString();
      const endDateTime = new Date(formData.endDate).toISOString();

      // 2. Bersihkan payload
      // Kita hapus property yang kosong agar tidak dikirim ke Prisma sebagai null
      const payload: any = {
        name: formData.name,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        ticketTypes: formData.ticketTypes.map((t: any) => ({
          ...(t.id && { id: t.id }), // Kirim ID hanya jika ada (untuk update)
          name: t.name,
          price: Number(t.price),
          totalTicket: Number(t.totalTicket),
        })),
        vouchers: formData.vouchers,
      };

      // Hanya masukkan bannerImage jika ada isinya
      if (formData.bannerImage && formData.bannerImage.trim() !== "") {
        payload.bannerImage = formData.bannerImage;
      }

      // Bersihkan array relasi agar tidak ada entry null
      if (formData.ticketTypes) {
        payload.ticketTypes = formData.ticketTypes.filter(
          (t: any) => t.name && t.price >= 0,
        );
      }

      if (formData.vouchers) {
        payload.vouchers = formData.vouchers.filter((v: any) => v.code);
      }

      await updateEvent(eventId, payload);
      alert("🎉 Event updated successfully!");
      navigate(`/events/${eventId}`);
    } catch (err: any) {
      console.error("Update Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update event. Please check your input fields.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || !formData)
    return (
      <div className="min-h-screen bg-[#171021] flex items-center justify-center text-[#eadef6]">
        Loading event data...
      </div>
    );

  return (
    <main className="bg-[#171021] min-h-screen pt-24 pb-12 px-6 max-w-[1280px] mx-auto text-[#eadef6]">
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

          <div id="basic-details">
            <BasicDetailsForm
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          </div>
          <div id="schedule">
            <ScheduleForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
          <div id="ticketing">
            <TicketingForm formData={formData} setFormData={setFormData} />{" "}
          </div>
          <div id="promotion">
            <PromotionForm formData={formData} setFormData={setFormData} />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#4d4354]/30">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-xl border border-[#4d4354] hover:bg-[#231d2e]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#ddb7ff] text-[#490080] font-bold hover:bg-[#f0dbff] disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
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
