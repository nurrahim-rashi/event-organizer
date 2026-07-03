export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#171021]/80 backdrop-blur-xl border-b border-[#4d4354]/10">
      <div className="flex items-center gap-8 max-w-[1280px] mx-auto w-full">
        <div className="text-2xl font-extrabold text-[#ddb7ff] whitespace-nowrap">
          Event Organizer
        </div>
        <div className="hidden md:flex items-center gap-6 flex-1">
          <a
            className="text-sm text-[#ddb7ff] border-b-2 border-[#ddb7ff] font-bold pb-1 transition-colors"
            href="#"
          >
            Discover
          </a>
          <a
            className="text-sm text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors"
            href="#"
          >
            Categories
          </a>
          <a
            className="text-sm text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors"
            href="#"
          >
            My Tickets
          </a>
          <a
            className="text-sm text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors"
            href="#"
          >
            Favorites
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#231d2e] overflow-hidden border border-[#4d4354]">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfYJkj_XrfRriik_gJAooGlFvIQC2XLUWeTZWwL7PT3JAYZSDcj2QMUqUV-H9wSglFVLyj_q5dTLGW3KgeC0xo1eWfWEXw7f0dRIs5PiqOPkcGb9vaYDkTQlJOr8--TXZT5rc0_wZNSivxM0atxahKWS4zorz4M-ImJHjJuCYe2y1_maFHFc0Q7iRY9yvCQk0SrOXMwjOaSZi6T8DVPcM4kPfO5WV2_lEueQeNjLBUO5ObNcTAnHv9JA4qAPZ5E0bbP9chkse-bgA"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
