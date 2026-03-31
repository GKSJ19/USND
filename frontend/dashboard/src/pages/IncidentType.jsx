import React from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f97316", "#94a3b8"];

const pieData = [
  { name: "Severe Storm", value: 40 },
  { name: "Flood", value: 25 },
  { name: "Hurricane", value: 10 },
  { name: "Fire", value: 12 },
  { name: "Snow", value: 5 },
];

const barData = [
  { name: "Public Assistance", value: 12 },
  { name: "Individual Assistance", value: 8 },
  { name: "Hazard Mitigation", value: 4 },
];

const IncidentType = () => {
  return (
    <div style={{ padding: "30px", color: "white" }}>

      {/* HEADER */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Incident Type Analysis
      </h1>

      <p style={{ color: "#9CA3AF", marginTop: "10px", maxWidth: "700px" }}>
        Breaking down the nature of disasters and the allocation of federal assistance.
      </p>

      <p style={{ color: "#9CA3AF", marginTop: "20px", maxWidth: "800px" }}>
        Not all disasters are created equal. Severe storms and flooding account
        for the majority of federal aid.
      </p>

      {/* TOP CHARTS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>

        {/* DONUT */}
        <div style={cardStyle}>
          <h3>Incident Type Distribution (%)</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div style={cardStyle}>
          <h3>Disaster Assistance Comparison ($B)</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BIG BAR DISTRIBUTION */}
      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Distribution of Disaster Incident Types</h3>

        <div style={{ marginTop: "20px" }}>
          {pieData.map((item, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.name}</span>
                <span>{item.value}%</span>
              </div>

              <div style={progressBg}>
                <div
                  style={{
                    ...progressFill,
                    width: `${item.value}%`,
                    background: COLORS[index],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STACKED LOOK (SIMPLIFIED UI) */}
      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Incident Type Distribution Across States</h3>

        <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
          {["FL", "TX", "CA", "NY", "GA"].map((state, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {state}
              </div>

              <div style={{ height: "150px", background: "#1e293b", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ height: "40%", background: "#3b82f6" }} />
                <div style={{ height: "30%", background: "#06b6d4" }} />
                <div style={{ height: "20%", background: "#f97316" }} />
                <div style={{ height: "10%", background: "#8b5cf6" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TREEMAP STYLE BOX */}
      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Treemap of Disaster Incident Types</h3>

        <div style={{ display: "flex", marginTop: "20px", height: "250px" }}>
          <div style={{ flex: 3, background: "#4f46e5", padding: "10px" }}>
            Severe Storm
          </div>
          <div style={{ flex: 2, background: "#0ea5e9", padding: "10px" }}>
            Flood
          </div>
          <div style={{ flex: 1, background: "#ef4444", padding: "10px" }}>
            Hurricane
          </div>
        </div>
      </div>

    </div>
  );
};

/* STYLES */
const cardStyle = {
  flex: 1,
  background: "#0f172a",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.05)",
};

const progressBg = {
  height: "8px",
  background: "#1e293b",
  borderRadius: "5px",
  marginTop: "5px",
};

const progressFill = {
  height: "100%",
  borderRadius: "5px",
};

export default IncidentType;