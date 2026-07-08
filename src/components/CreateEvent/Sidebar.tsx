interface FormSidebarProps {
  activeStep: string;
  loading: boolean;
  error: string | null;
  scrollToSection: (id: string) => void;
}

export function Sidebar({ activeStep, scrollToSection }: FormSidebarProps) {
  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="sticky top-28 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#eadef6] mb-2">
            Create a New Event
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
      </div>
    </aside>
  );
}
