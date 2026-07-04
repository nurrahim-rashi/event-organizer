import { useState, useEffect } from "react";
import { getEvent } from "../services/event.service";
import type { Event, TicketType } from "../types/type";

export const useEventDetail = (eventId: number) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data: Event = await getEvent(eventId);
        setEvent(data);

        if (data.tickets && data.tickets.length > 0) {
          const available = data.tickets.find((t) => t.isAvailable);
          if (available) setSelectedTicket(available);
        }
      } catch (error) {
        console.error("Error fetching event detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchDetail();
  }, [eventId]);

  return {
    event,
    loading,
    selectedTicket,
    setSelectedTicket,
  };
};
