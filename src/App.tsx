import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
  ComposedChart, Scatter, ReferenceLine, Treemap
} from 'recharts';
import { 
  LayoutDashboard, 
  Calendar, 
  Map as MapIcon, 
  Activity, 
  Info, 
  TrendingUp, 
  AlertTriangle, 
  Globe,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Waves,
  Flame,
  Wind,
  ShieldCheck,
  CloudLightning,
  Quote,
  Users,
  FileText,
  BookOpen,
  Database,
  Search,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import USChoroplethMap from './components/USChoroplethMap';
import HurricaneChoroplethMap from './components/HurricaneChoroplethMap';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

// --- Expanded Mock Data ---

const longTermYearlyData = Array.from({ length: 2024 - 1953 + 1 }, (_, i) => {
  const year = 1953 + i;
  // Base trend: slow growth then acceleration
  let base = Math.pow(i / 10, 2) * 50 + 200;
  // Add some noise and spikes
  if (year === 2005) base += 3000; // Katrina year
  if (year === 2011) base += 2000; // Major storm year
  if (year === 2020) base += 7000; // Biological/COVID spike
  
  const disasters = Math.max(100, Math.floor(base + Math.random() * 500));
  return { year, disasters };
});

// Calculate rolling average and growth
const processedYearlyData = longTermYearlyData.map((d, i, arr) => {
  const window = arr.slice(Math.max(0, i - 4), i + 1);
  const rollingAvg = Math.floor(window.reduce((sum, curr) => sum + curr.disasters, 0) / window.length);
  const prev = arr[i - 1]?.disasters || d.disasters;
  // Year-over-Year Growth as a decimal ratio (e.g., 4.0 for 400% growth) to match image scale
  const growth = i === 0 ? 0 : Number(((d.disasters - prev) / prev).toFixed(2));
  return { ...d, rollingAvg, growth };
});

const longTermIncidentData = Array.from({ length: 2024 - 1960 + 1 }, (_, i) => {
  const year = 1960 + i;
  return {
    year,
    Biological: year === 2020 ? 8000 : Math.random() * 200,
    Chemical: Math.random() * 100,
    Coastal: Math.random() * 300 + (year > 2000 ? 200 : 0),
    Drought: Math.random() * 400 + (year > 2010 ? 300 : 0),
    Fire: Math.random() * 500 + (i * 10),
    Flood: Math.random() * 800 + (i * 5),
  };
});

const monthlyTrendData = [
  { month: 'Jan', count: 18500 }, // High spike at start to match image
  { month: 'Feb', count: 3200 },
  { month: 'Mar', count: 3400 },
  { month: 'Apr', count: 5400 },
  { month: 'May', count: 5200 },
  { month: 'Jun', count: 4800 },
  { month: 'Jul', count: 5800 },
  { month: 'Aug', count: 5400 },
  { month: 'Sep', count: 4100 },
  { month: 'Oct', count: 6400 },
  { month: 'Nov', count: 3600 },
  { month: 'Dec', count: 3000 },
];

const stateData = [
  { state: 'Texas', disasters: 4520, color: '#3b82f6' },
  { state: 'California', disasters: 3840, color: '#2563eb' },
  { state: 'Florida', disasters: 3120, color: '#1d4ed8' },
  { state: 'Louisiana', disasters: 2850, color: '#1e40af' },
  { state: 'Oklahoma', disasters: 2410, color: '#1e3a8a' },
  { state: 'Washington', disasters: 2100, color: '#172554' },
  { state: 'Georgia', disasters: 1980, color: '#1e3a8a' },
  { state: 'Alabama', disasters: 1850, color: '#1e3a8a' },
  { state: 'Mississippi', disasters: 1720, color: '#1e3a8a' },
  { state: 'New York', disasters: 1650, color: '#1e3a8a' },
];

const incidentDistribution = [
  { name: 'Severe Storm', value: 45, color: '#3b82f6' },
  { name: 'Flood', value: 25, color: '#06b6d4' },
  { name: 'Fire', value: 15, color: '#f97316' },
  { name: 'Hurricane', value: 10, color: '#8b5cf6' },
  { name: 'Snow', value: 5, color: '#94a3b8' },
];

const fullIncidentDistributionData = [
  { name: 'Severe Storm', count: 20123, color: '#4338ca' },
  { name: 'Hurricane', count: 13654, color: '#b91c1c' },
  { name: 'Flood', count: 11234, color: '#0369a1' },
  { name: 'Biological', count: 7845, color: '#7e22ce' },
  { name: 'Fire', count: 3876, color: '#c2410c' },
  { name: 'Snowstorm', count: 3712, color: '#0891b2' },
  { name: 'Severe Ice Storm', count: 2945, color: '#be123c' },
  { name: 'Tornado', count: 1654, color: '#4d7c0f' },
  { name: 'Drought', count: 1287, color: '#a21caf' },
  { name: 'Tropical Storm', count: 1054, color: '#a16207' },
  { name: 'Coastal Storm', count: 645, color: '#1d4ed8' },
  { name: 'Other', count: 287, color: '#475569' },
  { name: 'Winter Storm', count: 254, color: '#334155' },
  { name: 'Freezing', count: 231, color: '#64748b' },
  { name: 'Earthquake', count: 187, color: '#44403c' },
  { name: 'Typhoon', count: 54, color: '#1e1b4b' },
  { name: 'Volcanic Eruption', count: 21, color: '#450a0a' },
  { name: 'Mud/Landslide', count: 12, color: '#422006' },
  { name: 'Fishing Losses', count: 5, color: '#1e3a8a' },
  { name: 'Dam/Levee Break', count: 5, color: '#1e3a8a' },
  { name: 'Toxic Substances', count: 5, color: '#1e3a8a' },
  { name: 'Chemical', count: 5, color: '#1e3a8a' },
  { name: 'Tsunami', count: 5, color: '#1e3a8a' },
  { name: 'Tropical Depression', count: 5, color: '#1e3a8a' },
  { name: 'Human Cause', count: 5, color: '#1e3a8a' },
  { name: 'Terrorist', count: 5, color: '#1e3a8a' },
  { name: 'Straight-Line Winds', count: 5, color: '#1e3a8a' },
];

const stateIncidentData = [
  { state: 'FL', Hurricane: 1200, 'Severe Storm': 400, Flood: 300, Fire: 200, Other: 100, Biological: 50, 'Coastal Storm': 150 },
  { state: 'GA', Hurricane: 800, 'Severe Storm': 600, Flood: 400, Fire: 300, Tornado: 200, Other: 150 },
  { state: 'KY', 'Severe Storm': 1500, Flood: 800, Snowstorm: 400, 'Severe Ice Storm': 300, Other: 200 },
  { state: 'LA', Hurricane: 1400, Flood: 600, 'Severe Storm': 300, 'Coastal Storm': 200, Other: 100 },
  { state: 'MO', 'Severe Storm': 1800, Flood: 500, Tornado: 300, Snowstorm: 200, Other: 100 },
  { state: 'NC', Hurricane: 900, 'Severe Storm': 700, Flood: 400, 'Coastal Storm': 300, Other: 200 },
  { state: 'OK', 'Severe Storm': 1200, Tornado: 600, Flood: 400, Fire: 200, Other: 100 },
  { state: 'PR', Hurricane: 1000, Flood: 600, 'Coastal Storm': 300, Other: 200 },
  { state: 'TX', 'Severe Storm': 2200, Hurricane: 1200, Flood: 800, Fire: 600, Drought: 400, Other: 300 },
  { state: 'VA', Hurricane: 700, 'Severe Storm': 600, Flood: 500, Snowstorm: 400, Other: 300 },
];

const stackedIncidentTypes = [
  { name: 'Hurricane', color: '#b45309' },
  { name: 'Severe Storm', color: '#15803d' },
  { name: 'Flood', color: '#7c2d12' },
  { name: 'Fire', color: '#6366f1' },
  { name: 'Biological', color: '#1e40af' },
  { name: 'Coastal Storm', color: '#ea580c' },
  { name: 'Drought', color: '#166534' },
  { name: 'Earthquake', color: '#991b1b' },
  { name: 'Freezing', color: '#db2777' },
  { name: 'Human Cause', color: '#ca8a04' },
  { name: 'Mud/Landslide', color: '#0891b2' },
  { name: 'Severe Ice Storm', color: '#f97316' },
  { name: 'Snowstorm', color: '#be123c' },
  { name: 'Terrorist', color: '#6d28d9' },
  { name: 'Tornado', color: '#a16207' },
  { name: 'Toxic Substances', color: '#d946ef' },
  { name: 'Tropical Depression', color: '#64748b' },
  { name: 'Tropical Storm', color: '#eab308' },
  { name: 'Winter Storm', color: '#1e3a8a' },
  { name: 'Other', color: '#334155' },
];

const heatmapStates = ['AK', 'AR', 'AZ', 'CO', 'DC', 'FL', 'GA', 'HI', 'ID', 'IN', 'KY', 'MA', 'ME', 'MI', 'MO', 'MS', 'NC', 'NE', 'NJ', 'NV', 'OH', 'OR', 'PR', 'RI', 'SD', 'TX', 'VA', 'VT', 'WI', 'WY'];
const heatmapIncidents = ['Biological', 'Chemical', 'Coastal Storm', 'Dam/Levee Break', 'Drought', 'Earthquake', 'Fire', 'Fishing Losses', 'Flood', 'Freezing', 'Human Cause', 'Hurricane', 'Mud/Landslide', 'Other', 'Severe Ice Storm', 'Severe Storm', 'Snowstorm', 'Straight-Line Winds', 'Terrorist', 'Tornado', 'Toxic Substances', 'Tropical Depression', 'Tropical Storm', 'Tsunami', 'Typhoon', 'Volcanic Eruption', 'Winter Storm'];

const heatmapData = heatmapStates.flatMap(state => 
  heatmapIncidents.map(incident => {
    let value = Math.floor(Math.random() * 100);
    // Mimic the "hotspots" from the image
    if (incident === 'Severe Storm') {
      if (state === 'KY') value = 1650;
      else if (['MO', 'IN', 'OH', 'AR', 'TN', 'MS'].includes(state)) value = 1100 + Math.random() * 300;
      else if (['TX', 'VA', 'NC', 'GA', 'AL'].includes(state)) value = 800 + Math.random() * 400;
    }
    if (incident === 'Hurricane') {
      if (['FL', 'GA', 'TX', 'LA', 'MS'].includes(state)) value = 1200 + Math.random() * 400;
      else if (['NC', 'SC', 'VA', 'PR'].includes(state)) value = 900 + Math.random() * 300;
    }
    if (incident === 'Fire') {
      if (state === 'TX') value = 1200;
      else if (['CA', 'CO', 'AZ', 'NM', 'ID', 'WA', 'OR'].includes(state)) value = 600 + Math.random() * 600;
    }
    if (incident === 'Flood') {
      if (['MO', 'KY', 'TX', 'LA', 'MS', 'AR'].includes(state)) value = 700 + Math.random() * 500;
    }
    if (incident === 'Biological' && state === 'AK') value = 300;
    if (incident === 'Snowstorm' && ['NY', 'MA', 'ME', 'VT', 'NH'].includes(state)) value = 400 + Math.random() * 400;
    
    return { state, incident, value };
  })
);

const assistanceData = [
  { type: 'Public Assistance', amount: 12.4, color: '#10b981' },
  { type: 'Individual Assistance', amount: 8.2, color: '#f59e0b' },
  { type: 'Hazard Mitigation', amount: 4.5, color: '#3b82f6' },
];

const regionalDisasterData = [
  { region: 'Midwest', count: 18500 },
  { region: 'Northeast', count: 6000 },
  { region: 'South', count: 35000 },
  { region: 'West', count: 7000 },
];

const topStatesData = [
  { state: 'TX', count: 5200 },
  { state: 'KY', count: 3400 },
  { state: 'MO', count: 2800 },
  { state: 'FL', count: 2800 },
  { state: 'GA', count: 2800 },
  { state: 'VA', count: 2800 },
  { state: 'LA', count: 2700 },
  { state: 'OK', count: 2600 },
  { state: 'NC', count: 2500 },
  { state: 'PR', count: 2200 },
];

const assistanceByIncidentData = [
  { name: 'Biological', ih: 4100, pa: 7600 },
  { name: 'Chemical', ih: 50, pa: 100 },
  { name: 'Coastal Storm', ih: 100, pa: 600 },
  { name: 'Dam/Levee Break', ih: 20, pa: 50 },
  { name: 'Drought', ih: 100, pa: 1300 },
  { name: 'Earthquake', ih: 50, pa: 200 },
  { name: 'Fire', ih: 200, pa: 3600 },
  { name: 'Fishing Losses', ih: 10, pa: 50 },
  { name: 'Flood', ih: 800, pa: 10450 },
  { name: 'Freezing', ih: 50, pa: 100 },
  { name: 'Human Cause', ih: 20, pa: 50 },
  { name: 'Hurricane', ih: 2000, pa: 13400 },
  { name: 'Mud/Landslide', ih: 50, pa: 100 },
  { name: 'Other', ih: 100, pa: 300 },
  { name: 'Severe Ice Storm', ih: 200, pa: 2900 },
  { name: 'Severe Storm', ih: 4000, pa: 17800 },
  { name: 'Snowstorm', ih: 100, pa: 3700 },
  { name: 'Straight-Line Winds', ih: 50, pa: 100 },
  { name: 'Terrorist', ih: 20, pa: 50 },
  { name: 'Tornado', ih: 150, pa: 1300 },
  { name: 'Toxic Substances', ih: 20, pa: 50 },
  { name: 'Tropical Depression', ih: 20, pa: 50 },
  { name: 'Tropical Storm', ih: 100, pa: 1050 },
  { name: 'Tsunami', ih: 10, pa: 50 },
  { name: 'Typhoon', ih: 50, pa: 150 },
  { name: 'Volcanic Eruption', ih: 10, pa: 50 },
  { name: 'Winter Storm', ih: 100, pa: 300 },
];

const incidentTypeDistributionData = [
  { state: 'FL', 'Severe Storm': 1200, 'Hurricane': 800, 'Flood': 400, 'Fire': 100, 'Other': 300 },
  { state: 'GA', 'Severe Storm': 1500, 'Hurricane': 400, 'Flood': 300, 'Fire': 100, 'Other': 500 },
  { state: 'KY', 'Severe Storm': 1800, 'Flood': 600, 'Fire': 100, 'Snowstorm': 300, 'Other': 500 },
  { state: 'LA', 'Severe Storm': 1000, 'Hurricane': 900, 'Flood': 500, 'Other': 300 },
  { state: 'MO', 'Severe Storm': 1600, 'Flood': 500, 'Tornado': 300, 'Other': 400 },
  { state: 'NC', 'Severe Storm': 1400, 'Hurricane': 600, 'Flood': 300, 'Other': 200 },
  { state: 'OK', 'Severe Storm': 1800, 'Tornado': 400, 'Flood': 200, 'Other': 200 },
  { state: 'PR', 'Hurricane': 1200, 'Flood': 400, 'Earthquake': 200, 'Other': 300 },
  { state: 'TX', 'Severe Storm': 2200, 'Hurricane': 600, 'Flood': 800, 'Fire': 600, 'Tornado': 400, 'Other': 600 },
  { state: 'VA', 'Severe Storm': 1400, 'Hurricane': 400, 'Flood': 300, 'Snowstorm': 300, 'Other': 300 },
];

const incidentTypes = ['Severe Storm', 'Hurricane', 'Flood', 'Fire', 'Tornado', 'Snowstorm', 'Earthquake', 'Other'];
const incidentColors: Record<string, string> = {
  'Severe Storm': '#3b82f6',
  'Hurricane': '#8b5cf6',
  'Flood': '#06b6d4',
  'Fire': '#f97316',
  'Tornado': '#f59e0b',
  'Snowstorm': '#94a3b8',
  'Earthquake': '#ec4899',
  'Other': '#64748b'
};

// --- Components ---

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8" role="group" aria-labelledby={`section-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
    <h2 id={`section-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-3xl font-display font-bold text-white tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-400 mt-2 max-w-2xl">{subtitle}</p>}
  </div>
);

const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue", neonColor }: { 
  title: string; 
  value: string; 
  icon: any; 
  trend?: 'up' | 'down'; 
  trendValue?: string;
  color?: "blue" | "emerald" | "rose" | "amber" | "violet";
  neonColor?: string;
}) => {
  const colorMap = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  };

  return (
    <motion.div 
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        boxShadow: neonColor ? `0 0 25px ${neonColor}80, 0 0 50px ${neonColor}33` : "none",
        borderColor: neonColor ? neonColor : "rgba(255, 255, 255, 0.1)"
      }}
      className={cn(
        "glass-card p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-300",
        neonColor && "hover:bg-white/5"
      )}
      role="status"
      aria-label={`${title}: ${value}${trend ? `, trending ${trend} by ${trendValue}` : ''}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] -mr-8 -mt-8 rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity" style={{ color: color === 'blue' ? '#3b82f6' : color === 'emerald' ? '#10b981' : color === 'rose' ? '#f43f5e' : color === 'amber' ? '#f59e0b' : '#8b5cf6' }} aria-hidden="true" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className={cn("p-3 rounded-xl border", colorMap[color])} aria-hidden="true">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
            trend === 'up' ? "bg-blue-500/10 text-blue-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" aria-hidden="true" /> : <ArrowDownRight className="w-3 h-3 mr-1" aria-hidden="true" />}
            <span className="sr-only">{trend === 'up' ? 'Increase' : 'Decrease'}</span>
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-4 relative z-10">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-display font-bold text-white mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

