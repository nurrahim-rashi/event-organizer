import React from "react";
import type { Toast, ToastType } from "../../hooks/useToast";

interface Props {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const config: Record<ToastType, { color: string; icon: string }> = {
  success: { color: "border-emerald-500", icon: "check_circle" },
  warning: { color: "border-amber-500", icon: "warning" },
  error: { color: "border-red-500", icon: "error" },
};

export const ToastContainer: React.FC<Props> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col gap-4 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-4 p-4 glass-panel bg-surface-container-high/80 rounded-xl border-l-4 ${config[toast.type].color} shadow-2xl animate-in slide-in-from-right`}
        >
          <div
            className={`bg-${toast.type === "success" ? "emerald" : toast.type === "warning" ? "amber" : "red"}-500/20 p-2 rounded-lg`}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {config[toast.type].icon}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-on-surface capitalize">
              {toast.type}
            </h4>
            <p className="text-on-surface-variant text-sm">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
