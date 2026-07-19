import React from "react";

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
      <div className="relative w-full max-w-md bg-surface-container rounded-xl shadow-2xl p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 border border-outline-variant">
        {/* Warning Icon */}
        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning">
          <span
            className="material-symbols-outlined !text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-on-surface mb-4 tracking-tight">
          Cancel Transaction?
        </h2>

        {/* Message */}
        <p className="text-on-surface-variant mb-10 leading-relaxed px-2">
          Are you sure you want to cancel? Your ticket selection will not be
          saved and you will need to start the checkout process again.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg transition-all duration-200 active:scale-95"
          >
            Keep Checkout
          </button>

          <button
            onClick={onConfirm}
            className="w-full py-4 bg-transparent text-on-surface-variant hover:text-on-surface font-semibold rounded-lg transition-colors duration-200"
          >
            Yes, Cancel Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
