import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/LandingPage/Hero";
import UpcomingEvents from "../components/LandingPage/UpcomingEvents";
import Footer from "../components/layout/Footer";
import CTA from "../components/LandingPage/CTA";

export default function LandingPage() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
  });

  const handleHeroFilter = (incomingFilters: {
    search: string;
    location: string;
    category: string;
  }) => {
    setFilters(incomingFilters);
  };

  return (
    <div className="bg-[#171021] text-[#eadef6] font-sans selection:bg-[#ddb7ff]/20 min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero onFilterChange={handleHeroFilter} />
        <UpcomingEvents />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
