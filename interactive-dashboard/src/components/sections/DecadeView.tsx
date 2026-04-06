"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  decadeData: any[];
}

const COLORS = ['#6366f1', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#f87171'];

export default function DecadeView({ decadeData }: Props) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-black/70 backdrop-blur-xl px-4 py-3 rounded-xl border border-purple-500/20 shadow-2xl">
        <p className="text-purple-300/60 text-xs">{label}</p>
        <p className="text-white font-semibold text-lg">{payload[0].value.toLocaleString()} declarations</p>
      </div>
    );
  };

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Insight text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-indigo-300/50 mb-3">Decade Breakdown</p>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-6">
              The <em className="font-serif italic bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-normal">acceleration</em>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Disaster declarations didn&apos;t just increase — they <strong className="text-white/80">exploded</strong>. The 2000s and 2010s each saw more declarations than the entire first 30 years of FEMA&apos;s history combined.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {decadeData.length > 0 && (
                <>
                  <div className="liquid-glass p-4" style={{ '--radius': '0.75rem' } as any}>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {decadeData[decadeData.length - 1]?.total?.toLocaleString() || '—'}
                    </p>
                    <p className="text-xs text-white/40 mt-1">Latest decade total</p>
                  </div>
                  <div className="liquid-glass p-4" style={{ '--radius': '0.75rem' } as any}>
                    <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                      {decadeData.length > 1 ? `${Math.round(decadeData[decadeData.length - 1].total / (decadeData[0].total || 1))}×` : '—'}
                    </p>
                    <p className="text-xs text-white/40 mt-1">Growth vs first decade</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Right: Chart */}
          <motion.div
            className="liquid-glass-strong p-6"
            style={{ '--radius': '1.5rem' } as any}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-white/80 font-medium mb-6">Total Declarations Per Decade</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={decadeData}>
                  <XAxis dataKey="decade" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {decadeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.75} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
