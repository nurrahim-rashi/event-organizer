interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelTransactionModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* Container utama dengan background #1f1929 dan border #393244 */}
      <div className="relative w-full max-w-md bg-[#1f1929] border border-[#393244] rounded-xl shadow-2xl p-8 flex flex-col items-center text-center">
        {/* Warning Icon - Sudah centered dengan flex items-center justify-center */}
        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#ffb300]/10 text-[#ffb300]">
          <span
            className="material-symbols-outlined !text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-[#eadef6] mb-4 tracking-tight">
          Cancel Transaction?
        </h2>

        {/* Message */}
        <p className="text-[#cfc2d6] mb-10 leading-relaxed px-2">
          Are you sure you want to cancel? Your ticket selection will not be
          saved and you will need to start the checkout process again.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col gap-4">
          {/* Tombol Keep Checkout (Warna Primary #ddb7ff) */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-[#ddb7ff] text-[#400071] font-bold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center"
          >
            Keep Checkout
          </button>

          {/* Tombol Cancel (Transparan dengan hover) */}
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-transparent text-[#cfc2d6] hover:text-[#eadef6] font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center group"
          >
            <span className="border-b border-transparent group-hover:border-red-400 transition-all text-red-400">
              Yes, Cancel Transaction
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
