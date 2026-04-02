"use client";

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  typeTrends: any[];
  top5TypeNames: string[];
}

const TYPE_COLORS: Record<string, string> = {
  'Severe Storm(s)': '#a855f7',
  'Flood': '#06b6d4',
  'Hurricane': '#ec4899',
  'Fire': '#f59e0b',
  'Tornado': '#10b981',
  'Snow': '#818cf8',
  'Earthquake': '#f43f5e',
  'Drought': '#f97316',
};
const FALLBACK_COLORS = ['#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

export default function TypeTrends({ typeTrends, top5TypeNames }: Props) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-black/70 backdrop-blur-xl px-4 py-3 rounded-xl border border-purple-500/20 shadow-2xl">
        <p className="text-purple-300/60 text-xs mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm" style={{ color: p.stroke }}>
            {p.name}: <span className="font-semibold text-white">{p.value}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-rose-300/50 mb-3">Disaster Types Over Time</p>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4">
          Which threats are <em className="font-serif italic bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent font-normal">growing?</em>
        </h2>
        <p className="text-white/50 max-w-2xl text-lg mb-12">
          Severe Storms have dominated since the 1980s, but Fire and Hurricane declarations show alarming spikes in recent decades.
        </p>
      </motion.div>

      <motion.div
        className="liquid-glass-strong p-8"
        style={{ '--radius': '1.5rem' } as any}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={typeTrends}>
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} interval={9} />
              <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={customTooltip} />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value: string) => <span className="text-white/50 text-xs">{value}</span>}
              />
              {top5TypeNames.map((type, i) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={TYPE_COLORS[type] || FALLBACK_COLORS[i]}
                  strokeWidth={2.5}
                  dot={false}
                  strokeOpacity={0.85}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
