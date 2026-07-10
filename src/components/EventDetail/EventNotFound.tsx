import React, { useState, useEffect } from "react";
import {
  Search,
  LayoutDashboard,
  Rocket,
  Music,
  Brush,
  Utensils,
} from "lucide-react";

const EventNotFound: React.FC = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="pl-0 md:pl-64 pt-16 min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-background">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-container opacity-5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-secondary-container opacity-5 blur-[120px] rounded-full" />

      <div className="max-w-2xl w-full px-6 py-12 text-center z-10">
        <div className="glass-panel rounded-xl p-12 shadow-[0_0_20px_rgba(183,109,255,0.15)] relative overflow-hidden bg-surface-container/60 border border-white/5">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-container-highest text-primary animate-bounce"></div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-on-surface">
            Event Not Found
          </h1>
          <p className="text-lg text-on-surface-variant mb-10 max-w-lg mx-auto">
            The event you are looking for might have been moved, deleted, or has
            already ended. It’s a quiet place here right now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto bg-primary text-on-primary font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10">
              <Search size={20} /> Back to Discovery
            </button>
            <button className="w-full sm:w-auto border border-outline hover:border-primary text-on-surface px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 bg-surface-container-low">
              <LayoutDashboard size={20} /> Go to My Dashboard
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 border-t border-outline-variant pt-8">
            <div className="text-left">
              <span className="text-xs text-outline uppercase block mb-1">
                Status Code
              </span>
              <span className="text-2xl font-bold">404</span>
            </div>
            <div className="h-8 w-px bg-outline-variant" />
            <div className="text-left">
              <span className="text-xs text-outline uppercase block mb-1">
                Platform Time
              </span>
              <span className="text-2xl font-bold">{time}</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 text-left">
          <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4 px-2">
            Popular Categories
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Rocket, label: "Tech", color: "text-secondary" },
              { icon: Music, label: "Music", color: "text-tertiary" },
              { icon: Brush, label: "Arts", color: "text-primary" },
              { icon: Utensils, label: "Food", color: "text-secondary-fixed" },
            ].map((cat, i) => (
              <a
                key={i}
                href="#"
                className="bg-surface-container hover:bg-surface-container-high border border-white/5 p-4 rounded-lg transition-colors group"
              >
                <cat.icon
                  className={`${cat.color} mb-2 group-hover:scale-110 transition-transform`}
                />
                <span className="block text-sm font-medium">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventNotFound;
