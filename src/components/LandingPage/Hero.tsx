import { useState, useEffect } from "react";
import { useDebounce } from "../../stores/useDebounce";

interface HeroProps {
  onFilterChange: (filters: {
    search: string;
    location: string;
    category: string;
  }) => void;
}

export default function Hero({ onFilterChange }: HeroProps) {
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const debouncedSearch = useDebounce(searchInput, 500);
  const debouncedLocation = useDebounce(locationInput, 500);

  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      location: debouncedLocation,
      category: selectedCategory,
    });
  }, [debouncedSearch, debouncedLocation, selectedCategory, onFilterChange]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? "" : categoryName));
  };

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden px-6 py-24 bg-gradient-to-tr from-[#171021] via-[#231d2e] to-[#171021]">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#ddb7ff]/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#5de6ff]/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e2738] text-[#ddb7ff] rounded-full text-xs font-semibold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[18px]">
              auto_awesome
            </span>
            <span>Discover Your Next Adventure</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-[#eadef6] max-w-xl leading-tight tracking-tight">
            Find Amazing Events{" "}
            <span className="text-[#ddb7ff] italic">Without Limits.</span>
          </h1>

          <p className="text-lg text-[#cfc2d6] max-w-md">
            The ultimate event management platform for unforgettable concerts,
            workshops, and sporting experiences.
          </p>

          {/* Form Pencarian */}
          <div className="flex flex-col md:flex-row items-center p-2 bg-[#231d2e] rounded-xl border border-[#4d4354]/30 max-w-2xl gap-2 md:gap-0 shadow-lg">
            <div className="flex flex-1 items-center px-4 gap-3 w-full">
              <span className="material-symbols-outlined text-[#cfc2d6]">
                search
              </span>
              <input
                className="w-full border-none focus:ring-0 bg-transparent text-[#eadef6] placeholder-[#cfc2d6]/50 outline-none py-3"
                placeholder="Search concerts, festivals, workshops..."
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-[#4d4354]/50 hidden md:block mx-2"></div>
            <div className="flex flex-1 items-center px-4 gap-3 w-full">
              <span className="material-symbols-outlined text-[#cfc2d6]">
                location_on
              </span>
              <input
                className="w-full border-none focus:ring-0 bg-transparent text-[#eadef6] placeholder-[#cfc2d6]/50 outline-none py-3"
                placeholder="All Locations"
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto bg-[#ddb7ff] text-[#490080] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#ddb7ff]/10">
              Search
            </button>
          </div>

          {/* Quick Tags Kategori */}
          <div className="flex flex-wrap gap-3">
            {[
              { id: "MUSIC", label: "Music", icon: "music_note" },
              { id: "BUSINESS", label: "Workshop", icon: "school" },
              { id: "SPORTS", label: "Sports", icon: "sports_soccer" },
              { id: "ART", label: "Art", icon: "theaters" },
              { id: "FOOD", label: "Culinary", icon: "restaurant" },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 py-2 rounded-full border transition-all text-sm flex items-center gap-2 ${
                    isSelected
                      ? "border-[#ddb7ff] bg-[#ddb7ff]/20 text-[#ddb7ff] font-medium"
                      : "border-[#4d4354] bg-[#1f1929] text-[#cfc2d6] hover:border-[#ddb7ff] hover:text-[#ddb7ff]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {cat.icon}
                  </span>{" "}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:block relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#231d2e]">
          <img
            alt="Festival Crowd"
            className="w-full aspect-[4/5] object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDORGsAkkAPyoTQdNyBE75feb8W0g0PVkIvy9t8U-J9i7X2Mt_cjS4UfXmT91ilD51MkgR8wLbywLRUpFTVuWyndzWT0lPRPgU4PI2IRaGcwOYAooBGZi_xet31eKEFDRDDFVH7yuMzxC7mOCgJsH-GYWApORL-HUc_iRDv9URHJbuNNTzC8cq71jO3Dug9MOuq7fb3DGhOvpWzYje5HWFAJ1vGvJ-aT077F3Oi0sCcZDxAAXUYSpt_dV1kKo14HxvvTofKdWYho_I"
          />
        </div>
      </div>
    </section>
  );
}
