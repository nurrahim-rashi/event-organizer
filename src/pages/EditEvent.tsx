import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useEditEvent } from "../stores/useEditEvent";
import DeleteEventModal from "../components/DeleteEvent/DeleteEventModal";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = Number(id);

  const { formData, loading } = useEditEvent(eventId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (loading)
    return <div className="text-center p-10 text-on-surface">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#171021] text-[#eadef6]">
      {/* Edit */}
      <div className="max-w-[1280px] mx-auto px-6 mt-6 flex justify-start">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-2 text-[#ffb4ab] border border-[#ffb4ab]/30 px-4 py-2 rounded-lg hover:bg-[#ffb4ab]/10 transition-all text-sm font-bold"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
          Danger: Delete Event
        </button>
      </div>

      {/* Delete Modal */}
      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        eventId={eventId}
        eventName={formData.name || "This Event"}
        onSuccess={() => navigate("/")}
      />
    </div>
  );
}
