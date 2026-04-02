import { useDashboard } from '@/contexts/DashboardContext';
import { StatCard } from './StatCard';
import { ChartContainer } from './ChartContainer';
import { CHART_COLORS, MONTH_NAMES } from '@/lib/data';
import { AlertTriangle, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
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

export function OverviewPage() {
  const { filteredData } = useDashboard();

  const stats = useMemo(() => {
    const states = new Set(filteredData.map(r => r.state));
    const types = new Set(filteredData.map(r => r.disasterType));
    const years = filteredData.map(r => r.year).filter(y => y > 0);
    return {
      total: filteredData.length,
      states: states.size,
      types: types.size,
      yearSpan: years.length ? `${Math.min(...years)}–${Math.max(...years)}` : 'N/A',
    };
  }, [filteredData]);

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(r => { map[r.disasterType] = (map[r.disasterType] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const byYear = useMemo(() => {
    const map: Record<number, number> = {};
    filteredData.forEach(r => { if (r.year > 0) map[r.year] = (map[r.year] || 0) + 1; });
    return Object.entries(map).map(([y, v]) => ({ year: +y, count: v })).sort((a, b) => a.year - b.year);
  }, [filteredData]);

  const topStates = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(r => { map[r.state] = (map[r.state] || 0) + 1; });
    return Object.entries(map).map(([state, count]) => ({ state, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [filteredData]);

  const byMonth = useMemo(() => {
    const map: Record<number, number> = {};
    filteredData.forEach(r => { if (r.month > 0) map[r.month] = (map[r.month] || 0) + 1; });
    return Array.from({ length: 12 }, (_, i) => ({ month: MONTH_NAMES[i], count: map[i + 1] || 0 }));
  }, [filteredData]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive summary of US natural disaster declarations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Declarations" value={stats.total} icon={<AlertTriangle className="w-5 h-5" />} color="primary" />
        <StatCard title="States Affected" value={stats.states} icon={<MapPin className="w-5 h-5" />} color="accent" />
        <StatCard title="Disaster Types" value={stats.types} icon={<TrendingUp className="w-5 h-5" />} color="warning" />
        <StatCard title="Time Period" value={stats.yearSpan} icon={<Calendar className="w-5 h-5" />} color="destructive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartContainer title="Declarations by Year" subtitle="Trend of disaster declarations over time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={byYear}>
              <defs>
                <linearGradient id="yearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="hsl(199, 89%, 48%)" fill="url(#yearGrad)" strokeWidth={2} name="Declarations" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Top Disaster Types" subtitle="Distribution of declarations by category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byType.slice(0, 8)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={50} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {byType.slice(0, 8).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartContainer title="Top 10 Affected States" subtitle="States with most disaster declarations">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topStates} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="state" type="category" width={30} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} name="Declarations" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Monthly Distribution" subtitle="Seasonal patterns in disaster occurrences">
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
    </div>
  );
}
