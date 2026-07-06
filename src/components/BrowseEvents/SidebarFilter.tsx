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
  const priceRange = searchParams.get("price") || "20000000";
  const dateFilter = searchParams.get("date") || "";

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

  const handleClearField = (key: string) => {
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

  const handlePriceChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("price", value);
    setSearchParams(newParams);
  };

  const handleDateChange = (type: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (dateFilter === type) {
      newParams.delete("date");
    } else {
      newParams.set("date", type);
    }
    setSearchParams(newParams);
  };

  return (
    <aside className="hidden xl:flex flex-col w-full flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
      <div className="bg-[rgba(35,29,46,0.7)] backdrop-blur-xl border border-white/5 p-6 rounded-xl flex flex-col h-full shadow-[0_0_20px_rgba(221,183,255,0.05)]">
        {/* Header Title */}
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-[#ddb7ff]">
            filter_list
          </span>
          Filters
        </h3>

        {/* Scrollable Content Container */}
        <div className="space-y-6 overflow-y-auto pr-1 no-scrollbar flex-1">
          {/* Keyword Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#988d9f]">
              Keyword
            </label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4354]">
                search
              </span>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#1f1929] border border-[#4d4354] rounded-lg pl-10 pr-10 py-2.5 focus:border-[#ddb7ff] focus:ring-1 focus:ring-[#ddb7ff] outline-none transition-all text-white placeholder-gray-500 text-sm"
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
          </div>

          {/* Location Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#988d9f]">
              Location
            </label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4354]">
                location_on
              </span>
              <input
                type="text"
                placeholder="Search location or city..."
                value={locationQuery}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-[#1f1929] border border-[#4d4354] rounded-lg pl-10 pr-10 py-2.5 focus:border-[#ddb7ff] focus:ring-1 focus:ring-[#ddb7ff] outline-none transition-all text-white placeholder-gray-500 text-sm"
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
          </div>

          {/* Category Chips */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#988d9f]">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${
                      isSelected
                        ? "bg-[#5de6ff] text-[#00363e] border-[#5de6ff]"
                        : "bg-[#2e2738] text-[#cfc2d6] border-[#4d4354] hover:border-[#ddb7ff]/50"
                    }`}
                  >
                    {cat.toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#988d9f]">
                Price Range
              </label>
              <span className="text-xs font-bold text-[#ddb7ff]">
                {Number(priceRange) === 0
                  ? "Free"
                  : `IDR 0 - IDR ${Number(priceRange).toLocaleString()}`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20000000"
              step="100000"
              value={priceRange}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full h-1.5 bg-[#393244] rounded-lg appearance-none cursor-pointer accent-[#ddb7ff]"
            />
          </div>

          {/* Date Options (English UI) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#988d9f]">Date</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleDateChange("this-week")}
                className={`w-full py-2.5 text-center rounded-lg text-xs font-medium border transition-all ${
                  dateFilter === "this-week"
                    ? "bg-[#ddb7ff]/20 border-[#ddb7ff] text-[#ddb7ff] font-bold"
                    : "bg-[#2e2738] border-[#4d4354] text-[#cfc2d6] hover:border-[#ddb7ff]/30"
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => handleDateChange("this-month")}
                className={`w-full py-2.5 text-center rounded-lg text-xs font-medium border transition-all ${
                  dateFilter === "this-month"
                    ? "bg-[#ddb7ff]/20 border-[#ddb7ff] text-[#ddb7ff] font-bold"
                    : "bg-[#2e2738] border-[#4d4354] text-[#cfc2d6] hover:border-[#ddb7ff]/30"
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => handleDateChange("next-3-months")}
                className={`w-full py-2.5 text-center rounded-lg text-xs font-medium border transition-all ${
                  dateFilter === "next-3-months"
                    ? "bg-[#ddb7ff]/20 border-[#ddb7ff] text-[#ddb7ff] font-bold"
                    : "bg-[#2e2738] border-[#4d4354] text-[#cfc2d6] hover:border-[#ddb7ff]/30"
                }`}
              >
                Next 3 Months
              </button>
            </div>
          </div>
        </div>

        {/* Reset Button Section */}
        <button
          onClick={() => setSearchParams(new URLSearchParams())}
          className="w-full mt-6 py-3 rounded-lg bg-[#393244] hover:bg-[#3d3648] text-white font-bold transition-all flex items-center justify-center gap-2 border border-white/5 text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Reset All Filters
        </button>
      </div>
    </aside>
  );
}
