export default function CTA() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1280px] border border-[#4d4354] bg-[#B76DFF] mx-auto bg-primary-container rounded-3xl p-12 overflow-hidden relative border border-white/5">
        {/* Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-l from-primary to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold font-headline-lg text-headline-lg text-on-primary-container mb-4 text-[#6900B3]">
              Host Your Own Event?
            </h2>
            <p className="font-body-lg text-on-primary-container/80 mb-8 text-[#6900B3]">
              Join thousands of other organizers and start selling your event
              tickets today with a secure and easy system.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button className="bg-on-primary-container text-primary-container bg-[#6900B3] px-8 py-3 rounded-lg font-body-md font-bold hover:opacity-90 transition-all shadow-xl shadow-primary-container/20">
                Become an Organizer
              </button>
              <button className="border-2 border-on-primary-container/50 border-[#6900B3] text-on-primary-container px-8 py-3 rounded-lg font-body-md font-bold hover:bg-on-primary-container hover:text-primary-container text-[#6900B3] transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Icon */}
          <div className="w-48 h-48 bg-on-primary-container/10 rounded-full flex items-center justify-center border border-on-primary-container/20 border-[#6900B3] backdrop-blur-sm animate-bounce">
            <span className="material-symbols-outlined text-[84px] text-[#842BD2] text-on-primary-container">
              rocket_launch
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
