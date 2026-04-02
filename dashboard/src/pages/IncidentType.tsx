import DashboardLayout from "@/components/DashboardLayout";
import ChartCard from "@/components/ChartCard";
import InsightCallout from "@/components/InsightCallout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";

const incidentFrequency = [
  { type: "Storm", count: 18500 }, { type: "Flood", count: 12100 }, { type: "Hurricane", count: 5200 },
  { type: "Fire", count: 8400 }, { type: "Snow", count: 3800 }, { type: "Ice", count: 2500 },
  { type: "Tornado", count: 1800 }, { type: "Drought", count: 900 }, { type: "Other", count: 700 },
  { type: "Typhoon", count: 400 }, { type: "Earthquake", count: 350 }, { type: "Tsunami", count: 150 },
  { type: "Volcano", count: 100 }, { type: "Mud/Landslide", count: 80 }, { type: "Chemical", count: 50 },
  { type: "Terrorist", count: 30 }, { type: "Dam/Levee", count: 25 }, { type: "Human Cause", count: 15 },
  { type: "Toxic", count: 10 },
];

const treemapData = [
  { type: "Storm", count: 18500, color: "hsl(0 70% 40%)" },
  { type: "Flood", count: 12100, color: "hsl(0 60% 50%)" },
  { type: "Hurricane", count: 5200, color: "hsl(0 50% 55%)" },
  { type: "Snow", count: 3800, color: "hsl(0 40% 60%)" },
  { type: "Fire", count: 2947, color: "hsl(0 35% 65%)" },
  { type: "Ice", count: 2500, color: "hsl(0 30% 70%)" },
  { type: "Tornado", count: 1800, color: "hsl(0 25% 75%)" },
];

const topStatesIncident = [
  { state: "TX", Storm: 800, Flood: 600, Hurricane: 250, Fire: 80, Snow: 200, Ice: 100, Tornado: 250, Drought: 80, Other: 80 },
  { state: "MO", Storm: 600, Flood: 400, Hurricane: 10, Fire: 30, Snow: 150, Ice: 80, Tornado: 180, Drought: 50, Other: 50 },
  { state: "KY", Storm: 550, Flood: 350, Hurricane: 20, Fire: 20, Snow: 120, Ice: 100, Tornado: 100, Drought: 40, Other: 40 },
  { state: "VA", Storm: 500, Flood: 300, Hurricane: 150, Fire: 20, Snow: 100, Ice: 80, Tornado: 50, Drought: 30, Other: 30 },
  { state: "FL", Storm: 400, Flood: 250, Hurricane: 500, Fire: 100, Snow: 5, Ice: 5, Tornado: 80, Drought: 20, Other: 40 },
  { state: "IL", Storm: 500, Flood: 300, Hurricane: 5, Fire: 15, Snow: 100, Ice: 70, Tornado: 120, Drought: 40, Other: 30 },
  { state: "LA", Storm: 350, Flood: 300, Hurricane: 400, Fire: 30, Snow: 10, Ice: 20, Tornado: 60, Drought: 15, Other: 25 },
];

const assistanceData = [
  { type: "Storm", individual: 5000, public: 15000 },
  { type: "Flood", individual: 3000, public: 10000 },
  { type: "Hurricane", individual: 4000, public: 8000 },
  { type: "Fire", individual: 2000, public: 5000 },
  { type: "Snow", individual: 800, public: 3000 },
  { type: "Ice", individual: 500, public: 2000 },
  { type: "Tornado", individual: 600, public: 1500 },
];

