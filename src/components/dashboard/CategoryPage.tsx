import { useDashboard } from '@/contexts/DashboardContext';
import { ChartContainer } from './ChartContainer';
import { StatCard } from './StatCard';
import { CHART_COLORS } from '@/lib/data';
import { Layers, TrendingUp, Zap, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from 'recharts';
import { useMemo } from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-2.5 text-xs border border-border/80">
      <p className="font-semibold text-foreground mb-1">{label || payload[0]?.payload?.name}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-mono">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export function CategoryPage() {
  const { filteredData } = useDashboard();

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(r => { map[r.disasterType] = (map[r.disasterType] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const programCoverage = useMemo(() => {
    const ia = filteredData.filter(r => r.individualAssistance).length;
    const pa = filteredData.filter(r => r.publicAssistance).length;
    const hm = filteredData.filter(r => r.hazardMitigation).length;
    const ihp = filteredData.filter(r => r.ihp).length;
    return [
      { name: 'Individual Assistance', value: ia },
      { name: 'Public Assistance', value: pa },
      { name: 'Hazard Mitigation', value: hm },
      { name: 'IHP', value: ihp },
    ];
  }, [filteredData]);

  const topTypesTrend = useMemo(() => {
    const top5 = byType.slice(0, 5).map(t => t.name);
    const yearMap: Record<number, Record<string, number>> = {};
    filteredData.forEach(r => {
      if (!top5.includes(r.disasterType) || r.year <= 0) return;
      const decade = Math.floor(r.year / 10) * 10;
      if (!yearMap[decade]) yearMap[decade] = {};
      yearMap[decade][r.disasterType] = (yearMap[decade][r.disasterType] || 0) + 1;
    });
    return Object.entries(yearMap).map(([decade, types]) => ({ decade: `${decade}s`, ...types })).sort((a, b) => a.decade.localeCompare(b.decade));
  }, [filteredData, byType]);

  const radarData = useMemo(() => {
    return byType.slice(0, 8).map(t => ({
      name: t.name.length > 10 ? t.name.slice(0, 10) + '…' : t.name,
      fullName: t.name,
      value: t.value,
    }));
  }, [byType]);

  const topType = byType[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Category Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into disaster types and assistance programs</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Top Category" value={topType?.name || 'N/A'} subtitle={`${topType?.value.toLocaleString() || 0} declarations`} icon={<Layers className="w-5 h-5" />} color="primary" />
        <StatCard title="Categories" value={byType.length} icon={<TrendingUp className="w-5 h-5" />} color="accent" />
        <StatCard title="Top Category %" value={`${topType ? ((topType.value / filteredData.length) * 100).toFixed(1) : 0}%`} icon={<Zap className="w-5 h-5" />} color="warning" />
        <StatCard title="Programs Active" value={programCoverage.filter(p => p.value > 0).length} subtitle="of 4 programs" icon={<Shield className="w-5 h-5" />} color="destructive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartContainer title="Disaster Type Distribution" subtitle="All categories ranked by frequency">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={byType} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 9 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Declarations">
                {byType.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Category Radar" subtitle="Relative scale of top 8 disaster types">
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220, 14%, 18%)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(215, 12%, 55%)' }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} />
              <Radar name="Declarations" dataKey="value" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartContainer title="Assistance Program Coverage" subtitle="How many declarations received each type of federal assistance">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={programCoverage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={3}>
                {programCoverage.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {programCoverage.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                {p.name}
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Top 5 Types Over Decades" subtitle="How the most common disaster types have evolved">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={topTypesTrend}>
              <XAxis dataKey="decade" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              {byType.slice(0, 5).map((t, i) => (
                <Line key={t.name} type="monotone" dataKey={t.name} stroke={CHART_COLORS[i]} strokeWidth={2} dot={{ r: 3 }} name={t.name} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
