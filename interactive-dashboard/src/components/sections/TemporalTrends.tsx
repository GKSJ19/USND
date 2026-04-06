"use client";

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
  yearly: Record<string, { total: number; types: Record<string, number> }>;
  monthlyAvg: { month: string; avg: number }[];
}

export default function TemporalTrends({ yearly, monthlyAvg }: Props) {
  const chartData = Object.keys(yearly)
    .sort((a, b) => Number(a) - Number(b))
    .map(y => ({ year: y, total: yearly[y].total }));

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-black/70 backdrop-blur-xl px-4 py-3 rounded-xl border border-purple-500/20 shadow-2xl">
        <p className="text-purple-300/60 text-xs">{label}</p>
        <p className="text-white font-semibold text-lg">{payload[0].value} declarations</p>
      </div>
    );
  };

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-pink-300/50 mb-3">Milestone 2</p>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4">
          Temporal <em className="font-serif italic bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent font-normal">trends</em>
        </h2>
        <p className="text-white/50 max-w-xl text-lg mb-12">
          Disaster declarations have surged over the decades. A clear acceleration is visible from the 1990s onward.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 liquid-glass-strong p-6"
          style={{ '--radius': '1.5rem' } as any}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-white/80 font-medium mb-6">Declarations Per Year</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} interval={9} />
                <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={customTooltip} />
                <Area type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={2.5} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="liquid-glass-strong p-6"
          style={{ '--radius': '1.5rem' } as any}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-white/80 font-medium mb-6">Seasonality</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAvg} layout="vertical">
                <XAxis type="number" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} />
                <YAxis dataKey="month" type="category" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} tickLine={false} width={35} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="avg" fill="url(#barGrad)" radius={[0, 6, 6, 0]}>
                </Bar>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-white/30 mt-4">Average declarations per month across all years</p>
        </motion.div>
      </div>
    </section>
  );
}
