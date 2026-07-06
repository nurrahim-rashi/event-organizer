import React, { useState, useEffect } from "react";
import { userAuth } from "../stores/useAuth"; // Sesuaikan dengan store kelompokmu
import { Link } from "react-router";
import axios from "axios";

interface DashboardStats {
    activeEventCounts?: number;
    ticketsSold?: number;
    totalEarnings?: number;
    totalTicketsOwned?: number;
}

export default function DashboardPage() {
  const { user } = userAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({})

  useEffect(() => {
    const fetchDashboardData = async () => {
        if (!user?.accessToken) return;

        try {
            setLoading(true);

            const response = await axios.get("http://localhost:8000/dashboard/stats", {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                },
            });

            setStats(response.data.data);
        } catch (error) {
            console.error("Failed to retrieve dashboard statistic data", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
        <div className="min-h-screen bg-[#0d0a16] text-white flex items-center justify-center">
            <p className="text-purple-400 animate-pulse text-lg font-semibold">
                Loading dashboard data...
            </p>
      </div>
    )
  };

  // Pelindung jika user belum login atau loading state global belum selesai
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0a16] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading your dashboard or please login first...</p>
      </div>
    );
  }


  if (user.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0d0a16] text-white p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Dashboard EO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-purple-950 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
                Organizer Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.name || "User"}.</p>
            </div>
            <Link to="/create-event">
              <button className="bg-linear-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all text-sm">
                + Create New Event
              </button>
            </Link>
          </div>

          {/* Kartu Analitik Angka Utama (EO Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-100 mt-2">Rp {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(stats.totalEarnings ?? 0)}</p>
            </div>
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Tickets Sold</p>
              <p className="text-2xl font-bold text-gray-100 mt-2">{stats.ticketsSold ?? 0} <span className="text-xs text-gray-500 font-normal">tickets</span></p>
            </div>
            <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Active Events</p>
              <p className="text-2xl font-bold text-gray-100 mt-2">{stats.activeEventCounts ?? 0} <span className="text-xs text-gray-500 font-normal">live</span></p>
            </div>
          </div>

          {/* Tabel Manajemen Event Kreator */}
          <div className="bg-[#161224] border border-purple-900/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Your Managed Events</h3>
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
                  <tr>
                    <td className="py-4 font-medium text-white pl-2">K-Pop Symphony Festival 2026</td>
                    <td className="py-4 text-gray-400">Aug 12, 2026</td>
                    <td className="py-4">98 / 200</td>
                    <td className="py-4 text-right pr-2">
                      <button className="text-xs bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 px-3 py-1.5 rounded-lg text-purple-300 hover:text-white transition-all mr-2">Edit</button>
                      <button className="text-xs bg-red-600/20 hover:bg-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg text-red-400 hover:text-white transition-all">End</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-white pl-2">Tech Web3 Conference</td>
                    <td className="py-4 text-gray-400">Sep 05, 2026</td>
                    <td className="py-4">44 / 100</td>
                    <td className="py-4 text-right pr-2">
                      <button className="text-xs bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 px-3 py-1.5 rounded-lg text-purple-300 hover:text-white transition-all mr-2">Edit</button>
                      <button className="text-xs bg-red-600/20 hover:bg-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg text-red-400 hover:text-white transition-all">End</button>
                    </td>
                  </tr>
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
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Dashboard Customer */}
        <div className="border-b border-purple-950 pb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
            Welcome Back, {user.name}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Ready for your next experience? Track your tickets and saved events here.</p>
        </div>

        {/* Kartu Ringkasan Aktivitas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Your Tickets</p>
              <p className="text-3xl font-bold text-gray-100 mt-1">{stats.totalTicketsOwned ?? 0}</p>
            </div>
            <Link to="/my-tickets" className="text-xs text-purple-400 hover:underline">View All &rarr;</Link>
          </div>
          <div className="bg-[#161224] border border-purple-900/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Saved Wishlist</p>
              <p className="text-3xl font-bold text-gray-100 mt-1">5</p>
            </div>
            <Link to="/favorites" className="text-xs text-purple-400 hover:underline">Browse &rarr;</Link>
          </div>
        </div>

        {/* List Tiket Terdekat (Upcoming Events) */}
        <div className="bg-[#161224] border border-purple-900/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-200">Your Upcoming Events</h3>
          
          <div className="space-y-4">
            {/* Kartu Tiket 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1e1932] border border-purple-950 rounded-xl gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-600/20 text-purple-400 p-3 rounded-xl text-center font-bold text-xs w-14">
                  JUL <span className="block text-lg">24</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Rock Nation Festival 2026</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Gelora Bung Karno, Jakarta</p>
                </div>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all self-start sm:self-center">
                View Ticket QR
              </button>
            </div>

            {/* Kartu Tiket 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1e1932] border border-purple-950 rounded-xl gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-600/20 text-indigo-400 p-3 rounded-xl text-center font-bold text-xs w-14">
                  OCT <span className="block text-lg">11</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Anime & Cosplay Gathering</h4>
                  <p className="text-gray-400 text-xs mt-0.5">ICE BSD, Tangerang</p>
                </div>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all self-start sm:self-center">
                View Ticket QR
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}