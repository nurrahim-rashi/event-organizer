export default function Footer() {
  return (
    <footer className="bg-[#110b1b] px-6 py-16 border-t border-[#4d4354]/10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="text-2xl font-extrabold text-[#ddb7ff] mb-6">
            Event Organizer
          </div>
          <p className="text-sm text-[#cfc2d6] leading-relaxed">
            Event Organizer is the premier destination for finding and managing
            the best events in Indonesia. Providing a seamless experience for
            every step of your event journey.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#eadef6] mb-6">
            Quick Links
          </h4>
          <ul className="space-y-4 text-sm text-[#cfc2d6]">
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                All Events
              </a>
            </li>
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                How to Buy
              </a>
            </li>
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                Help Center
              </a>
            </li>
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                Terms &amp; Conditions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#eadef6] mb-6">
            Categories
          </h4>
          <ul className="space-y-4 text-sm text-[#cfc2d6]">
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                Music Concerts
              </a>
            </li>
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                Creative Workshops
              </a>
            </li>
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                Sports Tournaments
              </a>
            </li>
            <li>
              <a className="hover:text-[#ddb7ff] transition-colors" href="#">
                Food Festivals
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#eadef6] mb-6">
            Connect
          </h4>
          <div className="flex gap-4 mb-6">
            <a
              className="w-10 h-10 rounded-full bg-[#2e2738] flex items-center justify-center hover:bg-[#ddb7ff] hover:text-[#490080] transition-all text-[#cfc2d6]"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">
                public
              </span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-[#2e2738] flex items-center justify-center hover:bg-[#ddb7ff] hover:text-[#490080] transition-all text-[#cfc2d6]"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">
                mail
              </span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-[#2e2738] flex items-center justify-center hover:bg-[#ddb7ff] hover:text-[#490080] transition-all text-[#cfc2d6]"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">
                chat
              </span>
            </a>
          </div>
          <p className="text-sm text-[#cfc2d6]">
            Subscribe to our newsletter for the latest event info.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 bg-[#231d2e] border border-[#4d4354] rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#ddb7ff] text-[#eadef6] outline-none"
              placeholder="Your email"
              type="email"
            />
            <button className="bg-[#ddb7ff] text-[#490080] px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-colors">
              Go
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-[#4d4354]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#cfc2d6]">
        <p>© 2026 Event Organizer Indonesia. All rights reserved.</p>
        <div className="flex gap-8">
          <a className="hover:text-[#ddb7ff] transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-[#ddb7ff] transition-colors" href="#">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
