import { useState, useEffect } from "react";
import { getEvent } from "../services/event.service";
import type { Event, TicketType } from "../types/type";

export const useEventDetail = (eventId: number | string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);

      const cleanId = Number(eventId);

      if (!eventId || isNaN(cleanId)) {
        setLoading(false);
        return;
      }

      try {
        const data: Event = await getEvent(cleanId);
        setEvent(data);

        const tickets = data?.ticketTypes || (data as any)?.ticket_types || [];

        if (tickets && tickets.length > 0) {
          const available = tickets.find(
            (t: any) =>
              (t.totalTicket ?? t.total_ticket ?? 0) > (t.booked ?? 0),
          );
          setSelectedTicket(available || tickets[0]);
        }
      } catch (error) {
        console.error("Error fetching event detail inside store:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [eventId]);

  return {
    event,
    loading,
    selectedTicket,
    setSelectedTicket,
  };
};
