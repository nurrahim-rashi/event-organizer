interface FormSidebarProps {
  activeStep: string;
  loading: boolean;
  error: string | null;
  scrollToSection: (id: string) => void;
}

export function FormSidebar({
  activeStep,
  loading,
  error,
  scrollToSection,
}: FormSidebarProps) {
  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="sticky top-28 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#eadef6] mb-2">
            Create New Event
          </h1>
          <p className="text-sm text-[#cfc2d6]">
            Complete the details to publish your event.
          </p>
        </div>
        <nav className="flex flex-col space-y-4">
          {[
            { id: "basic-details", num: 1, label: "Basic Details" },
            { id: "media", num: 2, label: "Event Media" },
            { id: "schedule", num: 3, label: "Schedule" },
            { id: "pricing", num: 4, label: "Ticketing" },
            { id: "promotions", num: 5, label: "Promotion" },
          ].map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => scrollToSection(step.id)}
              className="flex items-center gap-3 group text-left w-full"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all ${
                  activeStep === step.id
                    ? "border-[#ddb7ff] bg-[#ddb7ff] text-[#490080] shadow-[0_0_0_4px_rgba(221,183,255,0.15)]"
                    : "border-[#4d4354] text-[#cfc2d6] group-hover:border-[#ddb7ff]"
                }`}
              >
                {step.num}
              </span>
              <span
                className={`transition-colors ${activeStep === step.id ? "text-[#ddb7ff] font-bold" : "text-[#cfc2d6] group-hover:text-[#ddb7ff]"}`}
              >
                {step.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="pt-8 border-t border-[#4d4354]">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ddb7ff] disabled:bg-[#4d4354] text-[#490080] disabled:text-gray-400 py-3 px-6 rounded-xl font-bold shadow-lg shadow-[#ddb7ff]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span
              className={`material-symbols-outlined ${loading ? "animate-spin" : ""}`}
            >
              {loading ? "sync" : "rocket_launch"}
            </span>
            {loading ? "Publishing..." : "Publish Event"}
          </button>
          {error && (
            <p className="text-xs text-red-400 mt-2 text-center">{error}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
