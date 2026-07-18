import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface StatItem {
  label: string;
  revenue: number;
  ticketsSold: number;
}

interface EventStatisticsProps {
  eventId: number;
}

export default function EventStatistics({ eventId }: EventStatisticsProps) {
  const [filter, setFilter] = useState<"day" | "month" | "year">("month");
  const [chartData, setChartData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/dashboard/stats`, {
          params: {
            eventId: eventId,
            filter: filter,
          },
        });

        if (response.data.success && response.data.data.statistics) {
          setChartData(response.data.data.statistics);
        }
      } catch (error) {
        console.error("Failed to retrieve event statistics", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchStatistics();
    }
  }, [eventId, filter]); // Grafik otomatis me-render ulang setiap kali tombol filter diklik

  // Fungsi formatter mata uang Rupiah untuk YAxis dan Tooltip grafik pendapatan
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 bg-purple-950/20 rounded-2xl border border-purple-900/30 text-white space-y-6">
      {/* 1. HEADER & TOMBOL NAVIGASI FILTER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Statistics Visualization
          </h2>
          <p className="text-xs text-purple-300/70">
            Displaying graphical reports by day, month, and year
          </p>
        </div>

        {/* Tombol Navigasi Filter */}
        <div className="flex gap-1 bg-purple-950/60 p-1 rounded-xl border border-purple-900/40">
          {(["day", "month", "year"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all duration-200 ${
                filter === type
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-purple-300 hover:text-white hover:bg-purple-900/30"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LOADING STATE & EMPTY STATE */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-purple-300 animate-pulse">
            Loading graphical data...
          </p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center bg-purple-950/10 rounded-xl border border-dashed border-purple-900/30">
          <p className="text-sm text-gray-400 italic">
            No transaction data found for this period.
          </p>
        </div>
      ) : (
        /* 3. GRID GRAFIK RECHARTS */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GRAFIK A: TOTAL REVENUE (LINE CHART) */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-900/20">
            <h3 className="text-sm font-medium text-purple-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Total
              Revenue
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#3b0764"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#a78bfa"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a78bfa"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) =>
                      `Rp ${v >= 1000000 ? v / 1000000 + "M" : v.toLocaleString("id-ID")}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1b4b",
                      borderColor: "#581c87",
                      borderRadius: "12px",
                    }}
                    formatter={(value: any) => [
                      formatRupiah(Number(value)),
                      "Revenue",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#facc15"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRAFIK B: TICKETS SOLD (BAR CHART) */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-900/20">
            <h3 className="text-sm font-medium text-purple-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>{" "}
              Tickets Sold
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#3b0764"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#a78bfa"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a78bfa"
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1b4b",
                      borderColor: "#581c87",
                      borderRadius: "12px",
                    }}
                    formatter={(value: any) => [`${value} Tickets`, "Sold"]}
                  />
                  <Bar
                    dataKey="ticketsSold"
                    fill="#c084fc"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
