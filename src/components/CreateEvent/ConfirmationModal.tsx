interface ConfirmEditProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmEditModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmEditProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-[#1f1929] border border-[#393244] rounded-xl shadow-2xl p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#ddb7ff]/10 text-[#ddb7ff]">
          <span
            className="material-symbols-outlined !text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            edit_note
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#eadef6] mb-4">
          Save Changes?
        </h2>
        <p className="text-[#cfc2d6] mb-10 leading-relaxed">
          Are you sure you want to save these changes? This will update your
          event details immediately.
        </p>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-[#ddb7ff] text-[#400071] font-bold rounded-lg transition-all active:scale-95"
          >
            Yes, Save Changes
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-transparent text-[#cfc2d6] hover:text-[#eadef6] font-semibold rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