const yearlyTrendTypes = [
  { year: "1960", Fire: 10, Flood: 50, Hurricane: 20, Storm: 80, Snow: 10 },
  { year: "1970", Fire: 30, Flood: 100, Hurricane: 40, Storm: 150, Snow: 20 },
  { year: "1980", Fire: 50, Flood: 150, Hurricane: 60, Storm: 250, Snow: 30 },
  { year: "1990", Fire: 100, Flood: 250, Hurricane: 80, Storm: 400, Snow: 50 },
  { year: "1995", Fire: 120, Flood: 300, Hurricane: 100, Storm: 500, Snow: 60 },
  { year: "2000", Fire: 200, Flood: 350, Hurricane: 150, Storm: 600, Snow: 70 },
  { year: "2005", Fire: 180, Flood: 400, Hurricane: 2800, Storm: 800, Snow: 80 },
  { year: "2008", Fire: 300, Flood: 350, Hurricane: 200, Storm: 700, Snow: 60 },
  { year: "2010", Fire: 350, Flood: 300, Hurricane: 150, Storm: 800, Snow: 50 },
  { year: "2012", Fire: 400, Flood: 350, Hurricane: 300, Storm: 900, Snow: 40 },
  { year: "2015", Fire: 500, Flood: 400, Hurricane: 200, Storm: 1000, Snow: 30 },
  { year: "2018", Fire: 600, Flood: 380, Hurricane: 350, Storm: 1100, Snow: 25 },
  { year: "2020", Fire: 550, Flood: 420, Hurricane: 300, Storm: 1200, Snow: 20 },
];

const IncidentType = () => (
  <DashboardLayout>
    <div className="max-w-5xl space-y-8 animate-fade-in">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Incident type analysis reveals the composition and frequency of different disaster categories, their geographic distribution, and the federal assistance programs they trigger.
      </p>

      {/* Incident Frequency */}
      <ChartCard title="Incident Type Frequency">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={incidentFrequency} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="type" width={90} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Bar dataKey="count" fill="hsl(185 70% 50%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Treemap-style display */}
      <ChartCard title="Incident Type Distribution (Treemap)">
        <div className="flex gap-1 h-32 rounded-lg overflow-hidden">
          {treemapData.map((d) => (
            <div
              key={d.type}
              className="flex flex-col items-center justify-center text-foreground"
              style={{
                backgroundColor: d.color,
                flex: d.count,
                minWidth: 40,
              }}
            >
              <span className="text-xs font-bold">{d.type}</span>
              <span className="text-[10px] opacity-80">{(d.count / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Top States vs Incident Type */}
      <ChartCard title="Top States vs Incident Type">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topStatesIncident}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="Storm" stackId="a" fill="hsl(185 70% 50%)" />
            <Bar dataKey="Flood" stackId="a" fill="hsl(30 90% 55%)" />
            <Bar dataKey="Hurricane" stackId="a" fill="hsl(160 60% 45%)" />
            <Bar dataKey="Fire" stackId="a" fill="hsl(0 70% 50%)" />
            <Bar dataKey="Snow" stackId="a" fill="hsl(270 60% 55%)" />
            <Bar dataKey="Ice" stackId="a" fill="hsl(185 70% 70%)" />
            <Bar dataKey="Tornado" stackId="a" fill="hsl(45 90% 55%)" />
            <Bar dataKey="Drought" stackId="a" fill="hsl(330 60% 55%)" />
            <Bar dataKey="Other" stackId="a" fill="hsl(80 60% 50%)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Assistance Programs */}
      <ChartCard title="Incident Type vs Assistance Programs">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={assistanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="individual" fill="hsl(185 70% 50%)" name="Individual Assistance" />
            <Bar dataKey="public" fill="hsl(30 90% 55%)" name="Public Assistance" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Public assistance programs consistently exceed individual assistance across all major disaster types.</p>
      </ChartCard>

      {/* Yearly Trend of Top Types */}
      <ChartCard title="Yearly Trend Of Top Incident Types">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearlyTrendTypes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="Fire" stroke="hsl(0 70% 50%)" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="Flood" stroke="hsl(185 70% 50%)" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="Hurricane" stroke="hsl(160 60% 45%)" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="Storm" stroke="hsl(30 90% 55%)" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="Snow" stroke="hsl(270 60% 55%)" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Hurricane declarations spiked dramatically in 2005 (Katrina). Storms show steady growth.</p>
      </ChartCard>

      <InsightCallout
        title="Disaster Composition"
        description="Storms account for over 30% of all declarations, followed by floods and hurricanes. Public assistance programs handle the bulk of federal response, highlighting the emphasis on infrastructure recovery over individual aid."
      />
    </div>
  </DashboardLayout>
);

export default IncidentType;
