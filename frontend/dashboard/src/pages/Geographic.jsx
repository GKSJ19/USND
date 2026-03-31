import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 🔹 REGION DATA
const regionData = [
  { region: "South", value: 35000 },
  { region: "Midwest", value: 18000 },
  { region: "West", value: 7000 },
  { region: "Northeast", value: 5000 },
];

// 🔹 TOP STATES DATA
const stateData = [
  { state: "TX", value: 5000 },
  { state: "KY", value: 3200 },
  { state: "MO", value: 3000 },
  { state: "FL", value: 2800 },
  { state: "GA", value: 2700 },
  { state: "VA", value: 2600 },
  { state: "LA", value: 2500 },
  { state: "OK", value: 2400 },
  { state: "NC", value: 2300 },
  { state: "PR", value: 2200 },
];

// 🔹 STACKED DATA
const distributionData = [
  { state: "TX", storm: 40, flood: 25, fire: 10, hurricane: 15 },
  { state: "FL", storm: 30, flood: 20, fire: 5, hurricane: 35 },
  { state: "CA", storm: 20, flood: 15, fire: 40, hurricane: 5 },
  { state: "OK", storm: 45, flood: 20, fire: 5, hurricane: 10 },
];

export default function Geographic() {
  return (
    <div className="p-6 space-y-10 text-white bg-gradient-to-b from-[#020617] to-[#0f172a] min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Geographic Analysis</h1>
        <p className="text-gray-400 max-w-3xl">
          Identifying disaster hotspots and regional vulnerabilities across the United States.
        </p>

        <p className="text-gray-400 mt-4 max-w-3xl">
          Disasters are unevenly distributed across geography. Southern regions face hurricanes,
          while central states experience severe storms and tornadoes.
        </p>
      </div>

      {/* REGION BAR CHART */}
      <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
        <h3 className="mb-4 text-sm text-blue-400">
          ● DISASTER DECLARATIONS BY REGION
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="region" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <p className="mt-4 text-gray-400 text-sm">
          Key Insight: Southern U.S. records the highest number of disasters.
        </p>
      </div>

      {/* TOP STATES */}
      <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
        <h3 className="mb-4 text-sm text-blue-400">
          ● TOP STATES WITH MOST DISASTERS
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="state" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>

        <p className="mt-4 text-gray-400 text-sm">
          Key Insight: Texas leads significantly in disaster declarations.
        </p>
      </div>

      {/* DISTRIBUTION */}
      <div className="bg-[#020617] p-6 rounded-2xl border border-gray-800">
        <h3 className="mb-4 text-sm text-blue-400">
          ● INCIDENT TYPE DISTRIBUTION
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="state" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="storm" stackId="a" fill="#38bdf8" />
            <Bar dataKey="flood" stackId="a" fill="#22c55e" />
            <Bar dataKey="fire" stackId="a" fill="#f97316" />
            <Bar dataKey="hurricane" stackId="a" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>

        <p className="mt-4 text-gray-400 text-sm">
          Key Insight: Severe storms dominate across most states.
        </p>
      </div>

      {/* NARRATIVE */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Regional Hotspots</h2>
        <p>
          Tornado Alley (Texas, Oklahoma) experiences the highest storm activity,
          while Gulf Coast states face recurring hurricanes and flooding events.
        </p>
      </div>
    </div>
  );
}