import { useState, useEffect } from "react";
import { getEvent, updateEvent } from "../../services/event.service";
import type { Event, EventCategory } from "../../types/event";
import toast from "react-hot-toast";

interface EventFormState {
  name: string;
  category: EventCategory | "";
  location: string;
  description: string;
  bannerImage: File | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  ticketTypes: {
    name: string;
    price: number;
    totalTicket: number;
  }[];
}

export const useEditEvent = (eventId: number) => {
  const [formData, setFormData] = useState<EventFormState>({
    name: "",
    category: "OTHER",
    location: "",
    description: "",
    bannerImage: null,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    ticketTypes: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data: Event = await getEvent(eventId);

        const startDateTime = new Date(data.startDate);
        const endDateTime = new Date(data.endDate);

        setFormData({
          name: data.name,
          category: data.category,
          location: data.location,
          description: data.description,
          bannerImage: null,
          startDate: startDateTime.toISOString().split("T")[0],
          startTime: startDateTime.toTimeString().substring(0, 5),
          endDate: endDateTime.toISOString().split("T")[0],
          endTime: endDateTime.toTimeString().substring(0, 5),
          ticketTypes:
            data.ticketTypes?.map((t) => ({
              name: t.name,
              price: t.price,
              totalTicket: t.totalTicket,
            })) || [],
        });
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
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedEventPayload = {
        name: formData.name,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        startDate: new Date(
          `${formData.startDate}T${formData.startTime}`,
        ).toISOString(),
        endDate: new Date(
          `${formData.endDate}T${formData.endTime}`,
        ).toISOString(),
        ticketTypes: formData.ticketTypes,
      };

      await updateEvent(eventId, updatedEventPayload);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to update event", error);
      toast.error("Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  const capacity = formData.ticketTypes.reduce(
    (sum, t) => sum + t.totalTicket,
    0,
  );

  return {
    formData,
    setFormData,
    loading,
    saving,
    capacity,
    handleChange,
    handleSave,
  };
};
