import { useState } from "react";
import { deleteEvent } from "../../services/event.service";
import toast from "react-hot-toast";

export const useDeleteEvent = (eventId: number, onSuccess: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully!");
      onSuccess();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDelete,
    isDeleting,
  };
};
