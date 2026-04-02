import DashboardLayout from "@/components/DashboardLayout";
import ChartCard from "@/components/ChartCard";
import InsightCallout from "@/components/InsightCallout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell,
} from "recharts";

const topStates = [
  { state: "TX", count: 3800 }, { state: "MO", count: 2200 }, { state: "KY", count: 2100 },
  { state: "VA", count: 1900 }, { state: "OK", count: 1850 }, { state: "FL", count: 1700 },
  { state: "IL", count: 1650 }, { state: "GA", count: 1500 }, { state: "LA", count: 1400 },
  { state: "NC", count: 1350 },
];

const regionData = [
  { region: "Midwest", count: 8000 }, { region: "Northeast", count: 6000 },
  { region: "South", count: 22000 }, { region: "West", count: 12000 },
];

const monthlyTrend = [
  { month: "1", count: 3500 }, { month: "2", count: 4200 }, { month: "3", count: 4800 },
  { month: "4", count: 5500 }, { month: "5", count: 6200 }, { month: "6", count: 5800 },
  { month: "7", count: 5200 }, { month: "8", count: 6500 }, { month: "9", count: 8500 },
  { month: "10", count: 6000 }, { month: "11", count: 4000 }, { month: "12", count: 3200 },
];

const hurricaneHotspots = [
  { state: "TX", count: 1100 }, { state: "FL", count: 950 }, { state: "LA", count: 900 },
  { state: "NC", count: 800 }, { state: "VA", count: 750 }, { state: "AL", count: 700 },
  { state: "MS", count: 680 }, { state: "GA", count: 620 }, { state: "SC", count: 600 },
  { state: "NY", count: 500 },
];

const stateDistribution = [
  { state: "AL", Storm: 800, Flood: 300, Hurricane: 200, Fire: 50, Snow: 40, Other: 60 },
  { state: "AK", Storm: 100, Flood: 80, Hurricane: 0, Fire: 150, Snow: 100, Other: 30 },
  { state: "AR", Storm: 700, Flood: 250, Hurricane: 50, Fire: 30, Snow: 60, Other: 40 },
  { state: "AZ", Storm: 200, Flood: 150, Hurricane: 10, Fire: 400, Snow: 20, Other: 30 },
  { state: "CA", Storm: 300, Flood: 350, Hurricane: 5, Fire: 600, Snow: 30, Other: 50 },
  { state: "CO", Storm: 400, Flood: 200, Hurricane: 0, Fire: 250, Snow: 80, Other: 40 },
  { state: "CT", Storm: 350, Flood: 150, Hurricane: 80, Fire: 10, Snow: 100, Other: 20 },
  { state: "DE", Storm: 200, Flood: 80, Hurricane: 60, Fire: 5, Snow: 50, Other: 15 },
];

const allStatesData = [
  { state: "TX", count: 3800 }, { state: "MO", count: 2200 }, { state: "KY", count: 2100 },
  { state: "VA", count: 1900 }, { state: "OK", count: 1850 }, { state: "FL", count: 1700 },
  { state: "IL", count: 1650 }, { state: "GA", count: 1500 }, { state: "LA", count: 1400 },
  { state: "NC", count: 1350 }, { state: "AL", count: 1300 }, { state: "AR", count: 1250 },
  { state: "CA", count: 1200 }, { state: "NY", count: 1150 }, { state: "IN", count: 1100 },
  { state: "TN", count: 1050 }, { state: "MN", count: 1000 }, { state: "OH", count: 980 },
  { state: "PA", count: 950 }, { state: "MS", count: 920 },
];

const Geographic = () => (
  <DashboardLayout>
    <div className="max-w-5xl space-y-8 animate-fade-in">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Geographic analysis reveals stark regional disparities in disaster frequency. The Southern U.S. bears the highest burden, with Texas alone accounting for nearly 10% of all federal disaster declarations.
      </p>

      {/* Top 10 States */}
      <ChartCard title="Top 10 States With Highest Disaster Declarations">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topStates} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="state" width={30} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Bar dataKey="count" fill="hsl(80 60% 50%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Texas leads significantly with ~3,800 declarations — nearly double the second-highest state.</p>
      </ChartCard>

      <div className="grid grid-cols-2 gap-4">
        {/* By Region */}
        <ChartCard title="Disaster Declarations By Region">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {regionData.map((_, i) => {
                  const colors = ["hsl(185 70% 50%)", "hsl(160 60% 45%)", "hsl(0 70% 50%)", "hsl(30 90% 55%)"];
                  return <Cell key={i} fill={colors[i]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-3">Key Insight: Southern U.S. records more than half of all declarations.</p>
        </ChartCard>

        {/* Monthly Trend */}
        <ChartCard title="Monthly Disaster Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="hsl(185 70% 50%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(185 70% 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-3">Key Insight: September peaks at 8,500 — driven by hurricane season.</p>
        </ChartCard>
      </div>

      {/* Hurricane Hotspots */}
      <ChartCard title="Hurricane Disaster Hotspots In The US">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hurricaneHotspots}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Bar dataKey="count" fill="hsl(185 70% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Gulf Coast and Atlantic seaboard states dominate hurricane declarations.</p>
      </ChartCard>

      {/* Disaster Type by State */}
      <ChartCard title="Disaster Type Distribution By State">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="Storm" stackId="a" fill="hsl(185 70% 50%)" />
            <Bar dataKey="Flood" stackId="a" fill="hsl(30 90% 55%)" />
            <Bar dataKey="Hurricane" stackId="a" fill="hsl(160 60% 45%)" />
            <Bar dataKey="Fire" stackId="a" fill="hsl(0 70% 50%)" />
            <Bar dataKey="Snow" stackId="a" fill="hsl(45 90% 55%)" />
            <Bar dataKey="Other" stackId="a" fill="hsl(270 60% 55%)" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Storms dominate in most states; California has uniquely high fire declarations.</p>
      </ChartCard>

      {/* All States */}
      <ChartCard title="Disaster Declarations Across U.S. States">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={allStatesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Bar dataKey="count" fill="hsl(330 60% 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Texas, Missouri, and Kentucky form the top five of disaster-prone states.</p>
      </ChartCard>

      <InsightCallout
        title="Regional Hotspots"
        description="Tornado Alley (Texas, Oklahoma) experiences the highest storm activity, while Gulf Coast states face recurring hurricanes and flooding events. California stands out in the West due to wildfire declarations."
      />
    </div>
  </DashboardLayout>
);

export default Geographic;
