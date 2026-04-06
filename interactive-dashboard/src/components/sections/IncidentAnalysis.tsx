"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  topTypes: { type: string; count: number }[];
  assistanceData: { type: string; total: number; ihPct: number; paPct: number }[];
}

const COLORS = ['#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#6366f1', '#f43f5e', '#14b8a6', '#8b5cf6', '#f97316'];

export default function IncidentAnalysis({ topTypes, assistanceData }: Props) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-black/70 backdrop-blur-xl px-4 py-3 rounded-xl border border-purple-500/20 shadow-2xl">
        <p className="text-purple-300/60 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-white text-sm">
            {p.name}: <span className="font-semibold">{typeof p.value === 'number' && p.value < 200 ? `${p.value}%` : p.value}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-emerald-300/50 mb-3">Milestone 4</p>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4">
          Incident <em className="font-serif italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-normal">analysis</em>
        </h2>
        <p className="text-white/50 max-w-xl text-lg mb-12">
          Severe Storms dominate declarations, but not all disasters trigger the same federal aid.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="liquid-glass-strong p-6"
          style={{ '--radius': '1.5rem' } as any}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-white/80 font-medium mb-6">Incident Type Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTypes} layout="vertical">
                <XAxis type="number" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} />
                <YAxis dataKey="type" type="category" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} tickLine={false} width={110} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {topTypes.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="liquid-glass-strong p-6"
          style={{ '--radius': '1.5rem' } as any}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className="text-white/80 font-medium mb-2">Assistance Program Trigger Rate</h3>
          <p className="text-xs text-white/30 mb-6">% of declarations that activate each program</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assistanceData}>
                <XAxis dataKey="type" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} tickLine={false} interval={0} angle={-15} />
                <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="ihPct" name="Individual Assistance" fill="#a855f7" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
                <Bar dataKey="paPct" name="Public Assistance" fill="#06b6d4" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-purple-500/60" /><span className="text-xs text-white/40">Individual</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan-500/60" /><span className="text-xs text-white/40">Public</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
