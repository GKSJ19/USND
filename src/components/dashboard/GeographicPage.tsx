import { useDashboard } from '@/contexts/DashboardContext';
import { ChartContainer } from './ChartContainer';
import { StatCard } from './StatCard';
import { CHART_COLORS, STATE_NAMES } from '@/lib/data';
import { MapPin, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// ✅ ADD THIS LINE
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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

export function GeographicPage() {
  const { filteredData } = useDashboard();

  // ✅ ADD THIS LINE HERE
  const [hoveredState, setHoveredState] = useState<any>(null);

  const stateData = useMemo(() => {
    const map: Record<string, { count: number; types: Set<string> }> = {};
    filteredData.forEach(r => {
      if (!map[r.state]) map[r.state] = { count: 0, types: new Set() };
      map[r.state].count++;
      map[r.state].types.add(r.disasterType);
    });
    return Object.entries(map)
      .map(([state, { count, types }]) => ({ state, name: STATE_NAMES[state] || state, count, types: types.size }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);
  const max = stateData.length
  ? Math.max(...stateData.map(d => d.count || 0))
  : 1;

const colorScale = scaleLinear<string>()
  .domain([0, max])
  .range(["#E0E7FF", "#1E3A8A"]);

  const top = stateData[0];
  const totalStates = stateData.length;
  const avgPerState = stateData.length ? Math.round(filteredData.length / stateData.length) : 0;

  const topTypes = useMemo(() => {
    if (!top) return [];
    const map: Record<string, number> = {};
    filteredData.filter(r => r.state === top.state).forEach(r => { map[r.disasterType] = (map[r.disasterType] || 0) + 1; });
    return Object.entries(map).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredData, top]);

  const stateTypeDiversity = useMemo(() => 
    stateData.slice(0, 15).map(s => ({ state: s.state, count: s.count, types: s.types })),
    [stateData]
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Geographic Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Analyzing disaster patterns across US states and territories</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Most Affected State" value={top?.state || 'N/A'} subtitle={`${top?.count.toLocaleString() || 0} declarations`} icon={<MapPin className="w-5 h-5" />} color="primary" />
        <StatCard title="States/Territories" value={totalStates} icon={<TrendingUp className="w-5 h-5" />} color="accent" />
        <StatCard title="Avg per State" value={avgPerState} icon={<AlertTriangle className="w-5 h-5" />} color="warning" />
        <StatCard title="Least Affected" value={stateData[stateData.length - 1]?.state || 'N/A'} subtitle={`${stateData[stateData.length - 1]?.count || 0} declarations`} icon={<Award className="w-5 h-5" />} color="destructive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartContainer title="Top 20 States by Declarations" subtitle="States with the highest number of disaster declarations">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stateData.slice(0, 20)} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="state" type="category" width={30} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Declarations">
                {stateData.slice(0, 20).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Choropleth Map" subtitle="Disaster frequency across US states">
  {stateData.length === 0 ? (
    <p className="text-muted-foreground text-sm">No data available</p>
  ) : (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
const state = stateData.find((d: any) => {
  const stateName = STATE_NAMES[d.state] || d.state;
  return (
    stateName === geo.properties.name ||
    stateName === geo.properties.NAME
  );
});

            return (
              <Geography
  key={geo.rsmKey}
  geography={geo}
  fill={state ? colorScale(state.count) : "#EEE"}
  stroke="#FFF"
  onMouseEnter={() => {
    setHoveredState({
      name: geo.properties.name || geo.properties.NAME,
      count: state?.count || 0
    });
  }}
  onMouseLeave={() => {
    setHoveredState(null);
  }}
  style={{
    default: { outline: "none" },
    hover: { fill: "#2563eb", outline: "none" },
    pressed: { outline: "none" }
  }}
/>
            );
          })
        }
      </Geographies>
    </ComposableMap>
  )}
  {hoveredState && (
  <div className="mt-2 text-sm text-foreground">
    <strong>{hoveredState.name}</strong> : {hoveredState.count} disasters
  </div>
)}
  
</ChartContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartContainer title={`Disaster Breakdown: ${top?.state || ''}`} subtitle={`Types of disasters in the most affected state`}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topTypes}>
              <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Declarations" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="State Risk Diversity" subtitle="Number of declarations vs. variety of disaster types (top 15 states)">
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <XAxis dataKey="count" name="Declarations" tick={{ fontSize: 10 }} />
              <YAxis dataKey="types" name="Disaster Types" tick={{ fontSize: 10 }} />
              <ZAxis range={[40, 400]} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass-card p-2.5 text-xs border border-border/80">
                    <p className="font-semibold text-foreground">{d.state}</p>
                    <p className="text-muted-foreground">Declarations: {d.count}</p>
                    <p className="text-muted-foreground">Disaster Types: {d.types}</p>
                  </div>
                );
              }} />
              <Scatter data={stateTypeDiversity} fill="hsl(280, 65%, 60%)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
