export default function OrderDetails() {
  return (
    <section className="bg-[rgba(35,29,46,0.6)] backdrop-blur-[12px] border border-white/10 rounded-xl p-1 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-48 md:h-auto">
          <img
            className="w-full h-full object-cover rounded-lg"
            alt="Neon Horizon"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyn26qhsaigOyfFZSBLNjY6KQOMFsJxDihggeZ59Ukzgb8-M7XcEjURiq93mWUKLRdW6Djgv1MQtica9GX4uFn4aVU-0DdZCChAW0dH3Dw1mSJFfNSM0utjG23X6tC7hSaGxZbVW6GgE7MASnqOYdv7xjsi-s5s2hE1FOOPDEpsREm0HjmjaCX2LOCn72Ty4gyY-R0LzgZ3m6eliPLgdfaUA2df4sKzjcXlIykFz5qv4E2iq89fnE2jRzJsBTH-_1CVvWh6OmJyxo"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col justify-center gap-2">
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00cbe6] text-[#00515d] w-fit">
            <span className="text-[11px] font-semibold">LIVE PERFORMANCE</span>
          </div>
          <h2 className="text-2xl font-bold text-[#eadef6]">
            Neon Horizon: Digital Pulse 2024
          </h2>
          <div className="flex flex-col gap-1 text-[#cfc2d6] text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                calendar_today
              </span>
              <span>Saturday, Oct 26 • 8:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                location_on
              </span>
              <span>The Quantum Arena, SF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
