import { useDeleteEvent } from "../../hooks/useDeleteEvent";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventName: string;
  eventId: number;
}

export default function DeleteEventModal({
  isOpen,
  onClose,
  onSuccess,
  eventName,
  eventId,
}: DeleteEventModalProps) {
  const { handleDelete, isDeleting } = useDeleteEvent(eventId, onSuccess);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
      {/* Confirmation Modal Content */}
      <div className="relative w-full max-w-md bg-[#231d2e]/70 backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl p-8 transform scale-100 transition-all duration-300">
        {/* Warning Icon Section */}
        <div className="w-16 h-16 rounded-full bg-[#93000a]/30 flex items-center justify-center mb-6 mx-auto border border-[#ffb4ab]/20">
          <span
            className="material-symbols-outlined text-[#ffb4ab] text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
        </div>

        {/* Text Content */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#eadef6] mb-4 tracking-tight">
            Delete Event?
          </h2>
          <p className="text-[#cfc2d6] text-sm leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-[#ddb7ff] font-bold">"{eventName}"</span>?
            This action cannot be undone and all associated ticket data will be
            permanently removed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="group relative w-full h-14 bg-[#ffb4ab] text-[#690005] font-bold rounded-lg overflow-hidden transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,180,171,0.2)] flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">delete_forever</span>
            <span>{isDeleting ? "Deleting..." : "Delete Event"}</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full h-14 bg-[#393244] text-[#eadef6] font-semibold rounded-lg hover:bg-[#3d3648] transition-colors active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* Security Check Copy */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#988d9f]">
            Authorized Administrator Only
          </p>
        </div>
      </div>
    </div>
  );
}
