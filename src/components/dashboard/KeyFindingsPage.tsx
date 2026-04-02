import { useDashboard } from '@/contexts/DashboardContext';
import { ChartContainer } from './ChartContainer';
import { CHART_COLORS, MONTH_NAMES, STATE_NAMES } from '@/lib/data';
import { Lightbulb, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-2.5 text-xs border border-border/80">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-mono">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function InsightCard({ icon, title, description, color }: InsightCardProps) {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 flex gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export function KeyFindingsPage() {
  const { filteredData } = useDashboard();

  const insights = useMemo(() => {
    const stateMap: Record<string, number> = {};
    const typeMap: Record<string, number> = {};
    const yearMap: Record<number, number> = {};
    const monthMap: Record<number, number> = {};

    filteredData.forEach(r => {
      stateMap[r.state] = (stateMap[r.state] || 0) + 1;
      typeMap[r.disasterType] = (typeMap[r.disasterType] || 0) + 1;
      if (r.year > 0) yearMap[r.year] = (yearMap[r.year] || 0) + 1;
      if (r.month > 0) monthMap[r.month] = (monthMap[r.month] || 0) + 1;
    });

    const topState = Object.entries(stateMap).sort((a, b) => b[1] - a[1])[0];
    const topType = Object.entries(typeMap).sort((a, b) => b[1] - a[1])[0];
    const peakYear = Object.entries(yearMap).sort((a, b) => b[1] - a[1])[0];
    const peakMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0];

    const years = Object.keys(yearMap).map(Number).sort();
    const recentDecade = years.filter(y => y >= 2010).reduce((s, y) => s + (yearMap[y] || 0), 0);
    const earlyDecade = years.filter(y => y >= 1960 && y < 1970).reduce((s, y) => s + (yearMap[y] || 0), 0);

    return { topState, topType, peakYear, peakMonth, recentDecade, earlyDecade };
  }, [filteredData]);

  // Year-over-year growth rate
  const growthData = useMemo(() => {
    const yearMap: Record<number, number> = {};
    filteredData.forEach(r => { if (r.year > 0) yearMap[r.year] = (yearMap[r.year] || 0) + 1; });
    const years = Object.keys(yearMap).map(Number).sort();
    return years.slice(1).map(y => ({
      year: y,
      growth: yearMap[y - 1] ? Math.round(((yearMap[y] - yearMap[y - 1]) / yearMap[y - 1]) * 100) : 0,
    })).filter(d => d.year >= 1960);
  }, [filteredData]);

  // Comparison of top 5 disaster types in early vs recent era
  const eraComparison = useMemo(() => {
    const types = [...new Set(filteredData.map(r => r.disasterType))];
    const result = types.map(type => {
      const early = filteredData.filter(r => r.disasterType === type && r.year >= 1953 && r.year < 1990).length;
      const recent = filteredData.filter(r => r.disasterType === type && r.year >= 1990).length;
      return { type, early, recent };
    }).sort((a, b) => (b.early + b.recent) - (a.early + a.recent)).slice(0, 8);
    return result;
  }, [filteredData]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Key Findings</h1>
        <p className="text-sm text-muted-foreground mt-1">Critical insights and patterns discovered in the disaster data</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Data-Driven Insights
          </h2>
          <InsightCard
            icon={<AlertTriangle className="w-4 h-4" />}
            title={`${insights.topState?.[0] || 'N/A'} leads in disaster declarations`}
            description={`${STATE_NAMES[insights.topState?.[0] || ''] || insights.topState?.[0]} has ${insights.topState?.[1].toLocaleString() || 0} declarations, making it the most disaster-prone state in the dataset.`}
            color="hsl(199, 89%, 48%)"
          />
          <InsightCard
            icon={<TrendingUp className="w-4 h-4" />}
            title={`${insights.topType?.[0] || 'N/A'} is the dominant disaster type`}
            description={`${insights.topType?.[0]} accounts for ${insights.topType?.[1].toLocaleString() || 0} declarations (${((insights.topType?.[1] || 0) / filteredData.length * 100).toFixed(1)}% of all events).`}
            color="hsl(160, 84%, 39%)"
          />
          <InsightCard
            icon={<Info className="w-4 h-4" />}
            title={`Peak disaster year: ${insights.peakYear?.[0] || 'N/A'}`}
            description={`${insights.peakYear?.[0]} saw ${insights.peakYear?.[1].toLocaleString() || 0} declarations — the highest single-year count in the dataset.`}
            color="hsl(38, 92%, 50%)"
          />
          <InsightCard
            icon={<AlertTriangle className="w-4 h-4" />}
            title={`${MONTH_NAMES[(parseInt(insights.peakMonth?.[0] || '1') - 1)] || 'N/A'} is the peak disaster month`}
            description={`Seasonal analysis shows ${MONTH_NAMES[(parseInt(insights.peakMonth?.[0] || '1') - 1)]} has the highest cumulative declarations, indicating strong seasonality in disaster patterns.`}
            color="hsl(280, 65%, 60%)"
          />
          <InsightCard
            icon={<TrendingUp className="w-4 h-4" />}
            title="Dramatic increase in modern era"
            description={`Post-2010 declarations (${insights.recentDecade.toLocaleString()}) vastly exceed the 1960s count (${insights.earlyDecade.toLocaleString()}), reflecting both climate trends and evolving declaration policies.`}
            color="hsl(0, 72%, 51%)"
          />
        </div>

        <div className="space-y-4">
          <ChartContainer title="Year-over-Year Growth Rate" subtitle="Percentage change in annual declarations">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={growthData}>
                <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="growth" stroke="hsl(199, 89%, 48%)" strokeWidth={1.5} dot={false} name="Growth %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Era Comparison: Pre-1990 vs Post-1990" subtitle="Top 8 disaster types across two major time periods">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={eraComparison}>
                <XAxis dataKey="type" tick={{ fontSize: 8 }} angle={-25} textAnchor="end" height={55} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="early" fill="hsl(280, 65%, 60%)" name="1953–1989" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recent" fill="hsl(199, 89%, 48%)" name="1990–Present" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
