import { FileText, Search, CheckCircle, BarChart3, Globe, Layers } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import InsightCallout from "@/components/InsightCallout";

const steps = [
  { num: "01", icon: BarChart3, title: "Temporal Aggregation", desc: "Data is grouped by declaration date. We use 5-year rolling averages to smooth out annual volatility and reveal long-term climate-driven trends.", color: "text-primary" },
  { num: "02", icon: Globe, title: "Geographic Mapping", desc: "State-level data is normalized by population density to provide a more accurate representation of disaster impact per capita.", color: "text-chart-cyan" },
  { num: "03", icon: Layers, title: "Categorical Normalization", desc: "Over 40 legacy incident types have been mapped into 12 primary categories to maintain consistency while preserving the granularity of the data.", color: "text-chart-orange" },
];

const methodCards = [
  { icon: FileText, title: "Data Sourcing", desc: "Primary data sourced from the FEMA Open Data portal, covering all federal disaster declarations from 1953 to the present day." },
  { icon: Search, title: "Cleaning Process", desc: "Normalize incident types, handle missing geographic coordinates, and aggregate data by year and month for consistent temporal analysis." },
  { icon: CheckCircle, title: "Validation", desc: "Cross-referenced with historical climate records to ensure major spikes in the data align with documented catastrophic events." },
];

const tools = [
  { name: "Python / Pandas", desc: "Data wrangling & cleaning" },
  { name: "Recharts", desc: "Interactive visualization" },
  { name: "React + TypeScript", desc: "Frontend application" },
  { name: "FEMA OpenData API", desc: "Primary data source" },
];

const Approach = () => (
  <DashboardLayout>
    <div className="max-w-5xl space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="rounded-xl p-8 border border-border" style={{ background: "linear-gradient(180deg, hsl(220 30% 18%) 0%, hsl(220 20% 12%) 100%)" }}>
        <span className="text-xs font-semibold text-chart-yellow uppercase tracking-widest">Methodology</span>
        <h1 className="text-4xl font-extrabold text-foreground mt-3 leading-tight">
          Our <span className="text-primary">Analytical Approach</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed text-sm">
          A rigorous, multi-step methodology to transform raw federal disaster data into clear, actionable insights.
        </p>
      </div>

      {/* Method Cards */}
      <div className="grid grid-cols-3 gap-4">
        {methodCards.map((m) => (
          <div key={m.title} className="bg-card rounded-lg border border-border p-6">
            <m.icon className="w-8 h-8 text-muted-foreground mb-4" />
            <h3 className="text-sm font-bold text-foreground mb-2">{m.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Analytical Framework */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-accent rounded-full" />
          Analytical Framework
        </h2>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.num} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${s.color}`}>Step {s.num}</span>
                <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Tools & Technologies</h2>
        <div className="grid grid-cols-4 gap-3">
          {tools.map((t) => (
            <div key={t.name} className="bg-secondary rounded-lg p-4 text-center">
              <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">
        Visualizing U.S. Natural Disaster Declarations | Project Team | Infosys Springboard Internship | 2026
      </p>
    </div>
  </DashboardLayout>
);

export default Approach;
