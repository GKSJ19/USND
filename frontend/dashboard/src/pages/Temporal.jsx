import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 🔹 Dummy data (you can replace with your dataset later)
const yearlyData = [
  { year: 2000, total: 1500, avg: 1200 },
  { year: 2005, total: 5000, avg: 2000 },
  { year: 2010, total: 2500, avg: 2300 },
  { year: 2015, total: 3000, avg: 2600 },
  { year: 2020, total: 10000, avg: 4000 },
  { year: 2024, total: 3200, avg: 4200 },
];

const monthlyData = [
  { month: "Jan", value: 18000 },
  { month: "Feb", value: 3000 },
  { month: "Mar", value: 3200 },
  { month: "Apr", value: 5200 },
  { month: "May", value: 5000 },
  { month: "Jun", value: 4700 },
  { month: "Jul", value: 5800 },
  { month: "Aug", value: 5400 },
  { month: "Sep", value: 4000 },
  { month: "Oct", value: 6500 },
  { month: "Nov", value: 3500 },
  { month: "Dec", value: 3000 },
];

const yoyData = [
  { year: 2000, value: 0.2 },
  { year: 2005, value: 1.5 },
  { year: 2010, value: -0.5 },
  { year: 2015, value: 0.8 },
  { year: 2020, value: 3.0 },
  { year: 2024, value: 0.1 },
];

export default function Temporal() {
  return (
    <div className="p-6 space-y-10 text-white bg-gradient-to-b from-[#020617] to-[#0f172a] min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Temporal Analysis</h1>
        <p className="text-gray-400 max-w-3xl">
          Comprehensive tracking of disaster trends, seasonality, and rolling averages from 1953 to present.
        </p>

        <p className="text-gray-400 mt-4 max-w-3xl">
          Disaster trends are not static; they tell a story of a changing world. Over the last 70 years,
          we’ve seen a steady rise in federal declarations, with clear seasonal peaks during spring and summer.
        </p>
      </div>

      {/* TOP ROW */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* INCIDENT TYPE TREND */}
        <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
          <h3 className="mb-4 text-sm text-blue-400">● INCIDENT TYPE TRENDS OVER TIME</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#38bdf8" />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-gray-400 text-sm">
            Key Insight: Massive spike observed in recent years due to extreme events.
          </p>
        </div>

        {/* MONTHLY TREND */}
        <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
          <h3 className="mb-4 text-sm text-blue-400">● MONTHLY DISASTER TREND</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-gray-400 text-sm">
            Key Insight: High concentration early in the year with spring peaks.
          </p>
        </div>
      </div>

      {/* MIDDLE ROW */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* YEARLY TREND */}
        <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
          <h3 className="mb-4 text-sm text-blue-400">● YEARLY DISASTER TREND</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#60a5fa" />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-gray-400 text-sm">
            Key Insight: Strong growth observed after 2000.
          </p>
        </div>

        {/* ROLLING AVG */}
        <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
          <h3 className="mb-4 text-sm text-blue-400">● 5-YEAR ROLLING AVERAGE</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avg" stroke="#22d3ee" />
              <Line type="monotone" dataKey="total" stroke="#94a3b8" />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-gray-400 text-sm">
            Key Insight: Rolling average smooths volatility and shows upward trend.
          </p>
        </div>
      </div>

      {/* YOY */}
      <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
        <h3 className="mb-4 text-sm text-blue-400">● YEAR-OVER-YEAR GROWTH RATE</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yoyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#ec4899" />
          </LineChart>
        </ResponsiveContainer>

        <p className="mt-4 text-gray-400 text-sm">
          Key Insight: Growth rates are highly volatile with extreme spikes.
        </p>
      </div>

      {/* FINAL BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Long-term Climate Signal</h2>
        <p>
          Rising rolling averages, frequent spikes, and shifting seasonality indicate a
          systemic increase in disaster frequency beyond simple yearly variation.
        </p>
      </div>
    </div>
  );
}