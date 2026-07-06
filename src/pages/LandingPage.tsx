import Navbar from "../components/layout/Navbar";
import Hero from "../components/LandingPage/Hero";
import UpcomingEvents from "../components/LandingPage/UpcomingEvents";
import Footer from "../components/layout/Footer";
import CTA from "../components/LandingPage/CTA";

export default function LandingPage() {
  return (
    <div className="bg-[#171021] text-[#eadef6] font-sans selection:bg-[#ddb7ff]/20 min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <UpcomingEvents />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
