import { Triangle, MapPin, TrendingUp, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import InsightCallout from "@/components/InsightCallout";

const categoryData = [
  { name: "Severe Storm", count: "28.4k", pct: 44, color: "hsl(0 70% 50%)" },
  { name: "Flood", count: "12.1k", pct: 19, color: "hsl(160 60% 45%)" },
  { name: "Fire", count: "8.4k", pct: 13, color: "hsl(30 90% 55%)" },
  { name: "Hurricane", count: "5.2k", pct: 8, color: "hsl(270 60% 55%)" },
  { name: "Biological", count: "3k", pct: 5, color: "hsl(185 70% 50%)" },
];

const insights = [
  { title: "300% Increase", desc: "Federal disaster declarations have increased by over 300% since the 1960s, reflecting both climate change and improved reporting." },
  { title: "Texas & California Lead", desc: "These two states consistently lead the nation in total disaster counts due to their size and geographic vulnerability." },
  { title: "Severe Storms Dominate", desc: "Severe storms are the most frequent driver of emergency aid across all regions of the United States." },
  { title: "2020 Record Spike", desc: "The year 2020 saw a record-breaking spike in biological emergency declarations driven by the COVID-19 pandemic." },
  { title: "Spring Volatility", desc: "Spring months (April-June) represent the most volatile period for weather events across the continental U.S." },
  { title: "Infrastructure Spending", desc: "Public assistance for infrastructure repair remains the largest category of federal disaster expenditure." },
];

const Overview = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-8 animate-fade-in">
        {/* Hero */}
        <div className="rounded-xl p-8 border border-border" style={{ background: "linear-gradient(180deg, hsl(220 30% 18%) 0%, hsl(220 20% 12%) 100%)" }}>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">National Disaster Database · 1953–2024</span>
          <h1 className="text-4xl font-extrabold text-foreground mt-3 leading-tight">
            Visualizing U.S. <span className="text-primary">Natural Disaster</span> Declarations
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed text-sm">
            A comprehensive analysis of U.S. natural disaster declarations over seven decades — exploring how patterns have evolved over time, how they vary across regions, and which types of disasters occur most frequently.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Triangle} value="64,218" label="Total Declarations" />
          <StatCard icon={MapPin} value="50" label="Active States" />
          <StatCard icon={TrendingUp} value="2,410" label="Major Events" />
          <StatCard icon={Calendar} value="904" label="Avg. Per Year" />
        </div>

        {/* Primary Incident Categories */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Primary Incident Categories</h2>
          <p className="text-xs text-muted-foreground mb-6">Top drivers of federal emergency declarations across the nation.</p>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-4">
                <span className="w-28 text-sm text-foreground">{cat.name}</span>
                <div className="flex-1 bg-secondary rounded-full h-3 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold"
                    style={{ width: `${(cat.pct / 44) * 100}%`, backgroundColor: cat.color }}
                  >
                    <span className="text-foreground text-[10px] font-semibold">{cat.count}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground w-10 text-right">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Key Insights</h2>
          <div className="grid grid-cols-2 gap-4">
            {insights.map((ins) => (
              <div key={ins.title} className="bg-card rounded-lg border border-border p-5">
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">→</span>
                  <div>
                    <h3 className="text-sm font-semibold text-accent mb-1">{ins.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ins.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human Element */}
        <InsightCallout
          title="🌍 The Human Element"
          description="Beyond the numbers, each declaration represents a community in need. This data helps policymakers allocate resources where they are needed most, ensuring that no community is left behind after a disaster."
        />
      </div>
    </DashboardLayout>
  );
};

export default Overview;
