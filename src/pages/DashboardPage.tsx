import React, { useState, useEffect } from "react";
import { userAuth } from "../stores/useAuth";
import { Link } from "react-router";
import Navbar from "../components/General/Navbar";
import EventStatistics from "../components/Profile/EventStatistics";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { updateTransactionStatusMailer } from "../services/transaction.service";
import type { TransactionActionProps } from "../types/transaction-status";

interface DashboardStats {
  activeEventsCount?: number;
  ticketsSold?: number;
  totalEarnings?: number;
  managedEvents?: Array<{
    id: number;
    name: string;
    startDate: string;
    ticketsSold?: number;
  }>;
  totalAvailableEvents?: number;
  totalTicketsOwned?: number;
  upcomingEvents?: Array<{
    id: number;
    name?: string;
    startDate?: string;
    location?: string;
    description?: string;
    event?: {
      id: number;
      name: string;
      startDate: string;
      location: string;
      bannerUrl?: string;
    };
  }>;
  recommendedEvents?: Array<{
    id: number;
    name: string;
    startDate: string;
    location: string;
    price?: number;
    bannerUrl?: string;
  }>;
}

interface Transaction {
  id: number;
  userId: number;
  eventId: number;
  status: "WAITING_PAYMENT" | "DONE" | "REJECTED";
  totalPrice: number;
  paymentProof: string | null;
  createdAt: string;
  event?: {
    name: string;
  };
}

