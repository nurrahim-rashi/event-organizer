import type { EventCategory } from "../../types/type";

interface SidebarFilterProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

export default function SidebarFilter({
  searchParams,
  setSearchParams,
}: SidebarFilterProps) {
  const searchQuery = searchParams.get("search") || "";
  const locationQuery = searchParams.get("location") || "";
  const selectedCategories = searchParams.getAll("category") as EventCategory[];

  const availableCategories: EventCategory[] = [
    "MUSIC",
    "SPORTS",
    "BUSINESS",
    "EDUCATION",
    "TECHNOLOGY",
    "FOOD",
    "ART",
    "HEALTH",
    "OTHER",
  ];

  const handleSearchChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set("search", value);
    else newParams.delete("search");
    setSearchParams(newParams);
  };

  const handleLocationChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set("location", value);
    else newParams.delete("location");
    setSearchParams(newParams);
  };

  const handleClearField = (key: "search" | "location") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category: EventCategory) => {
    const newParams = new URLSearchParams(searchParams);
    const currentCats = newParams.getAll("category");

    if (currentCats.includes(category)) {
      const filteredCats = currentCats.filter((c) => c !== category);
      newParams.delete("category");
      filteredCats.forEach((c) => newParams.append("category", c));
    } else {
      newParams.append("category", category);
    }
    setSearchParams(newParams);
  };

  return (
    <aside className="hidden xl:flex flex-col w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 mb-6">
        <span
          className="material-symbols-outlined text-[#ddb7ff]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          tune
        </span>
        <h2 className="text-xl font-bold tracking-tight">Filters</h2>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 no-scrollbar">
        {/* Search Input dengan Tombol Clear */}
        <section>
          <h3 className="text-xs font-bold text-[#4d4354] uppercase tracking-wider mb-3">
            Search Event
          </h3>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4354]">
              search
            </span>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#1f1929] border border-white/5 rounded-xl pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-[#ddb7ff] focus:outline-none text-sm text-white placeholder-gray-500 overflow-x-auto"
            />
            {searchQuery && (
              <button
                onClick={() => handleClearField("search")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d4354] hover:text-[#ddb7ff] transition-colors flex items-center justify-center p-0.5 rounded-full hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Location Filter dengan Tombol Clear */}
        <section>
          <h3 className="text-xs font-bold text-[#4d4354] uppercase tracking-wider mb-3">
            Location
          </h3>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4354]">
              location_on
            </span>
            <input
              type="text"
              placeholder="Filter by city..."
              value={locationQuery}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full bg-[#1f1929] border border-white/5 rounded-xl pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-[#ddb7ff] focus:outline-none text-sm text-white placeholder-gray-500 overflow-x-auto"
            />
            {locationQuery && (
              <button
                onClick={() => handleClearField("location")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d4354] hover:text-[#ddb7ff] transition-colors flex items-center justify-center p-0.5 rounded-full hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Category Checklist */}
        <section>
          <h3 className="text-xs font-bold text-[#4d4354] uppercase tracking-wider mb-4">
            Categories
          </h3>
          <div className="space-y-3">
            {availableCategories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="form-checkbox bg-transparent border-[#988d9f] text-[#ddb7ff] focus:ring-[#ddb7ff] rounded-sm"
                />
                <span className="text-sm text-[#eadef6] group-hover:text-[#ddb7ff] transition-colors capitalize">
                  {cat.toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-auto pt-6 border-t border-[#4d4354]/20">
        <button
          onClick={() => setSearchParams(new URLSearchParams())}
          className="w-full py-3 rounded-lg bg-[#2e2738] border border-[#4d4354] text-[#eadef6] hover:bg-[#393244] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
          <span className="text-sm font-bold">Reset Filters</span>
        </button>
      </div>
    </aside>
  );
}
