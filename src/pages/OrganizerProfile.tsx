import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Navbar from "../components/General/Navbar";
import { EventCard } from "../components/General/EventCard";
import type { Organizer } from "../types/organizer";
import { getOrganizerProfile } from "../services/organizer.service";

export default function OrganizerProfile() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "reviews">(
    "reviews",
  );

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true);
        if (id) {
          const result = await getOrganizerProfile(id);
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching organizer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizerData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171021] text-[#ddb7ff]">
        Loading...
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171021] text-[#ffafd3]">
        Organizer Not Found
      </div>
    );

  const now = new Date();
  const upcomingEvents =
    data.organizedEvents?.filter((e: any) => new Date(e.startDate) > now) || [];
  const pastEvents =
    data.organizedEvents?.filter((e: any) => new Date(e.startDate) <= now) ||
    [];

  const renderEventList = (events: any[]) => {
    if (events.length === 0)
      return (
        <div className="text-center py-20 text-[#cfc2d6] bg-[#231d2e]/30 border border-dashed border-[#4d4354]/40 rounded-2xl">
          <span className="material-symbols-outlined text-4xl mb-2 text-[#cfc2d6]/50">
            calendar_today
          </span>
          <p className="text-sm">No events listed under this section yet.</p>
        </div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen font-sans">
      <Navbar />
      <main className="max-w-[1440px] mx-auto pt-16 pb-24">
        {/* Hero Section */}
        <section className="relative">
          <div className="h-[300px] w-full relative bg-[#231d2e]">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
              alt="Cover"
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
            <div className="flex items-end gap-6 mb-8">
              <div className="w-40 h-40 rounded-3xl border-4 border-[#171021] bg-[#3d3648] overflow-hidden">
                <img
                  src={
                    data.organizer.profilePic ||
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400"
                  }
                  alt={data.organizer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-5xl font-extrabold text-[#ddb7ff] mb-4">
                {data.organizer.name}
              </h1>
            </div>

            <div className="bg-[rgba(35,29,46,0.7)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 flex gap-12">
              <div className="flex flex-col">
                <span className="text-xs uppercase text-[#988d9f]">Events</span>
                <span className="text-2xl font-bold">{data.eventsCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase text-[#988d9f]">
                  Reviews
                </span>
                <span className="text-2xl font-bold">
                  {data.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="max-w-6xl mx-auto px-6 mt-12">
          <div className="flex gap-8 border-b border-[#4d4354]/40 mb-8 overflow-x-auto">
            {(["upcoming", "past", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-semibold capitalize ${activeTab === tab ? "text-[#ddb7ff] border-b-4 border-[#ddb7ff]" : "text-[#cfc2d6]"}`}
              >
                {tab === "reviews" ? "Reviews" : `${tab} Events`}
              </button>
            ))}
          </div>

          {activeTab === "upcoming" && renderEventList(upcomingEvents)}
          {activeTab === "past" && renderEventList(pastEvents)}
          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#231d2e] rounded-xl p-6 border border-[#4d4354]/30"
                >
                  <p className="text-sm text-[#cfc2d6] mb-4">
                    {review.comment}
                  </p>
                  <p className="text-xs font-bold text-[#ddb7ff]">
                    Attended: {review.transaction.event.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
