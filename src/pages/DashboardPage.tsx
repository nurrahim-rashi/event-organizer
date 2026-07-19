import React, { useState, useEffect } from "react";
import { userAuth } from "../stores/useAuth";
import { Link } from "react-router";
// import axios from "axios";
import Navbar from "../components/General/Navbar";
import EventStatistics from "../components/Profile/EventStatistics";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";

interface DashboardStats {
  activeEventCounts?: number;
  ticketsSold?: number;
  totalEarnings?: number;
  totalAvailableEvents?: number;
  totalTicketsOwned?: number;
  managedEvents?: Array<{
    id: number;
    name: string;
    startDate: string;
  }>;
  upcomingTickets?: Array<{
    id: number;
    event: {
      id: number;
      name: string;
      startDate: string;
      location: string;
    };
  }>;
  recommendedEvents?: Array<{
    id: number;
    name: string;
    startDate: string;
    location: string;
    price?: number;
  }>;
}

interface Transaction {
  id: number;
  userId: number;
  eventId: number;
  status: "WAITING_PAYMENT" | "DONE" | "REJECTED"; // Sesuaikan dengan tipe enum di backend
  totalPrice: number;
  paymentProof: string | null;
  createdAt: string;
  event?: {
    name: string;
  };
}

interface ActionButtonsProps {
  transactionId: number;
  accessToken: string;
  onSuccess: () => void;
}

const TransactionActionButtons: React.FC<ActionButtonsProps> = ({
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
      const response = await axiosInstance.patch(
        `/transactions/${transactionId}/status`,
        { newStatus: status },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (response.data.success) {
        toast.success(
          response.data.message || `Transaction successfully ${confirmText}ed!`,
        );
        onSuccess();
      }
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
  console.log("User yang login saat ini", user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({});
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchDashboardData = async () => {
    if (!user?.accessToken) return;

    try {
      setLoading(true);
      console.log("1. Sedang memanggil API stats...");

      const response = await axiosInstance.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      console.log("Response Data dari backend:", response.data);
      setStats(response.data.data);

      const eventIdToFetch =
        selectedEventId || response.data.data.managedEvents?.[0]?.id;

      if (eventIdToFetch) {
        const txResponse = await axiosInstance.get(
          `/transactions/event/${eventIdToFetch}/incoming`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          },
        );
        setTransactions(txResponse.data.data);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed to retrieve dashboard statistic data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0a16] text-white flex items-center justify-center">
        <p className="text-purple-400 animate-pulse text-lg font-semibold">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  // Pelindung jika user belum login atau loading state global belum selesai
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
              <button className="bg-linear-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all text-sm">
                + Create New Event
              </button>
            </Link>
          </div>

          {/* Kartu Analitik Angka Utama (EO Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(stats.totalEarnings ?? 0)}
              </p>
            </div>
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Tickets Sold
              </p>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {stats.ticketsSold ?? 0}{" "}
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
                {stats.activeEventCounts ?? 0}{" "}
                <span className="text-xs text-gray-500 font-normal">live</span>
              </p>
            </div>
          </div>

          {/*STATISTICS*/}
          <div className="space-y-4 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                Event Performance Analytics
              </h3>

              <div className="w-full sm:w-72">
                <select
                  className="w-full bg-[#161224] border border-purple-900/30 text-purple-300 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-600 transition-all cursor-pointer"
                  value={selectedEventId || ""}
                  onChange={(e) =>
                    setSelectedEventId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                >
                  <option value="" disabled>
                    -- Select an Event to View Stats --
                  </option>
                  {/* Menggunakan stats?.events berdasarkan struktur objek 'stats' kamu */}
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

            {selectedEventId ? (
              <EventStatistics eventId={selectedEventId} />
            ) : (
              <div className="p-10 text-center bg-purple-950/10 rounded-2xl border border-dashed border-purple-900/20 text-purple-300/60 text-sm">
                Please select an event from the dropdown above to visualize its
                sales and ticket analytics.
              </div>
            )}
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
                        {/*NAMA EVENT*/}
                        <td className="py-4 font-medium text-white pl-2">
                          {event.name}
                        </td>

                        {/*TANGGA: EVENT*/}
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

                        <td className="py-4">0</td>

                        <td className="py-4 text-right pr-2">
                          <button>Delete</button>
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

          <div className="bg-[#161224] border border-purple-900/20 rounded-2xl p-6 shadow-xl mt-8">
            <h3 className="text-lg font-bold mb-4 text-gray-200">
              Incoming Transactions & Payment Proofs
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
                        No incoming transactions found.
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

  // JIKA LOGIN SEBAGAI: CUSTOMER / USER BIASA
  return (
    <div className="min-h-screen bg-[#0d0a16] text-white p-6 md:p-10">
      {" "}
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Dashboard Customer */}
        <div className="border-b border-purple-950 pb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 mt-16">
            Welcome Back, {user.name}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Ready for your next experience? Track your tickets and saved events
            here.
          </p>
        </div>

        {/* Kartu Ringkasan Aktivitas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
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
              className="text-xs text-purple-400 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                Active Events
              </p>
              <p className="text-3xl font-bold text-gray-100 mt-1">
                {stats.totalAvailableEvents ?? 0}
              </p>
            </div>
            <Link
              to="/favorites"
              className="text-xs text-purple-400 hover:underline"
            >
              Browse &rarr;
            </Link>
          </div>
        </div>

        {/*RECOMMENED EVENTS*/}
        <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <h3 className="text-lg font-bold text-white mb-4">
            Recommended for you
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stats.recommendedEvents && stats.recommendedEvents.length > 0 ? (
              stats.recommendedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#161224] border border-purple-900/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-white text-base">
                      {event.name}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1">
                      {event.location}
                    </p>
                    <p className="text-purple-400 text-xs mt-3 font-medium">
                      {new Date(event.startDate).toLocaleDateString("id-ID", {
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
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-md shadow-purple-900/20"
                    >
                      Buy Ticket
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-8 px-4 bg-[#161224]/50 border border-dashed border-purple-900/20 rounded-2xl">
                <p className="text-sm text-gray-500 italic">
                  No recommended events available right now.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* List Tiket Terdekat (Upcoming Events) */}
        <div className="bg-[#161224] border border-purple-900/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-200">
            Your Upcoming Events
          </h3>

          <div className="space-y-4">
            {/* EVENT CARD */}
            {stats.upcomingTickets && stats.upcomingTickets.length > 0 ? (
              stats.upcomingTickets.map((ticket) => {
                const eventDate = new Date(ticket.event.startDate);
                const day = eventDate.getDate();

                const month = eventDate
                  .toLocaleDateString("id-ID", { month: "short" })
                  .toUpperCase();

                return (
                  <div
                    key={ticket.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1e1932] border border-purple-950 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      {/*KOTAK TANGGAL*/}
                      <div className="bg-purple-600/20 text-purple-400 p-3 rounded-xl text-center font-bold text-xs w-14">
                        {month} <span className="block text-lg">{day}</span>
                      </div>

                      {/*EVENT DETAIL*/}
                      <div>
                        <h4 className="font-semibold text-white">
                          {ticket.event.name}
                        </h4>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {ticket.event.location}
                        </p>
                      </div>
                    </div>

                    {/*BUTTON ACTION*/}
                    <button className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all mt-4 sm:mt-0">
                      View ticket QR
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-4">
                You don't have any upcoming events
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
