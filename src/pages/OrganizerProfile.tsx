import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Navbar from "../components/layout/Navbar";
import type { Organizer } from "../types/type";
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

  const onShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="bg-[#171021] text-[#ddb7ff] min-h-screen flex items-center justify-center font-sans">
        <div className="animate-pulse text-lg font-semibold">
          Loading Organizer Profile...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#171021] text-[#ffafd3] min-h-screen flex items-center justify-center font-sans">
        <div className="text-lg font-semibold">Organizer Not Found</div>
      </div>
    );
  }

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen font-sans">
      <Navbar />

      <main className="max-w-[1440px] mx-auto pt-16 min-h-screen pb-24">
        {/* Hero Section */}
        <section className="relative">
          {/* Cover Photo */}
          <div className="h-[300px] w-full relative overflow-hidden bg-[#231d2e]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#171021] to-transparent z-10"></div>
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
              alt="Cover"
            />
          </div>

          {/* Profile Info & Bio */}
          <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
              {/* Profile Picture */}
              <div className="w-40 h-40 rounded-3xl border-4 border-[#171021] bg-[#3d3648] overflow-hidden shadow-2xl shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={
                    data.organizer.profilePic ||
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400"
                  }
                  alt={data.organizer.name}
                />
              </div>

              {/* Bio Details */}
              <div className="flex-1 pb-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#ddb7ff] tracking-tight">
                  {data.organizer.name}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pb-2 w-full md:w-auto justify-start md:justify-end">
                <button
                  onClick={onShare}
                  className="p-2.5 border border-[#988d9f]/40 rounded-xl text-[#cfc2d6] hover:bg-[#3d3648] transition-colors cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-[rgba(35,29,46,0.7)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 flex flex-wrap gap-6 md:gap-12 items-center">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#988d9f]">
                  Events hosted
                </span>
                <span className="text-2xl font-bold text-[#eadef6]">
                  {data.eventsCount}
                </span>
              </div>
              <div className="hidden sm:block h-10 w-px bg-[#4d4354]/50"></div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#988d9f]">
                  Reviews
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#eadef6]">
                    {data.averageRating.toFixed(1)}
                  </span>
                  <span
                    className="material-symbols-outlined text-[#ffafd3]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="max-w-6xl mx-auto px-6 mt-12">
          <div className="flex gap-8 border-b border-[#4d4354]/40 mb-8 overflow-x-auto no-scrollbar">
            {(["upcoming", "past", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-semibold whitespace-nowrap transition-all cursor-pointer capitalize ${
                  activeTab === tab
                    ? "text-[#ddb7ff] border-b-4 border-[#ddb7ff]"
                    : "text-[#cfc2d6] hover:text-[#eadef6]"
                }`}
              >
                {tab === "reviews" ? "Reviews" : `${tab} Events`}
              </button>
            ))}
          </div>

          {/* Conditional Content: Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-12">
              {/* Ratings Summary Dashboard */}
              <div className="bg-[rgba(35,29,46,0.7)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 flex flex-col md:flex-row gap-12 items-center">
                <div className="text-center md:text-left">
                  <div className="text-5xl font-extrabold text-[#eadef6] mb-1">
                    {data.averageRating.toFixed(1)}
                  </div>
                  <div className="flex gap-0.5 text-[#ffafd3] mb-2 justify-center md:justify-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-[#cfc2d6]">
                    {data.totalReviews.toLocaleString()} reviews
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="flex-1 w-full flex flex-col gap-3">
                  {data.ratingDistribution.map((dist) => (
                    <div key={dist.stars} className="flex items-center gap-4">
                      <span className="text-xs text-[#988d9f] w-12">
                        {dist.stars} star
                      </span>
                      <div className="flex-1 h-2 bg-[#393244] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ddb7ff]"
                          style={{ width: `${dist.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-[#cfc2d6] w-8">
                        {dist.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Review Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#231d2e] rounded-xl p-6 border border-[#4d4354]/30 flex flex-col gap-4 shadow-lg"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#393244] overflow-hidden shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              review.user.profilePic ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                            }
                            alt={review.user.name}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#eadef6]">
                            {review.user.name}
                          </div>
                          <div className="text-xs text-[#cfc2d6]">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-[#ffafd3] shrink-0">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#cfc2d6] leading-relaxed flex-1">
                      {review.comment}
                    </p>
                    <div className="mt-auto pt-4 border-t border-[#4d4354]/20 flex items-center gap-2 text-xs font-semibold text-[#ddb7ff]">
                      <span className="material-symbols-outlined text-[16px]">
                        confirmation_number
                      </span>
                      Attended: {review.transaction.event.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== "reviews" && (
            <div className="text-center py-20 text-[#cfc2d6] bg-[#231d2e]/30 border border-dashed border-[#4d4354]/40 rounded-2xl">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#cfc2d6]/50">
                calendar_today
              </span>
              <p className="text-sm">
                No events listed under this section yet.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
