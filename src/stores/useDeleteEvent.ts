import { useState } from "react";
import { deleteEvent } from "../services/event.service";

export const useDeleteEvent = (eventId: number, onSuccess: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      alert("Event deleted successfully!");
      onSuccess();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDelete,
    isDeleting,
  };
};
