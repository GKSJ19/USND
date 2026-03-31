import { useEffect, useState, useMemo, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

const STATE_NAME_MAP: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  PR: "Puerto Rico",
};

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#ef4444", "#8b5cf6"];

function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    // Use the relative path starting with /api
    fetch("/api/data")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((resData) => {
        // Log this to see if it's hitting the error block or the data block
        console.log("Received data:", resData);
        
        if (Array.isArray(resData)) {
            setData(resData);
        } else if (resData.error) {
            console.error("Backend Error:", resData.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const processed = useMemo(() => {
    if (!data.length) return null;

    const incidentCount: Record<string, number> = {};
    const yearCount: Record<number, number> = {};
    const stateCountMap: Record<string, number> = {};
    const assistMap: Record<string, { name: string; ih: number; pa: number }> =
      {};
    const stormTrend: Record<number, number> = {};
    const fireTrend: Record<number, number> = {};
    const monthCount: Record<number, number> = {};
    const stackedData: Record<string, Record<string, number>> = {};

    data.forEach((d) => {
      const type = d.incident_type;
      const year = Number(d.fy_declared);
      const stateCode = d.state;
      const fullName = STATE_NAME_MAP[stateCode];

      // Counts
      if (type) incidentCount[type] = (incidentCount[type] || 0) + 1;
      if (year) yearCount[year] = (yearCount[year] || 0) + 1;
      if (fullName)
        stateCountMap[fullName] = (stateCountMap[fullName] || 0) + 1;

      // Assistance
      if (type) {
        if (!assistMap[type]) assistMap[type] = { name: type, ih: 0, pa: 0 };
        if (d.ih_program_declared === 1) assistMap[type].ih++;
        if (d.pa_program_declared === 1) assistMap[type].pa++;
      }

      // Trends
      if (year) {
        if (type?.includes("Storm"))
          stormTrend[year] = (stormTrend[year] || 0) + 1;
        if (type?.includes("Fire"))
          fireTrend[year] = (fireTrend[year] || 0) + 1;
      }

      // Monthly
      if (d.declaration_date) {
        const m = new Date(d.declaration_date).getMonth() + 1;
        monthCount[m] = (monthCount[m] || 0) + 1;
      }

      // Stacked (State + Incident)
      if (stateCode && type) {
        if (!stackedData[stateCode]) stackedData[stateCode] = {};
        stackedData[stateCode][type] = (stackedData[stateCode][type] || 0) + 1;
      }
    });

    return {
      incidenttypeData: Object.entries(incidentCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),

      yearlyData: Object.entries(yearCount)
        .map(([year, count]) => ({ year: Number(year), count }))
        .sort((a, b) => a.year - b.year),

      assistanceByIncidentData: Object.values(assistMap)
        .sort((a, b) => b.ih + b.pa - (a.ih + a.pa))
        .slice(0, 6),

      stormTrendData: Object.entries(stormTrend)
        .map(([year, count]) => ({ year: Number(year), count }))
        .sort((a, b) => a.year - b.year),

      fireTrendData: Object.entries(fireTrend)
        .map(([year, count]) => ({ year: Number(year), count }))
        .sort((a, b) => a.year - b.year),

      monthTrendData: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((name, i) => ({ month: name, count: monthCount[i + 1] || 0 })),

      statTotals: stateCountMap,
      stackChartData: Object.keys(stackedData).map((s) => ({
        state: s,
        ...stackedData[s],
      })),
    };
  }, [data]);

  // DESTRUCTURING (Only declare these names once here!)
  const {
    incidenttypeData = [],
    assistanceByIncidentData = [],
    stormTrendData = [],
    fireTrendData = [],
  } = processed || {};

  // Simple Stat calculations based on processed data
  const totalDeclarations = data.length;

  const yearCount: Record<string, number> = {};
  const stateCount: Record<string, number> = {};
  const incidentCount: Record<string, number> = {};
  const monthCount: Record<number, number> = {};
  const decadeCount: Record<string, number> = {};
  const weekdayCount: Record<string, number> = {};

  const stackedData: Record<string, Record<string, number>> = {};

  const sortedData = [...data].sort(
    (a, b) => (a.fy_declared || 0) - (b.fy_declared || 0),
  );

  sortedData.forEach((d) => {
    const state = d.state || d.state_name || d.region;
    const year = d.fy_declared;

    if (year) {
      yearCount[year] = (yearCount[year] || 0) + 1;
      const decade = Math.floor(year / 10) * 10 + "s";
      decadeCount[decade] = (decadeCount[decade] || 0) + 1;
    }

    if (state) stateCount[state] = (stateCount[state] || 0) + 1;

    if (d.incident_type) {
      incidentCount[d.incident_type] =
        (incidentCount[d.incident_type] || 0) + 1;

      if (state) {
        if (!stackedData[state]) stackedData[state] = {};
        stackedData[state][d.incident_type] =
          (stackedData[state][d.incident_type] || 0) + 1;
      }
    }

    if (d.declaration_date) {
      const dateObj = new Date(d.declaration_date);
      const m = dateObj.getMonth() + 1;
      monthCount[m] = (monthCount[m] || 0) + 1;

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = days[dateObj.getDay()];
      weekdayCount[dayName] = (weekdayCount[dayName] || 0) + 1;
    }
  });

  data.forEach((d) => {
    const state = d.state || d.state_name || d.region;

    if (d.fy_declared)
      yearCount[d.fy_declared] = (yearCount[d.fy_declared] || 0) + 1;

    if (state) stateCount[state] = (stateCount[state] || 0) + 1;

    if (d.incident_type)
      incidentCount[d.incident_type] =
        (incidentCount[d.incident_type] || 0) + 1;

    if (d.declaration_date) {
      const m = new Date(d.declaration_date).getMonth() + 1;
      monthCount[m] = (monthCount[m] || 0) + 1;
    }

    if (state && d.incident_type) {
      if (!stackedData[state]) stackedData[state] = {};
      stackedData[state][d.incident_type] =
        (stackedData[state][d.incident_type] || 0) + 1;
    }
  });

  // ===== TRANSFORM =====
  let runningTotal = 0;

  const yearData = Object.keys(yearCount)
    .sort()
    .map((y) => {
      runningTotal += yearCount[y];
      return {
        year: y,
        count: yearCount[y],
        cumulative: runningTotal,
      };
    });

  const stateData = Object.entries(stateCount).map(([k, v]) => ({
    state: k,
    count: v,
  }));

  const stackedChartData = Object.keys(stackedData).map((s) => ({
    state: s,
    ...stackedData[s],
  }));

  const incidentTypes = Object.keys(incidentCount);

  const lastYearEntry = yearData[yearData.length - 1];
  const prevYearEntry = yearData[yearData.length - 2];

  let yearlyTrend = 0;

  if (lastYearEntry && prevYearEntry && prevYearEntry.count > 0) {
    // 2. Calculate Percentage Change: ((New - Old) / Old) * 100
    yearlyTrend = Number(
      (
        ((lastYearEntry.count - prevYearEntry.count) / prevYearEntry.count) *
        100
      ).toFixed(1),
    );
  }

  const total = data.length;
  const states = new Set(stateData.map((s) => s.state)).size;
  const avgPerYear = total ? Math.round(total / 60) : 0;

  const stats = [
    { label: "Total Declarations", value: total, trend: yearlyTrend },
    { label: "States Covered", value: states },
    { label: "Incident Types", value: incidentTypes.length },
    { label: "Avg / Year", value: avgPerYear },
  ];

  const handleDownloadCSV = () => {
    const link = document.createElement("a");
    link.href = "/data/us_disaster_declarations.csv"; // Path to your file in the public folder
    link.setAttribute("download", "us_disaster_declarations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ===== ADVANCED TRANSFORMATIONS =====

  // ===== CONSOLIDATED TRANSFORMATIONS =====

  // 1. Yearly & Growth Stats

  const processedYearlyData = yearData.map((d, i, arr) => {
    const window = arr.slice(Math.max(0, i - 4), i + 1);
    const avg = window.reduce((sum, val) => sum + val.count, 0) / window.length;
    const prev = arr[i - 1]?.count || d.count;
    const growth = ((d.count - prev) / (prev || 1)) * 100; // Multiplied by 100 for percentage

    return {
      year: d.year,
      disasters: d.count,
      rollingAvg: Number(avg.toFixed(2)),
      growth: Number(growth.toFixed(1)),
    };
  });

  // 2. Monthly Trend (Mapping 1-12 to Month Names)
  const monthlyTrendData = Object.keys(monthCount)
    .sort((a, b) => Number(a) - Number(b))
    .map((m) => ({
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][Number(m) - 1],
      count: monthCount[Number(m)],
    }));

  // 3. Incident Type Trends (Consolidated Logic)
  // ===== FIXED INCIDENT TREND LOGIC =====
  const trendMap: Record<string, any> = {};

  // We use a broader check or a smaller set of high-frequency types found in FEMA data
  const targetTypes = [
    "Fire",
    "Flood",
    "Severe Storm",
    "Biological",
    "Tornado",
    "Snow",
  ];

  data.forEach((d) => {
    const year = d.fy_declared;
    const rawType = d.incident_type || "";

    // Find which of our target types matches the raw string
    const matchedType = targetTypes.find((t) => rawType.includes(t));

    if (year && year >= 2000 && matchedType) {
      if (!trendMap[year]) {
        trendMap[year] = { year };
        targetTypes.forEach((t) => (trendMap[year][t] = 0));
      }
      trendMap[year][matchedType]++;
    }
  });

  // 1. Process Incident Type Trends (Top 5 types across years)
  const incidentTrendData = useMemo(() => {
    const trendMap = new Map();

    // Define target types EXACTLY as they appear in the <Line /> dataKey
    const targetTypes = [
      "Fire",
      "Flood",
      "Severe Storm",
      "Biological",
      "Tornado",
    ];

    data.forEach((d) => {
      const year = d.fy_declared;
      const type = d.incident_type;

      // Filter post-2000 for cleaner visualization, consistent with your UI
      if (year && year >= 1950) {
        if (!trendMap.has(year)) {
          // Initialize the year object with 0s for all types
          // Define the type: a string key that maps to any (or number)
          const initYear: Record<string, any> = { year };

          targetTypes.forEach((t) => {
            (initYear as Record<string, any>)[t] = 0;
          });

          trendMap.set(year, initYear);
        }

        // Check for exact match or partial match (e.g., "Severe Storm(s)")
        const matchedType = targetTypes.find((t) => type?.includes(t));
        if (matchedType) {
          trendMap.get(year)[matchedType]++;
        }
      }
    });

    // Convert Map to sorted array
    return Array.from(trendMap.values()).sort((a, b) => a.year - b.year);
  }, [data]);

  // 1. Total Disasters per State (Corrected for Map Names)
  const stateTotals = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      // Map "GA" -> "Georgia" so D3 can find it
      const fullName = STATE_NAME_MAP[d.state];
      if (fullName) {
        counts[fullName] = (counts[fullName] || 0) + 1;
      }
    });
    return counts;
  }, [data]);

  // 2. Hurricane/Severe Storm Focus (Corrected for Map Names)
  const hurricaneImpactData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      const fullName = STATE_NAME_MAP[d.state];
      const type = d.incident_type;

      // Check if it's a storm and use the Full Name as the key
      if (
        fullName &&
        (type?.includes("Hurricane") || type?.includes("Storm"))
      ) {
        counts[fullName] = (counts[fullName] || 0) + 1;
      }
    });
    return counts;
  }, [data]);

  const USChoroplethMap = ({ counts }: { counts: Record<string, number> }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
      const renderMap = async () => {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
        );
        const us = await response.json();
        const states = topojson.feature(us, us.objects.states) as any;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 960;
        const height = 600;
        const projection = d3
          .geoAlbersUsa()
          .scale(1280)
          .translate([width / 2, height / 2]);
        const path = d3.geoPath().projection(projection);

        // Dynamic scale based on your CSV max value
        const maxVal = d3.max(Object.values(counts)) || 50;
        const colorScale = d3
          .scaleSequential(d3.interpolateReds)
          .domain([0, maxVal]);

        const g = svg.append("g");
        const zoom = d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 8])
          .on("zoom", (e) => {
            g.attr("transform", e.transform);
            setZoomLevel(e.transform.k);
          });
        svg.call(zoom as any);
        (svg.node() as any).__zoom = zoom;

        g.selectAll("path")
          .data(states.features)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", (d: any) => colorScale(counts[d.properties.name] || 0))
          .attr("stroke", "#ffffff20")
          .attr("stroke-width", 0.5)
          .attr("class", "hover:stroke-white cursor-pointer transition-colors")
          .append("title") // Native tooltip for simplicity
          .text(
            (d: any) =>
              `${d.properties.name}: ${counts[d.properties.name] || 0} declarations`,
          );
      };
      renderMap();
    }, [counts]);

    return (
      <div className="relative w-full h-full min-h-[500px]">
        <div className="absolute top-4 right-4 z-10 bg-slate-900/80 px-3 py-1 rounded text-[10px] text-white font-mono">
          ZOOM: {zoomLevel.toFixed(1)}x
        </div>
        <svg ref={svgRef} viewBox="0 0 960 600" className="w-full h-full" />
      </div>
    );
  };

  const HurricaneChoroplethMap = ({
    counts,
  }: {
    counts: Record<string, number>;
  }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
      const renderMap = async () => {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
        );
        const us = await response.json();
        const states = topojson.feature(us, us.objects.states) as any;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
        const path = d3.geoPath().projection(projection);

        // Custom Risk Palette
        const maxVal = d3.max(Object.values(counts)) || 100;
        const colorScale = (val: number) => {
          const p = val / maxVal;
          if (p > 0.8) return "#facc15"; // High
          if (p > 0.5) return "#fb923c"; // Med-High
          if (p > 0.2) return "#db2777"; // Medium
          if (p > 0.05) return "#4c1d95"; // Low
          return "#1e293b"; // Minimal
        };

        const g = svg.append("g");
        g.selectAll("path")
          .data(states.features)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", (d: any) => colorScale(counts[d.properties.name] || 0))
          .attr("stroke", "#ffffff10")
          .attr("stroke-width", 0.5)
          .append("title")
          .text(
            (d: any) =>
              `${d.properties.name} Risk Index: ${counts[d.properties.name] || 0}`,
          );
      };
      renderMap();
    }, [counts]);

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 960 600"
        className="w-full h-full min-h-[500px]"
      />
    );
  };

  const regionalDisasterData = useMemo(() => {
    const regions: Record<string, number> = {
      Northeast: 0,
      Midwest: 0,
      South: 0,
      West: 0,
    };

    const regionMapping: Record<string, string> = {
      // Northeast
      CT: "Northeast",
      ME: "Northeast",
      MA: "Northeast",
      NH: "Northeast",
      RI: "Northeast",
      VT: "Northeast",
      NJ: "Northeast",
      NY: "Northeast",
      PA: "Northeast",
      // Midwest
      IL: "Midwest",
      IN: "Midwest",
      MI: "Midwest",
      OH: "Midwest",
      WI: "Midwest",
      IA: "Midwest",
      KS: "Midwest",
      MN: "Midwest",
      MO: "Midwest",
      NE: "Midwest",
      ND: "Midwest",
      SD: "Midwest",
      // South
      DE: "South",
      FL: "South",
      GA: "South",
      MD: "South",
      NC: "South",
      SC: "South",
      VA: "South",
      WV: "South",
      AL: "South",
      KY: "South",
      MS: "South",
      TN: "South",
      AR: "South",
      LA: "South",
      OK: "South",
      TX: "South",
      DC: "South",
      // West
      AZ: "West",
      CO: "West",
      ID: "West",
      MT: "West",
      NV: "West",
      NM: "West",
      UT: "West",
      WY: "West",
      AK: "West",
      CA: "West",
      HI: "West",
      OR: "West",
      WA: "West",
    };

    data.forEach((d) => {
      const region = regionMapping[d.state];
      if (region) {
        regions[region]++;
      }
    });

    return Object.entries(regions).map(([region, count]) => ({
      region,
      count,
    }));
  }, [data]);

  const heatmapMatrixData = useMemo(() => {
    const topStates = stateData.slice(0, 25).map((s) => s.state);
    const result: { state: string; incident: string; value: number }[] = [];

    topStates.forEach((state) => {
      incidentTypes.forEach((incident) => {
        result.push({
          state,
          incident,
          value: stackedData[state]?.[incident] || 0,
        });
      });
    });
    return result;
  }, [stateData, incidentTypes, stackedData]);

  const heatmapStatesList = useMemo(
    () => stateData.slice(0, 25).map((s) => s.state),
    [stateData],
  );

  const HeatmapChart = ({
    data,
    states,
    incidents,
  }: {
    data: any[];
    states: string[];
    incidents: string[];
  }) => {
    const getColor = (value: number) => {
      if (value === 0) return "rgba(255,255,255,0.03)";
      const maxVal = Math.max(...data.map((d) => d.value)) || 100;
      const intensity = Math.min(value / maxVal, 1);

      // Using an Orange/Red scale to match your "Spatial Intensity" theme
      if (intensity < 0.5) {
        const t = intensity * 2;
        return `rgb(${Math.floor(30 + 225 * t)}, ${Math.floor(41 + 100 * t)}, ${Math.floor(59 + 20 * t)})`;
      } else {
        const t = (intensity - 0.5) * 2;
        return `rgb(249, ${Math.floor(115 * (1 - t) + 30 * t)}, ${Math.floor(22 * (1 - t) + 30 * t)})`;
      }
    };

    return (
      <div className="flex items-start bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50">
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px]">
            <div className="flex mb-4">
              <div className="w-16 shrink-0" />
              <div className="flex flex-1">
                {incidents.map((incident) => (
                  <div key={incident} className="flex-1 relative h-32">
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-[-45deg] origin-bottom-left whitespace-nowrap text-[10px] font-black uppercase tracking-tighter text-slate-500">
                      {incident}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-[2px]">
              {states.map((state) => (
                <div key={state} className="flex items-center h-6">
                  <div className="w-16 shrink-0 text-[11px] font-black text-slate-400 text-right pr-4">
                    {state}
                  </div>
                  <div className="flex flex-1 h-full gap-[2px]">
                    {incidents.map((incident) => {
                      const item = data.find(
                        (d) => d.state === state && d.incident === incident,
                      );
                      const val = item ? item.value : 0;
                      return (
                        <div
                          key={incident}
                          className="flex-1 h-full transition-all hover:scale-125 hover:z-10 cursor-crosshair group relative rounded-[1px]"
                          style={{ backgroundColor: getColor(val) }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-2xl">
                            <div className="font-black text-orange-500 mb-1">
                              {state} • {incident}
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500 uppercase">
                                Declarations:
                              </span>
                              <span className="font-mono font-bold">{val}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Legend Scale */}
        <div className="flex flex-col items-center gap-4 ml-8">
          <div className="h-[300px] w-3 bg-gradient-to-t from-slate-800 via-orange-500 to-red-600 rounded-full" />
          <div className="flex flex-col justify-between h-[300px] text-[9px] font-black text-slate-500 uppercase">
            <span>High</span>
            <span>Mid</span>
            <span>Low</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex w-screen min-h-screen bg-[#0b1120] text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#020617] p-4 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-6">FEMA Analytics</h2>
        {[
          "overview",
          "approach",
          "temporal",
          "geographic",
          "incident type",
          "heatmap",
        ].map((sec) => (
          <div
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`cursor-pointer px-3 py-2 rounded-lg mb-2 capitalize ${
              activeSection === sec
                ? "bg-pink-600"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {sec}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-10">
        {activeSection === "overview" && (
          <div className="space-y-10 animate-in fade-in duration-700">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden p-14 rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black border border-slate-800">
              <div className="absolute top-10 right-10 z-20">
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-200 text-sm font-bold rounded-xl border border-slate-700 backdrop-blur-md transition-all active:scale-95 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export Dataset
                </button>
              </div>
              <div className="relative z-10 max-w-4xl">
                <span className="px-4 py-1.5 text-sm font-bold text-blue-400 bg-blue-900/30 rounded-full border border-blue-500/30 tracking-wide">
                  National Disaster Database • 1953 - 2024
                </span>
                <h1 className="mt-8 text-7xl font-extrabold tracking-tighter text-white leading-[1.1]">
                  Visualizing U.S. Natural <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    Disaster Declarations
                  </span>
                </h1>
                <p className="mt-8 text-xl text-slate-300 leading-relaxed max-w-3xl">
                  This dashboard presents a comprehensive analysis of U.S.
                  natural disaster declarations. Explore how disaster patterns
                  have evolved over time, how they vary across different
                  regions, and which types of disasters are becoming more
                  frequent.
                </p>
                <div className="mt-12 flex gap-5">
                  <button
                    onClick={() => setActiveSection("temporal")}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition-all shadow-xl shadow-blue-500/25"
                  >
                    Start Exploring
                  </button>

                  <button
                    onClick={() => setActiveSection("approach")}
                    className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                  >
                    View Approach
                  </button>
                </div>
              </div>
              {/* Subtle background glow */}
              <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {/* AT A GLANCE (Stats) */}
              <div className="lg:col-span-1 space-y-8">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <span className="w-1.5 h-10 bg-blue-500 rounded-full" /> At a
                  Glance
                </h2>
                <div className="grid grid-cols-2 gap-5">
                  {stats.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#0f172a] p-7 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-colors shadow-lg"
                    >
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                        {item.label}
                      </p>
                      <h3 className="text-4xl font-black mt-3 text-white">
                        {item.value}
                      </h3>
                      <div className="mt-3 text-xs text-blue-400 font-bold flex items-center gap-1">
                        {item.trend || "↑ 12% vs Avg"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRIMARY INCIDENT CATEGORIES */}
              <div className="lg:col-span-2 space-y-8">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <span className="w-1.5 h-10 bg-indigo-500 rounded-full" />{" "}
                  Primary Incident Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    {
                      label: "Severe Storm",
                      count: "28.4k",
                      color: "bg-blue-500",
                      icon: "⛈️",
                    },
                    {
                      label: "Flood",
                      count: "12.2k",
                      color: "bg-cyan-500",
                      icon: "🌊",
                    },
                    {
                      label: "Fire",
                      count: "6.4k",
                      color: "bg-orange-500",
                      icon: "🔥",
                    },
                    {
                      label: "Hurricane",
                      count: "5.2k",
                      color: "bg-purple-500",
                      icon: "🌀",
                    },
                  ].map((cat, i) => (
                    <div
                      key={i}
                      className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-800/30 transition-all"
                    >
                      <div
                        className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-2xl`}
                      >
                        {cat.icon}
                      </div>
                      <p className="text-white font-bold text-lg">
                        {cat.label}
                      </p>
                      <p className="text-slate-400 text-sm font-medium mt-1">
                        {cat.count} Declarations
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KEY INSIGHTS SECTION */}
            <div className="p-10 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <span className="p-2.5 bg-amber-500/20 rounded-xl text-amber-500">
                  💡
                </span>{" "}
                Key Insights
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-all">
                  <p className="text-base text-slate-300 leading-relaxed">
                    <strong className="text-blue-400 text-lg block mb-2">
                      Rising Frequency:
                    </strong>
                    The data reveals a clear upward trend in disaster
                    declarations since the 1990s, suggesting increased reporting
                    and extreme weather events.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-all">
                  <p className="text-base text-slate-300 leading-relaxed">
                    <strong className="text-green-400 text-lg block mb-2">
                      Regional Hotspots:
                    </strong>
                    Coastal areas in the Southeast and West Coast show the
                    highest concentration of high-impact events like Hurricanes
                    and Wildfires.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-all">
                  <p className="text-base text-slate-300 leading-relaxed">
                    <strong className="text-purple-400 text-lg block mb-2">
                      Seasonal Cycles:
                    </strong>
                    Spring and Late Summer remain the most volatile periods for
                    weather-related disasters across the continental U.S.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "approach" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* SECTION HEADER */}
            <div className="max-w-3xl">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Our <span className="text-blue-500">Methodology</span>
              </h2>
              <p className="mt-6 text-xl text-slate-400 leading-relaxed">
                Transforming raw FEMA disaster data into actionable geographic
                and temporal insights through a modern data processing pipeline.
              </p>
            </div>

            {/* THREE-STEP PROCESS CARDS */}
            <div className="grid md:grid-cols-3 gap-10">
              {/* Step 1: Data Collection */}
              <div className="group bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                  📥
                </div>
                <h3 className="text-2xl font-bold text-white mb-5">
                  1. Data Ingestion
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Retrieving live data from the FEMA Open Data API. We target
                  the
                  <strong className="text-slate-200">
                    {" "}
                    Disaster Declarations Summaries
                  </strong>{" "}
                  dataset, covering records from 1953 to the present day.
                </p>
              </div>

              {/* Step 2: Processing */}
              <div className="group bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                  ⚙️
                </div>
                <h3 className="text-2xl font-bold text-white mb-5">
                  2. Processing & ETL
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Using FastAPI and Pandas to clean missing values, normalize
                  disaster categories, and aggregate count data by state and
                  year for optimized frontend rendering.
                </p>
              </div>

              {/* Step 3: Visualization */}
              <div className="group bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 hover:border-purple-500/50 transition-all duration-300 shadow-xl">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h3 className="text-2xl font-bold text-white mb-5">
                  3. Interactive Visualization
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Rendering insights through{" "}
                  <strong className="text-slate-200">Plotly.js</strong> and{" "}
                  <strong className="text-slate-200">Recharts</strong>. Dynamic
                  filtering allows users to drill down into specific incident
                  types or timeframes.
                </p>
              </div>
            </div>

            {/* THE DATA STACK FOOTER */}
            <div className="bg-gradient-to-r from-[#0f172a] to-transparent p-10 rounded-[2rem] border-l-8 border-blue-500 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                  <h4 className="text-2xl font-bold text-white">
                    The Technical Stack
                  </h4>
                  <p className="text-slate-500 text-lg mt-1">
                    Tools used to build this analysis
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Python",
                    "FastAPI",
                    "React",
                    "Tailwind",
                    "Plotly",
                    "FEMA API",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-6 py-3 bg-slate-900 text-slate-200 text-sm font-bold rounded-xl border border-slate-800 shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "temporal" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* SECTION HEADER */}
            <div className="flex flex-col gap-4 max-w-3xl">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Temporal Analysis
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Visualizing the intersection of seasonal peaks and long-term
                disaster category shifts.
              </p>
            </div>

            {/* NEW TOP ROW: SEASONALITY & INCIDENT TYPES */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Chart 1: Monthly Seasonality */}
              <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">
                    Monthly Seasonality
                  </h3>
                  <p className="text-xs text-slate-400">
                    Concentration of declarations by month
                  </p>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData}>
                      <defs>
                        <linearGradient
                          id="colorMonth"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#facc15"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#facc15"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={true}
                        axisLine={true}
                      />
                      <YAxis fontSize={12} tickLine={true} axisLine={true} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderRadius: "12px",
                          border: "none",
                        }}
                        itemStyle={{ color: "#facc15" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#facc15"
                        strokeWidth={3}
                        fill="url(#colorMonth)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Incident Type Trends */}
              {/* Chart 2: Incident Type Trends */}
              <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">
                    Incident Type Trends
                  </h3>
                  <p className="text-xs text-slate-400">
                    Post-1950 category volume
                  </p>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={incidentTrendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#ffffff05"
                      />
                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={true}
                        axisLine={true}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={true}
                        axisLine={true}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderRadius: "12px",
                          border: "none",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "12px",
                          paddingTop: "10px",
                        }}
                      />
                      {/* Ensure these dataKey strings match targetTypes in the logic above */}
                      <Line
                        type="monotone"
                        dataKey="Fire"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Flood"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Severe Storm"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Biological"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Tornado"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* SECOND ROW: YEARLY TOTALS & ROLLING AVERAGE */}
            <div className="grid lg:grid-cols-2 gap-10">
              {/* 3. Yearly Disaster Trend */}
              <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-2xl group hover:border-blue-500/30 transition-all">
                <h3 className="text-lg font-bold text-white mb-6">
                  Yearly Frequency
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearData}>
                      <XAxis
                        dataKey="year"
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={true}
                        axisLine={true}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={true}
                        axisLine={true}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #1e293b",
                          borderRadius: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 4. 5-Year Rolling Average */}
              <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-2xl group hover:border-cyan-500/30 transition-all">
                <h3 className="text-lg font-bold text-white mb-6">
                  Rolling Average
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedYearlyData}>
                      <XAxis
                        dataKey="year"
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={true}
                        axisLine={true}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={true}
                        axisLine={true}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #1e293b",
                          borderRadius: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rollingAvg"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* FINAL ROW: YoY GROWTH RATE */}
            <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-2xl group hover:border-pink-500/30 transition-all">
              <h3 className="text-lg font-bold text-white mb-6">
                Year-over-Year Growth Rate
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processedYearlyData}>
                    <XAxis
                      dataKey="year"
                      stroke="#94a3b8"
                      fontSize={10}
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      axisLine={true}
                      tickLine={true}
                      width={40}
                      tickFormatter={(value) => `${value}%`} // Useful for growth rates
                    />
                    <ReferenceLine y={0} stroke="#ffffff20" />
                    <Area
                      type="monotone"
                      dataKey="growth"
                      fill="#ec489920"
                      stroke="#ec4899"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeSection === "geographic" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
            {/* 1. SECTION HEADER */}
            <div className="flex flex-col gap-4 max-w-3xl">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Geographic Distribution
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Mapping the impact across federal territories. Data suggests
                that coastal vulnerability and regional climates are the primary
                drivers for recurring emergency declarations.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* LEFT SIDE: STATE LEADERBOARD */}
              <div className="lg:w-1/3 space-y-8">
                <div className="bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-2xl sticky top-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500 text-lg">
                      🗺️
                    </span>
                    State Insights
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">
                      Top Impacted States
                    </h3>
                    {stateData
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)
                      .map((state, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black border border-emerald-500/20">
                              {idx + 1}
                            </span>
                            <span className="text-base text-slate-200 font-bold group-hover:text-emerald-400 transition-colors">
                              {state.state}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                            {state.count.toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="mt-10 p-6 rounded-2xl bg-blue-900/10 border border-blue-500/20">
                    <h4 className="text-blue-400 text-sm font-black uppercase tracking-widest mb-2">
                      Observation
                    </h4>
                    <p className="text-sm text-blue-300/80 leading-relaxed font-medium">
                      Texas leads the nation in declarations, reflecting its
                      massive geographic diversity and exposure to both Gulf
                      storms and central plains weather.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: ADVANCED VISUALIZATIONS */}
              <div className="lg:w-2/3 space-y-12">
                {/* 2. National Disaster Density (Choropleth) */}
                <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">
                      National Disaster Density
                    </h3>
                    <p className="text-sm text-slate-400">
                      Heatmap of historical federal disaster declarations
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/40 relative overflow-hidden rounded-xl">
                    <USChoroplethMap counts={stateTotals} />
                  </div>
                </div>

                {/* 3. Hurricane Hotspots (Choropleth) */}
                <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Hurricane Vulnerability
                    </h3>
                    <p className="text-sm text-slate-400">
                      Risk concentration along the Atlantic and Gulf coasts
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/40 relative overflow-hidden rounded-xl">
                    <HurricaneChoroplethMap counts={hurricaneImpactData} />
                  </div>
                </div>

                {/* 4. Regional Distribution Bar Chart */}
                <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Regional Distribution
                    </h3>
                    <p className="text-sm text-slate-400">
                      Total federal disaster declarations by U.S. Census Region
                    </p>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionalDisasterData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#ffffff10"
                        />
                        <XAxis
                          dataKey="region"
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "#ffffff05" }}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            border: "1px solid #ffffff10",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                    <p className="text-xs text-blue-300/70 italic">
                      * Insight: The South region often exhibits higher counts
                      due to a high frequency of both tropical cyclones and
                      severe convective storms.
                    </p>
                  </div>
                </div>

                {/* 4. Top 10 States Bar Chart */}
                <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Top 10 States by Declaration Count
                  </h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stateData
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 10)}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#ffffff10"
                        />
                        <XAxis
                          dataKey="state"
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "#ffffff05" }}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            border: "1px solid #ffffff10",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Incident Type Distribution (Stacked 100%) */}
                <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Comparative Incident Breakdown
                  </h3>
                  <p className="text-sm text-slate-400 mb-8">
                    Percentage distribution of disaster types across top states
                  </p>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stackedChartData.slice(0, 10)}
                        stackOffset="expand"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#ffffff10"
                        />
                        <XAxis
                          dataKey="state"
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                          tickFormatter={(val) => `${Math.round(val * 100)}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            border: "1px solid #ffffff10",
                          }}
                          formatter={(value: any) => [`${value} cases`, ""]}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          wrapperStyle={{ fontSize: "10px", color: "#94a3b8" }}
                        />
                        {/* Dynamically render bars based on your incident types */}
                        <Bar dataKey="Flood" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="Fire" stackId="a" fill="#ef4444" />
                        <Bar
                          dataKey="Severe Storm"
                          stackId="a"
                          fill="#8b5cf6"
                        />
                        <Bar dataKey="Biological" stackId="a" fill="#10b981" />
                        <Bar dataKey="Snow" stackId="a" fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* NARRATIVE SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-slate-900/40 p-8 rounded-3xl border-l-8 border-l-blue-600 border border-slate-800">
                <h4 className="text-xl font-bold text-white mb-4">
                  The Tornado Alley Effect
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Oklahoma and Texas experience the highest density of severe
                  storm declarations, leading to complex infrastructure recovery
                  needs compared to single-event regions.
                </p>
              </div>
              <div className="bg-slate-900/40 p-8 rounded-3xl border-l-8 border-l-emerald-600 border border-slate-800">
                <h4 className="text-xl font-bold text-white mb-4">
                  Western Wildfire Paradigm
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  California's data shows a distinct shift toward Fire
                  declarations over the last decade, necessitating different
                  federal response strategies than the flood-prone East.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "incident type" && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col gap-4 max-w-3xl">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Incident Classification
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Breaking down federal response by disaster category. Data
                highlights a shift from localized weather events to broad-scale
                biological and climatic hazards.
              </p>
            </div>

            {/* TOP ROW: RANKING & FREQUENCY */}
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    Incident Volume Ranking
                  </h3>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Using incidenttypeData from your useMemo */}
                    <BarChart data={incidenttypeData.slice(0, 8)}>
                      <XAxis
                        dataKey="name"
                        stroke="#475569"
                        fontSize={10}
                        tickMargin={12}
                      />
                      <YAxis stroke="#475569" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #334155",
                          borderRadius: "16px",
                        }}
                        cursor={{ fill: "rgba(168, 85, 247, 0.05)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#a855f7"
                        radius={[8, 8, 0, 0]}
                        barSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">
                    Relative Frequency
                  </h3>
                  <div className="space-y-8">
                    {/* Using incidenttypeData for progress bars */}
                    {incidenttypeData.slice(0, 5).map((item, i) => (
                      <div key={i} className="space-y-3 group">
                        <div className="flex justify-between text-sm font-black uppercase">
                          <span className="text-slate-200 group-hover:text-purple-400 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-purple-500 font-mono">
                            {totalDeclarations > 0
                              ? (
                                  (item.value / totalDeclarations) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                            style={{
                              width: `${(item.value / (incidenttypeData[0]?.value || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: PROGRAM SHARE */}
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6">
                  Hazard Distribution
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incidenttypeData.slice(0, 6)}
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {incidenttypeData.slice(0, 6).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6">
                  Assistance Type Comparison
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Using assistanceByIncidentData from your assistMap logic */}
                    <BarChart data={assistanceByIncidentData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#ffffff10"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #ffffff10",
                        }}
                      />
                      <Legend verticalAlign="top" align="right" />
                      <Bar
                        dataKey="ih"
                        name="Individual"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="pa"
                        name="Public"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: SPECIFIC HAZARD TRENDS */}
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6">
                  Severe Storm Volatility
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Using stormTrendData from your stormTrend logic */}
                    <AreaChart data={stormTrendData}>
                      <defs>
                        <linearGradient
                          id="colorStorm"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" hide />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        fill="url(#colorStorm)"
                        strokeWidth={3}
                      />
                      <Tooltip />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6">
                  Fire Hazard Intensity
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Using fireTrendData from your fireTrend logic */}
                    <AreaChart data={fireTrendData}>
                      <defs>
                        <linearGradient
                          id="colorFire"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" hide />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#ef4444"
                        fill="url(#colorFire)"
                        strokeWidth={3}
                      />
                      <Tooltip />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "heatmap" && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-1000">
            {/* HEADER & ANALYTIC STRIP */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0f172a] p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tight">
                  <span className="p-3 bg-orange-500/20 rounded-2xl text-orange-500 text-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    🌡️
                  </span>
                  Spatial Intensity Matrix
                </h2>
                <p className="text-slate-400 text-lg mt-4 leading-relaxed font-medium">
                  Visualizing the intersection of geographic vulnerability and
                  disaster categories. Identifying{" "}
                  <span className="text-white">"Hot Zones"</span> where hazards
                  cluster, driving strategic federal resource allocation.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-w-[200px]">
                <div className="px-6 py-3 bg-slate-900/80 text-orange-400 text-xs font-black uppercase tracking-[0.25em] rounded-2xl border border-orange-500/30 flex items-center justify-center gap-3">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
                  Pattern Detection Live
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[78%] shadow-[0_0_15px_#f97316]" />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">
                State-Incident Matrix
              </h3>
              <p className="text-xs text-slate-500 uppercase font-black tracking-[0.3em] mt-2">
                Cross-Categorical Distribution Index
              </p>
            </div>

            <div className="relative z-10">
              <HeatmapChart
                data={heatmapMatrixData}
                states={heatmapStatesList}
                incidents={incidentTypes}
              />
            </div>

            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
          </div>
        )}

        <footer className="text-center text-gray-500 text-sm pt-6 border-t border-gray-800">
          © 2026 Disaster Analytics Dashboard
        </footer>
      </div>
    </div>
  );
}

export default App;
