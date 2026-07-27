import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useEventDetail } from "../hooks/event/useEventDetail";
import { userAuth } from "../stores/useAuth";
import { getOrganizerProfile } from "../services/organizer.service";
import { toTitleCase } from "../utils/toTitleCase";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";
import { OrganizerSection } from "../components/EventDetail/OrganizerSection";
import { TicketSelection } from "../components/EventDetail/TicketSelection";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = userAuth();

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [usePoints, setUsePoints] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [moreEvents, setMoreEvents] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);

  const { event, loading } = useEventDetail(id ?? "");
  const isOwner = user && event && user.id === event.organizerId;

  useEffect(() => {
    if (event?.organizerId) {
      getOrganizerProfile(event.organizerId.toString())
        .then((data: any) => setMoreEvents(data.organizedEvents || []))
        .catch(console.error);
    }
  }, [event?.organizerId]);

  // Fetch ulang data user biar dapet activePoints dan coupons asli dari DB
  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        try {
          const res = await axiosInstance.get(`/users/${user.id}`);
          setUserDetails(res.data.data);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      }
    };
    fetchUser();
  }, [user?.id]);

  // Gunakan data segar jika ada, kalau belum fallback ke data dari store login
  const currentUser = userDetails || user;
  // Backend lo pakai "activePoints" di response getUserService, jadi kita map ke "points"
  const currentPoints = userDetails?.activePoints ?? currentUser?.points ?? 0;
  const currentCoupons = userDetails?.coupons ?? currentUser?.coupons ?? [];

  const handleApplyVoucher = () => {
    const foundVoucher = (event as any)?.vouchers?.find(
      (v: any) => v.code.toUpperCase() === voucherCode.trim().toUpperCase(),
    );
    if (!foundVoucher) return toast.error("Invalid voucher code.");
    if (new Date() > new Date(foundVoucher.endDate))
      return toast.error("Voucher expired.");
    setAppliedVoucher(foundVoucher);
    toast.success("Voucher applied!");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#171021] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!event)
    return <div className="text-white text-center pt-20">Event Not Found</div>;

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen pb-16">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <Breadcrumb
          items={[{ label: "Events", path: "/events" }, { label: event.name }]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-6">
              <div className="w-full h-[400px] rounded-xl overflow-hidden relative shadow-lg">
                <img
                  src={event.bannerImage}
                  className="w-full h-full object-cover"
                  alt={event.name}
                />
              </div>
              <h1 className="text-4xl font-black">{event.name}</h1>
            </section>
            <OrganizerSection
              event={event}
              toTitleCase={toTitleCase}
              isOwner={!!isOwner}
              moreEvents={moreEvents}
            />
          </div>
          <div className="lg:col-span-4">
            <TicketSelection
              user={{ ...currentUser, points: currentPoints }}
              tickets={event.ticketTypes}
              coupons={currentCoupons}
              voucherCode={voucherCode}
              setVoucherCode={setVoucherCode}
              appliedVoucher={appliedVoucher}
              setAppliedVoucher={setAppliedVoucher}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              usePoints={usePoints}
              setUsePoints={setUsePoints}
              handleApplyVoucher={handleApplyVoucher}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