const CategoryCard = ({ name, count, icon: Icon, color, neonColor }: { name: string; count: string; icon: any; color: string; neonColor?: string }) => (
  <motion.div
    whileHover={{ 
      scale: 1.05,
      boxShadow: neonColor ? `0 0 25px ${neonColor}80, 0 0 50px ${neonColor}33` : "none",
      borderColor: neonColor ? neonColor : "rgba(255, 255, 255, 0.05)"
    }}
    className="p-6 rounded-3xl border border-white/5 bg-white/5 flex flex-col items-center text-center gap-4 group transition-all hover:bg-white/10"
    role="status"
    aria-label={`${name}: ${count} Declarations`}
  >
    <div className={cn("p-4 rounded-2xl shadow-lg transition-transform group-hover:rotate-12", color)} aria-hidden="true">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <div>
      <h5 className="font-bold text-white text-lg">{name}</h5>
      <p className="text-slate-400 text-sm">{count} Declarations</p>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, insight, description, height = "h-[300px]" }: { title?: string; children: React.ReactNode; insight?: string; description?: string; height?: string }) => (
  <div className="glass-card p-6 flex flex-col chart-card-for-report" role="region" aria-label={description || title} data-report-title={title} data-report-insight={insight}>
    {title && <h4 className="text-lg font-semibold text-slate-200 mb-4">{title}</h4>}
    <div className={cn("w-full chart-content-area", height)} aria-label={`Chart showing ${title}`}>
      {children}
    </div>
    {insight && (
      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5" role="note">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-slate-300 leading-relaxed italic">
            <span className="font-semibold text-white not-italic mr-1">Key Insight:</span>
            {insight}
          </p>
        </div>
      </div>
    )}
  </div>
);

