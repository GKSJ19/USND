import DashboardLayout from "@/components/DashboardLayout";
import ChartCard from "@/components/ChartCard";
import InsightCallout from "@/components/InsightCallout";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart,
} from "recharts";

// Yearly disaster declarations data
const yearlyData = [
  { year: "1953", count: 50 }, { year: "1957", count: 80 }, { year: "1960", count: 120 },
  { year: "1965", count: 200 }, { year: "1969", count: 280 }, { year: "1972", count: 350 },
  { year: "1975", count: 300 }, { year: "1976", count: 250 }, { year: "1979", count: 400 },
  { year: "1981", count: 350 }, { year: "1984", count: 300 }, { year: "1988", count: 450 },
  { year: "1991", count: 600 }, { year: "1993", count: 800 }, { year: "1995", count: 700 },
  { year: "1997", count: 900 }, { year: "1999", count: 1200 }, { year: "2001", count: 800 },
  { year: "2003", count: 1100 }, { year: "2005", count: 4500 }, { year: "2006", count: 3200 },
  { year: "2007", count: 1800 }, { year: "2008", count: 2200 }, { year: "2010", count: 1500 },
  { year: "2011", count: 2800 }, { year: "2013", count: 1600 }, { year: "2014", count: 1800 },
  { year: "2016", count: 2200 }, { year: "2017", count: 3800 }, { year: "2018", count: 2000 },
  { year: "2019", count: 2400 }, { year: "2020", count: 4200 },
];

// Top 6 disaster types trend
const disasterTypeTrend = [
  { year: "1960", Fire: 10, Flood: 50, Hurricane: 20, Ice: 5, Snow: 5, Storm: 80 },
  { year: "1970", Fire: 20, Flood: 80, Hurricane: 30, Ice: 10, Snow: 10, Storm: 120 },
  { year: "1980", Fire: 40, Flood: 120, Hurricane: 50, Ice: 20, Snow: 15, Storm: 200 },
  { year: "1990", Fire: 80, Flood: 200, Hurricane: 80, Ice: 30, Snow: 25, Storm: 400 },
  { year: "1993", Fire: 100, Flood: 300, Hurricane: 60, Ice: 40, Snow: 30, Storm: 500 },
  { year: "2000", Fire: 200, Flood: 400, Hurricane: 100, Ice: 50, Snow: 40, Storm: 800 },
  { year: "2005", Fire: 150, Flood: 500, Hurricane: 2500, Ice: 30, Snow: 50, Storm: 1200 },
  { year: "2007", Fire: 300, Flood: 350, Hurricane: 200, Ice: 40, Snow: 35, Storm: 900 },
  { year: "2012", Fire: 350, Flood: 300, Hurricane: 400, Ice: 35, Snow: 30, Storm: 1100 },
  { year: "2018", Fire: 500, Flood: 400, Hurricane: 300, Ice: 25, Snow: 20, Storm: 1200 },
];

// Monthly distribution
const monthlyData = [
  { month: "Jan", count: 3500 }, { month: "Feb", count: 4000 }, { month: "Mar", count: 4500 },
  { month: "Apr", count: 6500 }, { month: "May", count: 7000 }, { month: "Jun", count: 6000 },
  { month: "Jul", count: 5500 }, { month: "Aug", count: 6800 }, { month: "Sep", count: 9500 },
  { month: "Oct", count: 7500 }, { month: "Nov", count: 3000 }, { month: "Dec", count: 2800 },
];

// Rolling average
const rollingData = yearlyData.map((d, i, arr) => {
  const start = Math.max(0, i - 1);
  const end = Math.min(arr.length, i + 2);
  const slice = arr.slice(start, end);
  const avg = slice.reduce((s, v) => s + v.count, 0) / slice.length;
  return { ...d, avg: Math.round(avg) };
});

const Temporal = () => (
  <DashboardLayout>
    <div className="max-w-5xl space-y-8 animate-fade-in">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Disaster trends are not static; they tell a story of a changing world. Over the last 70 years, we've seen a steady rise in federal declarations, with clear seasonal peaks and dramatic spikes during major catastrophic years.
      </p>

      {/* Yearly Declarations */}
      <ChartCard title="Yearly Disaster Declarations">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="count" stroke="hsl(185 70% 50%)" fill="hsl(185 70% 50% / 0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Massive spike in 2005–2006 due to Hurricane Katrina and related events. Overall upward trend since 1990s.</p>
      </ChartCard>

      <div className="grid grid-cols-2 gap-4">
        {/* Disaster Types Trend */}
        <ChartCard title="Top 6 Disaster Types Trend Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={disasterTypeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="Fire" stroke="hsl(0 70% 50%)" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Flood" stroke="hsl(185 70% 50%)" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Hurricane" stroke="hsl(160 60% 45%)" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Ice" stroke="hsl(45 90% 55%)" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Snow" stroke="hsl(270 60% 55%)" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="Storm" stroke="hsl(30 90% 55%)" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-3">Key Insight: Hurricanes had a massive spike in 2005. Storms consistently dominate.</p>
        </ChartCard>

        {/* Monthly Distribution */}
        <ChartCard title="Monthly Disaster Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(185 70% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-3">Key Insight: September sees the highest disasters (hurricane season). Nov–Dec are lowest.</p>
        </ChartCard>
      </div>

      {/* Rolling Average */}
      <ChartCard title="Yearly Trend With 3-Year Rolling Average">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={rollingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 20%)", borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="count" fill="hsl(185 70% 50% / 0.3)" name="Actual" />
            <Line type="monotone" dataKey="avg" stroke="hsl(30 90% 55%)" strokeWidth={2} name="3-Year Moving Average" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3">Key Insight: Rolling average smooths volatility and reveals a clear upward trend since the 1990s.</p>
      </ChartCard>

      <InsightCallout
        title="Long-term Climate Signal"
        description="Rising rolling averages, frequent spikes, and shifting seasonality indicate a systemic increase in disaster frequency beyond simple yearly variation."
      />
    </div>
  </DashboardLayout>
);

export default Temporal;
