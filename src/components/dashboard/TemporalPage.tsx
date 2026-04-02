import { useDashboard } from '@/contexts/DashboardContext';
import { ChartContainer } from './ChartContainer';
import { StatCard } from './StatCard';
import { CHART_COLORS, MONTH_NAMES } from '@/lib/data';
import { Calendar, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area } from 'recharts';
import { useMemo } from 'react';

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

export function TemporalPage() {
  const { filteredData } = useDashboard();

  const byDecade = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(r => {
      const decade = `${Math.floor(r.year / 10) * 10}s`;
      map[decade] = (map[decade] || 0) + 1;
    });
    return Object.entries(map).map(([decade, count]) => ({ decade, count })).sort((a, b) => a.decade.localeCompare(b.decade));
  }, [filteredData]);

  const byYear = useMemo(() => {
    const map: Record<number, number> = {};
    filteredData.forEach(r => { if (r.year > 0) map[r.year] = (map[r.year] || 0) + 1; });
    const entries = Object.entries(map).map(([y, v]) => ({ year: +y, count: v })).sort((a, b) => a.year - b.year);
    // Add 5-year moving average
    return entries.map((e, i) => {
      const slice = entries.slice(Math.max(0, i - 4), i + 1);
      return { ...e, avg: Math.round(slice.reduce((s, x) => s + x.count, 0) / slice.length) };
    });
  }, [filteredData]);

  const byMonth = useMemo(() => {
    const map: Record<number, number> = {};
    filteredData.forEach(r => { if (r.month > 0) map[r.month] = (map[r.month] || 0) + 1; });
    return Array.from({ length: 12 }, (_, i) => ({ month: MONTH_NAMES[i], count: map[i + 1] || 0 }));
  }, [filteredData]);

  const peakMonth = byMonth.reduce((a, b) => b.count > a.count ? b : a, { month: 'N/A', count: 0 });
  const peakYear = byYear.reduce((a, b) => b.count > a.count ? b : a, { year: 0, count: 0, avg: 0 });
  const recentTrend = byYear.length >= 2 ? byYear[byYear.length - 1].count - byYear[byYear.length - 2].count : 0;

  // Heatmap data: month x decade
  const heatmap = useMemo(() => {
    const decades = [...new Set(filteredData.map(r => `${Math.floor(r.year / 10) * 10}s`))].sort();
    return MONTH_NAMES.map((month, mi) => {
      const row: any = { month };
      decades.forEach(d => {
        row[d] = filteredData.filter(r => r.month === mi + 1 && `${Math.floor(r.year / 10) * 10}s` === d).length;
      });
      return row;
    });
  }, [filteredData]);

  const decades = useMemo(() => [...new Set(filteredData.map(r => `${Math.floor(r.year / 10) * 10}s`))].sort(), [filteredData]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Temporal Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Understanding time-based patterns in disaster declarations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Peak Year" value={peakYear.year} subtitle={`${peakYear.count} declarations`} icon={<Calendar className="w-5 h-5" />} color="primary" />
        <StatCard title="Peak Month" value={peakMonth.month} subtitle={`${peakMonth.count} total declarations`} icon={<Clock className="w-5 h-5" />} color="accent" />
        <StatCard title="Recent Change" value={`${recentTrend >= 0 ? '+' : ''}${recentTrend}`} subtitle="vs. previous year" icon={<TrendingUp className="w-5 h-5" />} color="warning" />
        <StatCard title="Decades Covered" value={byDecade.length} icon={<BarChart3 className="w-5 h-5" />} color="destructive" />
      </div>

      <ChartContainer title="Yearly Trend with Moving Average" subtitle="Annual declarations with 5-year moving average to identify long-term patterns">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={byYear}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke="hsl(199, 89%, 48%)" fill="url(#trendGrad)" strokeWidth={1.5} name="Declarations" />
            <Line type="monotone" dataKey="avg" stroke="hsl(38, 92%, 50%)" strokeWidth={2.5} dot={false} name="5yr Avg" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartContainer title="Declarations by Decade" subtitle="Showing the acceleration of disaster declarations over time">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDecade}>
              <XAxis dataKey="decade" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Declarations">
                {byDecade.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Seasonal Pattern" subtitle="Monthly distribution reveals peak disaster seasons">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byMonth}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Declarations">
                {byMonth.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Month × Decade Heatmap" subtitle="Stacked view of monthly patterns across decades">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={heatmap}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {decades.map((d, i) => (
              <Bar key={d} dataKey={d} stackId="a" fill={CHART_COLORS[i % CHART_COLORS.length]} name={d} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