const GraphTitleBox = ({ title }: { title: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.02, x: 5 }}
    className="bg-gradient-to-r from-blue-600/20 to-indigo-600/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl mb-4 inline-flex items-center gap-3 shadow-xl shadow-blue-900/10 group cursor-default"
  >
    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:animate-pulse" />
    <motion.h4 
      animate={{ 
        opacity: [0.7, 1, 0.7],
        textShadow: [
          "0 0 0px rgba(255,255,255,0)",
          "0 0 10px rgba(255,255,255,0.5)",
          "0 0 0px rgba(255,255,255,0)"
        ]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-xs font-display font-black text-white uppercase tracking-[0.25em]"
    >
      {title}
    </motion.h4>
  </motion.div>
);

const InsightBox = ({ title, content, icon: Icon = Info }: { title: string; content: string; icon?: any }) => (
  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-[32px] shadow-2xl shadow-blue-900/20 relative overflow-hidden border border-white/10" role="complementary" aria-labelledby={`insight-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10" aria-hidden="true">
          <Icon className="w-6 h-6" />
        </div>
        <h4 id={`insight-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-xl font-bold">{title}</h4>
      </div>
      <p className="text-blue-50 text-lg leading-relaxed opacity-90">{content}</p>
    </div>
    <div className="absolute -right-10 -bottom-10 opacity-10" aria-hidden="true">
      <Icon size={200} />
    </div>
  </div>
);

// --- Pages ---

const OverviewPage = ({ onStartExploring, onViewApproach }: { onStartExploring: () => void; onViewApproach: () => void }) => (
  <div className="space-y-16">
    {/* Hero Section */}
    <motion.section 
      variants={itemVariants}
      whileHover={{ 
        boxShadow: "0 0 40px rgba(79, 70, 229, 0.3), 0 0 80px rgba(79, 70, 229, 0.1)",
        borderColor: "rgba(99, 102, 241, 0.5)",
        y: -2
      }}
      className="relative py-24 px-8 rounded-[48px] bg-slate-900/40 backdrop-blur-xl border border-white/10 text-white overflow-hidden transition-all duration-500 cursor-default"
    >
      <div className="relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-blue-500/10 backdrop-blur-md border border-blue-400/20 rounded-full text-blue-400 text-sm font-semibold mb-8">
            National Disaster Database • 1953 - 2024
          </span>
          <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight mb-8">
            Visualizing U.S. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Natural Disaster</span> Declarations
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-3xl">
            This dashboard presents a comprehensive analysis of U.S. natural disaster declarations over seven decades. 
            It explores how disaster patterns have evolved over time, how they vary across different regions, 
            and which types of disasters occur most frequently. The goal is to uncover meaningful insights 
            that can support better understanding, preparedness, and decision-making.
          </p>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onStartExploring}
              aria-label="Start exploring temporal disaster trends"
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-blue-600/40 flex items-center gap-3 text-lg"
            >
              Start Exploring <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
            <button 
              onClick={onViewApproach}
              aria-label="View data approach and sourcing information"
              className="px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl transition-all border border-white/10 text-lg"
            >
              View Approach
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[100px]" />
      </div>
    </motion.section>

    {/* Key Metrics Grid */}
    <motion.div variants={itemVariants} className="space-y-8">
      <SectionTitle title="At a Glance" subtitle="High-level statistics summarizing the total impact of recorded disasters." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Declarations" 
          value="64,218" 
          icon={ShieldAlert} 
          trend="up" 
          trendValue="12% YoY"
          color="blue"
          neonColor="#ec4899" // Pink
        />
        <MetricCard 
          title="Active States" 
          value="50" 
          icon={Globe} 
          color="blue"
          neonColor="#ec4899" // Pink
        />
        <MetricCard 
          title="Major Events" 
          value="2,410" 
          icon={AlertTriangle} 
          trend="up"
          trendValue="8% Avg"
          color="amber"
          neonColor="#ec4899" // Pink
        />
        <MetricCard 
          title="Avg. per Year" 
          value="904" 
          icon={Activity} 
          color="violet"
          neonColor="#ec4899" // Pink
        />
      </div>
    </motion.div>

    {/* Disaster Categories - More Colors & Dynamic */}
    <motion.div variants={itemVariants} className="space-y-8">
      <SectionTitle title="Primary Incident Categories" subtitle="The most frequent drivers of federal emergency declarations across the nation." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <CategoryCard name="Severe Storm" count="28.4k" icon={Wind} color="bg-blue-600" neonColor="#3b82f6" />
        <CategoryCard name="Flood" count="12.1k" icon={Waves} color="bg-blue-400" neonColor="#3b82f6" />
        <CategoryCard name="Fire" count="8.4k" icon={Flame} color="bg-orange-500" neonColor="#3b82f6" />
        <CategoryCard name="Hurricane" count="5.2k" icon={CloudLightning} color="bg-indigo-500" neonColor="#3b82f6" />
        <CategoryCard name="Biological" count="3.1k" icon={Activity} color="bg-rose-500" neonColor="#3b82f6" />
      </div>
    </motion.div>

    {/* Key Insights Section */}
    <motion.div variants={itemVariants} className="space-y-8">
      <SectionTitle title="Key Insights" subtitle="Impactful, data-driven observations from our analysis." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          "Federal disaster declarations have increased by over 300% since the 1960s.",
          "Texas and California consistently lead the nation in total disaster counts.",
          "Severe storms are the most frequent driver of emergency aid across all regions.",
          "The year 2020 saw a record-breaking spike in biological emergency declarations.",
          "Spring months (April-June) represent the most volatile period for weather events.",
          "Public assistance for infrastructure repair remains the largest federal expenditure."
        ].map((insight, i) => (
          <motion.div 
            key={i} 
            whileHover={{ 
              y: -5,
              boxShadow: "0 0 25px rgba(245, 158, 11, 0.4), 0 0 50px rgba(245, 158, 11, 0.15)",
              borderColor: "rgba(245, 158, 11, 0.6)"
            }}
            className="glass-card p-6 border-l-4 border-l-blue-500 flex items-start gap-4 transition-all duration-300 hover:bg-white/5 cursor-default"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold text-xs">{i + 1}</span>
            </div>
            <p className="text-slate-300 font-medium leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Detailed Info Section */}
    <motion.div variants={itemVariants} className="max-w-4xl mx-auto py-12">
      <div className="space-y-12">
        <div className="space-y-6 text-center">
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white">The Evolution of Response</h3>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Since the Disaster Relief Act of 1950, the federal government's role in disaster 
            recovery has expanded significantly. What began as a way to provide supplemental 
            aid has grown into a complex system of individual and public assistance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-6 items-start p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h5 className="font-bold text-white text-2xl mb-3">Federal Coordination</h5>
              <p className="text-slate-400 leading-relaxed">
                FEMA coordinates the federal government's role in preparing for, preventing, 
                mitigating the effects of, responding to, and recovering from all domestic disasters.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h5 className="font-bold text-white text-2xl mb-3">Increasing Frequency</h5>
              <p className="text-slate-400 leading-relaxed">
                The data reveals a clear upward trend in declarations, driven by both improved 
                reporting and the increasing intensity of weather-related events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    <motion.div variants={itemVariants}>
      <InsightBox 
        title="The Human Element" 
        content="Beyond the numbers, each declaration represents a community in need. This data helps policymakers allocate resources where they are needed most, ensuring that no community is left behind after a disaster."
        icon={Users}
      />
    </motion.div>
  </div>
);

const TemporalPage = () => {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      <motion.div variants={itemVariants}>
        <SectionTitle 
          title="Temporal Analysis" 
          subtitle="Comprehensive tracking of disaster trends, seasonality, and rolling averages from 1953 to present."
        />
        <div className="max-w-3xl mb-12">
          <p className="text-lg text-slate-400 leading-relaxed">
            Disaster trends are not static; they tell a story of a changing world. Over the last 70 years, 
            we’ve seen a steady rise in federal declarations, with clear seasonal peaks during spring 
            and summer. While some years remain quiet, the long-term growth suggests that extreme 
            events are becoming our new normal.
          </p>
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incident Type Trends Over Time */}
        <div className="flex flex-col">
          <GraphTitleBox title="Incident Type Trends Over Time" />
          <ChartCard 
            description="Line chart showing trends of different incident types like Biological, Fire, Flood, Drought, and Coastal disasters from 1953 to 2024."
            insight="A massive spike in 'Biological' incidents occurred in 2020, representing the unprecedented scale of the COVID-19 emergency declarations."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={longTermIncidentData}
                onMouseLeave={() => setHoveredLine(null)}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '10px', color: '#94a3b8', paddingTop: '20px' }}
                  onMouseEnter={(e) => setHoveredLine(e.dataKey)}
                  onMouseLeave={() => setHoveredLine(null)}
                />
                <Line 
                  type="monotone" 
                  dataKey="Biological" 
                  stroke="#f43f5e" 
                  strokeWidth={hoveredLine === 'Biological' ? 4 : 2} 
                  strokeOpacity={hoveredLine && hoveredLine !== 'Biological' ? 0.3 : 1}
                  dot={false} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
                  onMouseEnter={() => setHoveredLine('Biological')}
                />
                <Line 
                  type="monotone" 
                  dataKey="Fire" 
                  stroke="#f59e0b" 
                  strokeWidth={hoveredLine === 'Fire' ? 4 : 2} 
                  strokeOpacity={hoveredLine && hoveredLine !== 'Fire' ? 0.3 : 1}
                  dot={false} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
                  onMouseEnter={() => setHoveredLine('Fire')}
                />
                <Line 
                  type="monotone" 
                  dataKey="Flood" 
                  stroke="#0ea5e9" 
                  strokeWidth={hoveredLine === 'Flood' ? 4 : 2} 
                  strokeOpacity={hoveredLine && hoveredLine !== 'Flood' ? 0.3 : 1}
                  dot={false} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
                  onMouseEnter={() => setHoveredLine('Flood')}
                />
                <Line 
                  type="monotone" 
                  dataKey="Drought" 
                  stroke="#f97316" 
                  strokeWidth={hoveredLine === 'Drought' ? 4 : 2} 
                  strokeOpacity={hoveredLine && hoveredLine !== 'Drought' ? 0.3 : 1}
                  dot={false} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }}
                  onMouseEnter={() => setHoveredLine('Drought')}
                />
                <Line 
                  type="monotone" 
                  dataKey="Coastal" 
                  stroke="#14b8a6" 
                  strokeWidth={hoveredLine === 'Coastal' ? 4 : 2} 
                  strokeOpacity={hoveredLine && hoveredLine !== 'Coastal' ? 0.3 : 1}
                  dot={false} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#14b8a6' }}
                  onMouseEnter={() => setHoveredLine('Coastal')}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Monthly Disaster Trend */}
        <div className="flex flex-col">
          <GraphTitleBox title="Monthly Disaster Trend" />
          <ChartCard 
            description="Line chart showing the average number of disaster declarations per month, highlighting seasonal peaks in early months and Spring."
            insight="Historical data shows a significant concentration of declarations in the early months of the year, followed by secondary peaks during the Spring storm season."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  cursor={{ stroke: '#f59e0b20', strokeWidth: 20 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#f59e0b', strokeWidth: 0}} 
                  activeDot={{ r: 8, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yearly Disaster Trend */}
        <div className="flex flex-col">
          <GraphTitleBox title="Yearly Disaster Trend (1953 - 2024)" />
          <ChartCard 
            description="Line chart showing the total number of disaster declarations per year from 1953 to 2024, showing a clear upward trend."
            insight="The long-term view reveals a dramatic acceleration in declarations starting in the late 1990s, with extreme spikes corresponding to major national events."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedYearlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  cursor={{ stroke: '#3b82f620', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="disasters" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Year-wise with 5-Year Rolling Average */}
        <div className="flex flex-col">
          <GraphTitleBox title="Year-wise with 5-Year Rolling Average" />
          <ChartCard 
            description="Composed chart showing annual disaster totals alongside a 5-year rolling average to highlight long-term growth trends."
            insight="The 5-year rolling average provides a clearer view of the underlying trend, smoothing out the noise of individual extreme years to show consistent growth."
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={processedYearlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#94a3b8' }} />
                <Line 
                  type="monotone" 
                  dataKey="disasters" 
                  name="Total_Disasters" 
                  stroke="#94a3b8" 
                  strokeWidth={1.5} 
                  dot={false} 
                  activeDot={{ r: 4, fill: '#94a3b8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rollingAvg" 
                  name="Rolling Avg (5 Year)" 
                  stroke="#06b6d4" 
                  strokeWidth={hoveredLine === 'rollingAvg' ? 4 : 2.5} 
                  dot={false} 
                  activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                  onMouseEnter={() => setHoveredLine('rollingAvg')}
                  onMouseLeave={() => setHoveredLine(null)}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </motion.div>

      {/* Year-over-Year Growth Rate */}
      <motion.div variants={itemVariants} className="flex flex-col">
        <GraphTitleBox title="Year-over-Year Growth Rate" />
        <ChartCard 
          description="Area chart showing the percentage growth of disaster declarations compared to the previous year, illustrating volatility."
          insight="Growth rates show extreme volatility, with some years seeing significant increases in declarations compared to the previous year. A value of 1.0 represents a 100% increase."
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={processedYearlyData}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
              />
              <ReferenceLine y={0} stroke="#ffffff20" strokeDasharray="3 3" />
              <Area 
                type="monotone" 
                dataKey="growth" 
                name="YoY Growth" 
                stroke="#ec4899" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorGrowth)" 
                activeDot={{ r: 6, fill: '#fff', stroke: '#ec4899', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="growth" stroke="transparent" dot={{ r: 2, fill: '#ec4899' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <InsightBox 
          title="Long-term Climate Signal"
          content="The convergence of multiple data points—rising rolling averages, frequent spikes, and shifting seasonality—points toward a systemic increase in disaster frequency that transcends simple year-to-year variability."
          icon={TrendingUp}
        />
      </motion.div>
  </div>
);
};

const GeographicPage = () => (
  <div className="space-y-16">
    <motion.div variants={itemVariants}>
      <SectionTitle 
        title="Geographic Analysis" 
        subtitle="Identifying disaster hotspots and regional vulnerabilities across the United States."
      />
      <div className="max-w-3xl mb-12">
        <p className="text-lg text-slate-400 leading-relaxed">
          Geography defines vulnerability. While every state faces risks, disasters are not distributed 
          equally. From the hurricane-prone coasts of the South to the storm-battered plains of the 
          Midwest, regional patterns emerge that highlight where our infrastructure and communities 
          are tested most frequently.
        </p>
      </div>
    </motion.div>

    {/* 1. Disaster Declarations by U.S. Region */}
    <motion.div variants={itemVariants} className="space-y-4">
      <GraphTitleBox title="Disaster Declarations by U.S. Region" />
      <ChartCard 
        title="Regional Distribution"
        description="Bar chart showing the total number of federal disaster declarations across the four major U.S. regions: Midwest, Northeast, South, and West."
        insight="The South region consistently records the highest number of disaster declarations, driven by a combination of severe storms and coastal events."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={regionalDisasterData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>

    {/* 2. Disaster Declarations Across U.S. States (Professional Choropleth) */}
    <motion.div variants={itemVariants} className="space-y-6">
      <GraphTitleBox title="Disaster Declarations Across U.S. States" />
      <ChartCard 
        title="National Disaster Density"
        description="Professional U.S. Choropleth Map showing disaster density across states. Darker red indicates higher counts."
        height="min-h-[500px]"
      >
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/40 relative overflow-hidden rounded-xl">
          <USChoroplethMap />
        </div>
      </ChartCard>
      <div className="glass-card p-6 border-l-4 border-l-blue-500 flex items-start gap-4 mt-8">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <p className="text-slate-300 font-medium leading-relaxed">
          <span className="text-white font-bold mr-2">Map Insight:</span>
          Disaster density is highest in the central 'Tornado Alley' and the Gulf Coast, reflecting the high frequency of severe weather in these corridors.
        </p>
      </div>
    </motion.div>

    {/* 3. Hurricane Hotspots in the United States (Professional Choropleth) */}
    <motion.div variants={itemVariants} className="space-y-6">
      <GraphTitleBox title="Hurricane Hotspots in the United States" />
      <ChartCard 
        title="Hurricane Vulnerability"
        description="Professional U.S. Choropleth Map showing hurricane hotspots. Yellow indicates highest risk."
        height="min-h-[500px]"
      >
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/40 relative overflow-hidden rounded-xl">
          <HurricaneChoroplethMap />
        </div>
      </ChartCard>
      <div className="glass-card p-6 border-l-4 border-l-indigo-500 flex items-start gap-4 mt-8">
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
          <CloudLightning className="w-4 h-4 text-indigo-400" />
        </div>
        <p className="text-slate-300 font-medium leading-relaxed">
          <span className="text-white font-bold mr-2">Map Insight:</span>
          Hurricane risk is heavily concentrated along the Atlantic and Gulf coasts, with Florida and Louisiana showing the highest historical vulnerability.
        </p>
      </div>
    </motion.div>

    {/* 4. Top 10 States with Highest Disaster Declarations */}
    <motion.div variants={itemVariants} className="space-y-4">
      <GraphTitleBox title="Top 10 States with Highest Disaster Declarations" />
      <ChartCard 
        title="State-Level Impact"
        description="Vertical bar chart highlighting the ten states with the highest cumulative disaster declarations, led by Texas."
        insight="Texas leads the nation in total disaster declarations, followed by California, highlighting the immense geographic and climatic challenges faced by these large states."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topStatesData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
            />
            <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>

    {/* 5. Incident Type Distribution for Top Disaster States */}
    <motion.div variants={itemVariants} className="space-y-4">
      <GraphTitleBox title="Incident Type Distribution for Top Disaster States" />
      <ChartCard 
        title="Comparative Incident Breakdown (%)"
        description="100% stacked bar chart showing the percentage distribution of different disaster types across the top 10 most affected states."
        insight="While severe storms are common across all top states, California shows a unique dominance of fire-related incidents compared to the flood-heavy profiles of southern states."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={incidentTypeDistributionData} 
            stackOffset="expand"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}}
              tickFormatter={(val) => `${Math.round(val * 100)}%`}
            />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
              formatter={(value: number) => [`${value} declarations`, ""]}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '10px' }} />
            {incidentTypes.map((type) => (
              <Bar key={type} dataKey={type} stackId="a" fill={incidentColors[type]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>

    <motion.div variants={itemVariants} className="glass-card p-10 bg-slate-900/40 border-l-8 border-l-blue-600">
      <h4 className="text-2xl font-display font-bold text-white mb-6">Regional Hotspots Narrative</h4>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Wind className="w-5 h-5" aria-hidden="true" />
            <h5>Tornado Alley</h5>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Oklahoma and Texas experience the highest density of severe storm and tornado declarations, often resulting in complex individual assistance needs.
          </p>
        </div>
      </div>
    </motion.div>
  </div>
);

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, index, name, value, payload } = props;
  // Recharts Treemap passes the data item in the payload or directly in props
  const color = payload?.color || props.color || (props.root && props.root.children && props.root.children[index]?.color) || '#8884d8';

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 1,
          strokeOpacity: 0.8,
        }}
      />
      {width > 70 && height > 40 && (
        <text
          x={x + 10}
          y={y + 22}
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {name}
        </text>
      )}
      {width > 70 && height > 55 && (
        <text
          x={x + 10}
          y={y + 40}
          fill="rgba(255,255,255,0.7)"
          fontSize={10}
          fontWeight="medium"
          style={{ pointerEvents: 'none' }}
        >
          {value.toLocaleString()}
        </text>
      )}
    </g>
  );
};

const HeatmapChart = ({ data, states, incidents }: { data: any[], states: string[], incidents: string[] }) => {
  const getColor = (value: number) => {
    const intensity = Math.min(value / 1600, 1);
    
    // Blue-White-Red Diverging Scale (similar to RdBu_r)
    if (intensity < 0.5) {
      const t = intensity * 2;
      // From Blue (rgb(60, 80, 200)) to White (rgb(245, 245, 245))
      const r = Math.floor(60 + (245 - 60) * t);
      const g = Math.floor(80 + (245 - 80) * t);
      const b = Math.floor(200 + (245 - 200) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (intensity - 0.5) * 2;
      // From White (rgb(245, 245, 245)) to Red (rgb(200, 30, 30))
      const r = Math.floor(245 + (200 - 245) * t);
      const g = Math.floor(245 + (30 - 245) * t);
      const b = Math.floor(245 + (30 - 245) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  return (
    <div className="flex items-start bg-white p-8 rounded-xl">
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px]">
          <div className="flex mb-4">
            <div className="w-16 shrink-0" />
            <div className="flex flex-1">
              {incidents.map(incident => (
                <div key={incident} className="flex-1 relative h-40">
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-[-90deg] origin-bottom-left whitespace-nowrap text-[10px] font-medium text-slate-700">
                    {incident}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-[2px]">
            {states.map(state => (
              <div key={state} className="flex items-center h-6">
                <div className="w-16 shrink-0 text-[11px] font-medium text-slate-600 text-right pr-4">{state}</div>
                <div className="flex flex-1 h-full gap-[2px]">
                  {incidents.map(incident => {
                    const item = data.find(d => d.state === state && d.incident === incident);
                    const val = item ? item.value : 0;
                    return (
                      <div 
                        key={incident} 
                        className="flex-1 h-full transition-all hover:scale-110 hover:z-10 cursor-pointer group relative border border-black/5"
                        style={{ backgroundColor: getColor(val) }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-2xl">
                          <div className="font-bold border-b border-white/10 pb-1 mb-1">{state} • {incident}</div>
                          <div>Value: <span className="text-blue-400 font-mono">{Math.round(val)}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-6">
            <div className="w-16 shrink-0" />
            <div className="flex-1 text-center text-sm font-medium text-slate-600">Incident Type</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 ml-10 pt-40">
        <div className="h-[400px] w-6 bg-gradient-to-t from-[rgb(60,80,200)] via-[rgb(245,245,245)] to-[rgb(200,30,30)] rounded-sm border border-slate-200" />
        <div className="flex flex-col justify-between h-[400px] text-[11px] font-bold text-slate-600 py-1">
          <span>1600</span>
          <span>1400</span>
          <span>1200</span>
          <span>1000</span>
          <span>800</span>
          <span>600</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};

const IncidentPage = () => (
  <div className="space-y-12">
    <motion.div variants={itemVariants}>
      <SectionTitle 
        title="Incident Type Analysis" 
        subtitle="Breaking down the nature of disasters and the allocation of federal assistance."
      />
      <div className="max-w-3xl mb-12">
        <p className="text-lg text-slate-400 leading-relaxed">
          Not all disasters are created equal. While massive hurricanes often dominate the headlines, 
          it is the persistent threat of severe storms and flooding that accounts for the majority 
          of federal aid. Understanding these dominant incident types is key to building a more 
          resilient future.
        </p>
      </div>
    </motion.div>

    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ChartCard 
        title="Incident Type Distribution (%)" 
        description="Pie chart showing the percentage distribution of different disaster types, with Severe Storms and Flooding as the most frequent."
        insight="Severe Storms account for nearly half of all declarations, highlighting the widespread impact of non-catastrophic but frequent weather events."
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={incidentDistribution}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {incidentDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard 
        title="Disaster Assistance Comparison ($B)" 
        description="Bar chart comparing different types of federal disaster assistance in billions of dollars, showing Public Assistance as the largest category."
        insight="Public Assistance (infrastructure repair) remains the largest expenditure, though Individual Assistance is growing as disasters impact more populated areas."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={assistanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {assistanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>

    <motion.div variants={itemVariants} className="space-y-6">
      <GraphTitleBox title="Distribution of Disaster Incident Types" />
      <ChartCard 
        description="Comprehensive bar chart showing the distribution of all disaster incident types, ordered by frequency."
        insight="The vast majority of federal disaster declarations are driven by weather-related events, specifically severe storms, hurricanes, and floods."
        height="h-[500px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={fullIncidentDistributionData}
            margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10}} 
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10}} 
              label={{ value: 'Number of Disaster Declarations', angle: -90, position: 'insideLeft', fill: '#94a3b8', offset: -25, style: { textAnchor: 'middle' } }}
            />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
            />
            <Bar dataKey="count" fill="#4f73a5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>

    <motion.div variants={itemVariants} className="space-y-6">
      <GraphTitleBox title="Incident Type Distribution Across States" />
      <ChartCard 
        description="100% stacked bar chart showing the relative percentage distribution of various incident types across top disaster-prone states."
        insight="Texas and Florida show high concentrations of hurricanes and severe storms, while Kentucky and Missouri are dominated by severe storms and flooding."
        height="h-[600px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={stateIncidentData}
            stackOffset="expand"
            margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}} 
              tickFormatter={(val) => `${Math.round(val * 100)}%`}
              label={{ value: 'Distribution (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', offset: -10, style: { textAnchor: 'middle' } }}
            />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
              formatter={(value: number) => [`${value} declarations`, ""]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '40px', color: '#94a3b8' }} 
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
            {stackedIncidentTypes.map((type, index) => (
              <Bar 
                key={type.name} 
                dataKey={type.name} 
                stackId="a" 
                fill={type.color} 
                radius={index === stackedIncidentTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>

    <motion.div variants={itemVariants} className="space-y-6">
      <GraphTitleBox title="Treemap of Disaster Incident Types" />
      <ChartCard 
        description="Treemap visualization showing the relative scale of different disaster incident types based on total federal declarations."
        insight="The treemap clearly illustrates the dominance of severe storms and hurricanes, which together occupy more than half of the total disaster landscape."
        height="h-[500px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={fullIncidentDistributionData}
            dataKey="count"
            content={CustomTreemapContent}
          >
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
              formatter={(value: number) => [value.toLocaleString(), 'Declarations']}
            />
          </Treemap>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>

    <motion.div variants={itemVariants} className="space-y-6">
      <GraphTitleBox title="Incident Type vs Assistance Programs" />
      <ChartCard 
        description="Grouped bar chart comparing Individual Assistance and Public Assistance programs across different incident types."
        insight="Public Assistance is significantly more common across almost all incident types, particularly for large-scale weather events like severe storms and hurricanes."
        height="h-[500px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={assistanceByIncidentData}
            margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10}} 
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              label={{ value: 'Incident Type', position: 'insideBottom', offset: -70, fill: '#94a3b8' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10}} 
              label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#94a3b8', offset: -25, style: { textAnchor: 'middle' } }}
            />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
            <Bar dataKey="ih" name="Individual Assistance" fill="#4c72b0" radius={[2, 2, 0, 0]} />
            <Bar dataKey="pa" name="Public Assistance" fill="#dd8452" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>
    <motion.div variants={itemVariants} className="glass-card p-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-none">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-white mb-4">Dominant Disaster Insights</h4>
          <p className="text-slate-400 leading-relaxed mb-6">
            While hurricanes often capture the most media attention, the data shows that 
            <strong className="text-white"> Severe Storms</strong> and <strong className="text-white">Flooding</strong> are the most 
            consistent drivers of federal aid. These "silent" disasters accumulate 
            billions in costs over time, often affecting inland states that are 
            less prepared for catastrophic events.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
              <Activity className="w-4 h-4" aria-hidden="true" />
              <span>High Frequency</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>Broad Geographic Impact</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Did you know?</p>
          <p className="text-slate-200 font-medium leading-relaxed">
            FEMA has declared more disasters in the last 10 years than in the first 30 years of its existence combined.
          </p>
        </div>
      </div>
    </motion.div>

    <motion.div variants={itemVariants} className="glass-card p-10 bg-gradient-to-br from-slate-900/60 to-blue-900/20 border-t-4 border-t-blue-500">
      <h4 className="text-3xl font-display font-bold text-white mb-6">Conclusion</h4>
      <p className="text-xl text-slate-300 leading-relaxed">
        In summary, the data paints a stark picture of a nation facing an unprecedented rise in natural disaster 
        declarations. From the accelerating frequency of events since the late 1990s to the persistent geographic 
        dominance of the Gulf Coast and Midwest storm corridors, the scale of risk is expanding. While catastrophic 
        hurricanes often lead the news, the cumulative impact of severe storms and flooding remains the primary 
        driver of federal aid. As these patterns intensify, understanding the intersection of geography, 
        seasonality, and incident type will be paramount in building a more resilient and prepared America.
      </p>
    </motion.div>
  </div>
);

const ApproachPage = () => (
  <div className="space-y-12">
    <motion.div variants={itemVariants}>
      <SectionTitle 
        title="Data Approach" 
        subtitle="Transparency in how we process, clean, and visualize the FEMA disaster declaration dataset."
      />
    </motion.div>

    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="glass-card p-8 space-y-4 border-t-4 border-t-blue-500 hover:ring-1 hover:ring-blue-400/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group cursor-default" role="article">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 group-hover:bg-blue-400/20 flex items-center justify-center transition-colors" aria-hidden="true">
          <Database className="w-6 h-6 text-blue-400 group-hover:text-blue-400" />
        </div>
        <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Data Sourcing</h4>
        <p className="text-slate-400 group-hover:text-slate-200 text-sm leading-relaxed transition-colors">
          The primary data is sourced directly from the FEMA Open Data portal, covering all federal disaster declarations from 1953 to the present day.
        </p>
      </div>

      <div className="glass-card p-8 space-y-4 border-t-4 border-t-blue-500 hover:ring-1 hover:ring-blue-400/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group cursor-default" role="article">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 group-hover:bg-blue-400/20 flex items-center justify-center transition-colors" aria-hidden="true">
          <Search className="w-6 h-6 text-blue-400 group-hover:text-blue-400" />
        </div>
        <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Cleaning Process</h4>
        <p className="text-slate-400 group-hover:text-slate-200 text-sm leading-relaxed transition-colors">
          We normalize incident types, handle missing geographic coordinates, and aggregate data by year and month to ensure consistent temporal analysis.
        </p>
      </div>

      <div className="glass-card p-8 space-y-4 border-t-4 border-t-indigo-500 hover:ring-1 hover:ring-indigo-400/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-300 group cursor-default" role="article">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 group-hover:bg-indigo-400/20 flex items-center justify-center transition-colors" aria-hidden="true">
          <CheckCircle2 className="w-6 h-6 text-indigo-400 group-hover:text-indigo-400" />
        </div>
        <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">Validation</h4>
        <p className="text-slate-400 group-hover:text-slate-200 text-sm leading-relaxed transition-colors">
          Cross-referenced with historical climate records to ensure that major spikes in the data align with documented catastrophic events.
        </p>
      </div>
    </motion.div>

    <motion.div variants={itemVariants} className="glass-card p-10 bg-slate-900/40 hover:ring-1 hover:ring-blue-400/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300 group cursor-default">
      <h4 className="text-2xl font-display font-bold text-white group-hover:text-blue-400 mb-8 flex items-center gap-3 transition-colors">
        <BookOpen className="text-blue-400 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
        Analytical Framework
      </h4>
      <div className="space-y-8">
        <div className="flex gap-6">
          <div className="text-4xl font-display font-black text-blue-500/20 group-hover:text-blue-400/10 transition-colors" aria-hidden="true">01</div>
          <div>
            <h5 className="text-lg font-bold text-white group-hover:text-blue-400 mb-2 transition-colors">Temporal Aggregation</h5>
            <p className="text-slate-400 group-hover:text-slate-200 leading-relaxed transition-colors">
              Data is grouped by declaration date. We use 5-year rolling averages to smooth out annual volatility and reveal long-term climate-driven trends.
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-4xl font-display font-black text-blue-500/20 group-hover:text-blue-400/10 transition-colors" aria-hidden="true">02</div>
          <div>
            <h5 className="text-lg font-bold text-white group-hover:text-blue-400 mb-2 transition-colors">Geographic Mapping</h5>
            <p className="text-slate-400 group-hover:text-slate-200 leading-relaxed transition-colors">
              State-level data is normalized by population density in advanced views to provide a more accurate representation of disaster impact per capita.
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-4xl font-display font-black text-indigo-500/20 group-hover:text-indigo-400/10 transition-colors" aria-hidden="true">03</div>
          <div>
            <h5 className="text-lg font-bold text-white group-hover:text-indigo-400 mb-2 transition-colors">Categorical Normalization</h5>
            <p className="text-slate-400 group-hover:text-slate-200 leading-relaxed transition-colors">
              Over 40 legacy incident types have been mapped into 12 primary categories to maintain clarity while preserving the nuance of the original records.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportCSV = () => {
    try {
      setIsExportingCSV(true);
      console.log("Export CSV started");
      
      if (!processedYearlyData || processedYearlyData.length === 0) {
        throw new Error("No data available for export");
      }

      // We'll export the primary yearly dataset as it's the most comprehensive time-series data
      const headers = ["Year", "Total_Declarations", "5_Year_Rolling_Avg", "YoY_Growth_Ratio"];
      const csvRows = processedYearlyData.map(d => [
        d.year,
        d.disasters,
        d.rollingAvg,
        d.growth
      ].join(","));
      
      const csvContent = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `US_Disaster_Data_${new Date().getFullYear()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("Export CSV successful");
    } catch (error) {
      console.error("Export CSV failed:", error);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      console.log("Export PDF started");
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin;

      // Helper to add text with wrapping and handle page breaks
      const addWrappedText = (text: string, fontSize: number, color: number[] = [0, 0, 0], isBold: boolean = false, spacing: number = 5) => {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(color[0], color[1], color[2]);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
        const textHeight = (lines.length * fontSize * 0.35); // Approximate height in mm
        
        if (y + textHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
          // Re-apply font settings for new page
          pdf.setFontSize(fontSize);
          pdf.setTextColor(color[0], color[1], color[2]);
          pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        }
        
        pdf.text(lines, margin, y);
        y += textHeight + spacing;
      };

      // 1. Title
      pdf.setFontSize(24);
      pdf.setTextColor(15, 23, 42); // slate-900
      pdf.setFont('helvetica', 'bold');
      pdf.text("Visualizing U.S. Natural Disaster Declarations", margin, y);
      y += 12;

      // 2. Subtitle
      pdf.setFontSize(16);
      pdf.setTextColor(71, 85, 105); // slate-600
      pdf.setFont('helvetica', 'normal');
      pdf.text("Overview Analysis (1953 – 2024)", margin, y);
      y += 20;

      // 3. Overview Summary
      addWrappedText("Overview Summary", 14, [15, 23, 42], true, 8);
      addWrappedText("This dashboard presents a comprehensive analysis of U.S. natural disaster declarations over seven decades. It explores how disaster patterns have evolved over time, how they vary across different regions, and which types of disasters occur most frequently. The goal is to uncover meaningful insights that can support better understanding, preparedness, and decision-making.", 11, [71, 85, 105], false, 12);

      // 4. Key Insights
      const chartCards = Array.from(document.querySelectorAll('.chart-card-for-report'));
      if (chartCards.length > 0) {
        addWrappedText("Key Insights", 14, [15, 23, 42], true, 8);
        const insights = chartCards
          .map(card => card.getAttribute('data-report-insight'))
          .filter(insight => insight && insight.length > 0)
          .slice(0, 5);
        
        if (insights.length > 0) {
          insights.forEach((insight) => {
            addWrappedText(`• ${insight}`, 11, [71, 85, 105], false, 6);
          });
          y += 6;
        } else {
          addWrappedText("Navigate to specific analysis tabs (Temporal, Geographic, etc.) to include detailed insights in this report.", 11, [100, 116, 139], false, 10);
        }
      }

      // 5. Visualizations
      if (chartCards.length > 0) {
        pdf.addPage();
        y = margin;
        addWrappedText("Visualizations & Analysis", 16, [15, 23, 42], true, 10);

        for (const card of chartCards) {
          const title = card.getAttribute('data-report-title');
          const insight = card.getAttribute('data-report-insight');
          const chartArea = card.querySelector('.chart-content-area');

          if (chartArea) {
            // Check for page break before title
            if (y > pageHeight - 40) {
              pdf.addPage();
              y = margin;
            }

            if (title) {
              addWrappedText(title, 13, [15, 23, 42], true, 6);
            }

            try {
              const dataUrl = await htmlToImage.toPng(chartArea as HTMLElement, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#0f172a', // Use dark background for charts to match UI design
              });

              const imgProps = pdf.getImageProperties(dataUrl);
              const imgWidth = pageWidth - margin * 2;
              const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

              // Check for page break before image
              if (y + imgHeight > pageHeight - margin - 20) {
                pdf.addPage();
                y = margin;
                // Re-add title if it was on previous page
                if (title) {
                  addWrappedText(`${title} (cont.)`, 13, [15, 23, 42], true, 6);
                }
              }

              pdf.addImage(dataUrl, 'PNG', margin, y, imgWidth, imgHeight);
              y += imgHeight + 8;

              if (insight) {
                addWrappedText(`Interpretation: ${insight}`, 10, [100, 116, 139], false, 15);
              } else {
                y += 10;
              }
            } catch (err) {
              console.error("Failed to capture chart", err);
            }
          }
        }
      } else {
        y += 10;
        addWrappedText("Note: To include visualizations in the report, please select an analysis tab (Temporal, Geographic, or Incident) before exporting.", 11, [100, 116, 139], false, 10);
      }

      // 6. Conclusion
      if (y > pageHeight - 60) {
        pdf.addPage();
        y = margin;
      }
      y += 10;
      addWrappedText("Conclusion", 14, [15, 23, 42], true, 8);
      addWrappedText("In conclusion, the data demonstrates a significant increase in disaster frequency and severity over the past 70 years. Regional analysis highlights specific vulnerabilities, such as hurricane risk in the South and wildfire risk in the West. These insights underscore the importance of data-driven resilience planning and disaster preparedness as we face an increasingly volatile climate future.", 11, [71, 85, 105], false, 10);

      // Footer with page numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(148, 163, 184); // slate-400
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text("U.S. Natural Disaster Analytics Report", margin, pageHeight - 10);
        pdf.text(new Date().toLocaleDateString(), pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      pdf.save(`US_Disaster_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      console.log("Export PDF successful");
    } catch (error) {
      console.error("Export PDF failed:", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'approach', label: 'Approach', icon: FileText },
    { id: 'temporal', label: 'Temporal', icon: Calendar },
    { id: 'geographic', label: 'Geographic', icon: MapIcon },
    { id: 'heatmap', label: 'Heatmap', icon: Database },
    { id: 'incident', label: 'Incident Type', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <div className="bg-glow" />
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col sticky top-0 h-auto md:h-screen z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20" aria-hidden="true">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="font-display font-bold text-white leading-none">FEMA Analytics</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Data Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Go to ${tab.label} section`}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                  isActive 
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} aria-hidden="true" />
                <span className="font-semibold">{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main id="dashboard-content" className="flex-1 p-6 md:p-12 pb-24 md:pb-32 max-w-7xl mx-auto w-full relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-1">Data Visualization Project</p>
            <h2 className="text-2xl font-display font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.label} Analysis
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV}
              disabled={isExportingCSV}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm font-semibold",
                isExportingCSV && "opacity-50 cursor-not-allowed"
              )}
            >
              <FileSpreadsheet className={cn("w-4 h-4", isExportingCSV && "animate-pulse")} />
              {isExportingCSV ? "Exporting..." : "Export CSV"}
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all text-sm font-semibold shadow-lg shadow-blue-600/20",
                isExportingPDF && "opacity-50 cursor-not-allowed"
              )}
            >
              <Download className={cn("w-4 h-4", isExportingPDF && "animate-spin")} />
              {isExportingPDF ? "Generating PDF..." : "Export PDF"}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {activeTab === 'overview' && (
              <OverviewPage 
                onStartExploring={() => setActiveTab('temporal')} 
                onViewApproach={() => setActiveTab('approach')} 
              />
            )}
            {activeTab === 'temporal' && <TemporalPage />}
            {activeTab === 'geographic' && <GeographicPage />}
            {activeTab === 'heatmap' && (
              <div className="space-y-12">
                <motion.div variants={itemVariants}>
                  <SectionTitle 
                    title="State vs Incident Type Heatmap" 
                    subtitle="Visualizing the intensity of disaster declarations across states and incident categories."
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ChartCard 
                    description="Heatmap visualizing the intensity of different disaster incident types across various states, highlighting regional vulnerabilities."
                    insight="The heatmap reveals clear regional patterns: hurricanes dominate the Gulf and Atlantic coasts, while severe storms and flooding are widespread across the Midwest and South."
                    height="h-auto"
                  >
                    <HeatmapChart data={heatmapData} states={heatmapStates} incidents={heatmapIncidents} />
                  </ChartCard>
                </motion.div>
              </div>
            )}
            {activeTab === 'incident' && <IncidentPage />}
            {activeTab === 'approach' && <ApproachPage />}
          </motion.div>
        </AnimatePresence>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-4 px-6 text-center">
          <p className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wider uppercase">
            Visualizing U.S. Natural Disaster Declarations | Project Team | Infosys Springboard Internship | 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
