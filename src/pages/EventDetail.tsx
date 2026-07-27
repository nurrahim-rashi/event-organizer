import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useEventDetail } from "../hooks/event/useEventDetail";
import { userAuth } from "../stores/useAuth";
import { getOrganizerProfile } from "../services/organizer.service";
import { axiosInstance } from "../api/axios"; // Pastikan import ini
import { toTitleCase } from "../utils/toTitleCase";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";
import { OrganizerSection } from "../components/EventDetail/OrganizerSection";
import { TicketSelection } from "../components/EventDetail/TicketSelection";
import toast from "react-hot-toast";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = userAuth();

  // State baru untuk menampung data user yang SEBENARNYA (dari database)
  const [currentUser, setCurrentUser] = useState(user);

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [usePoints, setUsePoints] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [moreEvents, setMoreEvents] = useState<any[]>([]);

  const { event, loading } = useEventDetail(id ?? "");
  const isOwner = user && event && user.id === event.organizerId;

  // FETCH DATA USER LENGKAP SAAT MOUNT
  useEffect(() => {
    const fetchFullProfile = async () => {
      if (user) {
        try {
          // Ganti endpoint ini sesuai dengan endpoint backend kamu untuk get detail user/profile
          const res = await axiosInstance.get(`/users/profile`);
          setCurrentUser(res.data.data || res.data); // Update state dengan data terbaru
        } catch (error) {
          console.error("Gagal fetch profile:", error);
        }
      }
    };
    fetchFullProfile();
  }, [user]);

  useEffect(() => {
    if (event?.organizerId) {
      getOrganizerProfile(event.organizerId.toString())
        .then((data: any) => setMoreEvents(data.organizedEvents || []))
        .catch(console.error);
    }
  }, [event?.organizerId]);

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
            {/* ... section foto & organizer sama ... */}
            <div className="w-full h-[400px] rounded-xl overflow-hidden relative shadow-lg">
              <img
                src={event.bannerImage}
                className="w-full h-full object-cover"
                alt={event.name}
              />
            </div>
            <h1 className="text-4xl font-black">{event.name}</h1>
            <OrganizerSection
              event={event}
              toTitleCase={toTitleCase}
              isOwner={!!isOwner}
              moreEvents={moreEvents}
            />
          </div>
          <div className="lg:col-span-4">
            {/* PENTING: Gunakan currentUser (yang sudah difetch) bukan user dari store */}
            <TicketSelection
              user={currentUser}
              tickets={event.ticketTypes}
              coupons={currentUser?.coupons || []}
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