const TransactionActionButtons: React.FC<TransactionActionProps> = ({
  transactionId,
  accessToken,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (status: "DONE" | "REJECTED") => {
    const confirmText = status === "DONE" ? "accept" : "reject";
    if (
      !window.confirm(
        `Are you sure you want to ${confirmText} this transaction?`,
      )
    )
      return;

    setIsLoading(true);
    try {
      const response = await updateTransactionStatusMailer({
        transactionId,
        status,
        accessToken,
      });

      toast.success(
        response?.data?.message || response?.message || `Transaction successfully ${confirmText}ed!`,
      );
      onSuccess?.();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => handleAction("DONE")}
        disabled={isLoading}
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors"
      >
        {isLoading ? "..." : "Accept"}
      </button>
      <button
        onClick={() => handleAction("REJECTED")}
        disabled={isLoading}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors"
      >
        Reject
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = userAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({});
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // null = Semua Event
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 🔥 STATE BARU: Menampung nominal dinamis kiriman dari komponen grafik
  const [dynamicTotals, setDynamicTotals] = useState<{
    ticketsSold: number;
    totalEarnings: number;
  } | null>(null);

  // 1. Fetch data statistik global (Hanya dipanggil sekali saat load awal)
  const fetchDashboardData = async () => {
    if (!user?.accessToken) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get("/dashboard/stats", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      console.log("RESPONSE DASHBOARD STATS:", response.data.data);
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to retrieve dashboard statistic data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.accessToken]);

  // 🔥 2. EFFECT BARU: Re-fetch transaksi otomatis setiap kali user mengubah dropdown event
  useEffect(() => {
    if (!user || user.role === "CUSTOMER" || user.role === "USER") return;
    const fetchIncomingTransactions = async () => {
      if (!user?.accessToken) return;

      // Jika selectedEventId null (All Events), default ke data transaksi event pertama milik EO tersebut
      const eventIdToFetch = selectedEventId || stats.managedEvents?.[0]?.id;

      if (!eventIdToFetch) {
        setTransactions([]);
        return;
      }

      try {
        const txResponse = await axiosInstance.get(
          `/transactions/event/${eventIdToFetch}/incoming`,
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        );
        setTransactions(txResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch incoming transactions", error);
      }
    };

    if (stats.managedEvents) {
      fetchIncomingTransactions();
    }
  }, [selectedEventId, stats.managedEvents, user?.accessToken]);

  // 🔥 3. LOGIKA SINKRONISASI ANGKA KARTU UTAMA
  const displayEarnings = dynamicTotals
    ? dynamicTotals.totalEarnings
    : (stats.totalEarnings ?? 0);
  const displayTickets = dynamicTotals
    ? dynamicTotals.ticketsSold
    : (stats.ticketsSold ?? 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0a16] text-white flex items-center justify-center">
        <p className="text-purple-400 animate-pulse text-lg font-semibold">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0a16] text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading your dashboard or please login first...
        </p>
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0d0a16] text-white p-6 md:p-10">
        <Navbar />
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Dashboard EO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-purple-950 pb-6 mt-16">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
                Organizer Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Welcome back, {user?.name || "User"}.
              </p>
            </div>
            <Link to="/events/create">
              <button className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all text-sm">
                + Create New Event
              </button>
            </Link>
          </div>

          {/* Kartu Analitik Angka Utama (Menggunakan nilai display yang dinamis) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(displayEarnings)}
              </p>
            </div>
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Tickets Sold
              </p>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {displayTickets}{" "}
                <span className="text-xs text-gray-500 font-normal">
                  tickets
                </span>
              </p>
            </div>
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Active Events
              </p>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {stats.activeEventsCount ?? 0}{" "}
                <span className="text-xs text-gray-500 font-normal">live</span>
              </p>
            </div>
          </div>

          {/* SECTION STATISTICS */}
          <div className="space-y-4 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                Event Performance Analytics
              </h3>
              <div className="w-full sm:w-72">
                <select
                  className="w-full bg-[#161224] border border-purple-900/30 text-purple-300 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-600 transition-all cursor-pointer"
                  value={selectedEventId || ""}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    setSelectedEventId(val);
                    if (val === null) setDynamicTotals(null); // Reset ke total global jika pilih All Events
                  }}
                >
                  {/* Diubah menjadi opsi All Events yang valid (tidak di-disabled) */}
                  <option value="">-- All Managed Events --</option>
                  {stats?.managedEvents?.map((evt: any) => (
                    <option
                      key={evt.id}
                      value={evt.id}
                      className="bg-[#0d0a16]"
                    >
                      {evt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Render langsung komponen statistik dengan menyuntikkan callback onFetchSuccess */}
            <EventStatistics
              eventId={selectedEventId}
              onFetchSuccess={(totals) => setDynamicTotals(totals)}
            />
          </div>

          {/* Tabel Manajemen Event Kreator */}
          <div className="bg-[#161224] border border-purple-900/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-200">
              Your Managed Events
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-950 text-purple-300/70 text-xs uppercase tracking-wider">
                    <th className="pb-3 pl-2">Event Name</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Tickets Sold</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-300 divide-y divide-purple-950/40">
                  {stats.managedEvents && stats.managedEvents.length > 0 ? (
                    stats.managedEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-purple-950/40 text-sm text-gray-300"
                      >
                        <td className="py-4 font-medium text-white pl-2">
                          {event.name}
                        </td>
                        <td>
                          {new Date(event.startDate).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="py-4">{event.ticketsSold || 0}</td>
                        <td className="py-4 text-right pr-2">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/events/${event.id}/attendees`)
                              }
                              className="rounded-xl border border-purple-500/40 bg-purple-600/20 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-600 hover:text-white"
                            >
                              View Attendees
                            </button>
                            <button className="rounded-xl border border-red-500/30 bg-red-600/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-600 hover:text-white">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500 italic"
                      >
                        You haven't managed any events yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Transaksi Masuk */}
          <div className="bg-[#161224] border border-purple-900/20 rounded-2xl p-6 shadow-xl mt-8">
            <h3 className="text-lg font-bold mb-4 text-gray-200">
              Incoming Transactions & Payment Proofs
              <span className="text-xs font-normal text-purple-400 ml-2">
                (
                {selectedEventId
                  ? "Filtered"
                  : `Showing: ${stats.managedEvents?.[0]?.name || "First Event"}`}
                )
              </span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-950 text-purple-300/70 text-xs uppercase tracking-wider">
                    <th className="pb-3 pl-2">TX ID</th>
                    <th className="pb-3">Event Name</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Payment Proof</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-300 divide-y divide-purple-950/40">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <tr
                        key={tx.id}
                        className="border-b border-purple-950/40 text-sm text-gray-300"
                      >
                        <td className="py-4 pl-2 font-mono text-xs text-purple-300">
                          #{tx.id}
                        </td>
                        <td className="py-4 font-medium text-white">
                          {tx.event?.name || `Event ID: ${tx.eventId}`}
                        </td>
                        <td className="py-4">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(tx.totalPrice)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              tx.status === "DONE"
                                ? "bg-green-950 text-green-400 border border-green-900"
                                : tx.status === "REJECTED"
                                  ? "bg-red-950 text-red-400 border border-red-900"
                                  : "bg-yellow-950 text-yellow-400 border border-yellow-900"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4">
                          {tx.paymentProof ? (
                            <a
                              href={tx.paymentProof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 underline text-xs"
                            >
                              View Proof Image
                            </a>
                          ) : (
                            <span className="text-gray-500 italic text-xs">
                              No proof uploaded
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right pr-2">
                          {tx.status !== "DONE" && tx.status !== "REJECTED" ? (
                            <TransactionActionButtons
                              transactionId={tx.id}
                              accessToken={user.accessToken}
                              onSuccess={fetchDashboardData}
                            />
                          ) : (
                            <span className="text-xs text-gray-500 italic">
                              No action required
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-gray-500 italic"
                      >
                        No incoming transactions found for this event.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  {
    /* JIKA LOGIN SEBAGAI CUSTOMER */
  }
  return (
    <div className="min-h-screen bg-[#0d0a16] text-white p-6 md:p-10">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Welcome */}
        <div className="border-b border-purple-950 pb-6 mt-16">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Welcome Back, {user.name}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Ready for your next experience? Track your tickets and explore upcoming events here.
          </p>
        </div>

        {/* Ringkasan Kartu Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1: Tiket Dimiliki */}
          <div className="bg-[#161224] border border-purple-900/30 hover:border-purple-600/40 transition-all rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Your Tickets
              </p>
              <p className="text-3xl font-bold text-gray-100 mt-1">
                {stats.totalTicketsOwned ?? 0}
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white px-3.5 py-2 rounded-xl transition-all"
            >
              My Tickets &rarr;
            </Link>
          </div>

          {/* Card 2: Event Tersedia */}
          <div className="bg-[#161224] border border-purple-900/30 hover:border-purple-600/40 transition-all rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Active Events
              </p>
              <p className="text-3xl font-bold text-gray-100 mt-1">
                {stats.activeEventsCount ?? stats.totalAvailableEvents ?? 0}
              </p>
            </div>
            <Link
              to="/events"
              className="text-xs font-semibold bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white px-3.5 py-2 rounded-xl transition-all"
            >
              Browse Events &rarr;
            </Link>
          </div>
        </div>

        {/* SECTION: UPCOMING EVENTS (Tiket Pengguna yang Akan Datang) */}
        <div className="bg-[#161224] border border-purple-900/20 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-200">
              Your Upcoming Events
            </h3>
            {stats.upcomingEvents && stats.upcomingEvents.length > 0 && (
              <Link to="/transactions" className="text-xs text-purple-400 hover:underline">
                View All Transactions &rarr;
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {stats.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map((item) => {
                const name = item.event?.name || item.name || "Unnamed Event";
                const location = item.event?.location || item.location || "Location TBD";
                const rawDate = item.event?.startDate || item.startDate;

                const eventDate = rawDate ? new Date(rawDate) : null;
                const day = eventDate ? eventDate.getDate() : "-";
                const month = eventDate ? eventDate.toLocaleDateString("id-ID", { month: "short" }).toUpperCase() : "";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1e1932] border border-purple-950 hover:border-purple-800/50 rounded-xl transition-all gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Box Tanggal */}
                      <div className="bg-purple-600/20 text-purple-400 p-3 rounded-xl text-center font-bold text-xs w-14 shrink-0">
                        {month} <span className="block text-lg">{day}</span>
                      </div>
                      
                      {/* Info Event */}
                      <div>
                        <h4 className="font-semibold text-white text-base">
                          {name}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                          📍 {location}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => navigate(`/tickets/${item.id}`)}
                      className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-xs font-semibold px-4 py-2.5 rounded-xl text-white transition-all shadow-md shadow-purple-900/30 shrink-0 self-start sm:self-auto"
                    >
                      View Ticket QR
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 px-4 bg-[#120e1c]/50 border border-dashed border-purple-900/30 rounded-xl">
                <p className="text-sm text-gray-400">
                  You don't have any upcoming event tickets.
                </p>
                <Link 
                  to="/events" 
                  className="inline-block mt-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-900/20"
                >
                  Explore Events
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: RECOMMENDED EVENTS */}
        <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stats.recommendedEvents && stats.recommendedEvents.length > 0 ? (
              stats.recommendedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#120e1c] border border-purple-900/20 hover:border-purple-600/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all"
                >
                  <div>
                    <h4 className="font-semibold text-white text-base line-clamp-1">
                      {event.name}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1">
                      📍 {event.location}
                    </p>
                    <p className="text-purple-400 text-xs mt-3 font-medium flex items-center gap-1">
                      📅 {new Date(event.startDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-purple-950/40">
                    <span className="text-sm font-bold text-gray-200">
                      {event.price === 0
                        ? "Free"
                        : event.price
                          ? `Rp ${event.price.toLocaleString("id-ID")}`
                          : "Tickets Available"}
                    </span>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-xs bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-md shadow-purple-900/20"
                    >
                      Buy Ticket
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-8 px-4 bg-[#120e1c]/50 border border-dashed border-purple-900/20 rounded-2xl">
                <p className="text-sm text-gray-500 italic">
                  No recommended events available right now.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
