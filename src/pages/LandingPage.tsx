import Navbar from "../components/General/Navbar";
import Hero from "../components/LandingPage/Hero";
import UpcomingEvents from "../components/LandingPage/UpcomingEvents";
import Footer from "../components/General/Footer";
import CTA from "../components/LandingPage/CTA";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useSearchParams, useNavigate } from "react-router";
import { useGetEvents } from "../hooks/event/useGetEvents";

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [category, setCategory] = useQueryState(
    "category",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [location, setLocation] = useQueryState("location", {
    defaultValue: "",
  });
  const { data: eventResponse } = useGetEvents({
    page: 1,
    sortBy: "startDate",
    sortOrder: "desc",
  });

  const events = eventResponse?.data || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category.length > 0)
      params.set("category", category.join(","));
    if (location) params.append("location", location);

    navigate(`/events?${params.toString()}`);
  };

  return (
    <div className="bg-[#171021] min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
          setCategory={(cat) => setCategory([cat])}
          location={location}
          setLocation={setLocation}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          upcomingEvents={events}
        />
        <UpcomingEvents />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
