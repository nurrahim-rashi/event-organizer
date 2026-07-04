import { useState, useEffect } from "react";
import { getEvent, updateEvent } from "../services/event.service";
import type { Event } from "../types/type";

export const useEditEvent = (eventId: number) => {
  const [formData, setFormData] = useState<Event>({
    id: 0,
    title: "",
    category: "OTHER",
    capacity: 0,
    location: "",
    city: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isPaid: false,
    price: 0,
    organizerId: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEvent(eventId);
        setFormData(data);
      } catch (error) {
        console.error("Failed to load event data", error);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEventData();
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleTogglePaid = (isPaid: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPaid,
      price: isPaid ? prev.price : 0,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEvent(eventId, formData);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to update event", error);
    } finally {
      setSaving(false);
    }
  };

  const capacity = formData.capacity || 100;
  const totalRevenue = formData.price * capacity;
  const serviceFee = formData.isPaid ? totalRevenue * 0.05 : 0;
  const netEarnings = formData.isPaid ? totalRevenue - serviceFee : 0;

  return {
    formData,
    loading,
    saving,
    serviceFee,
    netEarnings,
    handleChange,
    handleTogglePaid,
    handleSave,
  };
};
