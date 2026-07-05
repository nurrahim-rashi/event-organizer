import { userAuth } from "../../stores/useAuth";
import { Link } from "react-router";

export default function Navbar() {
  const { user, logout } = userAuth();

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#171021]/80 backdrop-blur-xl border-b border-[#4d4354]/10">
      <div className="flex items-center gap-8 max-w-7xl mx-auto w-full">
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
          {user ? (
            <div>
              <button
                className="bg-[#A855F7] py-2 px-4 text-sm font-semibold rounded-xl hover:bg-[#22D3EE] hover:cursor-pointer"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login">
                <button className="bg-[#A855F7] py-2 px-4 text-sm font-semibold rounded-xl hover:bg-[#22D3EE] hover:cursor-pointer">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
