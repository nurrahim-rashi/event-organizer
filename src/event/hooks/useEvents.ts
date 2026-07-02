import { useEffect, useState } from "react";
import * as service from "../services/event.service";

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const data = await service.getEvents();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, fetchEvents };
};
